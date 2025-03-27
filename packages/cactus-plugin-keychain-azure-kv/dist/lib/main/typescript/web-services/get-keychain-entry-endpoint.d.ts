import type { Express, Request, Response } from "express";
import { LogLevelDesc, IAsyncProvider } from "@hyperledger/cactus-common";
import { IEndpointAuthzOptions, IExpressRequestHandler, IWebServiceEndpoint } from "@hyperledger/cactus-core-api";
import { PluginKeychainAzureKv } from "../plugin-keychain-azure-kv";
export interface IGetKeychainEntryEndpointOptions {
    logLevel?: LogLevelDesc;
    connector: PluginKeychainAzureKv;
}
export declare class GetKeychainEntryEndpoint implements IWebServiceEndpoint {
    readonly options: IGetKeychainEntryEndpointOptions;
    static readonly CLASS_NAME = "GetKeychainEntryEndpoint";
    private readonly log;
    get className(): string;
    constructor(options: IGetKeychainEntryEndpointOptions);
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
                "404": {
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
