import type { Express, Request, Response } from "express";

import { StatusCodes } from "http-status-codes-minimal";

import {
  IWebServiceEndpoint,
  IExpressRequestHandler,
  IEndpointAuthzOptions,
} from "@hyperledger/cactus-core-api";

import {
  Logger,
  Checks,
  LogLevelDesc,
  LoggerProvider,
  IAsyncProvider,
} from "@hyperledger/cactus-common";

import {
  handleRestEndpointException,
  registerWebServiceEndpoint,
} from "@hyperledger/cactus-core";

import { PluginLedgerConnectorCelo } from "../plugin-ledger-connector-celo";
import OAS from "../../json/openapi.json";

export interface IDeployContractV1EndpointOptions {
  logLevel?: LogLevelDesc;
  connector: PluginLedgerConnectorCelo;
}

export class DeployContractV1Endpoint implements IWebServiceEndpoint {
  public static readonly CLASS_NAME = "DeployContractV1Endpoint";

  private readonly log: Logger;

  public get className(): string {
    return DeployContractV1Endpoint.CLASS_NAME;
  }

  constructor(public readonly options: IDeployContractV1EndpointOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);
    Checks.truthy(options.connector, `${fnTag} arg options.connector`);

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public get oasPath(): (typeof OAS.paths)["/api/v1/plugins/@hyperledger/cacti-plugin-ledger-connector-celo/deploy-contract"] {
    return OAS.paths[
      "/api/v1/plugins/@hyperledger/cacti-plugin-ledger-connector-celo/deploy-contract"
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
    try {
      res
        .status(StatusCodes.OK)
        .json(await this.options.connector.deployContract(req.body));
    } catch (err) {
      this.log.error(`Crash while serving ${reqTag}`, err);
      const { log } = this;
      const errorMsg = "Failed to invoke deployContract method of connector.";
      await handleRestEndpointException({ error: err, errorMsg, log, res });
    }
  }
}
