import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class GetTransactionV1RequestPB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            transactionHash?: string;
        });
        get transactionHash(): string;
        set transactionHash(value: string);
        static fromObject(data: {
            transactionHash?: string;
        }): GetTransactionV1RequestPB;
        toObject(): {
            transactionHash?: string;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetTransactionV1RequestPB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): GetTransactionV1RequestPB;
    }
}
