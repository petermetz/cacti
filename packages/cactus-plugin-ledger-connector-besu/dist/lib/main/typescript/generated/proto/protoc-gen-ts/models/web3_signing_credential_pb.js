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
const dependency_5 = __importStar(require("./web3_signing_credential_type_pb"));
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
                            class Web3SigningCredentialPB extends pb_1.Message {
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
                                        if ("secret" in data && data.secret != undefined) {
                                            this.secret = data.secret;
                                        }
                                    }
                                }
                                get type() {
                                    return pb_1.Message.getFieldWithDefault(this, 3575610, dependency_5.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialTypePB.Web3SigningCredentialTypePB_CACTUS_KEYCHAIN_REF);
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
                                get secret() {
                                    return pb_1.Message.getFieldWithDefault(this, 369406289, "");
                                }
                                set secret(value) {
                                    pb_1.Message.setField(this, 369406289, value);
                                }
                                static fromObject(data) {
                                    const message = new Web3SigningCredentialPB({});
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
                                    if (this.keychainEntryKey != null) {
                                        data.keychainEntryKey = this.keychainEntryKey;
                                    }
                                    if (this.keychainId != null) {
                                        data.keychainId = this.keychainId;
                                    }
                                    if (this.secret != null) {
                                        data.secret = this.secret;
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.type != dependency_5.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialTypePB.Web3SigningCredentialTypePB_CACTUS_KEYCHAIN_REF)
                                        writer.writeEnum(3575610, this.type);
                                    if (this.ethAccount.length)
                                        writer.writeString(528332204, this.ethAccount);
                                    if (this.keychainEntryKey.length)
                                        writer.writeString(210645395, this.keychainEntryKey);
                                    if (this.keychainId.length)
                                        writer.writeString(14058372, this.keychainId);
                                    if (this.secret.length)
                                        writer.writeString(369406289, this.secret);
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Web3SigningCredentialPB();
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
                                    return Web3SigningCredentialPB.deserialize(bytes);
                                }
                            }
                            besu.Web3SigningCredentialPB = Web3SigningCredentialPB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViM19zaWduaW5nX2NyZWRlbnRpYWxfcGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2dlbmVyYXRlZC9wcm90by9wcm90b2MtZ2VuLXRzL21vZGVscy93ZWIzX3NpZ25pbmdfY3JlZGVudGlhbF9wYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVNBLGdGQUFrRTtBQUNsRSxzREFBd0M7QUFDeEMsSUFBaUIsR0FBRyxDQWdLbkI7QUFoS0QsV0FBaUIsR0FBRztJQUFDLElBQUEsV0FBVyxDQWdLL0I7SUFoS29CLFdBQUEsV0FBVztRQUFDLElBQUEsS0FBSyxDQWdLckM7UUFoS2dDLFdBQUEsS0FBSztZQUFDLElBQUEsTUFBTSxDQWdLNUM7WUFoS3NDLFdBQUEsTUFBTTtnQkFBQyxJQUFBLE1BQU0sQ0FnS25EO2dCQWhLNkMsV0FBQSxNQUFNO29CQUFDLElBQUEsU0FBUyxDQWdLN0Q7b0JBaEtvRCxXQUFBLFNBQVM7d0JBQUMsSUFBQSxJQUFJLENBZ0tsRTt3QkFoSzhELFdBQUEsSUFBSTs0QkFDL0QsTUFBYSx1QkFBd0IsU0FBUSxJQUFJLENBQUMsT0FBTztnQ0FDckQsYUFBYSxHQUFlLEVBQUUsQ0FBQztnQ0FDL0IsWUFBWSxJQU1YO29DQUNHLEtBQUssRUFBRSxDQUFDO29DQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztvQ0FDOUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxJQUFJLElBQUks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