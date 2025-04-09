import * as dependency_2 from "./web3_signing_credential_type_pb";
import * as pb_1 from "google-protobuf";
export declare namespace org.hyperledger.cacti.plugin.ledger.connector.besu {
    class Web3SigningCredentialNonePB extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            type?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialTypePB;
        });
        get type(): dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialTypePB;
        set type(value: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialTypePB);
        static fromObject(data: {
            type?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialTypePB;
        }): Web3SigningCredentialNonePB;
        toObject(): {
            type?: dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialTypePB;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Web3SigningCredentialNonePB;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): Web3SigningCredentialNonePB;
    }
}
