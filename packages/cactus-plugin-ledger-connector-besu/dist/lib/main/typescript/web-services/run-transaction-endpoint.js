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
            .header(cactus_common_1.HttpHeader.RetryAfter, "5")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLXRyYW5zYWN0aW9uLWVuZHBvaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC93ZWItc2VydmljZXMvcnVuLXRyYW5zYWN0aW9uLWVuZHBvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLGlDQUF1QztBQUV2Qyw4REFPb0M7QUFNcEMsMERBR2tDO0FBSWxDLDJFQUEwQztBQUUxQyxtSUFBMEg7QUFPMUgsTUFBYSxzQkFBc0I7SUFTTDtJQVJyQixNQUFNLENBQVUsVUFBVSxHQUFHLHdCQUF3QixDQUFDO0lBRTVDLEdBQUcsQ0FBUztJQUU3QixJQUFXLFNBQVM7UUFDbEIsT0FBTyxzQkFBc0IsQ0FBQyxVQUFVLENBQUM7SUFDM0MsQ0FBQztJQUVELFlBQTRCLE9BQXVDO1FBQXZDLFlBQU8sR0FBUCxPQUFPLENBQWdDO1FBQ2pFLE1BQU0sS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsZ0JBQWdCLENBQUM7UUFDaEQsc0JBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsS0FBSyxjQUFjLENBQUMsQ0FBQztRQUMvQyxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsS0FBSyx3QkFBd0IsQ0FBQyxDQUFDO1FBRW5FLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQztRQUM5QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLEdBQUcsOEJBQWMsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsSUFBVyxPQUFPO1FBQ2hCLE9BQU8sc0JBQUcsQ0FBQyxLQUFLLENBQ2Qsa0ZBQWtGLENBQ25GLENBQUM7SUFDSixDQUFDO0lBRU0sT0FBTztR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