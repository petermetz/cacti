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
                            class Web3TransactionReceiptPB extends pb_1.Message {
                                #one_of_decls = [[214641282]];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") {
                                        if ("status" in data && data.status != undefined) {
                                            this.status = data.status;
                                        }
                                        if ("transactionHash" in data && data.transactionHash != undefined) {
                                            this.transactionHash = data.transactionHash;
                                        }
                                        if ("transactionIndex" in data && data.transactionIndex != undefined) {
                                            this.transactionIndex = data.transactionIndex;
                                        }
                                        if ("blockHash" in data && data.blockHash != undefined) {
                                            this.blockHash = data.blockHash;
                                        }
                                        if ("blockNumber" in data && data.blockNumber != undefined) {
                                            this.blockNumber = data.blockNumber;
                                        }
                                        if ("gasUsed" in data && data.gasUsed != undefined) {
                                            this.gasUsed = data.gasUsed;
                                        }
                                        if ("contractAddress" in data && data.contractAddress != undefined) {
                                            this.contractAddress = data.contractAddress;
                                        }
                                        if ("from" in data && data.from != undefined) {
                                            this.from = data.from;
                                        }
                                        if ("to" in data && data.to != undefined) {
                                            this.to = data.to;
                                        }
                                    }
                                }
                                get status() {
                                    return pb_1.Message.getFieldWithDefault(this, 355610639, false);
                                }
                                set status(value) {
                                    pb_1.Message.setField(this, 355610639, value);
                                }
                                get transactionHash() {
                                    return pb_1.Message.getFieldWithDefault(this, 188901646, "");
                                }
                                set transactionHash(value) {
                                    pb_1.Message.setField(this, 188901646, value);
                                }
                                get transactionIndex() {
                                    return pb_1.Message.getFieldWithDefault(this, 488538260, 0);
                                }
                                set transactionIndex(value) {
                                    pb_1.Message.setField(this, 488538260, value);
                                }
                                get blockHash() {
                                    return pb_1.Message.getFieldWithDefault(this, 335211324, "");
                                }
                                set blockHash(value) {
                                    pb_1.Message.setField(this, 335211324, value);
                                }
                                get blockNumber() {
                                    return pb_1.Message.getFieldWithDefault(this, 205598263, 0);
                                }
                                set blockNumber(value) {
                                    pb_1.Message.setField(this, 205598263, value);
                                }
                                get gasUsed() {
                                    return pb_1.Message.getFieldWithDefault(this, 190522826, 0);
                                }
                                set gasUsed(value) {
                                    pb_1.Message.setField(this, 190522826, value);
                                }
                                get contractAddress() {
                                    return pb_1.Message.getFieldWithDefault(this, 214641282, "");
                                }
                                set contractAddress(value) {
                                    pb_1.Message.setOneofField(this, 214641282, this.#one_of_decls[0], value);
                                }
                                get has_contractAddress() {
                                    return pb_1.Message.getField(this, 214641282) != null;
                                }
                                get from() {
                                    return pb_1.Message.getFieldWithDefault(this, 3151786, "");
                                }
                                set from(value) {
                                    pb_1.Message.setField(this, 3151786, value);
                                }
                                get to() {
                                    return pb_1.Message.getFieldWithDefault(this, 3707, "");
                                }
                                set to(value) {
                                    pb_1.Message.setField(this, 3707, value);
                                }
                                get _contractAddress() {
                                    const cases = {
                                        0: "none",
                                        214641282: "contractAddress"
                                    };
                                    return cases[pb_1.Message.computeOneofCase(this, [214641282])];
                                }
                                static fromObject(data) {
                                    const message = new Web3TransactionReceiptPB({});
                                    if (data.status != null) {
                                        message.status = data.status;
                                    }
                                    if (data.transactionHash != null) {
                                        message.transactionHash = data.transactionHash;
                                    }
                                    if (data.transactionIndex != null) {
                                        message.transactionIndex = data.transactionIndex;
                                    }
                                    if (data.blockHash != null) {
                                        message.blockHash = data.blockHash;
                                    }
                                    if (data.blockNumber != null) {
                                        message.blockNumber = data.blockNumber;
                                    }
                                    if (data.gasUsed != null) {
                                        message.gasUsed = data.gasUsed;
                                    }
                                    if (data.contractAddress != null) {
                                        message.contractAddress = data.contractAddress;
                                    }
                                    if (data.from != null) {
                                        message.from = data.from;
                                    }
                                    if (data.to != null) {
                                        message.to = data.to;
                                    }
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    if (this.status != null) {
                                        data.status = this.status;
                                    }
                                    if (this.transactionHash != null) {
                                        data.transactionHash = this.transactionHash;
                                    }
                                    if (this.transactionIndex != null) {
                                        data.transactionIndex = this.transactionIndex;
                                    }
                                    if (this.blockHash != null) {
                                        data.blockHash = this.blockHash;
                                    }
                                    if (this.blockNumber != null) {
                                        data.blockNumber = this.blockNumber;
                                    }
                                    if (this.gasUsed != null) {
                                        data.gasUsed = this.gasUsed;
                                    }
                                    if (this.contractAddress != null) {
                                        data.contractAddress = this.contractAddress;
                                    }
                                    if (this.from != null) {
                                        data.from = this.from;
                                    }
                                    if (this.to != null) {
                                        data.to = this.to;
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.status != false)
                                        writer.writeBool(355610639, this.status);
                                    if (this.transactionHash.length)
                                        writer.writeString(188901646, this.transactionHash);
                                    if (this.transactionIndex != 0)
                                        writer.writeFloat(488538260, this.transactionIndex);
                                    if (this.blockHash.length)
                                        writer.writeString(335211324, this.blockHash);
                                    if (this.blockNumber != 0)
                                        writer.writeFloat(205598263, this.blockNumber);
                                    if (this.gasUsed != 0)
                                        writer.writeFloat(190522826, this.gasUsed);
                                    if (this.has_contractAddress)
                                        writer.writeString(214641282, this.contractAddress);
                                    if (this.from.length)
                                        writer.writeString(3151786, this.from);
                                    if (this.to.length)
                                        writer.writeString(3707, this.to);
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Web3TransactionReceiptPB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
                                            case 355610639:
                                                message.status = reader.readBool();
                                                break;
                                            case 188901646:
                                                message.transactionHash = reader.readString();
                                                break;
                                            case 488538260:
                                                message.transactionIndex = reader.readFloat();
                                                break;
                                            case 335211324:
                                                message.blockHash = reader.readString();
                                                break;
                                            case 205598263:
                                                message.blockNumber = reader.readFloat();
                                                break;
                                            case 190522826:
                                                message.gasUsed = reader.readFloat();
                                                break;
                                            case 214641282:
                                                message.contractAddress = reader.readString();
                                                break;
                                            case 3151786:
                                                message.from = reader.readString();
                                                break;
                                            case 3707:
                                                message.to = reader.readString();
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
                                    return Web3TransactionReceiptPB.deserialize(bytes);
                                }
                            }
                            besu.Web3TransactionReceiptPB = Web3TransactionReceiptPB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViM190cmFuc2FjdGlvbl9yZWNlaXB0X3BiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9nZW5lcmF0ZWQvcHJvdG8vcHJvdG9jLWdlbi10cy9tb2RlbHMvd2ViM190cmFuc2FjdGlvbl9yZWNlaXB0X3BiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUEsc0RBQXdDO0FBQ3hDLElBQWlCLEdBQUcsQ0F5UW5CO0FBelFELFdBQWlCLEdBQUc7SUFBQyxJQUFBLFdBQVcsQ0F5US9CO0lBelFvQixXQUFBLFdBQVc7UUFBQyxJQUFBLEtBQUssQ0F5UXJDO1FBelFnQyxXQUFBLEtBQUs7WUFBQyxJQUFBLE1BQU0sQ0F5UTVDO1lBelFzQyxXQUFBLE1BQU07Z0JBQUMsSUFBQSxNQUFNLENBeVFuRDtnQkF6UTZDLFdBQUEsTUFBTTtvQkFBQyxJQUFBLFNBQVMsQ0F5UTdEO29CQXpRb0QsV0FBQSxTQUFTO3dCQUFDLElBQUEsSUFBSSxDQXlRbEU7d0JBelE4RCxXQUFBLElBQUk7NEJBQy9ELE1BQWEsd0JBQXlCLFNBQVEsSUFBSSxDQUFDLE9BQU87Z0NBQ3RELGFBQWEsR0FBZSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQ0FDMUMsWUFBWSxJQVdSO29DQUNBLEtBQUssRUFBRSxDQUFDO29DQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztvQ0FDOUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxJ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