"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPastLogsEndpoint = void 0;
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_core_1 = require("@hyperledger/cactus-core");
const openapi_json_1 = __importDefault(require("../../json/openapi.json"));
class GetPastLogsEndpoint {
    options;
    static CLASS_NAME = "GetPastLogsEndpoint";
    log;
    get className() {
        return GetPastLogsEndpoint.CLASS_NAME;
    }
    constructor(options) {
        this.options = options;
        const fnTag = `${this.className}#constructor()`;
        cactus_common_1.Checks.truthy(options, `${fnTag} arg options`);
        cactus_common_1.Checks.truthy(options.connector, `${fnTag} arg options.connector`);
        const level = this.options.logLevel || "INFO";
        const label = this.className;
        this.log = cactus_common_1.LoggerProvider.getOrCreate({ level, label });
    }
    get oasPath() {
        return openapi_json_1.default.paths["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/get-past-logs"];
    }
    getPath() {
        return this.oasPath.post["x-hyperledger-cacti"].http.path;
    }
    getVerbLowerCase() {
        return this.oasPath.post["x-hyperledger-cacti"].http.verbLowerCase;
    }
    getOperationId() {
        return this.oasPath.post.operationId;
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
    async registerExpress(expressApp) {
        await (0, cactus_core_1.registerWebServiceEndpoint)(expressApp, this);
        return this;
    }
    getExpressRequestHandler() {
        return this.handleRequest.bind(this);
    }
    async handleRequest(req, res) {
        const reqTag = `${this.getVerbLowerCase()} - ${this.getPath()}`;
        this.log.debug(reqTag);
        const reqBody = req.body;
        try {
            const resBody = await this.options.connector.getPastLogs(reqBody);
            res.json(resBody);
        }
        catch (ex) {
            this.log.error(`Crash while serving ${reqTag}`, ex);
            res.status(500).json({
                message: "Internal Server Error",
                error: ex?.stack || ex?.message,
            });
        }
    }
}
exports.GetPastLogsEndpoint = GetPastLogsEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXBhc3QtbG9ncy1lbmRwb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvd2ViLXNlcnZpY2VzL2dldC1wYXN0LWxvZ3MtZW5kcG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsOERBTW9DO0FBTXBDLDBEQUFzRTtBQUl0RSwyRUFBMEM7QUFPMUMsTUFBYSxtQkFBbUI7SUFTRjtJQVJyQixNQUFNLENBQVUsVUFBVSxHQUFHLHFCQUFxQixDQUFDO0lBRXpDLEdBQUcsQ0FBUztJQUU3QixJQUFXLFNBQVM7UUFDbEIsT0FBTyxtQkFBbUIsQ0FBQyxVQUFVLENBQUM7SUFDeEMsQ0FBQztJQUVELFlBQTRCLE9BQW9DO1FBQXBDLFlBQU8sR0FBUCxPQUFPLENBQTZCO1FBQzlELE1BQU0sS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsZ0JBQWdCLENBQUM7UUFDaEQsc0JBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsS0FBSyxjQUFjLENBQUMsQ0FBQztRQUMvQyxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsS0FBSyx3QkFBd0IsQ0FBQyxDQUFDO1FBRW5FLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQztRQUM5QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLEdBQUcsOEJBQWMsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsSUFBVyxPQUFPO1FBQ2hCLE9BQU8sc0JBQUcsQ0FBQyxLQUFLLENBQ2QsZ0ZBQWdGLENBQ2pGLENBQUM7SUFDSixDQUFDO0lBRU0sT0FBTztRQUNaLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzVELENBQUM7SUFFTSxnQkFBZ0I7UUFDckIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDckUsQ0FBQztJQUVNLGNBQWM7UUFDbkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDdkMsQ0FBQztJQUVELCtCQUErQjtRQUM3Qiw4REFBOEQ7UUFDOUQsT0FBTztZQUNMLEdBQUcsRUFBRSxLQUFLLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQ2hCLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixhQUFhLEVBQUUsRUFBRTthQUNsQixDQUFDO1NBQ0gsQ0FBQztJQUNKLENBQUM7SUFFTSxLQUFLLENBQUMsZUFBZSxDQUMxQixVQUFtQjtRQUVuQixNQUFNLElBQUEsd0NBQTBCLEVBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25ELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLHdCQUF3QjtRQUM3QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQVksRUFBRSxHQUFhO1FBQ3BELE1BQU0sTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7UUFDaEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkIsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUM7WUFDSCxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNsRSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3BCLENBQUM7UUFBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO1lBQ1osSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3BELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNuQixPQUFPLEVBQUUsdUJBQXVCO2dCQUNoQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssSUFBSSxFQUFFLEVBQUUsT0FBTzthQUNoQyxDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQzs7QUF4RUgsa0RBeUVDIn0=