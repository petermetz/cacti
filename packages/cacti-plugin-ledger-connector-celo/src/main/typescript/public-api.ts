export {
  E_KEYCHAIN_NOT_FOUND,
  IPluginLedgerConnectorCeloOptions,
  PluginLedgerConnectorCelo,
} from "./plugin-ledger-connector-celo";
export { PluginFactoryLedgerConnector } from "./plugin-factory-ledger-connector";

import { IPluginFactoryOptions } from "@hyperledger/cactus-core-api";
import { PluginFactoryLedgerConnector } from "./plugin-factory-ledger-connector";

export {
  CeloApiClient,
  CeloApiClientOptions,
} from "./api-client/celo-api-client";

export * from "./generated/openapi/typescript-axios/api";

export async function createPluginFactory(
  pluginFactoryOptions: IPluginFactoryOptions,
): Promise<PluginFactoryLedgerConnector> {
  return new PluginFactoryLedgerConnector(pluginFactoryOptions);
}

export {
  ICeloGrpcSvcOpenApiOptions,
  CeloGrpcSvcOpenApi,
} from "./grpc-services/celo-grpc-svc-open-api";

export {
  CeloGrpcSvcStreams,
  ICeloGrpcSvcStreamsOptions,
} from "./grpc-services/celo-grpc-svc-streams";

export * as google_protobuf_any from "./generated/proto/protoc-gen-ts/google/protobuf/any";
export * as google_protobuf_empty from "./generated/proto/protoc-gen-ts/google/protobuf/empty";

export * as default_service from "./generated/proto/protoc-gen-ts/services/default_service";

export * as celo_grpc_svc_streams from "./generated/proto/protoc-gen-ts/services/celo-grpc-svc-streams";
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
