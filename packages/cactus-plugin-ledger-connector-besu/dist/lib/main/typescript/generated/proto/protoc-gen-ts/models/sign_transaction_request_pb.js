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
                            class SignTransactionRequestPB extends pb_1.Message {
                                #one_of_decls = [];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") {
                                        if ("keychainId" in data && data.keychainId != undefined) {
                                            this.keychainId = data.keychainId;
                                        }
                                        if ("keychainRef" in data && data.keychainRef != undefined) {
                                            this.keychainRef = data.keychainRef;
                                        }
                                        if ("transactionHash" in data && data.transactionHash != undefined) {
                                            this.transactionHash = data.transactionHash;
                                        }
                                    }
                                }
                                get keychainId() {
                                    return pb_1.Message.getFieldWithDefault(this, 14058372, "");
                                }
                                set keychainId(value) {
                                    pb_1.Message.setField(this, 14058372, value);
                                }
                                get keychainRef() {
                                    return pb_1.Message.getFieldWithDefault(this, 101070193, "");
                                }
                                set keychainRef(value) {
                                    pb_1.Message.setField(this, 101070193, value);
                                }
                                get transactionHash() {
                                    return pb_1.Message.getFieldWithDefault(this, 188901646, "");
                                }
                                set transactionHash(value) {
                                    pb_1.Message.setField(this, 188901646, value);
                                }
                                static fromObject(data) {
                                    const message = new SignTransactionRequestPB({});
                                    if (data.keychainId != null) {
                                        message.keychainId = data.keychainId;
                                    }
                                    if (data.keychainRef != null) {
                                        message.keychainRef = data.keychainRef;
                                    }
                                    if (data.transactionHash != null) {
                                        message.transactionHash = data.transactionHash;
                                    }
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    if (this.keychainId != null) {
                                        data.keychainId = this.keychainId;
                                    }
                                    if (this.keychainRef != null) {
                                        data.keychainRef = this.keychainRef;
                                    }
                                    if (this.transactionHash != null) {
                                        data.transactionHash = this.transactionHash;
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.keychainId.length)
                                        writer.writeString(14058372, this.keychainId);
                                    if (this.keychainRef.length)
                                        writer.writeString(101070193, this.keychainRef);
                                    if (this.transactionHash.length)
                                        writer.writeString(188901646, this.transactionHash);
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new SignTransactionRequestPB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
                                            case 14058372:
                                                message.keychainId = reader.readString();
                                                break;
                                            case 101070193:
                                                message.keychainRef = reader.readString();
                                                break;
                                            case 188901646:
                                                message.transactionHash = reader.readString();
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
                                    return SignTransactionRequestPB.deserialize(bytes);
                                }
                            }
                            besu.SignTransactionRequestPB = SignTransactionRequestPB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbl90cmFuc2FjdGlvbl9yZXF1ZXN0X3BiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9nZW5lcmF0ZWQvcHJvdG8vcHJvdG9jLWdlbi10cy9tb2RlbHMvc2lnbl90cmFuc2FjdGlvbl9yZXF1ZXN0X3BiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUEsc0RBQXdDO0FBQ3hDLElBQWlCLEdBQUcsQ0FrSG5CO0FBbEhELFdBQWlCLEdBQUc7SUFBQyxJQUFBLFdBQVcsQ0FrSC9CO0lBbEhvQixXQUFBLFdBQVc7UUFBQyxJQUFBLEtBQUssQ0FrSHJDO1FBbEhnQyxXQUFBLEtBQUs7WUFBQyxJQUFBLE1BQU0sQ0FrSDVDO1lBbEhzQyxXQUFBLE1BQU07Z0JBQUMsSUFBQSxNQUFNLENBa0huRDtnQkFsSDZDLFdBQUEsTUFBTTtvQkFBQyxJQUFBLFNBQVMsQ0FrSDdEO29CQWxIb0QsV0FBQSxTQUFTO3dCQUFDLElBQUEsSUFBSSxDQWtIbEU7d0JBbEg4RCxXQUFBLElBQUk7NEJBQy9ELE1BQWEsd0JBQXlCLFNBQVEsSUFBSSxDQUFDLE9BQU87Z0NBQ3RELGFBQWEsR0FBZSxFQUFFLENBQUM7Z0NBQy9CLFlBQVksSUFJWDtvQ0FDRyxLQUFLLEVBQUUsQ0FBQztvQ0FDUixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0NBQzlGLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sSUFBSSxJQUFJLFFBQVEsRUFBRSxD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