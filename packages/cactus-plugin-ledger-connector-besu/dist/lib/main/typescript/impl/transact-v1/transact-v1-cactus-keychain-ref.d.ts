import { PluginRegistry } from "@hyperledger/cactus-core";
import { RunTransactionRequest, RunTransactionResponse } from "../../generated/openapi/typescript-axios";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import Web3 from "web3";
import { PrometheusExporter } from "../../prometheus-exporter/prometheus-exporter";
export declare function transactV1CactusKeychainRef(ctx: {
    readonly pluginRegistry: PluginRegistry;
    readonly prometheusExporter: PrometheusExporter;
    readonly web3: Web3;
    readonly logLevel: LogLevelDesc;
}, req: RunTransactionRequest): Promise<RunTransactionResponse>;
