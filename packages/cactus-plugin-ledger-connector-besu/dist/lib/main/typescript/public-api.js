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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGrpcInsecureServerCredentials = exports.createGrpcInsecureChannelCredentials = exports.watch_blocks_v1_pb = exports.watch_blocks_v1_request_pb = exports.watch_blocks_v1_progress_pb = exports.besu_grpc_svc_streams = exports.default_service = exports.web3_transaction_receipt_pb = exports.web3_signing_credential_type_pb = exports.web3_signing_credential_private_key_hex_pb = exports.web3_signing_credential_pb = exports.web3_signing_credential_none_pb = exports.web3_signing_credential_cactus_keychain_ref_pb = exports.web3_block_header_timestamp_pb = exports.sign_transaction_response_pb = exports.sign_transaction_request_pb = exports.run_transaction_response_pb = exports.run_transaction_request_pb = exports.receipt_type_pb = exports.invoke_contract_v1_response_pb = exports.invoke_contract_v1_request_pb = exports.get_transaction_v1_response_pb = exports.get_transaction_v1_request_pb = exports.get_past_logs_v1_response_pb = exports.get_past_logs_v1_request_pb = exports.get_block_v1_response_pb = exports.get_block_v1_request_pb = exports.get_besu_record_v1_response_pb = exports.get_besu_record_v1_request_pb = exports.get_balance_v1_response_pb = exports.get_balance_v1_request_pb = exports.evm_transaction_pb = exports.evm_log_pb = exports.evm_block_pb = exports.eth_contract_invocation_type_pb = exports.deploy_contract_solidity_bytecode_v1_response_pb = exports.deploy_contract_solidity_bytecode_v1_request_pb = exports.consistency_strategy_pb = exports.besu_transaction_config_to_pb = exports.besu_transaction_config_pb = exports.besu_private_transaction_config_pb = exports.google_protobuf_empty = exports.google_protobuf_any = exports.BesuGrpcSvcStreams = exports.BesuGrpcSvcOpenApi = exports.BesuApiClientOptions = exports.BesuApiClient = exports.PluginFactoryLedgerConnector = exports.PluginLedgerConnectorBesu = exports.E_KEYCHAIN_NOT_FOUND = void 0;
exports.ensure0xPrefix = exports.isBlockNumber = exports.getBlockV1Impl = exports.getBlockV1Http = exports.getBlockV1Grpc = exports.createGrpcServer = exports.createGrpcSslServerCredentials = exports.createGrpcSslChannelCredentials = void 0;
exports.createPluginFactory = createPluginFactory;
var plugin_ledger_connector_besu_1 = require("./plugin-ledger-connector-besu");
Object.defineProperty(exports, "E_KEYCHAIN_NOT_FOUND", { enumerable: true, get: function () { return plugin_ledger_connector_besu_1.E_KEYCHAIN_NOT_FOUND; } });
Object.defineProperty(exports, "PluginLedgerConnectorBesu", { enumerable: true, get: function () { return plugin_ledger_connector_besu_1.PluginLedgerConnectorBesu; } });
var plugin_factory_ledger_connector_1 = require("./plugin-factory-ledger-connector");
Object.defineProperty(exports, "PluginFactoryLedgerConnector", { enumerable: true, get: function () { return plugin_factory_ledger_connector_1.PluginFactoryLedgerConnector; } });
const plugin_factory_ledger_connector_2 = require("./plugin-factory-ledger-connector");
var besu_api_client_1 = require("./api-client/besu-api-client");
Object.defineProperty(exports, "BesuApiClient", { enumerable: true, get: function () { return besu_api_client_1.BesuApiClient; } });
Object.defineProperty(exports, "BesuApiClientOptions", { enumerable: true, get: function () { return besu_api_client_1.BesuApiClientOptions; } });
__exportStar(require("./generated/openapi/typescript-axios/api"), exports);
async function createPluginFactory(pluginFactoryOptions) {
    return new plugin_factory_ledger_connector_2.PluginFactoryLedgerConnector(pluginFactoryOptions);
}
var besu_grpc_svc_open_api_1 = require("./grpc-services/besu-grpc-svc-open-api");
Object.defineProperty(exports, "BesuGrpcSvcOpenApi", { enumerable: true, get: function () { return besu_grpc_svc_open_api_1.BesuGrpcSvcOpenApi; } });
var besu_grpc_svc_streams_1 = require("./grpc-services/besu-grpc-svc-streams");
Object.defineProperty(exports, "BesuGrpcSvcStreams", { enumerable: true, get: function () { return besu_grpc_svc_streams_1.BesuGrpcSvcStreams; } });
exports.google_protobuf_any = __importStar(require("./generated/proto/protoc-gen-ts/google/protobuf/any"));
exports.google_protobuf_empty = __importStar(require("./generated/proto/protoc-gen-ts/google/protobuf/empty"));
exports.besu_private_transaction_config_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/besu_private_transaction_config_pb"));
exports.besu_transaction_config_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/besu_transaction_config_pb"));
exports.besu_transaction_config_to_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/besu_transaction_config_to_pb"));
exports.consistency_strategy_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/consistency_strategy_pb"));
exports.deploy_contract_solidity_bytecode_v1_request_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/deploy_contract_solidity_bytecode_v1_request_pb"));
exports.deploy_contract_solidity_bytecode_v1_response_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/deploy_contract_solidity_bytecode_v1_response_pb"));
exports.eth_contract_invocation_type_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/eth_contract_invocation_type_pb"));
exports.evm_block_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/evm_block_pb"));
exports.evm_log_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/evm_log_pb"));
exports.evm_transaction_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/evm_transaction_pb"));
exports.get_balance_v1_request_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/get_balance_v1_request_pb"));
exports.get_balance_v1_response_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/get_balance_v1_response_pb"));
exports.get_besu_record_v1_request_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/get_besu_record_v1_request_pb"));
exports.get_besu_record_v1_response_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/get_besu_record_v1_response_pb"));
exports.get_block_v1_request_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/get_block_v1_request_pb"));
exports.get_block_v1_response_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/get_block_v1_response_pb"));
exports.get_past_logs_v1_request_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/get_past_logs_v1_request_pb"));
exports.get_past_logs_v1_response_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/get_past_logs_v1_response_pb"));
exports.get_transaction_v1_request_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/get_transaction_v1_request_pb"));
exports.get_transaction_v1_response_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/get_transaction_v1_response_pb"));
exports.invoke_contract_v1_request_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/invoke_contract_v1_request_pb"));
exports.invoke_contract_v1_response_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/invoke_contract_v1_response_pb"));
exports.receipt_type_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/receipt_type_pb"));
exports.run_transaction_request_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/run_transaction_request_pb"));
exports.run_transaction_response_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/run_transaction_response_pb"));
exports.sign_transaction_request_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/sign_transaction_request_pb"));
exports.sign_transaction_response_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/sign_transaction_response_pb"));
exports.web3_block_header_timestamp_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/web3_block_header_timestamp_pb"));
exports.web3_signing_credential_cactus_keychain_ref_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/web3_signing_credential_cactus_keychain_ref_pb"));
exports.web3_signing_credential_none_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/web3_signing_credential_none_pb"));
exports.web3_signing_credential_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/web3_signing_credential_pb"));
exports.web3_signing_credential_private_key_hex_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/web3_signing_credential_private_key_hex_pb"));
exports.web3_signing_credential_type_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/web3_signing_credential_type_pb"));
exports.web3_transaction_receipt_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/web3_transaction_receipt_pb"));
exports.default_service = __importStar(require("./generated/proto/protoc-gen-ts/services/default_service"));
exports.besu_grpc_svc_streams = __importStar(require("./generated/proto/protoc-gen-ts/services/besu-grpc-svc-streams"));
exports.watch_blocks_v1_progress_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/watch_blocks_v1_progress_pb"));
exports.watch_blocks_v1_request_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/watch_blocks_v1_request_pb"));
exports.watch_blocks_v1_pb = __importStar(require("./generated/proto/protoc-gen-ts/models/watch_blocks_v1_pb"));
var grpc_credentials_factory_1 = require("./grpc-services/common/grpc-credentials-factory");
Object.defineProperty(exports, "createGrpcInsecureChannelCredentials", { enumerable: true, get: function () { return grpc_credentials_factory_1.createGrpcInsecureChannelCredentials; } });
Object.defineProperty(exports, "createGrpcInsecureServerCredentials", { enumerable: true, get: function () { return grpc_credentials_factory_1.createGrpcInsecureServerCredentials; } });
Object.defineProperty(exports, "createGrpcSslChannelCredentials", { enumerable: true, get: function () { return grpc_credentials_factory_1.createGrpcSslChannelCredentials; } });
Object.defineProperty(exports, "createGrpcSslServerCredentials", { enumerable: true, get: function () { return grpc_credentials_factory_1.createGrpcSslServerCredentials; } });
var grpc_server_factory_1 = require("./grpc-services/common/grpc-server-factory");
Object.defineProperty(exports, "createGrpcServer", { enumerable: true, get: function () { return grpc_server_factory_1.createGrpcServer; } });
var get_block_v1_grpc_1 = require("./impl/get-block-v1/get-block-v1-grpc");
Object.defineProperty(exports, "getBlockV1Grpc", { enumerable: true, get: function () { return get_block_v1_grpc_1.getBlockV1Grpc; } });
var get_block_v1_http_1 = require("./impl/get-block-v1/get-block-v1-http");
Object.defineProperty(exports, "getBlockV1Http", { enumerable: true, get: function () { return get_block_v1_http_1.getBlockV1Http; } });
var get_block_v1_impl_1 = require("./impl/get-block-v1/get-block-v1-impl");
Object.defineProperty(exports, "getBlockV1Impl", { enumerable: true, get: function () { return get_block_v1_impl_1.getBlockV1Impl; } });
Object.defineProperty(exports, "isBlockNumber", { enumerable: true, get: function () { return get_block_v1_impl_1.isBlockNumber; } });
var ensure_0x_prefix_1 = require("./common/ensure-0x-prefix");
Object.defineProperty(exports, "ensure0xPrefix", { enumerable: true, get: function () { return ensure_0x_prefix_1.ensure0xPrefix; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvcHVibGljLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkEsa0RBSUM7QUF0QkQsK0VBS3dDO0FBSnRDLG9JQUFBLG9CQUFvQixPQUFBO0FBRXBCLHlJQUFBLHlCQUF5QixPQUFBO0FBRzNCLHFGQUFpRjtBQUF4RSwrSUFBQSw0QkFBNEIsT0FBQTtBQUdyQyx1RkFBaUY7QUFFakYsZ0VBR3NDO0FBRnBDLGdIQUFBLGFBQWEsT0FBQTtBQUNiLHVIQUFBLG9CQUFvQixPQUFBO0FBR3RCLDJFQUF5RDtBQUVsRCxLQUFLLFVBQVUsbUJBQW1CLENBQ3ZDLG9CQUEyQztJQUUzQyxPQUFPLElBQUksOERBQTRCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNoRSxDQUFDO0FBRUQsaUZBR2dEO0FBRDlDLDRIQUFBLGtCQUFrQixPQUFBO0FBR3BCLCtFQUcrQztBQUY3QywySEFBQSxrQkFBa0IsT0FBQTtBQUlwQiwyR0FBMkY7QUFDM0YsK0dBQStGO0FBRS9GLGdKQUFnSTtBQUNoSSxnSUFBZ0g7QUFDaEgsc0lBQXNIO0FBQ3RILDBIQUEwRztBQUMxRywwS0FBMEo7QUFDMUosNEtBQTRKO0FBQzVKLDBJQUEwSDtBQUMxSCxvR0FBb0Y7QUFDcEYsZ0dBQWdGO0FBQ2hGLGdIQUFnRztBQUNoRyw4SEFBOEc7QUFDOUcsZ0lBQWdIO0FBQ2hILHNJQUFzSDtBQUN0SCx3SUFBd0g7QUFDeEgsMEhBQTBHO0FBQzFHLDRIQUE0RztBQUM1RyxrSUFBa0g7QUFDbEgsb0lBQW9IO0FBQ3BILHNJQUFzSDtBQUN0SCx3SUFBd0g7QUFDeEgsc0lBQXNIO0FBQ3RILHdJQUF3SDtBQUN4SCwwR0FBMEY7QUFDMUYsZ0lBQWdIO0FBQ2hILGtJQUFrSDtBQUNsSCxrSUFBa0g7QUFDbEgsb0lBQW9IO0FBQ3BILHdJQUF3SDtBQUN4SCx3S0FBd0o7QUFDeEosMElBQTBIO0FBQzFILGdJQUFnSDtBQUNoSCxnS0FBZ0o7QUFDaEosMElBQTBIO0FBQzFILGtJQUFrSDtBQUVsSCw0R0FBNEY7QUFFNUYsd0hBQXdHO0FBQ3hHLGtJQUFrSDtBQUNsSCxnSUFBZ0g7QUFDaEgsZ0hBQWdHO0FBRWhHLDRGQUt5RDtBQUp2RCxnSkFBQSxvQ0FBb0MsT0FBQTtBQUNwQywrSUFBQSxtQ0FBbUMsT0FBQTtBQUNuQywySUFBQSwrQkFBK0IsT0FBQTtBQUMvQiwwSUFBQSw4QkFBOEIsT0FBQTtBQUdoQyxrRkFBOEU7QUFBckUsdUhBQUEsZ0JBQWdCLE9BQUE7QUFFekIsMkVBQXVFO0FBQTlELG1IQUFBLGNBQWMsT0FBQTtBQUN2QiwyRUFBdUU7QUFBOUQsbUhBQUEsY0FBYyxPQUFBO0FBQ3ZCLDJFQUcrQztBQUY3QyxtSEFBQSxjQUFjLE9BQUE7QUFDZCxrSEFBQSxhQUFhLE9BQUE7QUFHZiw4REFBMkQ7QUFBbEQsa0hBQUEsY0FBYyxPQUFBIn0=