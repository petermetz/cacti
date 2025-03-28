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
const dependency_2 = __importStar(require("./web3_transaction_receipt_pb"));
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
                            class RunTransactionResponsePB extends pb_1.Message {
                                #one_of_decls = [];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") {
                                        if ("transactionReceipt" in data && data.transactionReceipt != undefined) {
                                            this.transactionReceipt = data.transactionReceipt;
                                        }
                                    }
                                }
                                get transactionReceipt() {
                                    return pb_1.Message.getWrapperField(this, dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3TransactionReceiptPB, 472834426);
                                }
                                set transactionReceipt(value) {
                                    pb_1.Message.setWrapperField(this, 472834426, value);
                                }
                                get has_transactionReceipt() {
                                    return pb_1.Message.getField(this, 472834426) != null;
                                }
                                static fromObject(data) {
                                    const message = new RunTransactionResponsePB({});
                                    if (data.transactionReceipt != null) {
                                        message.transactionReceipt = dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3TransactionReceiptPB.fromObject(data.transactionReceipt);
                                    }
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    if (this.transactionReceipt != null) {
                                        data.transactionReceipt = this.transactionReceipt.toObject();
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.has_transactionReceipt)
                                        writer.writeMessage(472834426, this.transactionReceipt, () => this.transactionReceipt.serialize(writer));
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new RunTransactionResponsePB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
                                            case 472834426:
                                                reader.readMessage(message.transactionReceipt, () => message.transactionReceipt = dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3TransactionReceiptPB.deserialize(reader));
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
                                    return RunTransactionResponsePB.deserialize(bytes);
                                }
                            }
                            besu.RunTransactionResponsePB = RunTransactionResponsePB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuX3RyYW5zYWN0aW9uX3Jlc3BvbnNlX3BiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9nZW5lcmF0ZWQvcHJvdG8vcHJvdG9jLWdlbi10cy9tb2RlbHMvcnVuX3RyYW5zYWN0aW9uX3Jlc3BvbnNlX3BiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUEsNEVBQThEO0FBQzlELHNEQUF3QztBQUN4QyxJQUFpQixHQUFHLENBdUVuQjtBQXZFRCxXQUFpQixHQUFHO0lBQUMsSUFBQSxXQUFXLENBdUUvQjtJQXZFb0IsV0FBQSxXQUFXO1FBQUMsSUFBQSxLQUFLLENBdUVyQztRQXZFZ0MsV0FBQSxLQUFLO1lBQUMsSUFBQSxNQUFNLENBdUU1QztZQXZFc0MsV0FBQSxNQUFNO2dCQUFDLElBQUEsTUFBTSxDQXVFbkQ7Z0JBdkU2QyxXQUFBLE1BQU07b0JBQUMsSUFBQSxTQUFTLENBdUU3RDtvQkF2RW9ELFdBQUEsU0FBUzt3QkFBQyxJQUFBLElBQUksQ0F1RWxFO3dCQXZFOEQsV0FBQSxJQUFJOzRCQUMvRCxNQUFhLHdCQUF5QixTQUFRLElBQUksQ0FBQyxPQUFPO2dDQUN0RCxhQUFhLEdBQWUsRUFBRSxDQUFDO2dDQUMvQixZQUFZLElBRVg7b0NBQ0csS0FBSyxFQUFFLENBQUM7b0NBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29DQUM5RixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLElBQUksSUFB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