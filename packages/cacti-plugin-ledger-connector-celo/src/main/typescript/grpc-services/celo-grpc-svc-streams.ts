import { ServerDuplexStream } from "@grpc/grpc-js";

import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
} from "@hyperledger/cactus-common";

import * as watch_blocks_v1_progress_pb from "../generated/proto/protoc-gen-ts/models/watch_blocks_v1_progress_pb";
import * as watch_blocks_v1_request_pb from "../generated/proto/protoc-gen-ts/models/watch_blocks_v1_request_pb";
import * as celo_grpc_svc_streams from "../generated/proto/protoc-gen-ts/services/celo-grpc-svc-streams";
import { watch_blocks_v1_pb } from "../public-api";

export interface ICeloGrpcSvcStreamsOptions {
  readonly logLevel?: LogLevelDesc;
}

export class CeloGrpcSvcStreams extends celo_grpc_svc_streams.org.hyperledger
  .cacti.plugin.ledger.connector.celo.services.celoservice
  .UnimplementedCeloGrpcSvcStreamsService {
  // No choice but to disable the linter here because we need to be able to
  // declare fields on the implementation class but the parent class forces to
  // only have methods implementations not fields.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [field: string]: any;

  public static readonly CLASS_NAME = "CeloGrpcSvcStreams";

  public get className(): string {
    return CeloGrpcSvcStreams.CLASS_NAME;
  }

  private readonly log: Logger;

  /**
   * The log level that will be used throughout all the methods of this class.
   */
  private readonly logLevel: LogLevelDesc;

  constructor(public readonly opts: ICeloGrpcSvcStreamsOptions) {
    super();
    this.logLevel = opts.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level: this.logLevel, label });
    this.log.debug(`Created instance of ${this.className} OK`);
  }

  WatchBlocksV1(
    call: ServerDuplexStream<
      watch_blocks_v1_request_pb.org.hyperledger.cacti.plugin.ledger.connector.celo.WatchBlocksV1RequestPB,
      watch_blocks_v1_progress_pb.org.hyperledger.cacti.plugin.ledger.connector.celo.WatchBlocksV1ProgressPB
    >,
  ): void {
    this.log.debug("WatchBlocksV1::MAIN_FN=");

    const WatchBlocksV1PB =
      watch_blocks_v1_pb.org.hyperledger.cacti.plugin.ledger.connector.celo
        .WatchBlocksV1PB;

    type WatchBlocksV1RequestPB =
      watch_blocks_v1_request_pb.org.hyperledger.cacti.plugin.ledger.connector.celo.WatchBlocksV1RequestPB;

    call.on("data", (chunk: WatchBlocksV1RequestPB) => {
      this.log.debug("WatchBlocksV1::data=%o", chunk);
      if (chunk.event === WatchBlocksV1PB.WatchBlocksV1PB_Unsubscribe) {
        this.log.debug("WatchBlocksV1::data=WatchBlocksV1PB_Unsubscribe");
        call.end();
      }
    });

    call.once("close", () => {
      this.log.debug("subscribe_newBlockHeaders::event=CLOSE");
    });
  }
}
