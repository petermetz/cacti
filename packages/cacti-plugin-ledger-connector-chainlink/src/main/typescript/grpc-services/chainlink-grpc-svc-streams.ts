// import {
//   sendUnaryData,
//   ServerDuplexStream,
//   ServerUnaryCall,
// } from "@grpc/grpc-js";

import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
} from "@hyperledger/cactus-common";

// import * as watch_blocks_v1_progress_pb from "../generated/proto/protoc-gen-ts/models/watch_blocks_v1_progress_pb";
// import * as watch_blocks_v1_request_pb from "../generated/proto/protoc-gen-ts/models/watch_blocks_v1_request_pb";
import * as chainlink_grpc_svc_streams from "../generated/proto/protoc-gen-ts/services/chainlink-grpc-svc-streams";
// import { google } from "../generated/proto/protoc-gen-ts/google/protobuf/empty";

export interface IChainlinkGrpcSvcStreamsOptions {
  readonly logLevel?: LogLevelDesc;
}

export class ChainlinkGrpcSvcStreams extends chainlink_grpc_svc_streams.org
  .hyperledger.cacti.plugin.ledger.connector.chainlink.services.chainlinkservice
  .UnimplementedChainlinkGrpcSvcStreamsService {
  // No choice but to disable the linter here because we need to be able to
  // declare fields on the implementation class but the parent class forces to
  // only have methods implementations not fields.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [field: string]: any;

  public static readonly CLASS_NAME = "ChainlinkGrpcSvcStreams";

  public get className(): string {
    return ChainlinkGrpcSvcStreams.CLASS_NAME;
  }

  private readonly log: Logger;

  /**
   * The log level that will be used throughout all the methods of this class.
   */
  private readonly logLevel: LogLevelDesc;

  constructor(public readonly opts: IChainlinkGrpcSvcStreamsOptions) {
    super();
    this.logLevel = opts.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level: this.logLevel, label });
    this.log.debug(`Created instance of ${this.className} OK`);
  }

  GetOpenApiV1() // call: ServerUnaryCall<google.protobuf.Empty, google.protobuf.Empty>,
  // callback: sendUnaryData<google.protobuf.Empty>,
  : void {
    throw new Error("Method not implemented.");
  }

  WatchBlocksV1() // call: ServerDuplexStream<
  //   watch_blocks_v1_request_pb.org.hyperledger.cacti.plugin.ledger.connector.chainlink.WatchBlocksV1RequestPB,
  //   watch_blocks_v1_progress_pb.org.hyperledger.cacti.plugin.ledger.connector.chainlink.WatchBlocksV1ProgressPB
  // >,
  : void {
    this.log.debug("WatchBlocksV1::MAIN_FN=");
  }
}
