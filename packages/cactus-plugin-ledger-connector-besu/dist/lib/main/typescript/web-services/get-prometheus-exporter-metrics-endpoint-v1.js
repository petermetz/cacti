"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPrometheusExporterMetricsEndpointV1 = void 0;
const cactus_core_1 = require("@hyperledger/cactus-core");
const openapi_json_1 = __importDefault(require("../../json/openapi.json"));
const cactus_common_1 = require("@hyperledger/cactus-common");
class GetPrometheusExporterMetricsEndpointV1 {
    options;
    log;
    constructor(options) {
        this.options = options;
        const fnTag = "GetPrometheusExporterMetricsEndpointV1#constructor()";
        cactus_common_1.Checks.truthy(options, `${fnTag} options`);
        cactus_common_1.Checks.truthy(options.connector, `${fnTag} options.connector`);
        const label = "get-prometheus-exporter-metrics-endpoint";
        const level = options.logLevel || "INFO";
        this.log = cactus_common_1.LoggerProvider.getOrCreate({ label, level });
    }
    getAuthorizationOptionsProvider() {
        // TODO: make this an injectable dependency in the constructor
        return {
            get: async () => ({
                isProtected: true,
                requiredRoles: [],
            }),
        };
    }
    getExpressRequestHandler() {
        return this.handleRequest.bind(this);
    }
    get oasPath() {
        return openapi_json_1.default.paths["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/get-prometheus-exporter-metrics"];
    }
    getPath() {
        return this.oasPath.get["x-hyperledger-cacti"].http.path;
    }
    getVerbLowerCase() {
        return this.oasPath.get["x-hyperledger-cacti"].http.verbLowerCase;
    }
    getOperationId() {
        return this.oasPath.get.operationId;
    }
    async registerExpress(expressApp) {
        await (0, cactus_core_1.registerWebServiceEndpoint)(expressApp, this);
        return this;
    }
    async handleRequest(req, res) {
        const fnTag = "GetPrometheusExporterMetrics#handleRequest()";
        const verbUpper = this.getVerbLowerCase().toUpperCase();
        this.log.debug(`${verbUpper} ${this.getPath()}`);
        try {
            const resBody = await this.options.connector.getPrometheusExporterMetrics();
            res.status(200);
            res.send(resBody);
        }
        catch (ex) {
            this.log.error(`${fnTag} failed to serve request`, ex);
            res.status(500);
            res.statusMessage = ex.message;
            res.json({ error: ex.stack });
        }
    }
}
exports.GetPrometheusExporterMetricsEndpointV1 = GetPrometheusExporterMetricsEndpointV1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXByb21ldGhldXMtZXhwb3J0ZXItbWV0cmljcy1lbmRwb2ludC12MS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvd2ViLXNlcnZpY2VzL2dldC1wcm9tZXRoZXVzLWV4cG9ydGVyLW1ldHJpY3MtZW5kcG9pbnQtdjEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsMERBQXNFO0FBRXRFLDJFQUEwQztBQVExQyw4REFNb0M7QUFTcEMsTUFBYSxzQ0FBc0M7SUFNL0I7SUFIRCxHQUFHLENBQVM7SUFFN0IsWUFDa0IsT0FBdUQ7UUFBdkQsWUFBTyxHQUFQLE9BQU8sQ0FBZ0Q7UUFFdkUsTUFBTSxLQUFLLEdBQUcsc0RBQXNELENBQUM7UUFFckUsc0JBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsS0FBSyxVQUFVLENBQUMsQ0FBQztRQUMzQyxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsS0FBSyxvQkFBb0IsQ0FBQyxDQUFDO1FBRS9ELE1BQU0sS0FBSyxHQUFHLDBDQUEwQyxDQUFDO1FBQ3pELE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxHQUFHLEdBQUcsOEJBQWMsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsK0JBQStCO1FBQzdCLDhEQUE4RDtRQUM5RCxPQUFPO1lBQ0wsR0FBRyxFQUFFLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDaEIsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLGFBQWEsRUFBRSxFQUFFO2FBQ2xCLENBQUM7U0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVNLHdCQUF3QjtRQUM3QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxJQUFXLE9BQU87UUFDaEIsT0FBTyxzQkFBRyxDQUFDLEtBQUssQ0FDZCxrR0FBa0csQ0FDbkcsQ0FBQztJQUNKLENBQUM7SUFFTSxPQUFPO1FBQ1osT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDM0QsQ0FBQztJQUVNLGdCQUFnQjtRQUNyQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUNwRSxDQUFDO0lBRU0sY0FBYztRQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQztJQUN0QyxDQUFDO0lBRU0sS0FBSyxDQUFDLGVBQWUsQ0FDMUIsVUFBbUI7UUFFbkIsTUFBTSxJQUFBLHdDQUEwQixFQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQVksRUFBRSxHQUFhO1FBQzdDLE1BQU0sS0FBSyxHQUFHLDhDQUE4QyxDQUFDO1FBQzdELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3hELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsU0FBUyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakQsSUFBSSxDQUFDO1lBQ0gsTUFBTSxPQUFPLEdBQ1gsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO1lBQzlELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwQixDQUFDO1FBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztZQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSywwQkFBMEIsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN2RCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLEdBQUcsQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztZQUMvQixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2hDLENBQUM7SUFDSCxDQUFDO0NBQ0Y7QUExRUQsd0ZBMEVDIn0=