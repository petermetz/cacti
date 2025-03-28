"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployContractSolidityBytecodeNoKeychainEndpoint = void 0;
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_core_1 = require("@hyperledger/cactus-core");
const openapi_json_1 = __importDefault(require("../../json/openapi.json"));
class DeployContractSolidityBytecodeNoKeychainEndpoint {
    options;
    static CLASS_NAME = "DeployContractSolidityBytecodeNoKeychainEndpoint";
    log;
    get className() {
        return DeployContractSolidityBytecodeNoKeychainEndpoint.CLASS_NAME;
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
        return openapi_json_1.default.paths["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/deploy-contract-solidity-bytecode-no-keychain"];
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
        const { log } = this;
        const fnTag = `${this.className}#handleRequest()`;
        const reqTag = `${this.getVerbLowerCase()} - ${this.getPath()}`;
        this.log.debug(reqTag);
        const reqBody = req.body;
        try {
            const resBody = await this.options.connector.deployContractNoKeychain(reqBody);
            res.json(resBody);
        }
        catch (ex) {
            const errorMsg = `${reqTag} ${fnTag} Failed to deploy contract:`;
            await (0, cactus_core_1.handleRestEndpointException)({ errorMsg, log, error: ex, res });
        }
    }
}
exports.DeployContractSolidityBytecodeNoKeychainEndpoint = DeployContractSolidityBytecodeNoKeychainEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95LWNvbnRyYWN0LXNvbGlkaXR5LWJ5dGVjb2RlLW5vLWtleWNoYWluLWVuZHBvaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC93ZWItc2VydmljZXMvZGVwbG95LWNvbnRyYWN0LXNvbGlkaXR5LWJ5dGVjb2RlLW5vLWtleWNoYWluLWVuZHBvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQVFBLDhEQU1vQztBQUVwQywwREFHa0M7QUFJbEMsMkVBQTBDO0FBTzFDLE1BQWEsZ0RBQWdEO0lBYXpDO0lBVlgsTUFBTSxDQUFVLFVBQVUsR0FDL0Isa0RBQWtELENBQUM7SUFFcEMsR0FBRyxDQUFTO0lBRTdCLElBQVcsU0FBUztRQUNsQixPQUFPLGdEQUFnRCxDQUFDLFVBQVUsQ0FBQztJQUNyRSxDQUFDO0lBRUQsWUFDa0IsT0FBeUQ7UUFBekQsWUFBTyxHQUFQLE9BQU8sQ0FBa0Q7UUFFekUsTUFBTSxLQUFLLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxnQkFBZ0IsQ0FBQztRQUNoRCxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsR0FBRyxLQUFLLGNBQWMsQ0FBQyxDQUFDO1FBQy9DLHNCQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxLQUFLLHdCQUF3QixDQUFDLENBQUM7UUFFbkUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDO1FBQzlDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDN0IsSUFBSSxDQUFDLEdBQUcsR0FBRyw4QkFBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxJQUFXLE9BQU87UUFDaEIsT0FBTyxzQkFBRyxDQUFDLEtBQUssQ0FDZCxnSEFBZ0gsQ0FDakgsQ0FBQztJQUNKLENBQUM7SUFFTSxPQUFPO1FBQ1osT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDNUQsQ0FBQztJQUVNLGdCQUFnQjtRQUNyQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUNyRSxDQUFDO0lBRU0sY0FBYztRQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUN2QyxDQUFDO0lBRUQsK0JBQStCO1FBQzdCLDhEQUE4RDtRQUM5RCxPQUFPO1lBQ0wsR0FBRyxFQUFFLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDaEIsV0FBVyxFQUFFLElBQUk7Z0JBQ2pCLGFBQWEsRUFBRSxFQUFFO2FBQ2xCLENBQUM7U0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVNLEtBQUssQ0FBQyxlQUFlLENBQzFCLFVBQW1CO1FBRW5CLE1BQU0sSUFBQSx3Q0FBMEIsRUFBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sd0JBQXdCO1FBQzdCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVNLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBWSxFQUFFLEdBQWE7UUFDcEQsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNyQixNQUFNLEtBQUssR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLGtCQUFrQixDQUFDO1FBQ2xELE1BQU0sTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7UUFDaEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkIsTUFBTSxPQUFPLEdBQXNELEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDNUUsSUFBSSxDQUFDO1lBQ0gsTUFBTSxPQUFPLEdBQ1gsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqRSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3BCLENBQUM7UUFBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO1lBQ1osTUFBTSxRQUFRLEdBQUcsR0FBRyxNQUFNLElBQUksS0FBSyw2QkFBNkIsQ0FBQztZQUNqRSxNQUFNLElBQUEseUNBQTJCLEVBQUMsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN2RSxDQUFDO0lBQ0gsQ0FBQzs7QUE3RUgsNEdBOEVDIn0=