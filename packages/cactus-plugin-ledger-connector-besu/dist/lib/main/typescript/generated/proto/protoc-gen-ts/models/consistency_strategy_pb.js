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
const dependency_2 = __importStar(require("./receipt_type_pb"));
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
                            class ConsistencyStrategyPB extends pb_1.Message {
                                #one_of_decls = [];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") {
                                        if ("receiptType" in data && data.receiptType != undefined) {
                                            this.receiptType = data.receiptType;
                                        }
                                        if ("timeoutMs" in data && data.timeoutMs != undefined) {
                                            this.timeoutMs = data.timeoutMs;
                                        }
                                        if ("blockConfirmations" in data && data.blockConfirmations != undefined) {
                                            this.blockConfirmations = data.blockConfirmations;
                                        }
                                    }
                                }
                                get receiptType() {
                                    return pb_1.Message.getFieldWithDefault(this, 423008661, dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.ReceiptTypePB.ReceiptTypePB_NODE_TX_POOL_ACK);
                                }
                                set receiptType(value) {
                                    pb_1.Message.setField(this, 423008661, value);
                                }
                                get timeoutMs() {
                                    return pb_1.Message.getFieldWithDefault(this, 51479271, 0);
                                }
                                set timeoutMs(value) {
                                    pb_1.Message.setField(this, 51479271, value);
                                }
                                get blockConfirmations() {
                                    return pb_1.Message.getFieldWithDefault(this, 207555762, 0);
                                }
                                set blockConfirmations(value) {
                                    pb_1.Message.setField(this, 207555762, value);
                                }
                                static fromObject(data) {
                                    const message = new ConsistencyStrategyPB({});
                                    if (data.receiptType != null) {
                                        message.receiptType = data.receiptType;
                                    }
                                    if (data.timeoutMs != null) {
                                        message.timeoutMs = data.timeoutMs;
                                    }
                                    if (data.blockConfirmations != null) {
                                        message.blockConfirmations = data.blockConfirmations;
                                    }
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    if (this.receiptType != null) {
                                        data.receiptType = this.receiptType;
                                    }
                                    if (this.timeoutMs != null) {
                                        data.timeoutMs = this.timeoutMs;
                                    }
                                    if (this.blockConfirmations != null) {
                                        data.blockConfirmations = this.blockConfirmations;
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.receiptType != dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.ReceiptTypePB.ReceiptTypePB_NODE_TX_POOL_ACK)
                                        writer.writeEnum(423008661, this.receiptType);
                                    if (this.timeoutMs != 0)
                                        writer.writeInt32(51479271, this.timeoutMs);
                                    if (this.blockConfirmations != 0)
                                        writer.writeInt32(207555762, this.blockConfirmations);
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new ConsistencyStrategyPB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
                                            case 423008661:
                                                message.receiptType = reader.readEnum();
                                                break;
                                            case 51479271:
                                                message.timeoutMs = reader.readInt32();
                                                break;
                                            case 207555762:
                                                message.blockConfirmations = reader.readInt32();
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
                                    return ConsistencyStrategyPB.deserialize(bytes);
                                }
                            }
                            besu.ConsistencyStrategyPB = ConsistencyStrategyPB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc2lzdGVuY3lfc3RyYXRlZ3lfcGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2dlbmVyYXRlZC9wcm90by9wcm90b2MtZ2VuLXRzL21vZGVscy9jb25zaXN0ZW5jeV9zdHJhdGVneV9wYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLGdFQUFrRDtBQUNsRCxzREFBd0M7QUFDeEMsSUFBaUIsR0FBRyxDQWtIbkI7QUFsSEQsV0FBaUIsR0FBRztJQUFDLElBQUEsV0FBVyxDQWtIL0I7SUFsSG9CLFdBQUEsV0FBVztRQUFDLElBQUEsS0FBSyxDQWtIckM7UUFsSGdDLFdBQUEsS0FBSztZQUFDLElBQUEsTUFBTSxDQWtINUM7WUFsSHNDLFdBQUEsTUFBTTtnQkFBQyxJQUFBLE1BQU0sQ0FrSG5EO2dCQWxINkMsV0FBQSxNQUFNO29CQUFDLElBQUEsU0FBUyxDQWtIN0Q7b0JBbEhvRCxXQUFBLFNBQVM7d0JBQUMsSUFBQSxJQUFJLENBa0hsRTt3QkFsSDhELFdBQUEsSUFBSTs0QkFDL0QsTUFBYSxxQkFBc0IsU0FBUSxJQUFJLENBQUMsT0FBTztnQ0FDbkQsYUFBYSxHQUFlLEVBQUUsQ0FBQztnQ0FDL0IsWUFBWSxJQUlYO29DQUNHLEtBQUssRUFBRSxDQUFDO29DQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztvQ0FDOUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxJQUFJLElBQUksUUFBUSxF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