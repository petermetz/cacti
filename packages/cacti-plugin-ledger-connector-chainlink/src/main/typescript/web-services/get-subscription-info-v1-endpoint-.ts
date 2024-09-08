import { Express, Request, Response } from "express";

import {
  Logger,
  Checks,
  LogLevelDesc,
  LoggerProvider,
  IAsyncProvider,
} from "@hyperledger/cactus-common";
import {
  IEndpointAuthzOptions,
  IExpressRequestHandler,
  IWebServiceEndpoint,
} from "@hyperledger/cactus-core-api";
import {
  handleRestEndpointException,
  registerWebServiceEndpoint,
} from "@hyperledger/cactus-core";

import { PluginLedgerConnectorChainlink } from "../plugin-ledger-connector-chainlink";

import OAS from "../../json/openapi.json";

export interface IGetSubscriptionInfoEndpointOptions {
  logLevel?: LogLevelDesc;
  plugin: PluginLedgerConnectorChainlink;
}

export class GetSubscriptionInfoEndpoint implements IWebServiceEndpoint {
  public static readonly CLASS_NAME = "GetSubscriptionInfoEndpoint";

  private readonly log: Logger;

  public get className(): string {
    return GetSubscriptionInfoEndpoint.CLASS_NAME;
  }

  constructor(public readonly opts: IGetSubscriptionInfoEndpointOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(opts, `${fnTag} arg options`);
    Checks.truthy(opts.plugin, `${fnTag} arg options.connector`);

    const level = this.opts.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public get oasPath(): (typeof OAS.paths)["/api/v1/plugins/@hyperledger/cacti-plugin-ledger-connector-chainlink/get-subscription-info"] {
    return OAS.paths[
      "/api/v1/plugins/@hyperledger/cacti-plugin-ledger-connector-chainlink/get-subscription-info"
    ];
  }

  public getPath(): string {
    return this.oasPath.post["x-hyperledger-cacti"].http.path;
  }

  public getVerbLowerCase(): string {
    return this.oasPath.post["x-hyperledger-cacti"].http.verbLowerCase;
  }

  public getOperationId(): string {
    return this.oasPath.post.operationId;
  }

  getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions> {
    // TODO: make this an injectable dependency in the constructor
    return {
      get: async () => ({
        isProtected: true,
        requiredRoles: [],
      }),
    };
  }

  public async registerExpress(
    expressApp: Express,
  ): Promise<IWebServiceEndpoint> {
    await registerWebServiceEndpoint(expressApp, this);
    return this;
  }

  public getExpressRequestHandler(): IExpressRequestHandler {
    return this.handleRequest.bind(this);
  }

  public async handleRequest(req: Request, res: Response): Promise<void> {
    const reqTag = `${this.getVerbLowerCase()} - ${this.getPath()}`;
    this.log.debug(reqTag);
    const { body } = req;
    try {
      const res = await this.opts.plugin.getSubscriptionInfoV1(body);
      res.json(res);
    } catch (ex) {
      const { log } = this;
      const errorMsg = "Failed to get Chainlink subscription info.";
      await handleRestEndpointException({ log, error: ex, errorMsg, res });
    }
  }
}
