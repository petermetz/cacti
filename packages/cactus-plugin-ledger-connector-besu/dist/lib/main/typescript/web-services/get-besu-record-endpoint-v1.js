"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBesuRecordEndpointV1 = void 0;
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_core_1 = require("@hyperledger/cactus-core");
const openapi_json_1 = __importDefault(require("../../json/openapi.json"));
class GetBesuRecordEndpointV1 {
    options;
    static CLASS_NAME = "GetBesuRecordEndpointV1";
    log;
    get className() {
        return GetBesuRecordEndpointV1.CLASS_NAME;
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
    getOasPath() {
        return openapi_json_1.default.paths["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/get-besu-record"];
    }
    getPath() {
        const apiPath = this.getOasPath();
        return apiPath.post["x-hyperledger-cacti"].http.path;
    }
    getVerbLowerCase() {
        const apiPath = this.getOasPath();
        return apiPath.post["x-hyperledger-cacti"].http.verbLowerCase;
    }
    getOperationId() {
        return this.getOasPath().post.operationId;
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
        try {
            const reqBody = req.body;
            const resBody = await this.options.connector.getBesuRecord(reqBody);
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
exports.GetBesuRecordEndpointV1 = GetBesuRecordEndpointV1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWJlc3UtcmVjb3JkLWVuZHBvaW50LXYxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC93ZWItc2VydmljZXMvZ2V0LWJlc3UtcmVjb3JkLWVuZHBvaW50LXYxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLDhEQU1vQztBQU1wQywwREFBc0U7QUFLdEUsMkVBQTBDO0FBTzFDLE1BQWEsdUJBQXVCO0lBU047SUFSckIsTUFBTSxDQUFVLFVBQVUsR0FBRyx5QkFBeUIsQ0FBQztJQUU3QyxHQUFHLENBQVM7SUFFN0IsSUFBVyxTQUFTO1FBQ2xCLE9BQU8sdUJBQXVCLENBQUMsVUFBVSxDQUFDO0lBQzVDLENBQUM7SUFFRCxZQUE0QixPQUF3QztRQUF4QyxZQUFPLEdBQVAsT0FBTyxDQUFpQztRQUNsRSxNQUFNLEtBQUssR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLGdCQUFnQixDQUFDO1FBQ2hELHNCQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLEtBQUssY0FBYyxDQUFDLENBQUM7UUFDL0Msc0JBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxHQUFHLEtBQUssd0JBQXdCLENBQUMsQ0FBQztRQUVuRSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUM7UUFDOUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBRyxHQUFHLDhCQUFjLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVNLFVBQVU7UUFDZixPQUFPLHNCQUFHLENBQUMsS0FBSyxDQUNkLGtGQUFrRixDQUNuRixDQUFDO0lBQ0osQ0FBQztJQUVNLE9BQU87UUFDWixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEMsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUN2RCxDQUFDO0lBRU0sZ0JBQWdCO1FBQ3JCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNsQyxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQ2hFLENBQUM7SUFFTSxjQUFjO1FBQ25CLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDNUMsQ0FBQztJQUVELCtCQUErQjtRQUM3Qiw4REFBOEQ7UUFDOUQsT0FBTztZQUNMLEdBQUcsRUFBRSxLQUFLLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQ2hCLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixhQUFhLEVBQUUsRUFBRTthQUNsQixDQUFDO1NBQ0gsQ0FBQztJQUNKLENBQUM7SUFFTSxLQUFLLENBQUMsZUFBZSxDQUMxQixVQUFtQjtRQUVuQixNQUFNLElBQUEsd0NBQTBCLEVBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25ELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLHdCQUF3QjtRQUM3QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQVksRUFBRSxHQUFhO1FBQ3BELE1BQU0sTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7UUFDaEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDO1lBQ0gsTUFBTSxPQUFPLEdBQ1gsR0FBRyxDQUFDLElBQThCLENBQUM7WUFDckMsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDcEUsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwQixDQUFDO1FBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztZQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHVCQUF1QixNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNwRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDbkIsT0FBTyxFQUFFLHVCQUF1QjtnQkFDaEMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLElBQUksRUFBRSxFQUFFLE9BQU87YUFDaEMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7O0FBM0VILDBEQTRFQyJ9