export {
  E_KEYCHAIN_NOT_FOUND,
  IPluginLedgerConnectorChainlinkOptions,
  PluginLedgerConnectorChainlink,
} from "./plugin-ledger-connector-chainlink";
export { PluginFactoryLedgerConnector } from "./plugin-factory-ledger-connector";

import { IPluginFactoryOptions } from "@hyperledger/cactus-core-api";
import { PluginFactoryLedgerConnector } from "./plugin-factory-ledger-connector";

export {
  ChainlinkApiClient,
  ChainlinkApiClientOptions,
} from "./api-client/chainlink-api-client";

export { Configuration as OpenApiClientCfg } from "./generated/openapi/typescript-axios/index";
export { DefaultApi as OpenApiClient } from "./generated/openapi/typescript-axios/index";

export { GetSubscriptionInfoV1Request } from "./generated/openapi/typescript-axios/api";
export { GetSubscriptionInfoV1Response } from "./generated/openapi/typescript-axios/api";
export { SubscriptionInfo } from "./generated/openapi/typescript-axios/api";
export { WatchBlocksV1 } from "./generated/openapi/typescript-axios/api";
export { WatchBlocksV1Progress } from "./generated/openapi/typescript-axios/api";
export { WatchBlocksV1Request } from "./generated/openapi/typescript-axios/api";

export async function createPluginFactory(
  pluginFactoryOptions: IPluginFactoryOptions,
): Promise<PluginFactoryLedgerConnector> {
  return new PluginFactoryLedgerConnector(pluginFactoryOptions);
}

export {
  IChainlinkGrpcSvcOpenApiOptions,
  ChainlinkGrpcSvcOpenApi,
} from "./grpc-services/chainlink-grpc-svc-open-api";

export {
  ChainlinkGrpcSvcStreams,
  IChainlinkGrpcSvcStreamsOptions,
} from "./grpc-services/chainlink-grpc-svc-streams";

export * as google_protobuf_any from "./generated/proto/protoc-gen-ts/google/protobuf/any";
export * as google_protobuf_empty from "./generated/proto/protoc-gen-ts/google/protobuf/empty";

export * as get_subscription_info_v1_request_pb from "./generated/proto/protoc-gen-ts/models/get_subscription_info_v1_request_pb";
export * as get_subscription_info_v1_request_subscription_id_pb from "./generated/proto/protoc-gen-ts/models/get_subscription_info_v1_request_subscription_id_pb";
export * as get_subscription_info_v1_response_pb from "./generated/proto/protoc-gen-ts/models/get_subscription_info_v1_response_pb";
export * as subscription_info_pb from "./generated/proto/protoc-gen-ts/models/subscription_info_pb";

export * as default_service from "./generated/proto/protoc-gen-ts/services/default_service";

export * as chainlink_grpc_svc_streams from "./generated/proto/protoc-gen-ts/services/chainlink-grpc-svc-streams";
export * as watch_blocks_v1_progress_pb from "./generated/proto/protoc-gen-ts/models/watch_blocks_v1_progress_pb";
export * as watch_blocks_v1_request_pb from "./generated/proto/protoc-gen-ts/models/watch_blocks_v1_request_pb";
export * as watch_blocks_v1_pb from "./generated/proto/protoc-gen-ts/models/watch_blocks_v1_pb";

export {
  createGrpcInsecureChannelCredentials,
  createGrpcInsecureServerCredentials,
  createGrpcSslChannelCredentials,
  createGrpcSslServerCredentials,
} from "./grpc-services/common/grpc-credentials-factory";

export { createGrpcServer } from "./grpc-services/common/grpc-server-factory";

export { getSubscriptionInfoV1Grpc } from "./impl/get-subscription-info-v1/get-subscription-info-v1-grpc";
export { getSubscriptionInfoV1Http } from "./impl/get-subscription-info-v1/get-subscription-info-v1-http";
export { getSubscriptionInfoV1Impl } from "./impl/get-subscription-info-v1/get-subscription-info-v1-impl";

export { awaitOffRampTxV1Impl } from "./impl/await-off-ramp-tx-v1/await-off-ramp-tx-v1.impl";
export { CcipOffRampAbi } from "./impl/await-off-ramp-tx-v1/off-ramp-metadata";
export { CcipOffRampBytecode } from "./impl/await-off-ramp-tx-v1/off-ramp-metadata";

export { IEVM2EVMOnRampStaticConfig } from "./ccip/on-ramp/i-evm-2-evm-on-ramp-static-config";
export { isIEVM2EVMOnRampStaticConfig } from "./ccip/on-ramp/i-evm-2-evm-on-ramp-static-config";
export { linkUSDValue } from "./ccip/common/link-usd-value";
export { linkValue } from "./ccip/common/link-value";

export { getEvmExtraArgsV1 } from "./ccip/common/get-evm-extra-args-v1";
export { EVM_V1_TAG_HEX } from "./ccip/common/get-evm-extra-args-v1";

export { getEvmExtraArgsV2 } from "./ccip/common/get-evm-extra-args-v2";
export { EVM_V2_TAG_HEX } from "./ccip/common/get-evm-extra-args-v2";

export { mustEncodeAddress } from "./ccip/common/must-encode-address";
