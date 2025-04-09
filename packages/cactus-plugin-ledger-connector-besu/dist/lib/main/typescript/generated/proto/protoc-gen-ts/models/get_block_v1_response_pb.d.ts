import * as dependency_2 from "./evm_block_pb";
import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class GetBlockV1ResponsePB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            block?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmBlockPB;
        });
        get block(): dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmBlockPB;
        set block(value: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmBlockPB);
        get has_block(): boolean;
        static fromObject(data: {
            block?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmBlockPB.prototype.toObject>;
        }): GetBlockV1ResponsePB;
        toObject(): {
            block?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmBlockPB.prototype.toObject>;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetBlockV1ResponsePB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): GetBlockV1ResponsePB;
    }
}
