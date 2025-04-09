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
const dependency_2 = __importStar(require("./evm_transaction_pb"));
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
                            class GetTransactionV1ResponsePB extends pb_1.Message {
                                #one_of_decls = [];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") {
                                        if ("transaction" in data && data.transaction != undefined) {
                                            this.transaction = data.transaction;
                                        }
                                    }
                                }
                                get transaction() {
                                    return pb_1.Message.getWrapperField(this, dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmTransactionPB, 530633441);
                                }
                                set transaction(value) {
                                    pb_1.Message.setWrapperField(this, 530633441, value);
                                }
                                get has_transaction() {
                                    return pb_1.Message.getField(this, 530633441) != null;
                                }
                                static fromObject(data) {
                                    const message = new GetTransactionV1ResponsePB({});
                                    if (data.transaction != null) {
                                        message.transaction = dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmTransactionPB.fromObject(data.transaction);
                                    }
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    if (this.transaction != null) {
                                        data.transaction = this.transaction.toObject();
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.has_transaction)
                                        writer.writeMessage(530633441, this.transaction, () => this.transaction.serialize(writer));
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new GetTransactionV1ResponsePB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
                                            case 530633441:
                                                reader.readMessage(message.transaction, () => message.transaction = dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmTransactionPB.deserialize(reader));
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
                                    return GetTransactionV1ResponsePB.deserialize(bytes);
                                }
                            }
                            besu.GetTransactionV1ResponsePB = GetTransactionV1ResponsePB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0X3RyYW5zYWN0aW9uX3YxX3Jlc3BvbnNlX3BiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9nZW5lcmF0ZWQvcHJvdG8vcHJvdG9jLWdlbi10cy9tb2RlbHMvZ2V0X3RyYW5zYWN0aW9uX3YxX3Jlc3BvbnNlX3BiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUEsbUVBQXFEO0FBQ3JELHNEQUF3QztBQUN4QyxJQUFpQixHQUFHLENBdUVuQjtBQXZFRCxXQUFpQixHQUFHO0lBQUMsSUFBQSxXQUFXLENBdUUvQjtJQXZFb0IsV0FBQSxXQUFXO1FBQUMsSUFBQSxLQUFLLENBdUVyQztRQXZFZ0MsV0FBQSxLQUFLO1lBQUMsSUFBQSxNQUFNLENBdUU1QztZQXZFc0MsV0FBQSxNQUFNO2dCQUFDLElBQUEsTUFBTSxDQXVFbkQ7Z0JBdkU2QyxXQUFBLE1BQU07b0JBQUMsSUFBQSxTQUFTLENBdUU3RDtvQkF2RW9ELFdBQUEsU0FBUzt3QkFBQyxJQUFBLElBQUksQ0F1RWxFO3dCQXZFOEQsV0FBQSxJQUFJOzRCQUMvRCxNQUFhLDBCQUEyQixTQUFRLElBQUksQ0FBQyxPQUFPO2dDQUN4RCxhQUFhLEdBQWUsRUFBRSxDQUFDO2dDQUMvQixZQUFZLElBRVg7b0NBQ0csS0FBSyxFQUFFLENBQUM7b0NBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29DQUM5RixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLElB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