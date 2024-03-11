import { Express, Request, Response } from "express";
import HttpStatus from "http-status-codes";

import {
  Logger,
  Checks,
  LogLevelDesc,
  LoggerProvider,
  IAsyncProvider,
} from "@hyperledger/cactus-common";

import {
  IWebServiceEndpoint,
  IExpressRequestHandler,
  IEndpointAuthzOptions,
} from "@hyperledger/cactus-core-api";

import {
  PluginRegistry,
  registerWebServiceEndpoint,
} from "@hyperledger/cactus-core";

import OAS from "../../../json/openapi.json";
import { collectOpenapiJsonDocs } from "./collect-openapi-json-docs";

export interface IGetAggregateOpenapiJsonEndpointV1Options {
  logLevel?: LogLevelDesc;
  pluginRegistry: PluginRegistry;
}

export class GetAggregateOpenapiJsonEndpointV1 implements IWebServiceEndpoint {
  public static readonly CLASS_NAME = "GetAggregateOpenapiJsonEndpointV1";

  private readonly log: Logger;

  public get className(): string {
    return GetAggregateOpenapiJsonEndpointV1.CLASS_NAME;
  }

  constructor(public readonly opts: IGetAggregateOpenapiJsonEndpointV1Options) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(opts, `${fnTag} arg options`);
    Checks.truthy(opts.pluginRegistry, `${fnTag} arg options.pluginRegistry`);

    const level = this.opts.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public getExpressRequestHandler(): IExpressRequestHandler {
    return this.handleRequest.bind(this);
  }

  public get oasPath(): typeof OAS.paths["/api/v1/api-server/get-aggregate-openapi-json"] {
    return OAS.paths["/api/v1/api-server/get-aggregate-openapi-json"];
  }

  public getPath(): string {
    return this.oasPath.get["x-hyperledger-cactus"].http.path;
  }

  public getVerbLowerCase(): string {
    return this.oasPath.get["x-hyperledger-cactus"].http.verbLowerCase;
  }

  public getOperationId(): string {
    return this.oasPath.get.operationId;
  }

  public async registerExpress(
    expressApp: Express,
  ): Promise<IWebServiceEndpoint> {
    await registerWebServiceEndpoint(expressApp, this);
    return this;
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

  async handleRequest(req: Request, res: Response): Promise<void> {
    const fnTag = `${this.className}#handleRequest()`;
    const verbUpper = this.getVerbLowerCase().toUpperCase();
    this.log.debug(`${verbUpper} ${this.getPath()}`);

    try {
      const resBody = await collectOpenapiJsonDocs(this.opts.pluginRegistry);
      res.status(HttpStatus.OK);
      res.json(resBody);
    } catch (ex) {
      this.log.error(`${fnTag} failed to serve contract deploy request`, ex);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      res.statusMessage = ex.message;
      res.json({ error: ex.stack });
    }
  }

  public async getAggregateOpenapiJson(): Promise<unknown> {
    return {};
  }
}
