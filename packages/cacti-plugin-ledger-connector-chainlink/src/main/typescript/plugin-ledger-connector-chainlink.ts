import type { Server as SocketIoServer } from "socket.io";
import type { Socket as SocketIoSocket } from "socket.io";
import type { Express } from "express";

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

import { PluginRegistry } from "@hyperledger/cactus-core";

import {
  Checks,
  Logger,
  LoggerProvider,
  LogLevelDesc,
} from "@hyperledger/cactus-common";

import { PrometheusExporter } from "./prometheus-exporter/prometheus-exporter";
import { GetSubscriptionInfoEndpoint } from "./web-services/get-subscription-info-v1-endpoint-";
import {
  GetOpenApiSpecV1Endpoint,
  IGetOpenApiSpecV1EndpointOptions,
} from "./web-services/get-open-api-spec-v1-endpoint";
import * as grpc_default_service from "./generated/proto/protoc-gen-ts/services/default_service";
import * as chainlink_grpc_svc_streams from "./generated/proto/protoc-gen-ts/services/chainlink-grpc-svc-streams";
import { ChainlinkGrpcSvcOpenApi } from "./grpc-services/chainlink-grpc-svc-open-api";
import { ChainlinkGrpcSvcStreams } from "./grpc-services/chainlink-grpc-svc-streams";
import { getSubscriptionInfoV1Http } from "./impl/get-subscription-info-v1/get-subscription-info-v1-http";
import { WatchBlocksV1 } from "./generated/openapi/typescript-axios/api";
import OAS from "../json/openapi.json";

export const E_KEYCHAIN_NOT_FOUND =
  "cacti.connector.chainlink.keychain_not_found";

export interface IPluginLedgerConnectorChainlinkOptions
  extends ICactusPluginOptions {
  ledgerHttpPort: number;
  ledgerHttpHost: string;
  pluginRegistry: PluginRegistry;
  prometheusExporter?: PrometheusExporter;
  logLevel?: LogLevelDesc;
}

export class PluginLedgerConnectorChainlink
  implements
    IPluginLedgerConnector<unknown, unknown, unknown, unknown>,
    ICactusPlugin,
    IPluginGrpcService,
    IPluginWebService
{
  private readonly instanceId: string;
  public prometheusExporter: PrometheusExporter;
  private readonly log: Logger;
  private readonly logLevel: LogLevelDesc;
  private readonly pluginRegistry: PluginRegistry;
  private endpoints: IWebServiceEndpoint[] | undefined;

  public static readonly CLASS_NAME = "PluginLedgerConnectorChainlink";

  public get className(): string {
    return PluginLedgerConnectorChainlink.CLASS_NAME;
  }

  constructor(public readonly options: IPluginLedgerConnectorChainlinkOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.ledgerHttpHost, `${fnTag} options.ledgerHttpHost`);
    Checks.truthy(options.ledgerHttpPort, `${fnTag} options.ledgerHttpPort`);
    Checks.truthy(options.pluginRegistry, `${fnTag} options.pluginRegistry`);
    Checks.truthy(options.instanceId, `${fnTag} options.instanceId`);

    this.logLevel = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level: this.logLevel, label });

    this.instanceId = options.instanceId;
    this.pluginRegistry = options.pluginRegistry;
    this.prometheusExporter =
      options.prometheusExporter ||
      new PrometheusExporter({ pollingIntervalInMin: 1 });
    Checks.truthy(
      this.prometheusExporter,
      `${fnTag} options.prometheusExporter`,
    );

    this.prometheusExporter.startMetricsCollection();
  }

  public getConsensusAlgorithmFamily(): Promise<ConsensusAlgorithmFamily> {
    throw new Error("Method not implemented.");
  }
  public hasTransactionFinality(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  public async deployContract(): Promise<unknown> {
    throw new Error("Method not implemented.");
  }

  public async transact(): Promise<unknown> {
    throw new Error("Method not implemented.");
  }

  public getOpenApiSpec(): unknown {
    return OAS;
  }

  public getPrometheusExporter(): PrometheusExporter {
    return this.prometheusExporter;
  }

  public async getPrometheusExporterMetrics(): Promise<string> {
    const res: string = await this.prometheusExporter.getPrometheusMetrics();
    this.log.debug(`getPrometheusExporterMetrics() response: %o`, res);
    return res;
  }

  public getInstanceId(): string {
    return this.instanceId;
  }

  public async onPluginInit(): Promise<void> {}

  public async shutdown(): Promise<void> {
    this.log.info(`Shutting down ${this.className}...`);
  }

  async registerWebServices(
    app: Express,
    wsApi: SocketIoServer,
  ): Promise<IWebServiceEndpoint[]> {
    // FIXME
    // const { logLevel } = this.options;
    const webServices = await this.getOrCreateWebServices();
    await Promise.all(webServices.map((ws) => ws.registerExpress(app)));

    wsApi.on("connection", (socket: SocketIoSocket) => {
      this.log.debug(`New Socket connected. ID=${socket.id}`);

      socket.on(WatchBlocksV1.Subscribe, () => {
        // FIXME
        // new WatchBlocksV1Endpoint({ socket, logLevel }).subscribe();
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
      chainlink_grpc_svc_streams.org.hyperledger.cacti.plugin.ledger.connector
        .chainlink.services.chainlinkservice
        .UnimplementedChainlinkGrpcSvcStreamsService.definition;

    const implementation = new ChainlinkGrpcSvcStreams({
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
      grpc_default_service.org.hyperledger.cacti.plugin.ledger.connector
        .chainlink.services.defaultservice.DefaultServiceClient.service;

    const implementation = new ChainlinkGrpcSvcOpenApi({
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
      const endpoint = new GetSubscriptionInfoEndpoint({
        plugin: this,
        logLevel: this.options.logLevel,
      });
      endpoints.push(endpoint);
    }
    // {
    //   const opts: IGetPrometheusExporterMetricsEndpointV1Options = {
    //     connector: this,
    //     logLevel: this.options.logLevel,
    //   };
    //   const endpoint = new GetPrometheusExporterMetricsEndpointV1(opts);
    //   endpoints.push(endpoint);
    // }
    {
      const oasPath =
        OAS.paths[
          "/api/v1/plugins/@hyperledger/cacti-plugin-ledger-connector-chainlink/get-open-api-spec"
        ];

      const operationId = oasPath.get.operationId;
      const opts: IGetOpenApiSpecV1EndpointOptions = {
        oas: OAS,
        oasPath,
        operationId,
        path: oasPath.get["x-hyperledger-cacti"].http.path,
        pluginRegistry: this.pluginRegistry,
        verbLowerCase: oasPath.get["x-hyperledger-cacti"].http.verbLowerCase,
        logLevel: this.options.logLevel,
      };
      const endpoint = new GetOpenApiSpecV1Endpoint(opts);
      endpoints.push(endpoint);
    }

    this.endpoints = endpoints;
    return endpoints;
  }

  public getPackageName(): string {
    return `@hyperledger/cacti-plugin-ledger-connector-chainlink`;
  }

  // FIXME
  public async getSubscriptionInfoV1(request: any): Promise<any> {
    const ctx = { logLevel: this.logLevel };
    const res = await getSubscriptionInfoV1Http(ctx, request);
    this.log.debug("res=%o", res);
    return res;
  }
}
