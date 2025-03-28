import * as dependency_2 from "./receipt_type_pb";
import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class ConsistencyStrategyPB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            receiptType?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.ReceiptTypePB;
            timeoutMs?: number;
            blockConfirmations?: number;
        });
        get receiptType(): dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.ReceiptTypePB;
        set receiptType(value: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.ReceiptTypePB);
        get timeoutMs(): number;
        set timeoutMs(value: number);
        get blockConfirmations(): number;
        set blockConfirmations(value: number);
        static fromObject(data: {
            receiptType?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.ReceiptTypePB;
            timeoutMs?: number;
            blockConfirmations?: number;
        }): ConsistencyStrategyPB;
        toObject(): {
            receiptType?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.ReceiptTypePB;
            timeoutMs?: number;
            blockConfirmations?: number;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ConsistencyStrategyPB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): ConsistencyStrategyPB;
    }
}
