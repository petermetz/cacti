import type { Express, Request, Response } from "express";
import { IWebServiceEndpoint, IExpressRequestHandler, IEndpointAuthzOptions } from "@hyperledger/cactus-core-api";
import { LogLevelDesc, IAsyncProvider } from "@hyperledger/cactus-common";
import { PluginLedgerConnectorBesu } from "../plugin-ledger-connector-besu";
import OAS from "../../json/openapi.json";
export interface IDeployContractSolidityBytecodeNoKeychainOptions {
    logLevel?: LogLevelDesc;
    connector: PluginLedgerConnectorBesu;
}
export declare class DeployContractSolidityBytecodeNoKeychainEndpoint implements IWebServiceEndpoint {
    readonly options: IDeployContractSolidityBytecodeNoKeychainOptions;
    static readonly CLASS_NAME = "DeployContractSolidityBytecodeNoKeychainEndpoint";
    private readonly log;
    get className(): string;
    constructor(options: IDeployContractSolidityBytecodeNoKeychainOptions);
    get oasPath(): (typeof OAS.paths)["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/deploy-contract-solidity-bytecode-no-keychain"];
    getPath(): string;
    getVerbLowerCase(): string;
    getOperationId(): string;
    getAuthorizationOptionsProvider(): IAsyncProvider<IEndpointAuthzOptions>;
    registerExpress(expressApp: Express): Promise<IWebServiceEndpoint>;
    getExpressRequestHandler(): IExpressRequestHandler;
    handleRequest(req: Request, res: Response): Promise<void>;
}
