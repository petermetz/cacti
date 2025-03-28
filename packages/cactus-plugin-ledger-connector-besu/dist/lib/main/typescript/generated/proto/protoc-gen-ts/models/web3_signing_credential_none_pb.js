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
                            class Web3SigningCredentialNonePB extends pb_1.Message {
                                #one_of_decls = [];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") {
                                        if ("type" in data && data.type != undefined) {
                                            this.type = data.type;
                                        }
                                    }
                                }
                                get type() {
                                    return pb_1.Message.getFieldWithDefault(this, 3575610, dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialTypePB.Web3SigningCredentialTypePB_CACTUS_KEYCHAIN_REF);
                                }
                                set type(value) {
                                    pb_1.Message.setField(this, 3575610, value);
                                }
                                static fromObject(data) {
                                    const message = new Web3SigningCredentialNonePB({});
                                    if (data.type != null) {
                                        message.type = data.type;
                                    }
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    if (this.type != null) {
                                        data.type = this.type;
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.type != dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialTypePB.Web3SigningCredentialTypePB_CACTUS_KEYCHAIN_REF)
                                        writer.writeEnum(3575610, this.type);
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Web3SigningCredentialNonePB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
                                            case 3575610:
                                                message.type = reader.readEnum();
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
                                    return Web3SigningCredentialNonePB.deserialize(bytes);
                                }
                            }
                            besu.Web3SigningCredentialNonePB = Web3SigningCredentialNonePB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViM19zaWduaW5nX2NyZWRlbnRpYWxfbm9uZV9wYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvZ2VuZXJhdGVkL3Byb3RvL3Byb3RvYy1nZW4tdHMvbW9kZWxzL3dlYjNfc2lnbmluZ19jcmVkZW50aWFsX25vbmVfcGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNQSxnRkFBa0U7QUFDbEUsc0RBQXdDO0FBQ3hDLElBQWlCLEdBQUcsQ0FvRW5CO0FBcEVELFdBQWlCLEdBQUc7SUFBQyxJQUFBLFdBQVcsQ0FvRS9CO0lBcEVvQixXQUFBLFdBQVc7UUFBQyxJQUFBLEtBQUssQ0FvRXJDO1FBcEVnQyxXQUFBLEtBQUs7WUFBQyxJQUFBLE1BQU0sQ0FvRTVDO1lBcEVzQyxXQUFBLE1BQU07Z0JBQUMsSUFBQSxNQUFNLENBb0VuRDtnQkFwRTZDLFdBQUEsTUFBTTtvQkFBQyxJQUFBLFNBQVMsQ0FvRTdEO29CQXBFb0QsV0FBQSxTQUFTO3dCQUFDLElBQUEsSUFBSSxDQW9FbEU7d0JBcEU4RCxXQUFBLElBQUk7NEJBQy9ELE1BQWEsMkJBQTRCLFNBQVEsSUFBSSxDQUFDLE9BQU87Z0NBQ3pELGFBQWEsR0FBZSxFQUFFLENBQUM7Z0NBQy9CLFlBQVksSUFFWDtvQ0FDRyxLQUFLLEVBQUUsQ0FBQztvQ0FDUixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0NBQzlGLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8s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