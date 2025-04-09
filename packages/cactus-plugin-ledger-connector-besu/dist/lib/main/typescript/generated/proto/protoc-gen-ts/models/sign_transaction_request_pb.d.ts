import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class SignTransactionRequestPB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            keychainId?: string;
            keychainRef?: string;
            transactionHash?: string;
        });
        get keychainId(): string;
        set keychainId(value: string);
        get keychainRef(): string;
        set keychainRef(value: string);
        get transactionHash(): string;
        set transactionHash(value: string);
        static fromObject(data: {
            keychainId?: string;
            keychainRef?: string;
            transactionHash?: string;
        }): SignTransactionRequestPB;
        toObject(): {
            keychainId?: string;
            keychainRef?: string;
            transactionHash?: string;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SignTransactionRequestPB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): SignTransactionRequestPB;
    }
}
