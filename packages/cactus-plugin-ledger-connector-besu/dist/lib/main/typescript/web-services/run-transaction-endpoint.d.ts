import { Express, Request, Response } from "express";
import { LogLevelDesc, IAsyncProvider } from "@hyperledger/cactus-common";
import { IEndpointAuthzOptions, IExpressRequestHandler, IWebServiceEndpoint } from "@hyperledger/cactus-core-api";
import { PluginLedgerConnectorBesu } from "../plugin-ledger-connector-besu";
import OAS from "../../json/openapi.json";
export interface IRunTransactionEndpointOptions {
    logLevel?: LogLevelDesc;
    connector: PluginLedgerConnectorBesu;
}
export declare class RunTransactionEndpoint implements IWebServiceEndpoint {
    readonly options: IRunTransactionEndpointOptions;
    static readonly CLASS_NAME = "RunTransactionEndpoint";
    private readonly log;
    get className(): string;
    constructor(options: IRunTransactionEndpointOptions);
    get oasPath(): (typeof OAS.paths)["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/run-transaction"];
    getPath(): string;
    getVerbLowerCase(): string;
    getOperationId(): string;
    getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions>;
    registerExpress(expressApp: Express): Promise<IWebServiceEndpoint>;
    getExpressRequestHandler(): IExpressRequestHandler;
    private handleLedgerNotAccessibleError;
    handleRequest(req: Request, res: Response): Promise<void>;
}
