import * as dependency_2 from "./web3_block_header_pb";
import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class WatchBlocksV1ProgressPB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            blockHeader?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderPB;
        });
        get blockHeader(): dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderPB;
        set blockHeader(value: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderPB);
        get has_blockHeader(): boolean;
        static fromObject(data: {
            blockHeader?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderPB.prototype.toObject>;
        }): WatchBlocksV1ProgressPB;
        toObject(): {
            blockHeader?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderPB.prototype.toObject>;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): WatchBlocksV1ProgressPB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): WatchBlocksV1ProgressPB;
    }
}
