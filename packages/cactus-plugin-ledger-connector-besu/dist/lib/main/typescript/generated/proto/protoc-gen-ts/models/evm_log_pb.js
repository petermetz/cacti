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
                            class EvmLogPB extends pb_1.Message {
                                #one_of_decls = [];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [331163357], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") {
                                        if ("address" in data && data.address != undefined) {
                                            this.address = data.address;
                                        }
                                        if ("data" in data && data.data != undefined) {
                                            this.data = data.data;
                                        }
                                        if ("blockHash" in data && data.blockHash != undefined) {
                                            this.blockHash = data.blockHash;
                                        }
                                        if ("transactionHash" in data && data.transactionHash != undefined) {
                                            this.transactionHash = data.transactionHash;
                                        }
                                        if ("topics" in data && data.topics != undefined) {
                                            this.topics = data.topics;
                                        }
                                        if ("logIndex" in data && data.logIndex != undefined) {
                                            this.logIndex = data.logIndex;
                                        }
                                        if ("transactionIndex" in data && data.transactionIndex != undefined) {
                                            this.transactionIndex = data.transactionIndex;
                                        }
                                        if ("blockNumber" in data && data.blockNumber != undefined) {
                                            this.blockNumber = data.blockNumber;
                                        }
                                    }
                                }
                                get address() {
                                    return pb_1.Message.getFieldWithDefault(this, 73950222, "");
                                }
                                set address(value) {
                                    pb_1.Message.setField(this, 73950222, value);
                                }
                                get data() {
                                    return pb_1.Message.getFieldWithDefault(this, 3076010, "");
                                }
                                set data(value) {
                                    pb_1.Message.setField(this, 3076010, value);
                                }
                                get blockHash() {
                                    return pb_1.Message.getFieldWithDefault(this, 335211324, "");
                                }
                                set blockHash(value) {
                                    pb_1.Message.setField(this, 335211324, value);
                                }
                                get transactionHash() {
                                    return pb_1.Message.getFieldWithDefault(this, 188901646, "");
                                }
                                set transactionHash(value) {
                                    pb_1.Message.setField(this, 188901646, value);
                                }
                                get topics() {
                                    return pb_1.Message.getFieldWithDefault(this, 331163357, []);
                                }
                                set topics(value) {
                                    pb_1.Message.setField(this, 331163357, value);
                                }
                                get logIndex() {
                                    return pb_1.Message.getFieldWithDefault(this, 382599153, 0);
                                }
                                set logIndex(value) {
                                    pb_1.Message.setField(this, 382599153, value);
                                }
                                get transactionIndex() {
                                    return pb_1.Message.getFieldWithDefault(this, 488538260, 0);
                                }
                                set transactionIndex(value) {
                                    pb_1.Message.setField(this, 488538260, value);
                                }
                                get blockNumber() {
                                    return pb_1.Message.getFieldWithDefault(this, 205598263, 0);
                                }
                                set blockNumber(value) {
                                    pb_1.Message.setField(this, 205598263, value);
                                }
                                static fromObject(data) {
                                    const message = new EvmLogPB({});
                                    if (data.address != null) {
                                        message.address = data.address;
                                    }
                                    if (data.data != null) {
                                        message.data = data.data;
                                    }
                                    if (data.blockHash != null) {
                                        message.blockHash = data.blockHash;
                                    }
                                    if (data.transactionHash != null) {
                                        message.transactionHash = data.transactionHash;
                                    }
                                    if (data.topics != null) {
                                        message.topics = data.topics;
                                    }
                                    if (data.logIndex != null) {
                                        message.logIndex = data.logIndex;
                                    }
                                    if (data.transactionIndex != null) {
                                        message.transactionIndex = data.transactionIndex;
                                    }
                                    if (data.blockNumber != null) {
                                        message.blockNumber = data.blockNumber;
                                    }
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    if (this.address != null) {
                                        data.address = this.address;
                                    }
                                    if (this.data != null) {
                                        data.data = this.data;
                                    }
                                    if (this.blockHash != null) {
                                        data.blockHash = this.blockHash;
                                    }
                                    if (this.transactionHash != null) {
                                        data.transactionHash = this.transactionHash;
                                    }
                                    if (this.topics != null) {
                                        data.topics = this.topics;
                                    }
                                    if (this.logIndex != null) {
                                        data.logIndex = this.logIndex;
                                    }
                                    if (this.transactionIndex != null) {
                                        data.transactionIndex = this.transactionIndex;
                                    }
                                    if (this.blockNumber != null) {
                                        data.blockNumber = this.blockNumber;
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.address.length)
                                        writer.writeString(73950222, this.address);
                                    if (this.data.length)
                                        writer.writeString(3076010, this.data);
                                    if (this.blockHash.length)
                                        writer.writeString(335211324, this.blockHash);
                                    if (this.transactionHash.length)
                                        writer.writeString(188901646, this.transactionHash);
                                    if (this.topics.length)
                                        writer.writeRepeatedString(331163357, this.topics);
                                    if (this.logIndex != 0)
                                        writer.writeFloat(382599153, this.logIndex);
                                    if (this.transactionIndex != 0)
                                        writer.writeFloat(488538260, this.transactionIndex);
                                    if (this.blockNumber != 0)
                                        writer.writeFloat(205598263, this.blockNumber);
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new EvmLogPB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
                                            case 73950222:
                                                message.address = reader.readString();
                                                break;
                                            case 3076010:
                                                message.data = reader.readString();
                                                break;
                                            case 335211324:
                                                message.blockHash = reader.readString();
                                                break;
                                            case 188901646:
                                                message.transactionHash = reader.readString();
                                                break;
                                            case 331163357:
                                                pb_1.Message.addToRepeatedField(message, 331163357, reader.readString());
                                                break;
                                            case 382599153:
                                                message.logIndex = reader.readFloat();
                                                break;
                                            case 488538260:
                                                message.transactionIndex = reader.readFloat();
                                                break;
                                            case 205598263:
                                                message.blockNumber = reader.readFloat();
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
                                    return EvmLogPB.deserialize(bytes);
                                }
                            }
                            besu.EvmLogPB = EvmLogPB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZtX2xvZ19wYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvZ2VuZXJhdGVkL3Byb3RvL3Byb3RvYy1nZW4tdHMvbW9kZWxzL2V2bV9sb2dfcGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNQSxzREFBd0M7QUFDeEMsSUFBaUIsR0FBRyxDQXFPbkI7QUFyT0QsV0FBaUIsR0FBRztJQUFDLElBQUEsV0FBVyxDQXFPL0I7SUFyT29CLFdBQUEsV0FBVztRQUFDLElBQUEsS0FBSyxDQXFPckM7UUFyT2dDLFdBQUEsS0FBSztZQUFDLElBQUEsTUFBTSxDQXFPNUM7WUFyT3NDLFdBQUEsTUFBTTtnQkFBQyxJQUFBLE1BQU0sQ0FxT25EO2dCQXJPNkMsV0FBQSxNQUFNO29CQUFDLElBQUEsU0FBUyxDQXFPN0Q7b0JBck9vRCxXQUFBLFNBQVM7d0JBQUMsSUFBQSxJQUFJLENBcU9sRTt3QkFyTzhELFdBQUEsSUFBSTs0QkFDL0QsTUFBYSxRQUFTLFNBQVEsSUFBSSxDQUFDLE9BQU87Z0NBQ3RDLGFBQWEsR0FBZSxFQUFFLENBQUM7Z0NBQy9CLFlBQVksSUFTWDtvQ0FDRyxLQUFLLEVBQUUsQ0FBQztvQ0FDUixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29DQUN2RyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLElBQUksSUFBSSxRQUFRLEVBQUUsQ0FBQzt3Q0FDbEQsSUFBSSxTQUFTLElBQUks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