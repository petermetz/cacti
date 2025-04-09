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
exports.BesuGrpcSvcOpenApi = void 0;
const grpc_js_1 = require("@grpc/grpc-js");
const default_service = __importStar(require("../generated/proto/protoc-gen-ts/services/default_service"));
const get_block_v1_grpc_1 = require("../impl/get-block-v1/get-block-v1-grpc");
const cactus_common_1 = require("@hyperledger/cactus-common");
class BesuGrpcSvcOpenApi extends default_service.org.hyperledger.cacti
    .plugin.ledger.connector.besu.services.defaultservice
    .UnimplementedDefaultServiceService {
    opts;
    static CLASS_NAME = "BesuGrpcSvcOpenApi";
    get className() {
        return BesuGrpcSvcOpenApi.CLASS_NAME;
    }
    log;
    web3;
    /**
     * The log level that will be used throughout all the methods of this class.
     */
    logLevel;
    constructor(opts) {
        super();
        this.opts = opts;
        this.logLevel = opts.logLevel || "INFO";
        const label = this.className;
        this.log = cactus_common_1.LoggerProvider.getOrCreate({ level: this.logLevel, label });
        this.web3 = opts.web3;
        this.log.debug(`Created instance of ${this.className} OK`);
    }
    DeployContractSolBytecodeV1(call, callback) {
        return callback({
            message: "Status.UNIMPLEMENTED",
            code: grpc_js_1.status.UNIMPLEMENTED,
            details: "Service endpoint not yet implemented.",
        });
    }
    DeployContractSolBytecodeNoKeychainV1(call, callback) {
        return callback({
            message: "Status.UNIMPLEMENTED",
            code: grpc_js_1.status.UNIMPLEMENTED,
            details: "Service endpoint not yet implemented.",
        });
    }
    GetBalanceV1(call, callback) {
        return callback({
            message: "Status.UNIMPLEMENTED",
            code: grpc_js_1.status.UNIMPLEMENTED,
            details: "Service endpoint not yet implemented.",
        });
    }
    GetBesuRecordV1(call, callback) {
        return callback({
            message: "Status.UNIMPLEMENTED",
            code: grpc_js_1.status.UNIMPLEMENTED,
            details: "Service endpoint not yet implemented.",
        });
    }
    GetBlockV1(call, callback) {
        (0, get_block_v1_grpc_1.getBlockV1Grpc)({ web3: this.web3, logLevel: this.logLevel }, call.request)
            .then((res) => {
            callback(null, res);
        })
            .catch((cause) => {
            const ex = (0, cactus_common_1.createRuntimeErrorWithCause)("getBlockGrpc() crashed", cause);
            const exJson = (0, cactus_common_1.safeStringifyException)(ex);
            this.log.debug("getBlockGrpc() crashed with %o", cause);
            callback({
                message: "status.INTERNAL - getBlockGrpc() call crashed.",
                code: grpc_js_1.status.INTERNAL,
                stack: ex.stack,
                name: ex.name,
                details: exJson,
            });
        });
    }
    GetOpenApiSpecV1(call, callback) {
        return callback({
            message: "Status.UNIMPLEMENTED",
            code: grpc_js_1.status.UNIMPLEMENTED,
            details: "Service endpoint not yet implemented.",
        });
    }
    GetPastLogsV1(call, callback) {
        return callback({
            message: "Status.UNIMPLEMENTED",
            code: grpc_js_1.status.UNIMPLEMENTED,
            details: "Service endpoint not yet implemented.",
        });
    }
    GetPrometheusMetricsV1(call, callback) {
        return callback({
            message: "Status.UNIMPLEMENTED",
            code: grpc_js_1.status.UNIMPLEMENTED,
            details: "Service endpoint not yet implemented.",
        });
    }
    GetTransactionV1(call, callback) {
        return callback({
            message: "Status.UNIMPLEMENTED",
            code: grpc_js_1.status.UNIMPLEMENTED,
            details: "Service endpoint not yet implemented.",
        });
    }
    InvokeContractV1(call, callback) {
        return callback({
            message: "Status.UNIMPLEMENTED",
            code: grpc_js_1.status.UNIMPLEMENTED,
            details: "Service endpoint not yet implemented.",
        });
    }
    RunTransactionV1(call, callback) {
        return callback({
            message: "Status.UNIMPLEMENTED",
            code: grpc_js_1.status.UNIMPLEMENTED,
            details: "Service endpoint not yet implemented.",
        });
    }
    SignTransactionV1(call, callback) {
        return callback({
            message: "Status.UNIMPLEMENTED",
            code: grpc_js_1.status.UNIMPLEMENTED,
            details: "Service endpoint not yet implemented.",
        });
    }
}
exports.BesuGrpcSvcOpenApi = BesuGrpcSvcOpenApi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVzdS1ncnBjLXN2Yy1vcGVuLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvZ3JwYy1zZXJ2aWNlcy9iZXN1LWdycGMtc3ZjLW9wZW4tYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMkNBQXVDO0FBWXZDLDJHQUE2RjtBQUM3Riw4RUFBd0U7QUFDeEUsOERBTW9DO0FBUXBDLE1BQWEsa0JBQW1CLFNBQVEsZUFBZSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSztLQUMxRSxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWM7S0FDcEQsa0NBQWtDO0lBcUJQO0lBZHJCLE1BQU0sQ0FBVSxVQUFVLEdBQUcsb0JBQW9CLENBQUM7SUFFekQsSUFBVyxTQUFTO1FBQ2xCLE9BQU8sa0JBQWtCLENBQUMsVUFBVSxDQUFDO0lBQ3ZDLENBQUM7SUFFZ0IsR0FBRyxDQUFTO0lBRVosSUFBSSxDQUFPO0lBRTVCOztPQUVHO0lBQ2MsUUFBUSxDQUFlO0lBQ3hDLFlBQTRCLElBQWdDO1FBQzFELEtBQUssRUFBRSxDQUFDO1FBRGtCLFNBQUksR0FBSixJQUFJLENBQTRCO1FBRTFELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUM7UUFDeEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBRyxHQUFHLDhCQUFjLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsdUJBQXVC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