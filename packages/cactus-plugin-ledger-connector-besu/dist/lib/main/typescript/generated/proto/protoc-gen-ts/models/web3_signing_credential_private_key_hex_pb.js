"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.org = void 0;
const dependency_2 = __importStar(require("./web3_signing_credential_type_pb"));
const pb_1 = __importStar(require("google-protobuf"));
var org;
(function (org) {
    var hyperledger;
    (function (hyperledger) {
        var cacti;
        (function (cacti) {
            var plugin;
            (function (plugin) {
                var ledger;
                (function (ledger) {
                    var connector;
                    (function (connector) {
                        var besu;
                        (function (besu) {
                            class Web3SigningCredentialPrivateKeyHexPB extends pb_1.Message {
                                #one_of_decls = [];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") {
                                        if ("type" in data && data.type != undefined) {
                                            this.type = data.type;
                                        }
                                        if ("ethAccount" in data && data.ethAccount != undefined) {
                                            this.ethAccount = data.ethAccount;
                                        }
                                        if ("secret" in data && data.secret != undefined) {
                                            this.secret = data.secret;
                                        }
                                    }
                                }
                                get type() {
                                    return pb_1.Message.getFieldWithDefault(this, 3575610, dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialTypePB.Web3SigningCredentialTypePB_CACTUS_KEYCHAIN_REF);
                                }
                                set type(value) {
                                    pb_1.Message.setField(this, 3575610, value);
                                }
                                get ethAccount() {
                                    return pb_1.Message.getFieldWithDefault(this, 528332204, "");
                                }
                                set ethAccount(value) {
                                    pb_1.Message.setField(this, 528332204, value);
                                }
                                get secret() {
                                    return pb_1.Message.getFieldWithDefault(this, 369406289, "");
                                }
                                set secret(value) {
                                    pb_1.Message.setField(this, 369406289, value);
                                }
                                static fromObject(data) {
                                    const message = new Web3SigningCredentialPrivateKeyHexPB({});
                                    if (data.type != null) {
                                        message.type = data.type;
                                    }
                                    if (data.ethAccount != null) {
                                        message.ethAccount = data.ethAccount;
                                    }
                                    if (data.secret != null) {
                                        message.secret = data.secret;
                                    }
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    if (this.type != null) {
                                        data.type = this.type;
                                    }
                                    if (this.ethAccount != null) {
                                        data.ethAccount = this.ethAccount;
                                    }
                                    if (this.secret != null) {
                                        data.secret = this.secret;
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.type != dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialTypePB.Web3SigningCredentialTypePB_CACTUS_KEYCHAIN_REF)
                                        writer.writeEnum(3575610, this.type);
                                    if (this.ethAccount.length)
                                        writer.writeString(528332204, this.ethAccount);
                                    if (this.secret.length)
                                        writer.writeString(369406289, this.secret);
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Web3SigningCredentialPrivateKeyHexPB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
                                            case 3575610:
                                                message.type = reader.readEnum();
                                                break;
                                            case 528332204:
                                                message.ethAccount = reader.readString();
                                                break;
                                            case 369406289:
                                                message.secret = reader.readString();
                                                break;
                                            default: reader.skipField();
                                        }
                                    }
                                    return message;
                                }
                                serializeBinary() {
                                    return this.serialize();
                                }
                                static deserializeBinary(bytes) {
                                    return Web3SigningCredentialPrivateKeyHexPB.deserialize(bytes);
                                }
                            }
                            besu.Web3SigningCredentialPrivateKeyHexPB = Web3SigningCredentialPrivateKeyHexPB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViM19zaWduaW5nX2NyZWRlbnRpYWxfcHJpdmF0ZV9rZXlfaGV4X3BiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9nZW5lcmF0ZWQvcHJvdG8vcHJvdG9jLWdlbi10cy9tb2RlbHMvd2ViM19zaWduaW5nX2NyZWRlbnRpYWxfcHJpdmF0ZV9rZXlfaGV4X3BiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUEsZ0ZBQWtFO0FBQ2xFLHNEQUF3QztBQUN4QyxJQUFpQixHQUFHLENBa0huQjtBQWxIRCxXQUFpQixHQUFHO0lBQUMsSUFBQSxXQUFXLENBa0gvQjtJQWxIb0IsV0FBQSxXQUFXO1FBQUMsSUFBQSxLQUFLLENBa0hyQztRQWxIZ0MsV0FBQSxLQUFLO1lBQUMsSUFBQSxNQUFNLENBa0g1QztZQWxIc0MsV0FBQSxNQUFNO2dCQUFDLElBQUEsTUFBTSxDQWtIbkQ7Z0JBbEg2QyxXQUFBLE1BQU07b0JBQUMsSUFBQSxTQUFTLENBa0g3RDtvQkFsSG9ELFdBQUEsU0FBUzt3QkFBQyxJQUFBLElBQUksQ0FrSGxFO3dCQWxIOEQsV0FBQSxJQUFJOzRCQUMvRCxNQUFhLG9DQUFxQyxTQUFRLElBQUksQ0FBQyxPQUFPO2dDQUNsRSxhQUFhLEdBQWUsRUFBRSxDQUFDO2dDQUMvQixZQUFZLElBSVg7b0NBQ0csS0FBSyxFQUFFLENBQUM7b0NBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29DQUM5RixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FB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