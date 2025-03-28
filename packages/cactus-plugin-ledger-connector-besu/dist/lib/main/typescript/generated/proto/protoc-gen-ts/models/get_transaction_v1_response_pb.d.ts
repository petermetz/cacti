import * as dependency_2 from "./evm_transaction_pb";
import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class GetTransactionV1ResponsePB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            transaction?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmTransactionPB;
        });
        get transaction(): dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmTransactionPB;
        set transaction(value: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmTransactionPB);
        get has_transaction(): boolean;
        static fromObject(data: {
            transaction?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmTransactionPB.prototype.toObject>;
        }): GetTransactionV1ResponsePB;
        toObject(): {
            transaction?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmTransactionPB.prototype.toObject>;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetTransactionV1ResponsePB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): GetTransactionV1ResponsePB;
    }
}
