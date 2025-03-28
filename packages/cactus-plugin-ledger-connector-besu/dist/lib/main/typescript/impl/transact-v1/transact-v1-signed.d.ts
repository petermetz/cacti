import { LogLevelDesc } from "@hyperledger/cactus-common";
import { ConsistencyStrategy, RunTransactionRequest, RunTransactionResponse } from "../../generated/openapi/typescript-axios";
import Web3 from "web3";
import type { TransactionReceipt } from "web3-eth";
import { PrometheusExporter } from "../../prometheus-exporter/prometheus-exporter";
export declare function transactV1Signed(ctx: {
    readonly web3: Web3;
    readonly prometheusExporter: PrometheusExporter;
    readonly logLevel: LogLevelDesc;
}, req: RunTransactionRequest): Promise<RunTransactionResponse>;
export declare function getTxReceipt(ctx: {
    readonly web3: Web3;
    readonly prometheusExporter: PrometheusExporter;
    readonly logLevel: LogLevelDesc;
}, request: RunTransactionRequest, txPoolReceipt: TransactionReceipt): Promise<RunTransactionResponse>;
export declare function pollForTxReceipt(ctx: {
    readonly web3: Web3;
    readonly logLevel: LogLevelDesc;
}, txHash: string, consistencyStrategy: ConsistencyStrategy): Promise<TransactionReceipt>;
