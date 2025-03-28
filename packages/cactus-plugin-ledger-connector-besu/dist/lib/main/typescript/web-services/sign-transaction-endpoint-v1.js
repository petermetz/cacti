"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BesuSignTransactionEndpointV1 = void 0;
const cactus_core_1 = require("@hyperledger/cactus-core");
const cactus_common_1 = require("@hyperledger/cactus-common");
const openapi_json_1 = __importDefault(require("../../json/openapi.json"));
class BesuSignTransactionEndpointV1 {
    options;
    log;
    constructor(options) {
        this.options = options;
        const fnTag = "BesuSignTransactionEndpointV1#constructor()";
        cactus_common_1.Checks.truthy(options, `${fnTag} options`);
        cactus_common_1.Checks.truthy(options.connector, `${fnTag} options.connector`);
        const label = "besu-sign-transaction-endpoint";
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
        return openapi_json_1.default.paths["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/sign-transaction"];
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
    async registerExpress(expressApp) {
        await (0, cactus_core_1.registerWebServiceEndpoint)(expressApp, this);
        return this;
    }
    async handleRequest(req, res) {
        const fnTag = "BesuSignTransactionEndpointV1#handleRequest()";
        this.log.debug(`POST ${this.getPath()}`);
        try {
            const request = req.body;
            const trxResponse = await this.options.connector.signTransaction(request);
            if (trxResponse.isPresent()) {
                res.status(200);
                res.json(trxResponse.get());
            }
            else {
                this.log.error(`${fnTag} failed to find the transaction`);
                res.status(404);
                res.statusMessage = "Transaction not found";
                res.json({ error: "Transaction not found" });
            }
        }
        catch (ex) {
            this.log.error(`${fnTag} failed to serve request`, ex);
            res.status(500);
            res.statusMessage = ex.message;
            res.json({ error: ex.stack });
        }
    }
}
exports.BesuSignTransactionEndpointV1 = BesuSignTransactionEndpointV1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi10cmFuc2FjdGlvbi1lbmRwb2ludC12MS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvd2ViLXNlcnZpY2VzL3NpZ24tdHJhbnNhY3Rpb24tZW5kcG9pbnQtdjEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsMERBQXNFO0FBUXRFLDhEQU1vQztBQUtwQywyRUFBMEM7QUFPMUMsTUFBYSw2QkFBNkI7SUFHWjtJQUZYLEdBQUcsQ0FBUztJQUU3QixZQUE0QixPQUE0QztRQUE1QyxZQUFPLEdBQVAsT0FBTyxDQUFxQztRQUN0RSxNQUFNLEtBQUssR0FBRyw2Q0FBNkMsQ0FBQztRQUU1RCxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsR0FBRyxLQUFLLFVBQVUsQ0FBQyxDQUFDO1FBQzNDLHNCQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxLQUFLLG9CQUFvQixDQUFDLENBQUM7UUFFL0QsTUFBTSxLQUFLLEdBQUcsZ0NBQWdDLENBQUM7UUFDL0MsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUM7UUFDekMsSUFBSSxDQUFDLEdBQUcsR0FBRyw4QkFBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCwrQkFBK0I7UUFDN0IsOERBQThEO1FBQzlELE9BQU87WUFDTCxHQUFHLEVBQUUsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUNoQixXQUFXLEVBQUUsSUFBSTtnQkFDakIsYUFBYSxFQUFFLEVBQUU7YUFDbEIsQ0FBQztTQUNILENBQUM7SUFDSixDQUFDO0lBRU0sd0JBQXdCO1FBQzdCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELElBQVcsT0FBTztRQUNoQixPQUFPLHNCQUFHLENBQUMsS0FBSyxDQUNkLG1GQUFtRixDQUNwRixDQUFDO0lBQ0osQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUM1RCxDQUFDO0lBRUQsZ0JBQWdCO1FBQ2QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDckUsQ0FBQztJQUVNLGNBQWM7UUFDbkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDdkMsQ0FBQztJQUVNLEtBQUssQ0FBQyxlQUFlLENBQzFCLFVBQW1CO1FBRW5CLE1BQU0sSUFBQSx3Q0FBMEIsRUFBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFZLEVBQUUsR0FBYTtRQUM3QyxNQUFNLEtBQUssR0FBRywrQ0FBK0MsQ0FBQztRQUM5RCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFekMsSUFBSSxDQUFDO1lBQ0gsTUFBTSxPQUFPLEdBQ1gsR0FBRyxDQUFDLElBQThCLENBQUM7WUFFckMsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFMUUsSUFBSSxXQUFXLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQztnQkFDNUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUM5QixDQUFDO2lCQUFNLENBQUM7Z0JBQ04sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLGlDQUFpQyxDQUFDLENBQUM7Z0JBQzFELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hCLEdBQUcsQ0FBQyxhQUFhLEdBQUcsdUJBQXVCLENBQUM7Z0JBQzVDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO1lBQy9DLENBQUM7UUFDSCxDQUFDO1FBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztZQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSywwQkFBMEIsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN2RCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLEdBQUcsQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztZQUMvQixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2hDLENBQUM7SUFDSCxDQUFDO0NBQ0Y7QUEvRUQsc0VBK0VDIn0=