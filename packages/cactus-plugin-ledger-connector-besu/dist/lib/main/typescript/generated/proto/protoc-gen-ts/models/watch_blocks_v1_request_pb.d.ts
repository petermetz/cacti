import * as dependency_2 from "./watch_blocks_v1_pb";
import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class WatchBlocksV1RequestPB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            event?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.WatchBlocksV1PB;
        });
        get event(): dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.WatchBlocksV1PB;
        set event(value: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.WatchBlocksV1PB);
        static fromObject(data: {
            event?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.WatchBlocksV1PB;
        }): WatchBlocksV1RequestPB;
        toObject(): {
            event?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.WatchBlocksV1PB;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): WatchBlocksV1RequestPB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): WatchBlocksV1RequestPB;
    }
}
