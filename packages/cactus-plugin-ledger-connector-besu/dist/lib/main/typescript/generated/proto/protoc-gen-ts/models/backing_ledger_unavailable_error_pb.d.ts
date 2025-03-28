import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class BackingLedgerUnavailableErrorPB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            message?: string;
        });
        get message(): string;
        set message(value: string);
        static fromObject(data: {
            message?: string;
        }): BackingLedgerUnavailableErrorPB;
        toObject(): {
            message?: string;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BackingLedgerUnavailableErrorPB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): BackingLedgerUnavailableErrorPB;
    }
}
