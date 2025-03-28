import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class Web3BlockHeaderTimestampPB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {});
        static fromObject(data: {}): Web3BlockHeaderTimestampPB;
        toObject(): {};
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Web3BlockHeaderTimestampPB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): Web3BlockHeaderTimestampPB;
    }
}
