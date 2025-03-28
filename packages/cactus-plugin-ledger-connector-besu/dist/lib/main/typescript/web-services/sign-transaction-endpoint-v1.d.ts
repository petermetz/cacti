import { Express, Request, Response } from "express";
import { IWebServiceEndpoint, IExpressRequestHandler, IEndpointAuthzOptions } from "@hyperledger/cactus-core-api";
import { LogLevelDesc, IAsyncProvider } from "@hyperledger/cactus-common";
import { PluginLedgerConnectorBesu } from "../plugin-ledger-connector-besu";
import OAS from "../../json/openapi.json";
export interface IBesuSignTransactionEndpointOptions {
    connector: PluginLedgerConnectorBesu;
    logLevel?: LogLevelDesc;
}
export declare class BesuSignTransactionEndpointV1 implements IWebServiceEndpoint {
    readonly options: IBesuSignTransactionEndpointOptions;
    private readonly log;
    constructor(options: IBesuSignTransactionEndpointOptions);
    getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions>;
    getExpressRequestHandler(): IExpressRequestHandler;
    get oasPath(): (typeof OAS.paths)["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/sign-transaction"];
    getPath(): string;
    getVerbLowerCase(): string;
    getOperationId(): string;
    registerExpress(expressApp: Express): Promise<IWebServiceEndpoint>;
    handleRequest(req: Request, res: Response): Promise<void>;
}
