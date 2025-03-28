import Web3 from "web3";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import * as get_block_v1_response_pb from "../../generated/proto/protoc-gen-ts/models/get_block_v1_response_pb";
import * as default_service from "../../generated/proto/protoc-gen-ts/services/default_service";
export declare function getBlockV1Grpc(ctx: {
    readonly web3: Web3;
    readonly logLevel: LogLevelDesc;
}, req: default_service.org.hyperledger.cacti.plugin.ledger.connector.besu.services.defaultservice.GetBlockV1Request): Promise<get_block_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.GetBlockV1ResponsePB>;
