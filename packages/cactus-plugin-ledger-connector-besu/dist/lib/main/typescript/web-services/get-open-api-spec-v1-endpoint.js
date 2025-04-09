"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOpenApiSpecV1Endpoint = exports.OasPathGetOpenApiSpecV1 = void 0;
const cactus_core_1 = require("@hyperledger/cactus-core");
const cactus_common_1 = require("@hyperledger/cactus-common");
const openapi_json_1 = __importDefault(require("../../json/openapi.json"));
exports.OasPathGetOpenApiSpecV1 = openapi_json_1.default.paths["/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/get-open-api-spec"];
class GetOpenApiSpecV1Endpoint extends cactus_core_1.GetOpenApiSpecV1EndpointBase {
    options;
    get className() {
        return GetOpenApiSpecV1Endpoint.CLASS_NAME;
    }
    constructor(options) {
        super(options);
        this.options = options;
        const fnTag = `${this.className}#constructor()`;
        cactus_common_1.Checks.truthy(options, `${fnTag} arg options`);
    }
}
exports.GetOpenApiSpecV1Endpoint = GetOpenApiSpecV1Endpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LW9wZW4tYXBpLXNwZWMtdjEtZW5kcG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L3dlYi1zZXJ2aWNlcy9nZXQtb3Blbi1hcGktc3BlYy12MS1lbmRwb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwwREFHa0M7QUFFbEMsOERBQWtFO0FBR2xFLDJFQUEwQztBQUU3QixRQUFBLHVCQUF1QixHQUNsQyxzQkFBRyxDQUFDLEtBQUssQ0FDUCxvRkFBb0YsQ0FDckYsQ0FBQztBQVlKLE1BQWEsd0JBQ1gsU0FBUSwwQ0FBcUU7SUFPakQ7SUFKNUIsSUFBVyxTQUFTO1FBQ2xCLE9BQU8sd0JBQXdCLENBQUMsVUFBVSxDQUFDO0lBQzdDLENBQUM7SUFFRCxZQUE0QixPQUF5QztRQUNuRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFEVyxZQUFPLEdBQVAsT0FBTyxDQUFrQztRQUVuRSxNQUFNLEtBQUssR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLGdCQUFnQixDQUFDO1FBQ2hELHNCQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLEtBQUssY0FBYyxDQUFDLENBQUM7SUFDakQsQ0FBQztDQUNGO0FBYkQsNERBYUMifQ==