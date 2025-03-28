import { PluginRegistry } from "@hyperledger/cactus-core";
import { RunTransactionRequest, RunTransactionResponse } from "../../generated/openapi/typescript-axios";
import Web3 from "web3";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import { PrometheusExporter } from "../../prometheus-exporter/prometheus-exporter";
export declare function transactV1PrivateKey(ctx: {
    readonly pluginRegistry: PluginRegistry;
    readonly prometheusExporter: PrometheusExporter;
    readonly web3: Web3;
    readonly logLevel: LogLevelDesc;
}, req: RunTransactionRequest): Promise<RunTransactionResponse>;
export declare function transactPrivate(ctx: {
    readonly web3: Web3;
}, options: any): Promise<RunTransactionResponse>;
export declare function getPrivateTxReceipt(ctx: {
    readonly web3: Web3;
}, privateFrom: string, txHash: string): Promise<RunTransactionResponse>;
