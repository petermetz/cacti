import * as dependency_2 from "./besu_transaction_config_to_pb";
import * as dependency_3 from "./web3_block_header_timestamp_pb";
import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class BesuTransactionConfigPB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            rawTransaction?: string;
            from?: dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB;
            to?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigToPB;
            value?: dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB;
            gas?: dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB;
            gasPrice?: dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB;
            nonce?: number;
            data?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigToPB;
        });
        get rawTransaction(): string;
        set rawTransaction(value: string);
        get from(): dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB;
        set from(value: dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB);
        get has_from(): boolean;
        get to(): dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigToPB;
        set to(value: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigToPB);
        get has_to(): boolean;
        get value(): dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB;
        set value(value: dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB);
        get has_value(): boolean;
        get gas(): dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB;
        set gas(value: dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB);
        get has_gas(): boolean;
        get gasPrice(): dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB;
        set gasPrice(value: dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB);
        get has_gasPrice(): boolean;
        get nonce(): number;
        set nonce(value: number);
        get data(): dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigToPB;
        set data(value: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigToPB);
        get has_data(): boolean;
        static fromObject(data: {
            rawTransaction?: string;
            from?: ReturnType<typeof dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.prototype.toObject>;
            to?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigToPB.prototype.toObject>;
            value?: ReturnType<typeof dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.prototype.toObject>;
            gas?: ReturnType<typeof dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.prototype.toObject>;
            gasPrice?: ReturnType<typeof dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.prototype.toObject>;
            nonce?: number;
            data?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigToPB.prototype.toObject>;
        }): BesuTransactionConfigPB;
        toObject(): {
            rawTransaction?: string;
            from?: ReturnType<typeof dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.prototype.toObject>;
            to?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigToPB.prototype.toObject>;
            value?: ReturnType<typeof dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.prototype.toObject>;
            gas?: ReturnType<typeof dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.prototype.toObject>;
            gasPrice?: ReturnType<typeof dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.prototype.toObject>;
            nonce?: number;
            data?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigToPB.prototype.toObject>;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BesuTransactionConfigPB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): BesuTransactionConfigPB;
    }
}
