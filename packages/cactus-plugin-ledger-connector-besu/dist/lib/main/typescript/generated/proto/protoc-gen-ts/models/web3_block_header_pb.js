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
const dependency_2 = __importStar(require("./web3_block_header_timestamp_pb"));
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
                            class Web3BlockHeaderPB extends pb_1.Message {
                                #one_of_decls = [];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") {
                                        if ("number" in data && data.number != undefined) {
                                            this.number = data.number;
                                        }
                                        if ("hash" in data && data.hash != undefined) {
                                            this.hash = data.hash;
                                        }
                                        if ("parentHash" in data && data.parentHash != undefined) {
                                            this.parentHash = data.parentHash;
                                        }
                                        if ("nonce" in data && data.nonce != undefined) {
                                            this.nonce = data.nonce;
                                        }
                                        if ("sha3Uncles" in data && data.sha3Uncles != undefined) {
                                            this.sha3Uncles = data.sha3Uncles;
                                        }
                                        if ("logsBloom" in data && data.logsBloom != undefined) {
                                            this.logsBloom = data.logsBloom;
                                        }
                                        if ("transactionRoot" in data && data.transactionRoot != undefined) {
                                            this.transactionRoot = data.transactionRoot;
                                        }
                                        if ("stateRoot" in data && data.stateRoot != undefined) {
                                            this.stateRoot = data.stateRoot;
                                        }
                                        if ("receiptRoot" in data && data.receiptRoot != undefined) {
                                            this.receiptRoot = data.receiptRoot;
                                        }
                                        if ("miner" in data && data.miner != undefined) {
                                            this.miner = data.miner;
                                        }
                                        if ("extraData" in data && data.extraData != undefined) {
                                            this.extraData = data.extraData;
                                        }
                                        if ("gasLimit" in data && data.gasLimit != undefined) {
                                            this.gasLimit = data.gasLimit;
                                        }
                                        if ("gasUsed" in data && data.gasUsed != undefined) {
                                            this.gasUsed = data.gasUsed;
                                        }
                                        if ("timestamp" in data && data.timestamp != undefined) {
                                            this.timestamp = data.timestamp;
                                        }
                                    }
                                }
                                get number() {
                                    return pb_1.Message.getFieldWithDefault(this, 497493176, 0);
                                }
                                set number(value) {
                                    pb_1.Message.setField(this, 497493176, value);
                                }
                                get hash() {
                                    return pb_1.Message.getFieldWithDefault(this, 3195150, "");
                                }
                                set hash(value) {
                                    pb_1.Message.setField(this, 3195150, value);
                                }
                                get parentHash() {
                                    return pb_1.Message.getFieldWithDefault(this, 245049128, "");
                                }
                                set parentHash(value) {
                                    pb_1.Message.setField(this, 245049128, value);
                                }
                                get nonce() {
                                    return pb_1.Message.getFieldWithDefault(this, 105002991, "");
                                }
                                set nonce(value) {
                                    pb_1.Message.setField(this, 105002991, value);
                                }
                                get sha3Uncles() {
                                    return pb_1.Message.getFieldWithDefault(this, 373514458, "");
                                }
                                set sha3Uncles(value) {
                                    pb_1.Message.setField(this, 373514458, value);
                                }
                                get logsBloom() {
                                    return pb_1.Message.getFieldWithDefault(this, 399161966, "");
                                }
                                set logsBloom(value) {
                                    pb_1.Message.setField(this, 399161966, value);
                                }
                                get transactionRoot() {
                                    return pb_1.Message.getFieldWithDefault(this, 189212898, "");
                                }
                                set transactionRoot(value) {
                                    pb_1.Message.setField(this, 189212898, value);
                                }
                                get stateRoot() {
                                    return pb_1.Message.getFieldWithDefault(this, 475330288, "");
                                }
                                set stateRoot(value) {
                                    pb_1.Message.setField(this, 475330288, value);
                                }
                                get receiptRoot() {
                                    return pb_1.Message.getFieldWithDefault(this, 422939453, "");
                                }
                                set receiptRoot(value) {
                                    pb_1.Message.setField(this, 422939453, value);
                                }
                                get miner() {
                                    return pb_1.Message.getFieldWithDefault(this, 103900799, "");
                                }
                                set miner(value) {
                                    pb_1.Message.setField(this, 103900799, value);
                                }
                                get extraData() {
                                    return pb_1.Message.getFieldWithDefault(this, 253792294, "");
                                }
                                set extraData(value) {
                                    pb_1.Message.setField(this, 253792294, value);
                                }
                                get gasLimit() {
                                    return pb_1.Message.getFieldWithDefault(this, 9229217, 0);
                                }
                                set gasLimit(value) {
                                    pb_1.Message.setField(this, 9229217, value);
                                }
                                get gasUsed() {
                                    return pb_1.Message.getFieldWithDefault(this, 190522826, 0);
                                }
                                set gasUsed(value) {
                                    pb_1.Message.setField(this, 190522826, value);
                                }
                                get timestamp() {
                                    return pb_1.Message.getWrapperField(this, dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB, 55126294);
                                }
                                set timestamp(value) {
                                    pb_1.Message.setWrapperField(this, 55126294, value);
                                }
                                get has_timestamp() {
                                    return pb_1.Message.getField(this, 55126294) != null;
                                }
                                static fromObject(data) {
                                    const message = new Web3BlockHeaderPB({});
                                    if (data.number != null) {
                                        message.number = data.number;
                                    }
                                    if (data.hash != null) {
                                        message.hash = data.hash;
                                    }
                                    if (data.parentHash != null) {
                                        message.parentHash = data.parentHash;
                                    }
                                    if (data.nonce != null) {
                                        message.nonce = data.nonce;
                                    }
                                    if (data.sha3Uncles != null) {
                                        message.sha3Uncles = data.sha3Uncles;
                                    }
                                    if (data.logsBloom != null) {
                                        message.logsBloom = data.logsBloom;
                                    }
                                    if (data.transactionRoot != null) {
                                        message.transactionRoot = data.transactionRoot;
                                    }
                                    if (data.stateRoot != null) {
                                        message.stateRoot = data.stateRoot;
                                    }
                                    if (data.receiptRoot != null) {
                                        message.receiptRoot = data.receiptRoot;
                                    }
                                    if (data.miner != null) {
                                        message.miner = data.miner;
                                    }
                                    if (data.extraData != null) {
                                        message.extraData = data.extraData;
                                    }
                                    if (data.gasLimit != null) {
                                        message.gasLimit = data.gasLimit;
                                    }
                                    if (data.gasUsed != null) {
                                        message.gasUsed = data.gasUsed;
                                    }
                                    if (data.timestamp != null) {
                                        message.timestamp = dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.fromObject(data.timestamp);
                                    }
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    if (this.number != null) {
                                        data.number = this.number;
                                    }
                                    if (this.hash != null) {
                                        data.hash = this.hash;
                                    }
                                    if (this.parentHash != null) {
                                        data.parentHash = this.parentHash;
                                    }
                                    if (this.nonce != null) {
                                        data.nonce = this.nonce;
                                    }
                                    if (this.sha3Uncles != null) {
                                        data.sha3Uncles = this.sha3Uncles;
                                    }
                                    if (this.logsBloom != null) {
                                        data.logsBloom = this.logsBloom;
                                    }
                                    if (this.transactionRoot != null) {
                                        data.transactionRoot = this.transactionRoot;
                                    }
                                    if (this.stateRoot != null) {
                                        data.stateRoot = this.stateRoot;
                                    }
                                    if (this.receiptRoot != null) {
                                        data.receiptRoot = this.receiptRoot;
                                    }
                                    if (this.miner != null) {
                                        data.miner = this.miner;
                                    }
                                    if (this.extraData != null) {
                                        data.extraData = this.extraData;
                                    }
                                    if (this.gasLimit != null) {
                                        data.gasLimit = this.gasLimit;
                                    }
                                    if (this.gasUsed != null) {
                                        data.gasUsed = this.gasUsed;
                                    }
                                    if (this.timestamp != null) {
                                        data.timestamp = this.timestamp.toObject();
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.number != 0)
                                        writer.writeFloat(497493176, this.number);
                                    if (this.hash.length)
                                        writer.writeString(3195150, this.hash);
                                    if (this.parentHash.length)
                                        writer.writeString(245049128, this.parentHash);
                                    if (this.nonce.length)
                                        writer.writeString(105002991, this.nonce);
                                    if (this.sha3Uncles.length)
                                        writer.writeString(373514458, this.sha3Uncles);
                                    if (this.logsBloom.length)
                                        writer.writeString(399161966, this.logsBloom);
                                    if (this.transactionRoot.length)
                                        writer.writeString(189212898, this.transactionRoot);
                                    if (this.stateRoot.length)
                                        writer.writeString(475330288, this.stateRoot);
                                    if (this.receiptRoot.length)
                                        writer.writeString(422939453, this.receiptRoot);
                                    if (this.miner.length)
                                        writer.writeString(103900799, this.miner);
                                    if (this.extraData.length)
                                        writer.writeString(253792294, this.extraData);
                                    if (this.gasLimit != 0)
                                        writer.writeInt32(9229217, this.gasLimit);
                                    if (this.gasUsed != 0)
                                        writer.writeInt32(190522826, this.gasUsed);
                                    if (this.has_timestamp)
                                        writer.writeMessage(55126294, this.timestamp, () => this.timestamp.serialize(writer));
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new Web3BlockHeaderPB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
                                            case 497493176:
                                                message.number = reader.readFloat();
                                                break;
                                            case 3195150:
                                                message.hash = reader.readString();
                                                break;
                                            case 245049128:
                                                message.parentHash = reader.readString();
                                                break;
                                            case 105002991:
                                                message.nonce = reader.readString();
                                                break;
                                            case 373514458:
                                                message.sha3Uncles = reader.readString();
                                                break;
                                            case 399161966:
                                                message.logsBloom = reader.readString();
                                                break;
                                            case 189212898:
                                                message.transactionRoot = reader.readString();
                                                break;
                                            case 475330288:
                                                message.stateRoot = reader.readString();
                                                break;
                                            case 422939453:
                                                message.receiptRoot = reader.readString();
                                                break;
                                            case 103900799:
                                                message.miner = reader.readString();
                                                break;
                                            case 253792294:
                                                message.extraData = reader.readString();
                                                break;
                                            case 9229217:
                                                message.gasLimit = reader.readInt32();
                                                break;
                                            case 190522826:
                                                message.gasUsed = reader.readInt32();
                                                break;
                                            case 55126294:
                                                reader.readMessage(message.timestamp, () => message.timestamp = dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.deserialize(reader));
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
                                    return Web3BlockHeaderPB.deserialize(bytes);
                                }
                            }
                            besu.Web3BlockHeaderPB = Web3BlockHeaderPB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViM19ibG9ja19oZWFkZXJfcGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2dlbmVyYXRlZC9wcm90by9wcm90b2MtZ2VuLXRzL21vZGVscy93ZWIzX2Jsb2NrX2hlYWRlcl9wYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLCtFQUFpRTtBQUNqRSxzREFBd0M7QUFDeEMsSUFBaUIsR0FBRyxDQWtYbkI7QUFsWEQsV0FBaUIsR0FBRztJQUFDLElBQUEsV0FBVyxDQWtYL0I7SUFsWG9CLFdBQUEsV0FBVztRQUFDLElBQUEsS0FBSyxDQWtYckM7UUFsWGdDLFdBQUEsS0FBSztZQUFDLElBQUEsTUFBTSxDQWtYNUM7WUFsWHNDLFdBQUEsTUFBTTtnQkFBQyxJQUFBLE1BQU0sQ0FrWG5EO2dCQWxYNkMsV0FBQSxNQUFNO29CQUFDLElBQUEsU0FBUyxDQWtYN0Q7b0JBbFhvRCxXQUFBLFNBQVM7d0JBQUMsSUFBQSxJQUFJLENBa1hsRTt3QkFsWDhELFdBQUEsSUFBSTs0QkFDL0QsTUFBYSxpQkFBa0IsU0FBUSxJQUFJLENBQUMsT0FBTztnQ0FDL0MsYUFBYSxHQUFlLEVBQUUsQ0FBQztnQ0FDL0IsWUFBWSxJQWVYO29DQUNHLEtBQUssRUFBRSxDQUFDO29DQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztvQ0FDOUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxJQUFJLElBQUksUUFBUSxFQUFFLENBQUM7d0NBQ2xELElBQUksUUFBUSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLFNBQVMsRUFBRSxDQUFDOzRDQUMvQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7d0NBQzlCLENBQUM7d0NBQ0QsSUFBSSxNQUFNLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFLENBQUM7NENBQzNDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzt3Q0FDMUIsQ0FBQzt3Q0FDRCxJQUFJLFlBQVksSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxTQUFTLEVBQUUsQ0FBQzs0Q0FDdkQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO3dDQUN0QyxDQUFDO3dDQUNELElBQUksT0FBTyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLFNBQVMsRUFBRSxDQUFDOzRDQUM3QyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7d0NBQzVCLENBQUM7d0NBQ0QsSUFBSSxZQUFZLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksU0FBUyxFQUFFLENBQUM7NENBQ3ZELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQzt3Q0FDdEMsQ0FBQzt3Q0FDRCxJQUFJLFdBQVcsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLEVBQUUsQ0FBQzs0Q0FDckQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO3dDQUNwQyxDQUFDO3dDQUNELElBQUksaUJBQWlCLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksU0FBUyxFQUFFLENBQUM7NENBQ2pFLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQzt3Q0FDaEQsQ0FBQzt3Q0FDRCxJQUFJLFdBQVcsSUFB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SUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUUsQ0FBQzt3Q0FDckIsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO29DQUMvQixDQUFDO29DQUNELElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLEVBQUUsQ0FBQzt3Q0FDMUIsT0FBTyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO29DQUN6QyxDQUFDO29DQUNELElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQzt3Q0FDekIsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO29DQUN2QyxDQUFDO29DQUNELElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLEVBQUUsQ0FBQzt3Q0FDL0IsT0FBTyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO29DQUNuRCxDQUFDO29DQUNELElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQzt3Q0FDekIsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO29DQUN2QyxDQUFDO29DQUNELElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLEVBQUUsQ0FBQzt3Q0FDM0IsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO29DQUMzQyxDQUFDO29DQUNELElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUUsQ0FBQzt3Q0FDckIsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO29DQUMvQixDQUFDO29DQUNELElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQzt3Q0FDekIsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO29DQUN2QyxDQUFDO29DQUNELElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLEVBQUUsQ0FBQzt3Q0FDeEIsT0FBTyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO29DQUNyQyxDQUFDO29DQUNELElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQzt3Q0FDdkIsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO29DQUNuQyxDQUFDO29DQUNELElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQzt3Q0FDekIsT0FBTyxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0NBQzlJLENBQUM7b0NBQ0QsT0FBTyxPQUFPLENBQUM7Z0NBQ25CLENBQUM7Z0NBQ0QsUUFBUTtvQ0FDSixNQUFNLElBQUksR0FlTixFQUFFLENBQUM7b0NBQ1AsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRSxDQUFDO3dDQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7b0NBQzlCLENBQUM7b0NBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDO3dDQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7b0NBQzFCLENBQUM7b0NBQ0QsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksRUFBRSxDQUFDO3dDQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7b0NBQ3RDLENBQUM7b0NBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRSxDQUFDO3dDQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7b0NBQzVCLENBQUM7b0NBQ0QsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksRUFBRSxDQUFDO3dDQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7b0NBQ3RDLENBQUM7b0NBQ0QsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO3dDQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7b0NBQ3BDLENBQUM7b0NBQ0QsSUFBSSxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksRUFBRSxDQUFDO3dDQUMvQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7b0NBQ2hELENBQUM7b0NBQ0QsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO3dDQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7b0NBQ3BDLENBQUM7b0NBQ0QsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksRUFBRSxDQUFDO3dDQUMzQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7b0NBQ3hDLENBQUM7b0NBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRSxDQUFDO3dDQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7b0NBQzVCLENBQUM7b0NBQ0QsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO3dDQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7b0NBQ3BDLENBQUM7b0NBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRSxDQUFDO3dDQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0NBQ2xDLENBQUM7b0NBQ0QsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRSxDQUFDO3dDQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7b0NBQ2hDLENBQUM7b0NBQ0QsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO3dDQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7b0NBQy9DLENBQUM7b0NBQ0QsT0FBTyxJQUFJLENBQUM7Z0NBQ2hCLENBQUM7Z0NBR0QsU0FBUyxDQUFDLENBQXFCO29DQUMzQixNQUFNLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7b0NBQzVDLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDO3dDQUNoQixNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7b0NBQzlDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO3dDQUNoQixNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0NBQzNDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNO3dDQUN0QixNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7b0NBQ25ELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO3dDQUNqQixNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0NBQzlDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNO3dDQUN0QixNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7b0NBQ25ELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNO3dDQUNyQixNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0NBQ2xELElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNO3dDQUMzQixNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7b0NBQ3hELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNO3dDQUNyQixNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0NBQ2xELElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNO3dDQUN2QixNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7b0NBQ3BELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNO3dDQUNqQixNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0NBQzlDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNO3dDQUNyQixNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0NBQ2xELElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDO3dDQUNsQixNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0NBQzlDLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDO3dDQUNqQixNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0NBQy9DLElBQUksSUFBSSxDQUFDLGFBQWE7d0NBQ2xCLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQ0FDMUYsSUFBSSxDQUFDLENBQUM7d0NBQ0YsT0FBTyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0NBQ3hDLENBQUM7Z0NBQ0QsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFxQztvQ0FDcEQsTUFBTSxNQUFNLEdBQUcsS0FBSyxZQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sR0FBRyxJQUFJLGlCQUFpQixFQUFFLENBQUM7b0NBQzVILE9BQU8sTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7d0NBQ3hCLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTs0Q0FDbkIsTUFBTTt3Q0FDVixRQUFRLE1BQU0sQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDOzRDQUM5QixLQUFLLFNBQVM7Z0RBQ1YsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7Z0RBQ3BDLE1BQU07NENBQ1YsS0FBSyxPQUFPO2dEQUNSLE9BQU8sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dEQUNuQyxNQUFNOzRDQUNWLEtBQUssU0FBUztnREFDVixPQUFPLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztnREFDekMsTUFBTTs0Q0FDVixLQUFLLFNBQVM7Z0RBQ1YsT0FBTyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7Z0RBQ3BDLE1BQU07NENBQ1YsS0FBSyxTQUFTO2dEQUNWLE9BQU8sQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dEQUN6QyxNQUFNOzRDQUNWLEtBQUssU0FBUztnREFDVixPQUFPLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztnREFDeEMsTUFBTTs0Q0FDVixLQUFLLFNBQVM7Z0RBQ1YsT0FBTyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7Z0RBQzlDLE1BQU07NENBQ1YsS0FBSyxTQUFTO2dEQUNWLE9BQU8sQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dEQUN4QyxNQUFNOzRDQUNWLEtBQUssU0FBUztnREFDVixPQUFPLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztnREFDMUMsTUFBTTs0Q0FDVixLQUFLLFNBQVM7Z0RBQ1YsT0FBTyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7Z0RBQ3BDLE1BQU07NENBQ1YsS0FBSyxTQUFTO2dEQUNWLE9BQU8sQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dEQUN4QyxNQUFNOzRDQUNWLEtBQUssT0FBTztnREFDUixPQUFPLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztnREFDdEMsTUFBTTs0Q0FDVixLQUFLLFNBQVM7Z0RBQ1YsT0FBTyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7Z0RBQ3JDLE1BQU07NENBQ1YsS0FBSyxRQUFRO2dEQUNULE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0RBQ2hMLE1BQU07NENBQ1YsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO3dDQUNoQyxDQUFDO29DQUNMLENBQUM7b0NBQ0QsT0FBTyxPQUFPLENBQUM7Z0NBQ25CLENBQUM7Z0NBQ0QsZUFBZTtvQ0FDWCxPQUFPLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQ0FDNUIsQ0FBQztnQ0FDRCxNQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBaUI7b0NBQ3RDLE9BQU8saUJBQWlCLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dDQUNoRCxDQUFDOzZCQUNKOzRCQWhYWSxzQkFBaUIsb0JBZ1g3QixDQUFBO3dCQUNMLENBQUMsRUFsWDhELElBQUksR0FBSixjQUFJLEtBQUosY0FBSSxRQWtYbEU7b0JBQUQsQ0FBQyxFQWxYb0QsU0FBUyxHQUFULGdCQUFTLEtBQVQsZ0JBQVMsUUFrWDdEO2dCQUFELENBQUMsRUFsWDZDLE1BQU0sR0FBTixhQUFNLEtBQU4sYUFBTSxRQWtYbkQ7WUFBRCxDQUFDLEVBbFhzQyxNQUFNLEdBQU4sWUFBTSxLQUFOLFlBQU0sUUFrWDVDO1FBQUQsQ0FBQyxFQWxYZ0MsS0FBSyxHQUFMLGlCQUFLLEtBQUwsaUJBQUssUUFrWHJDO0lBQUQsQ0FBQyxFQWxYb0IsV0FBVyxHQUFYLGVBQVcsS0FBWCxlQUFXLFFBa1gvQjtBQUFELENBQUMsRUFsWGdCLEdBQUcsbUJBQUgsR0FBRyxRQWtYbkIifQ==