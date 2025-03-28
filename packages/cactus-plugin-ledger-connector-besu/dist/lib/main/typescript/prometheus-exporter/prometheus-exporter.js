"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrometheusExporter = void 0;
const prom_client_1 = __importStar(require("prom-client"));
const data_fetcher_1 = require("./data-fetcher");
const metrics_1 = require("./metrics");
const metrics_2 = require("./metrics");
class PrometheusExporter {
    prometheusExporterOptions;
    metricsPollingIntervalInMin;
    transactions = { counter: 0 };
    registry;
    constructor(prometheusExporterOptions) {
        this.prometheusExporterOptions = prometheusExporterOptions;
        this.metricsPollingIntervalInMin =
            prometheusExporterOptions.pollingIntervalInMin || 1;
        this.registry = new prom_client_1.Registry();
    }
    addCurrentTransaction() {
        (0, data_fetcher_1.collectMetrics)(this.transactions);
    }
    async getPrometheusMetrics() {
        const result = await this.registry.getSingleMetricAsString(metrics_1.K_CACTUS_BESU_TOTAL_TX_COUNT);
        return result;
    }
    startMetricsCollection() {
        this.registry.registerMetric(metrics_2.totalTxCount);
        prom_client_1.default.collectDefaultMetrics({ register: this.registry });
    }
}
exports.PrometheusExporter = PrometheusExporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWV0aGV1cy1leHBvcnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvcHJvbWV0aGV1cy1leHBvcnRlci9wcm9tZXRoZXVzLWV4cG9ydGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkRBQW1EO0FBRW5ELGlEQUFnRDtBQUNoRCx1Q0FBeUQ7QUFDekQsdUNBQXlDO0FBTXpDLE1BQWEsa0JBQWtCO0lBTVg7SUFMRiwyQkFBMkIsQ0FBUztJQUNwQyxZQUFZLEdBQWlCLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQzVDLFFBQVEsQ0FBVztJQUVuQyxZQUNrQix5QkFBcUQ7UUFBckQsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUE0QjtRQUVyRSxJQUFJLENBQUMsMkJBQTJCO1lBQzlCLHlCQUF5QixDQUFDLG9CQUFvQixJQUFJLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksc0JBQVEsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFTSxxQkFBcUI7UUFDMUIsSUFBQSw2QkFBYyxFQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRU0sS0FBSyxDQUFDLG9CQUFvQjtRQUMvQixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQ3hELHNDQUE0QixDQUM3QixDQUFDO1FBQ0YsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVNLHNCQUFzQjtRQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxzQkFBWSxDQUFDLENBQUM7UUFDM0MscUJBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUNoRSxDQUFDO0NBQ0Y7QUE1QkQsZ0RBNEJDIn0=