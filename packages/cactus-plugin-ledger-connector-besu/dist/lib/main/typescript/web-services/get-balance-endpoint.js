"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBalanceEndpoint = void 0;
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_core_1 = require("@hyperledger/cactus-core");
const openapi_json_1 = __importDefault(require("../../json/openapi.json"));
class GetBalanceEndpoint {
    options;
    static CLASS_NAME = "GetBalanceEndpoint";
    log;
    get className() {
        return GetBalanceEndpoint.CLASS_NAME;
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
        return openapi_json_1.default.paths["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/get-balance"];
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
            const resBody = await this.options.connector.getBalance(reqBody);
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
exports.GetBalanceEndpoint = GetBalanceEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWJhbGFuY2UtZW5kcG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L3dlYi1zZXJ2aWNlcy9nZXQtYmFsYW5jZS1lbmRwb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSw4REFNb0M7QUFNcEMsMERBQXNFO0FBSXRFLDJFQUEwQztBQU8xQyxNQUFhLGtCQUFrQjtJQVNEO0lBUnJCLE1BQU0sQ0FBVSxVQUFVLEdBQUcsb0JBQW9CLENBQUM7SUFFeEMsR0FBRyxDQUFTO0lBRTdCLElBQVcsU0FBUztRQUNsQixPQUFPLGtCQUFrQixDQUFDLFVBQVUsQ0FBQztJQUN2QyxDQUFDO0lBRUQsWUFBNEIsT0FBbUM7UUFBbkMsWUFBTyxHQUFQLE9BQU8sQ0FBNEI7UUFDN0QsTUFBTSxLQUFLLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxnQkFBZ0IsQ0FBQztRQUNoRCxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsR0FBRyxLQUFLLGNBQWMsQ0FBQyxDQUFDO1FBQy9DLHNCQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxLQUFLLHdCQUF3QixDQUFDLENBQUM7UUFFbkUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDO1FBQzlDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsR0FBRyw4QkFBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxJQUFXLE9BQU87UUFDaEIsT0FBTyxzQkFBRyxDQUFDLEtBQUssQ0FDZCw4RUFBOEUsQ0FDL0UsQ0FBQztJQUNKLENBQUM7SUFFTSxPQUFPO1FBQ1osT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDNUQsQ0FBQztJQUVNLGdCQUFnQjtRQUNyQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUNyRSxDQUFDO0lBRU0sY0FBYztRQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUN2QyxDQUFDO0lBRUQsK0JBQStCO1FBQzdCLDhEQUE4RDtRQUM5RCxPQUFPO1lBQ0wsR0FBRyxFQUFFLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDaEIsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLGFBQWEsRUFBRSxFQUFFO2FBQ2xCLENBQUM7U0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVNLEtBQUssQ0FBQyxlQUFlLENBQzFCLFVBQW1CO1FBRW5CLE1BQU0sSUFBQSx3Q0FBMEIsRUFBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sd0JBQXdCO1FBQzdCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVNLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBWSxFQUFFLEdBQWE7UUFDcEQsTUFBTSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztRQUNoRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QixNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQztZQUNILE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2pFLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEIsQ0FBQztRQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7WUFDWixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDcEQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ25CLE9BQU8sRUFBRSx1QkFBdUI7Z0JBQ2hDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxJQUFJLEVBQUUsRUFBRSxPQUFPO2FBQ2hDLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDOztBQXhFSCxnREF5RUMifQ==