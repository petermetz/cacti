import type { Server as SocketIoServer } from "socket.io";
import type { Socket as SocketIoSocket } from "socket.io";
import type { Express } from "express";
import Web3 from "web3";

import OAS from "../json/openapi.json";

import {
  ConsensusAlgorithmFamily,
  IPluginLedgerConnector,
  IWebServiceEndpoint,
  IPluginWebService,
  ICactusPlugin,
  ICactusPluginOptions,
  IPluginGrpcService,
  IGrpcSvcDefAndImplPair,
} from "@hyperledger/cactus-core-api";

import {
  PluginRegistry,
  consensusHasTransactionFinality,
} from "@hyperledger/cactus-core";

import {
  Checks,
  Logger,
  LoggerProvider,
  LogLevelDesc,
} from "@hyperledger/cactus-common";

import { WatchBlocksV1 } from "./generated/openapi/typescript-axios";

import { PrometheusExporter } from "./prometheus-exporter/prometheus-exporter";
import { WatchBlocksV1Endpoint } from "./web-services/watch-blocks-v1-endpoint";
import {
  GetOpenApiSpecV1Endpoint,
  IGetOpenApiSpecV1EndpointOptions,
} from "./web-services/get-open-api-spec-v1-endpoint";
import * as grpc_default_service from "./generated/proto/protoc-gen-ts/services/default_service";
import * as celo_grpc_svc_streams from "./generated/proto/protoc-gen-ts/services/celo-grpc-svc-streams";
import { CeloGrpcSvcOpenApi } from "./grpc-services/celo-grpc-svc-open-api";
import { CeloGrpcSvcStreams } from "./grpc-services/celo-grpc-svc-streams";
import { deployContractImpl } from "./impl/deploy-contract-impl";
import {
  DeployContractV1Endpoint,
  IDeployContractV1EndpointOptions,
} from "./web-services/deploy-contract-v1-endpoint";
import { createWeb3V1_10_4_Provider } from "./core/create-web3-v1_10_4-provider";
import { ContractKit, newKitFromWeb3 } from "@celo/contractkit";

export const E_KEYCHAIN_NOT_FOUND = "cacti.connector.celo.keychain_not_found";

export enum Web3ProviderKind {
  HTTP = "http",
  WEBSOCKET = "websocket",
}

export interface IWeb3ProviderOptions {
  /**
   * Denotes the supported provider types.
   */
  readonly kind: Readonly<Web3ProviderKind>;
  /**
   * The complete URL to pass in as the Web3 provider's constructor's
   * first parameter. Should include the port number.
   * For example: http://celo:7545
   */
  readonly url: Readonly<string>;
}

export interface IPluginLedgerConnectorCeloOptions
  extends ICactusPluginOptions {
  readonly web3ProviderOptions: Readonly<IWeb3ProviderOptions>;
  readonly pluginRegistry: PluginRegistry;
  readonly prometheus?: PrometheusExporter;
  readonly logLevel?: LogLevelDesc;
}

export class PluginLedgerConnectorCelo
  implements
    IPluginLedgerConnector<
      any, // FIXME
      any, // FIXME
      any, // FIXME
      any // FIXME
    >,
    ICactusPlugin,
    IPluginGrpcService,
    IPluginWebService
{
  private readonly instanceId: string;
  public prometheus: PrometheusExporter;
  private readonly log: Logger;
  private readonly logLevel: LogLevelDesc;
  private readonly pluginRegistry: PluginRegistry;
  private readonly web3: Web3;
  private readonly kit: ContractKit;

  private endpoints: IWebServiceEndpoint[] | undefined;

  public static readonly CLASS_NAME = "PluginLedgerConnectorCelo";

  public get className(): string {
    return PluginLedgerConnectorCelo.CLASS_NAME;
  }

  constructor(public readonly opts: IPluginLedgerConnectorCeloOptions) {
    const fn = `${this.className}#constructor()`;
    Checks.truthy(opts, `${fn} arg opts`);
    Checks.truthy(opts.pluginRegistry, `${fn} opts.pluginRegistry`);
    Checks.truthy(opts.web3ProviderOptions, `${fn} opts.web3ProviderOptions`);
    Checks.truthy(opts.instanceId, `${fn} opts.instanceId`);

    this.logLevel = this.opts.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level: this.logLevel, label });

    const provider = createWeb3V1_10_4_Provider({
      logLevel: this.logLevel,
      opts: opts.web3ProviderOptions,
    });
    this.log.debug("Creating web3 provider with: %o", opts.web3ProviderOptions);
    this.web3 = new Web3(provider);
    this.kit = newKitFromWeb3(this.web3);

    this.instanceId = opts.instanceId;
    this.pluginRegistry = opts.pluginRegistry;
    this.prometheus = opts.prometheus || new PrometheusExporter({});
    Checks.truthy(this.prometheus, `${fn} opts.prometheus`);

    this.prometheus.startMetricsCollection();
  }

  /**
   * FIXME
   */
  public async deployContract(req: any): Promise<unknown> {
    const fn = `${this.className}#deployContract()`;
    const log = LoggerProvider.getOrCreate({
      label: fn,
      level: this.opts.logLevel,
    });
    log.trace("ENTER");

    const out = await deployContractImpl({
      web3: this.web3,
      kit: this.kit,
      logLevel: this.logLevel,
      req,
    });

    log.trace("EXIT %o", out);
    return out;
  }

  public async transact(): Promise<unknown> {
    throw new Error("Method not implemented.");
  }

  public getOpenApiSpec(): unknown {
    return OAS;
  }

  public getPrometheusExporter(): PrometheusExporter {
    return this.prometheus;
  }

  public async getPrometheusExporterMetrics(): Promise<string> {
    const res: string = await this.prometheus.getPrometheusMetrics();
    this.log.debug(`getPrometheusExporterMetrics() response: %o`, res);
    return res;
  }

  public getInstanceId(): string {
    return this.instanceId;
  }

  public async onPluginInit(): Promise<void> {
    this.log.debug("onPluginInit() ENTER");
    const blockNumber = await this.web3.eth.getBlockNumber();
    this.log.debug("onPluginInit() blockNumber=%o", blockNumber);
    this.log.debug("onPluginInit() EXIT");
  }

  public async shutdown(): Promise<void> {
    this.log.info(`Shutting down ${this.className}...`);
  }

  async registerWebServices(
    app: Express,
    wsApi: SocketIoServer,
  ): Promise<IWebServiceEndpoint[]> {
    const { logLevel } = this.opts;
    const webServices = await this.getOrCreateWebServices();
    await Promise.all(webServices.map((ws) => ws.registerExpress(app)));

    wsApi.on("connection", (socket: SocketIoSocket) => {
      this.log.debug(`New Socket connected. ID=${socket.id}`);

      socket.on(WatchBlocksV1.Subscribe, () => {
        new WatchBlocksV1Endpoint({ socket, logLevel }).subscribe();
      });
    });
    return webServices;
  }
  public async createGrpcSvcDefAndImplPairs(): Promise<
    IGrpcSvcDefAndImplPair[]
  > {
    const openApiSvc = await this.createGrpcOpenApiSvcDefAndImplPair();
    const streamsSvc = await this.createGrpcStreamsSvcDefAndImplPair();
    return [openApiSvc, streamsSvc];
  }

  public async createGrpcStreamsSvcDefAndImplPair(): Promise<IGrpcSvcDefAndImplPair> {
    const definition =
      celo_grpc_svc_streams.org.hyperledger.cacti.plugin.ledger.connector.celo
        .services.celoservice.UnimplementedCeloGrpcSvcStreamsService.definition;

    const implementation = new CeloGrpcSvcStreams({
      logLevel: this.logLevel,
    });

    return { definition, implementation };
  }

  /**
   * Create a new instance of the service implementation.
   * Note: This does not cache the returned objects internally. A new instance
   * is created during every invocation.
   *
   * @returns The gRPC service definition+implementation pair that is backed
   * by the code generated by the OpenAPI generator from the openapi.json spec
   * of this package. Used by the API server to obtain the service objects dynamically
   * at runtime so that the plugin's gRPC services can be exposed in a similar
   * fashion how the HTTP REST endpoints are registered as well.
   */
  public async createGrpcOpenApiSvcDefAndImplPair(): Promise<IGrpcSvcDefAndImplPair> {
    const definition =
      grpc_default_service.org.hyperledger.cacti.plugin.ledger.connector.celo
        .services.defaultservice.DefaultServiceClient.service;

    const implementation = new CeloGrpcSvcOpenApi({
      logLevel: this.logLevel,
    });

    return { definition, implementation };
  }

  public async getOrCreateWebServices(): Promise<IWebServiceEndpoint[]> {
    if (Array.isArray(this.endpoints)) {
      return this.endpoints;
    }

    const endpoints: IWebServiceEndpoint[] = [];

    {
      const oasPath =
        OAS.paths[
          "/api/v1/plugins/@hyperledger/cacti-plugin-ledger-connector-celo/get-open-api-spec"
        ];

      const operationId = oasPath.get.operationId;
      const opts: IGetOpenApiSpecV1EndpointOptions = {
        oas: OAS,
        oasPath,
        operationId,
        path: oasPath.get["x-hyperledger-cacti"].http.path,
        pluginRegistry: this.pluginRegistry,
        verbLowerCase: oasPath.get["x-hyperledger-cacti"].http.verbLowerCase,
        logLevel: this.opts.logLevel,
      };
      const endpoint = new GetOpenApiSpecV1Endpoint(opts);
      endpoints.push(endpoint);
    }

    {
      const opts: IDeployContractV1EndpointOptions = {
        logLevel: this.opts.logLevel,
        connector: this,
      };
      const endpoint = new DeployContractV1Endpoint(opts);
      endpoints.push(endpoint);
    }

    this.endpoints = endpoints;
    return endpoints;
  }

  public getPackageName(): string {
    return `@hyperledger/cacti-plugin-ledger-connector-celo`;
  }

  public async getConsensusAlgorithmFamily(): Promise<ConsensusAlgorithmFamily> {
    return ConsensusAlgorithmFamily.Authority;
  }
  public async hasTransactionFinality(): Promise<boolean> {
    const currentConsensusAlgorithmFamily =
      await this.getConsensusAlgorithmFamily();

    return consensusHasTransactionFinality(currentConsensusAlgorithmFamily);
  }
}
