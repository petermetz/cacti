import * as dependency_5 from "./web3_signing_credential_type_pb";
import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class Web3SigningCredentialPB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            type?: dependency_5.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialTypePB;
            ethAccount?: string;
            keychainEntryKey?: string;
            keychainId?: string;
            secret?: string;
        });
        get type(): dependency_5.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialTypePB;
        set type(value: dependency_5.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialTypePB);
        get ethAccount(): string;
        set ethAccount(value: string);
        get keychainEntryKey(): string;
        set keychainEntryKey(value: string);
        get keychainId(): string;
        set keychainId(value: string);
        get secret(): string;
        set secret(value: string);
        static fromObject(data: {
            type?: dependency_5.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialTypePB;
            ethAccount?: string;
            keychainEntryKey?: string;
            keychainId?: string;
            secret?: string;
        }): Web3SigningCredentialPB;
        toObject(): {
            type?: dependency_5.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialTypePB;
            ethAccount?: string;
            keychainEntryKey?: string;
            keychainId?: string;
            secret?: string;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Web3SigningCredentialPB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): Web3SigningCredentialPB;
    }
}
