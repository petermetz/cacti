import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class Web3TransactionReceiptPB extends pb_1.Message {
        #private;
        constructor(data?: any[] | ({
            status?: boolean;
            transactionHash?: string;
            transactionIndex?: number;
            blockHash?: string;
            blockNumber?: number;
            gasUsed?: number;
            from?: string;
            to?: string;
        } & (({
            contractAddress?: string;
        }))));
        get status(): boolean;
        set status(value: boolean);
        get transactionHash(): string;
        set transactionHash(value: string);
        get transactionIndex(): number;
        set transactionIndex(value: number);
        get blockHash(): string;
        set blockHash(value: string);
        get blockNumber(): number;
        set blockNumber(value: number);
        get gasUsed(): number;
        set gasUsed(value: number);
        get contractAddress(): string;
        set contractAddress(value: string);
        get has_contractAddress(): boolean;
        get from(): string;
        set from(value: string);
        get to(): string;
        set to(value: string);
        get _contractAddress(): "contractAddress" | "none";
        static fromObject(data: {
            status?: boolean;
            transactionHash?: string;
            transactionIndex?: number;
            blockHash?: string;
            blockNumber?: number;
            gasUsed?: number;
            contractAddress?: string;
            from?: string;
            to?: string;
        }): Web3TransactionReceiptPB;
        toObject(): {
            status?: boolean;
            transactionHash?: string;
            transactionIndex?: number;
            blockHash?: string;
            blockNumber?: number;
            gasUsed?: number;
            contractAddress?: string;
            from?: string;
            to?: string;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Web3TransactionReceiptPB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): Web3TransactionReceiptPB;
    }
}
