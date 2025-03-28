import { Express, Request, Response } from "express";
import OAS from "../../json/openapi.json";
import { IWebServiceEndpoint, IExpressRequestHandler, IEndpointAuthzOptions } from "@hyperledger/cactus-core-api";
import { LogLevelDesc, IAsyncProvider } from "@hyperledger/cactus-common";
import { PluginLedgerConnectorBesu } from "../plugin-ledger-connector-besu";
export interface IGetPrometheusExporterMetricsEndpointV1Options {
    connector: PluginLedgerConnectorBesu;
    logLevel?: LogLevelDesc;
}
export declare class GetPrometheusExporterMetricsEndpointV1 implements IWebServiceEndpoint {
    readonly options: IGetPrometheusExporterMetricsEndpointV1Options;
    private readonly log;
    constructor(options: IGetPrometheusExporterMetricsEndpointV1Options);
    getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions>;
    getExpressRequestHandler(): IExpressRequestHandler;
    get oasPath(): (typeof OAS.paths)["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/get-prometheus-exporter-metrics"];
    getPath(): string;
    getVerbLowerCase(): string;
    getOperationId(): string;
    registerExpress(expressApp: Express): Promise<IWebServiceEndpoint>;
    handleRequest(req: Request, res: Response): Promise<void>;
}
