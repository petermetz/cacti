import * as dependency_2 from "./web3_transaction_receipt_pb";
import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class RunTransactionResponsePB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            transactionReceipt?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3TransactionReceiptPB;
        });
        get transactionReceipt(): dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3TransactionReceiptPB;
        set transactionReceipt(value: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3TransactionReceiptPB);
        get has_transactionReceipt(): boolean;
        static fromObject(data: {
            transactionReceipt?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3TransactionReceiptPB.prototype.toObject>;
        }): RunTransactionResponsePB;
        toObject(): {
            transactionReceipt?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3TransactionReceiptPB.prototype.toObject>;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): RunTransactionResponsePB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): RunTransactionResponsePB;
    }
}
