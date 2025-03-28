import * as dependency_2 from "./besu_private_transaction_config_pb";
import * as dependency_3 from "./besu_transaction_config_pb";
import * as dependency_4 from "./consistency_strategy_pb";
import * as dependency_5 from "./web3_signing_credential_pb";
import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class RunTransactionRequestPB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            web3SigningCredential?: dependency_5.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialPB;
            transactionConfig?: dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigPB;
            consistencyStrategy?: dependency_4.org.hyperledger.cacti.plugin.ledger.connector.besu.ConsistencyStrategyPB;
            privateTransactionConfig?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuPrivateTransactionConfigPB;
        });
        get web3SigningCredential(): dependency_5.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialPB;
        set web3SigningCredential(value: dependency_5.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialPB);
        get has_web3SigningCredential(): boolean;
        get transactionConfig(): dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigPB;
        set transactionConfig(value: dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigPB);
        get has_transactionConfig(): boolean;
        get consistencyStrategy(): dependency_4.org.hyperledger.cacti.plugin.ledger.connector.besu.ConsistencyStrategyPB;
        set consistencyStrategy(value: dependency_4.org.hyperledger.cacti.plugin.ledger.connector.besu.ConsistencyStrategyPB);
        get has_consistencyStrategy(): boolean;
        get privateTransactionConfig(): dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuPrivateTransactionConfigPB;
        set privateTransactionConfig(value: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuPrivateTransactionConfigPB);
        get has_privateTransactionConfig(): boolean;
        static fromObject(data: {
            web3SigningCredential?: ReturnType<typeof dependency_5.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialPB.prototype.toObject>;
            transactionConfig?: ReturnType<typeof dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigPB.prototype.toObject>;
            consistencyStrategy?: ReturnType<typeof dependency_4.org.hyperledger.cacti.plugin.ledger.connector.besu.ConsistencyStrategyPB.prototype.toObject>;
            privateTransactionConfig?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuPrivateTransactionConfigPB.prototype.toObject>;
        }): RunTransactionRequestPB;
        toObject(): {
            web3SigningCredential?: ReturnType<typeof dependency_5.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialPB.prototype.toObject>;
            transactionConfig?: ReturnType<typeof dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigPB.prototype.toObject>;
            consistencyStrategy?: ReturnType<typeof dependency_4.org.hyperledger.cacti.plugin.ledger.connector.besu.ConsistencyStrategyPB.prototype.toObject>;
            privateTransactionConfig?: ReturnType<typeof dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuPrivateTransactionConfigPB.prototype.toObject>;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): RunTransactionRequestPB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): RunTransactionRequestPB;
    }
}
