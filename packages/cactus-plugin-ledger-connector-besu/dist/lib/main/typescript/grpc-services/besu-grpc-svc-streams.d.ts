import { ServerDuplexStream } from "@grpc/grpc-js";
import Web3 from "web3";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import * as watch_blocks_v1_progress_pb from "../generated/proto/protoc-gen-ts/models/watch_blocks_v1_progress_pb";
import * as watch_blocks_v1_request_pb from "../generated/proto/protoc-gen-ts/models/watch_blocks_v1_request_pb";
import * as besu_grpc_svc_streams from "../generated/proto/protoc-gen-ts/services/besu-grpc-svc-streams";
export interface IBesuGrpcSvcStreamsOptions {
    readonly logLevel?: LogLevelDesc;
    readonly web3: Web3;
}
export declare class BesuGrpcSvcStreams extends besu_grpc_svc_streams.org.hyperledger
    .cacti.plugin.ledger.connector.besu.services.besuservice
    .UnimplementedBesuGrpcSvcStreamsService {
    readonly opts: IBesuGrpcSvcStreamsOptions;
    [field: string]: any;
    static readonly CLASS_NAME = "BesuGrpcSvcStreams";
    get className(): string;
    private readonly log;
    private readonly web3;
    /**
     * The log level that will be used throughout all the methods of this class.
     */
    private readonly logLevel;
    constructor(opts: IBesuGrpcSvcStreamsOptions);
    WatchBlocksV1(call: ServerDuplexStream<watch_blocks_v1_request_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.WatchBlocksV1RequestPB, watch_blocks_v1_progress_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.WatchBlocksV1ProgressPB>): void;
}
