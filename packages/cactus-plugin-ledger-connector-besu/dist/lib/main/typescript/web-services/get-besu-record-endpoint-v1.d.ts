import { Express, Request, Response } from "express";
import { LogLevelDesc, IAsyncProvider } from "@hyperledger/cactus-common";
import { IEndpointAuthzOptions, IExpressRequestHandler, IWebServiceEndpoint } from "@hyperledger/cactus-core-api";
import { PluginLedgerConnectorBesu } from "../plugin-ledger-connector-besu";
export interface IGetBesuRecordEndpointV1Options {
    logLevel?: LogLevelDesc;
    connector: PluginLedgerConnectorBesu;
}
export declare class GetBesuRecordEndpointV1 implements IWebServiceEndpoint {
    readonly options: IGetBesuRecordEndpointV1Options;
    static readonly CLASS_NAME = "GetBesuRecordEndpointV1";
    private readonly log;
    get className(): string;
    constructor(options: IGetBesuRecordEndpointV1Options);
    getOasPath(): {
        post: {
            "x-hyperledger-cacti": {
                http: {
                    verbLowerCase: string;
                    path: string;
                };
            };
            operationId: string;
            summary: string;
            parameters: never[];
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: string;
                        };
                    };
                };
            };
            responses: {
                "200": {
                    description: string;
                    content: {
                        "text/plain": {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
                "503": {
                    description: string;
                    content: {
                        "*/*": {
                            schema: {
                                $ref: string;
                            };
                        };
                    };
                };
            };
        };
    };
    getPath(): string;
    getVerbLowerCase(): string;
    getOperationId(): string;
    getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions>;
    registerExpress(expressApp: Express): Promise<IWebServiceEndpoint>;
    getExpressRequestHandler(): IExpressRequestHandler;
    handleRequest(req: Request, res: Response): Promise<void>;
}
