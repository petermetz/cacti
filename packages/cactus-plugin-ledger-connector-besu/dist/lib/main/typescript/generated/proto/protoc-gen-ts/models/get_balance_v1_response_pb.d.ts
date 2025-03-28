import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class GetBalanceV1ResponsePB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            balance?: string;
        });
        get balance(): string;
        set balance(value: string);
        static fromObject(data: {
            balance?: string;
        }): GetBalanceV1ResponsePB;
        toObject(): {
            balance?: string;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetBalanceV1ResponsePB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): GetBalanceV1ResponsePB;
    }
}
