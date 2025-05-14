"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunTransactionEndpoint = void 0;
const axios_1 = require("axios");
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_core_1 = require("@hyperledger/cactus-core");
const openapi_json_1 = __importDefault(require("../../json/openapi.json"));
const is_web3_websocket_provider_abnormal_closure_error_1 = require("../common/is-web3-websocket-provider-abnormal-closure-error");
class RunTransactionEndpoint {
    options;
    static CLASS_NAME = "RunTransactionEndpoint";
    log;
    get className() {
        return RunTransactionEndpoint.CLASS_NAME;
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
        return openapi_json_1.default.paths["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/run-transaction"];
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
    handleLedgerNotAccessibleError(res) {
        const fn = "handleLedgerNotAccessibleError()";
        this.log.debug("%s WebSocketProvider disconnected from ledger. Sending HttpStatusCode.ServiceUnavailable...", fn);
        res
            .header("Retry-After", "5")
            .status(axios_1.HttpStatusCode.ServiceUnavailable)
            .json({
            success: false,
            error: "Could not establish connection to the backing ledger.",
        });
    }
    async handleRequest(req, res) {
        const reqTag = `${this.getVerbLowerCase()} - ${this.getPath()}`;
        const { log } = this;
        this.log.debug(reqTag);
        const reqBody = req.body;
        try {
            const resBody = await this.options.connector.transact(reqBody);
            res.json({ success: true, data: resBody });
        }
        catch (ex) {
            if ((0, is_web3_websocket_provider_abnormal_closure_error_1.isWeb3WebsocketProviderAbnormalClosureError)(ex)) {
                return this.handleLedgerNotAccessibleError(res);
            }
            const errorMsg = `request handler fn crashed for: ${reqTag}`;
            await (0, cactus_core_1.handleRestEndpointException)({ errorMsg, log, error: ex, res });
        }
    }
}
exports.RunTransactionEndpoint = RunTransactionEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLXRyYW5zYWN0aW9uLWVuZHBvaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC93ZWItc2VydmljZXMvcnVuLXRyYW5zYWN0aW9uLWVuZHBvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLGlDQUF1QztBQUV2Qyw4REFNb0M7QUFNcEMsMERBR2tDO0FBSWxDLDJFQUEwQztBQUUxQyxtSUFBMEg7QUFPMUgsTUFBYSxzQkFBc0I7SUFTTDtJQVJyQixNQUFNLENBQVUsVUFBVSxHQUFHLHdCQUF3QixDQUFDO0lBRTVDLEdBQUcsQ0FBUztJQUU3QixJQUFXLFNBQVM7UUFDbEIsT0FBTyxzQkFBc0IsQ0FBQyxVQUFVLENBQUM7SUFDM0MsQ0FBQztJQUVELFlBQTRCLE9BQXVDO1FBQXZDLFlBQU8sR0FBUCxPQUFPLENBQWdDO1FBQ2pFLE1BQU0sS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsZ0JBQWdCLENBQUM7UUFDaEQsc0JBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsS0FBSyxjQUFjLENBQUMsQ0FBQztRQUMvQyxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsS0FBSyx3QkFBd0IsQ0FBQyxDQUFDO1FBRW5FLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQztRQUM5QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLEdBQUcsOEJBQWMsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsSUFBVyxPQUFPO1FBQ2hCLE9BQU8sc0JBQUcsQ0FBQyxLQUFLLENBQ2Qsa0ZBQWtGLENBQ25GLENBQUM7SUFDSixDQUFDO0lBRU0sT0FBTztR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