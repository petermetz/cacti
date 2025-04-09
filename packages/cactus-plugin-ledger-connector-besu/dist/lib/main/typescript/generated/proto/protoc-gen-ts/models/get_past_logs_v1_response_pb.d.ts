import * as dependency_2 from "./evm_log_pb";
import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class GetPastLogsV1ResponsePB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            logs?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmLogPB[];
        });
        get logs(): dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmLogPB[];
        set logs(value: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmLogPB[]);
        static fromObject(data: {
            logs?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmLogPB.prototype.toObject>[];
        }): GetPastLogsV1ResponsePB;
        toObject(): {
            logs?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmLogPB.prototype.toObject>[];
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetPastLogsV1ResponsePB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): GetPastLogsV1ResponsePB;
    }
}
