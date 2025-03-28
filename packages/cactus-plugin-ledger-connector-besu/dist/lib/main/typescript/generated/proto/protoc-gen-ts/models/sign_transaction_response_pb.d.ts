import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class SignTransactionResponsePB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            signature?: string;
        });
        get signature(): string;
        set signature(value: string);
        static fromObject(data: {
            signature?: string;
        }): SignTransactionResponsePB;
        toObject(): {
            signature?: string;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SignTransactionResponsePB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): SignTransactionResponsePB;
    }
}
