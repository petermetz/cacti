import { Express, Request, Response } from "express";
import { LogLevelDesc, IAsyncProvider } from "@hyperledger/cactus-common";
import { IEndpointAuthzOptions, IExpressRequestHandler, IWebServiceEndpoint } from "@hyperledger/cactus-core-api";
import { PluginLedgerConnectorBesu } from "../plugin-ledger-connector-besu";
import OAS from "../../json/openapi.json";
export interface IGetPastLogsEndpointOptions {
    logLevel?: LogLevelDesc;
    connector: PluginLedgerConnectorBesu;
}
export declare class GetPastLogsEndpoint implements IWebServiceEndpoint {
    readonly options: IGetPastLogsEndpointOptions;
    static readonly CLASS_NAME = "GetPastLogsEndpoint";
    private readonly log;
    get className(): string;
    constructor(options: IGetPastLogsEndpointOptions);
    get oasPath(): (typeof OAS.paths)["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/get-past-logs"];
    getPath(): string;
    getVerbLowerCase(): string;
    getOperationId(): string;
    getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions>;
    registerExpress(expressApp: Express): Promise<IWebServiceEndpoint>;
    getExpressRequestHandler(): IExpressRequestHandler;
    handleRequest(req: Request, res: Response): Promise<void>;
}
