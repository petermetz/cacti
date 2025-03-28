import { LogLevelDesc } from "@hyperledger/cactus-common";
import { DeployContractSolidityBytecodeNoKeychainV1Request, DeployContractSolidityBytecodeV1Response } from "../../generated/openapi/typescript-axios";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { PrometheusExporter } from "../../prometheus-exporter/prometheus-exporter";
import Web3 from "web3";
export declare function deployContractV1NoKeychain(ctx: {
    readonly pluginRegistry: PluginRegistry;
    readonly prometheusExporter: PrometheusExporter;
    readonly web3: Web3;
    readonly logLevel: LogLevelDesc;
}, req: DeployContractSolidityBytecodeNoKeychainV1Request): Promise<DeployContractSolidityBytecodeV1Response>;
