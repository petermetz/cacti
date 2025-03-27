import type { Express, Request, Response } from "express";
import { LogLevelDesc, IAsyncProvider } from "@hyperledger/cactus-common";
import { IEndpointAuthzOptions, IExpressRequestHandler, IWebServiceEndpoint } from "@hyperledger/cactus-core-api";
import { PluginKeychainAzureKv } from "../plugin-keychain-azure-kv";
export interface IDeleteKeychainEntryEndpointOptions {
    logLevel?: LogLevelDesc;
    connector: PluginKeychainAzureKv;
}
export declare class DeleteKeychainEntryEndpoint implements IWebServiceEndpoint {
    readonly options: IDeleteKeychainEntryEndpointOptions;
    static readonly CLASS_NAME = "DeleteKeychainEntryEndpoint";
    private readonly log;
    get className(): string;
    constructor(options: IDeleteKeychainEntryEndpointOptions);
    getOasPath(): {
        post: {
            "x-hyperledger-cacti": {
                http: {
                    path: string;
                    verbLowerCase: string;
                };
            };
            operationId: string;
            summary: string;
            parameters: never[];
            requestBody: {
                $ref: string;
            };
            responses: {
                "200": {
                    $ref: string;
                };
                "400": {
                    $ref: string;
                };
                "401": {
                    $ref: string;
                };
                "500": {
                    $ref: string;
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
