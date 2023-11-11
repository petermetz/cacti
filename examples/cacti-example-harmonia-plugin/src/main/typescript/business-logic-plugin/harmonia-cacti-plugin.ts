import type { Express } from "express";
import OAS from "../../json/openapi.json";
import {
  Logger,
  Checks,
  LogLevelDesc,
  LoggerProvider,
} from "@hyperledger/cactus-common";
import {
  ICactusPlugin,
  IPluginWebService,
  IWebServiceEndpoint,
} from "@hyperledger/cactus-core-api";
import {
  DefaultApi as BesuApi,
  Web3SigningCredential,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";

import { IContractDeploymentInfo } from "../i-contract-deployment-info";

export interface OrgEnv {
  CORE_PEER_LOCALMSPID: string;
  CORE_PEER_ADDRESS: string;
  CORE_PEER_MSPCONFIGPATH: string;
  CORE_PEER_TLS_ROOTCERT_FILE: string;
  ORDERER_TLS_ROOTCERT_FILE: string;
}

export interface IHarmoniaCactiPluginOptions {
  logLevel?: LogLevelDesc;
  instanceId: string;
  besuApiClient: BesuApi;
  web3SigningCredential?: Web3SigningCredential;
  fabricEnvironment?: NodeJS.ProcessEnv;
  contracts: IContractDeploymentInfo;
}

export class HarmoniaCactiPlugin implements ICactusPlugin, IPluginWebService {
  public static readonly CLASS_NAME = "HarmoniaCactiPlugin";

  private readonly log: Logger;
  private readonly instanceId: string;

  private endpoints: IWebServiceEndpoint[] | undefined;

  public get className(): string {
    return HarmoniaCactiPlugin.CLASS_NAME;
  }

  constructor(public readonly options: IHarmoniaCactiPluginOptions) {
    const fnTag = `${this.className}#constructor()`;

    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.instanceId, `${fnTag} arg options.instanceId`);
    Checks.nonBlankString(options.instanceId, `${fnTag} options.instanceId`);
    Checks.truthy(options.contracts, `${fnTag} arg options.contracts`);

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
    this.instanceId = options.instanceId;
  }

  public getOpenApiSpec(): unknown {
    return OAS;
  }

  async registerWebServices(app: Express): Promise<IWebServiceEndpoint[]> {
    const webServices = await this.getOrCreateWebServices();
    await Promise.all(webServices.map((ws) => ws.registerExpress(app)));
    return webServices;
  }

  public async getOrCreateWebServices(): Promise<IWebServiceEndpoint[]> {
    if (Array.isArray(this.endpoints)) {
      return this.endpoints;
    }

    this.endpoints = [
      // FIXME
    ];
    return this.endpoints;
  }

  public async shutdown(): Promise<void> {
    this.log.info(`Shutting down ${this.className}...`);
  }

  public getInstanceId(): string {
    return this.instanceId;
  }

  public getPackageName(): string {
    return "@hyperledger/cactus-example-supply-chain-backend";
  }

  public async onPluginInit(): Promise<unknown> {
    return;
  }
}
