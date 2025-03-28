import { Registry } from "prom-client";
import { Transactions } from "./response.type";
export interface IPrometheusExporterOptions {
    pollingIntervalInMin?: number;
}
export declare class PrometheusExporter {
    readonly prometheusExporterOptions: IPrometheusExporterOptions;
    readonly metricsPollingIntervalInMin: number;
    readonly transactions: Transactions;
    readonly registry: Registry;
    constructor(prometheusExporterOptions: IPrometheusExporterOptions);
    addCurrentTransaction(): void;
    getPrometheusMetrics(): Promise<string>;
    startMetricsCollection(): void;
}
