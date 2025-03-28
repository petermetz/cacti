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
                            class Web3SigningCredentialCactusKeychainRefPB extends pb_1.Message {
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
                                        if ("keychainEntryKey" in data && data.keychainEntryKey != undefined) {
                                            this.keychainEntryKey = data.keychainEntryKey;
                                        }
                                        if ("keychainId" in data && data.keychainId != undefined) {
                                            this.keychainId = data.keychainId;
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
                                get keychainEntryKey() {
                                    return pb_1.Message.getFieldWithDefault(this, 210645395, "");
                                }
                                set keychainEntryKey(value) {
                                    pb_1.Message.setField(this, 210645395, value);
                                }
                                get keychainId() {
                                    return pb_1.Message.getFieldWithDefault(this, 14058372, "");
                                }
                                set keychainId(value) {
                                    pb_1.Message.setField(this, 14058372, value);
                                }
                                static fromObject(data) {
                                    const message = new Web3SigningCredentialCactusKeychainRefPB({});
                                    if (data.type != null) {
                                        message.type = data.type;
                                    }
                                    if (data.ethAccount != null) {
                                        message.ethAccount = data.ethAccount;
                                    }
                                    if (data.keychainEntryKey != null) {
                                        message.keychainEntryKey = data.keychainEntryKey;
                                    }
                                    if (data.keychainId != null) {
                                        message.keychainId = data.keychainId;
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
                                    if (this.keychainEntryKey != null) {
                                        data.keychainEntryKey = this.keychainEntryKey;
                                    }
                                    if (this.keychainId != null) {
                                        data.keychainId = this.keychainId;
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.type != dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialTypePB.Web3SigningCredentialTypePB_CACTUS_KEYCHAIN_REF)
                                        writer.writeEnum(3575610, this.type);
                                    if (this.ethAccount.length)
                                        writer.writeString(528332204, this.ethAccount);
                                    if (this.keychainEntryKey.length)
                                        writer.writeString(210645395, this.keychainEntryKey);
                                    if (this.keychainId.length)
                                        writer.writeString(14058372, this.keychainId);
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Web3SigningCredentialCactusKeychainRefPB();
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
                                            case 210645395:
                                                message.keychainEntryKey = reader.readString();
                                                break;
                                            case 14058372:
                                                message.keychainId = reader.readString();
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
                                    return Web3SigningCredentialCactusKeychainRefPB.deserialize(bytes);
                                }
                            }
                            besu.Web3SigningCredentialCactusKeychainRefPB = Web3SigningCredentialCactusKeychainRefPB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViM19zaWduaW5nX2NyZWRlbnRpYWxfY2FjdHVzX2tleWNoYWluX3JlZl9wYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvZ2VuZXJhdGVkL3Byb3RvL3Byb3RvYy1nZW4tdHMvbW9kZWxzL3dlYjNfc2lnbmluZ19jcmVkZW50aWFsX2NhY3R1c19rZXljaGFpbl9yZWZfcGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNQSxnRkFBa0U7QUFDbEUsc0RBQXdDO0FBQ3hDLElBQWlCLEdBQUcsQ0F5SW5CO0FBeklELFdBQWlCLEdBQUc7SUFBQyxJQUFBLFdBQVcsQ0F5SS9CO0lBeklvQixXQUFBLFdBQVc7UUFBQyxJQUFBLEtBQUssQ0F5SXJDO1FBeklnQyxXQUFBLEtBQUs7WUFBQyxJQUFBLE1BQU0sQ0F5STVDO1lBeklzQyxXQUFBLE1BQU07Z0JBQUMsSUFBQSxNQUFNLENBeUluRDtnQkF6STZDLFdBQUEsTUFBTTtvQkFBQyxJQUFBLFNBQVMsQ0F5STdEO29CQXpJb0QsV0FBQSxTQUFTO3dCQUFDLElBQUEsSUFBSSxDQXlJbEU7d0JBekk4RCxXQUFBLElBQUk7NEJBQy9ELE1BQWEsd0NBQXlDLFNBQVEsSUFBSSxDQUFDLE9BQU87Z0NBQ3RFLGFBQWEsR0FBZSxFQUFFLENBQUM7Z0NBQy9CLFlBQVksSUFLWDtvQ0FDRyxLQUFLLEVBQUUsQ0FBQztvQ0FDUixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0NBQzlGLElBQUksQ0FBQyxLQUFLLENBQUMs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