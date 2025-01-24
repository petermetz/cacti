import type { Express, Request, Response } from "express";
import type { PluginLedgerConnectorFabric } from "../plugin-ledger-connector-fabric";

import {
  Logger,
  LoggerProvider,
  LogLevelDesc,
  Checks,
  IAsyncProvider,
} from "@hyperledger/cactus-common";

import {
  IWebServiceEndpoint,
  IExpressRequestHandler,
  IEndpointAuthzOptions,
} from "@hyperledger/cactus-core-api";

import {
  handleRestEndpointException,
  registerWebServiceEndpoint,
} from "@hyperledger/cactus-core";

import OAS from "../../json/openapi.json";

export interface ISetConnectionProfileBase64EndpointV1Options {
  logLevel: LogLevelDesc;
  connector: PluginLedgerConnectorFabric;
}

export class SetConnectionProfileBase64EndpointV1
  implements IWebServiceEndpoint
{
  public static readonly CLASS_NAME = "SetConnectionProfileBase64EndpointV1";

  private readonly log: Logger;

  public get className(): string {
    return SetConnectionProfileBase64EndpointV1.CLASS_NAME;
  }

  constructor(
    public readonly opts: ISetConnectionProfileBase64EndpointV1Options,
  ) {
    const fnTag = `${this.className}#constructor()`;

    Checks.truthy(opts, `${fnTag} options`);
    Checks.truthy(opts.connector, `${fnTag} options.connector`);

    this.log = LoggerProvider.getOrCreate({
      label: "set-connection-profile-base64-endpoint-v1",
      level: opts.logLevel || "INFO",
    });
  }

  public getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions> {
    return {
      get: async () => ({
        isProtected: false, // FIXME(petermetz)
        requiredRoles: this.oasPath.post.security[0].bearerTokenAuth,
      }),
    };
  }

  public getExpressRequestHandler(): IExpressRequestHandler {
    return this.handleRequest.bind(this);
  }

  public get oasPath(): (typeof OAS.paths)["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-fabric/set-connection-profile-base-64"] {
    return OAS.paths[
      "/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-fabric/set-connection-profile-base-64"
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

  public async registerExpress(
    expressApp: Express,
  ): Promise<IWebServiceEndpoint> {
    await registerWebServiceEndpoint(expressApp, this);
    return this;
  }

  async handleRequest(req: Request, res: Response): Promise<void> {
    const fnTag = `${this.className}#handleRequest()`;
    const verbUpper = this.getVerbLowerCase().toUpperCase();
    const reqTag = `${verbUpper} ${this.getPath()}`;
    this.log.debug(reqTag);

    try {
      const resBody = await this.opts.connector.setConnectionProfileBase64(
        req.body,
      );
      res.status(200).json(resBody);
    } catch (cause: unknown) {
      const errorMsg = `${fnTag} request handler fn crashed for: ${reqTag}`;
      await handleRestEndpointException({
        errorMsg,
        log: this.log,
        error: cause,
        res,
      });
    }
  }
}
