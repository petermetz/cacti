import { Express, Request, Response } from "express";
import { LogLevelDesc, IAsyncProvider } from "@hyperledger/cactus-common";
import { IEndpointAuthzOptions, IExpressRequestHandler, IWebServiceEndpoint } from "@hyperledger/cactus-core-api";
import { PluginLedgerConnectorBesu } from "../plugin-ledger-connector-besu";
import OAS from "../../json/openapi.json";
export interface IGetBalanceEndpointOptions {
    logLevel?: LogLevelDesc;
    connector: PluginLedgerConnectorBesu;
}
export declare class GetBalanceEndpoint implements IWebServiceEndpoint {
    readonly options: IGetBalanceEndpointOptions;
    static readonly CLASS_NAME = "GetBalanceEndpoint";
    private readonly log;
    get className(): string;
    constructor(options: IGetBalanceEndpointOptions);
    get oasPath(): (typeof OAS.paths)["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/get-balance"];
    getPath(): string;
    getVerbLowerCase(): string;
    getOperationId(): string;
    getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions>;
    registerExpress(expressApp: Express): Promise<IWebServiceEndpoint>;
    getExpressRequestHandler(): IExpressRequestHandler;
    handleRequest(req: Request, res: Response): Promise<void>;
}
