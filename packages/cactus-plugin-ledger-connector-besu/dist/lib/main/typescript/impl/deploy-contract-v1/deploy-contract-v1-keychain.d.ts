import { LogLevelDesc } from "@hyperledger/cactus-common";
import { DeployContractSolidityBytecodeV1Request, DeployContractSolidityBytecodeV1Response } from "../../generated/openapi/typescript-axios";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { PrometheusExporter } from "../../prometheus-exporter/prometheus-exporter";
import Web3 from "web3";
import Contract from "web3-eth-contract";
export interface IDeployContractV1KeychainResponse {
    status: boolean;
    contractAddress: string;
    contractName: string;
    contract?: Contract.Contract;
    deployResponse: DeployContractSolidityBytecodeV1Response;
}
export declare function deployContractV1Keychain(ctx: {
    readonly pluginRegistry: PluginRegistry;
    readonly prometheusExporter: PrometheusExporter;
    readonly web3: Web3;
    readonly logLevel: LogLevelDesc;
}, req: DeployContractSolidityBytecodeV1Request): Promise<IDeployContractV1KeychainResponse>;
