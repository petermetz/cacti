import * as dependency_2 from "./invoke_contract_v1_request_pb";
import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class GetBesuRecordV1RequestPB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            invokeCall?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.InvokeContractV1RequestPB;
            transactionHash?: string;
        });
        get invokeCall(): dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.InvokeContractV1RequestPB;
        set invokeCall(value: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.InvokeContractV1RequestPB);
        get has_invokeCall(): boolean;
        get transactionHash(): string;
        set transactionHash(value: string);
        static fromObject(data: {
            invokeCall?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.InvokeContractV1RequestPB.prototype.toObject>;
            transactionHash?: string;
        }): GetBesuRecordV1RequestPB;
        toObject(): {
            invokeCall?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.InvokeContractV1RequestPB.prototype.toObject>;
            transactionHash?: string;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetBesuRecordV1RequestPB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): GetBesuRecordV1RequestPB;
    }
}
