import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class EvmLogPB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            address?: string;
            data?: string;
            blockHash?: string;
            transactionHash?: string;
            topics?: string[];
            logIndex?: number;
            transactionIndex?: number;
            blockNumber?: number;
        });
        get address(): string;
        set address(value: string);
        get data(): string;
        set data(value: string);
        get blockHash(): string;
        set blockHash(value: string);
        get transactionHash(): string;
        set transactionHash(value: string);
        get topics(): string[];
        set topics(value: string[]);
        get logIndex(): number;
        set logIndex(value: number);
        get transactionIndex(): number;
        set transactionIndex(value: number);
        get blockNumber(): number;
        set blockNumber(value: number);
        static fromObject(data: {
            address?: string;
            data?: string;
            blockHash?: string;
            transactionHash?: string;
            topics?: string[];
            logIndex?: number;
            transactionIndex?: number;
            blockNumber?: number;
        }): EvmLogPB;
        toObject(): {
            address?: string;
            data?: string;
            blockHash?: string;
            transactionHash?: string;
            topics?: string[];
            logIndex?: number;
            transactionIndex?: number;
            blockNumber?: number;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): EvmLogPB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): EvmLogPB;
    }
}
