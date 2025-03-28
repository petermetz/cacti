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
const dependency_2 = __importStar(require("./invoke_contract_v1_request_pb"));
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
                            class GetBesuRecordV1RequestPB extends pb_1.Message {
                                #one_of_decls = [];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") {
                                        if ("invokeCall" in data && data.invokeCall != undefined) {
                                            this.invokeCall = data.invokeCall;
                                        }
                                        if ("transactionHash" in data && data.transactionHash != undefined) {
                                            this.transactionHash = data.transactionHash;
                                        }
                                    }
                                }
                                get invokeCall() {
                                    return pb_1.Message.getWrapperField(this, dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.InvokeContractV1RequestPB, 359347961);
                                }
                                set invokeCall(value) {
                                    pb_1.Message.setWrapperField(this, 359347961, value);
                                }
                                get has_invokeCall() {
                                    return pb_1.Message.getField(this, 359347961) != null;
                                }
                                get transactionHash() {
                                    return pb_1.Message.getFieldWithDefault(this, 188901646, "");
                                }
                                set transactionHash(value) {
                                    pb_1.Message.setField(this, 188901646, value);
                                }
                                static fromObject(data) {
                                    const message = new GetBesuRecordV1RequestPB({});
                                    if (data.invokeCall != null) {
                                        message.invokeCall = dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.InvokeContractV1RequestPB.fromObject(data.invokeCall);
                                    }
                                    if (data.transactionHash != null) {
                                        message.transactionHash = data.transactionHash;
                                    }
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    if (this.invokeCall != null) {
                                        data.invokeCall = this.invokeCall.toObject();
                                    }
                                    if (this.transactionHash != null) {
                                        data.transactionHash = this.transactionHash;
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.has_invokeCall)
                                        writer.writeMessage(359347961, this.invokeCall, () => this.invokeCall.serialize(writer));
                                    if (this.transactionHash.length)
                                        writer.writeString(188901646, this.transactionHash);
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new GetBesuRecordV1RequestPB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
                                            case 359347961:
                                                reader.readMessage(message.invokeCall, () => message.invokeCall = dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.InvokeContractV1RequestPB.deserialize(reader));
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
                                    return GetBesuRecordV1RequestPB.deserialize(bytes);
                                }
                            }
                            besu.GetBesuRecordV1RequestPB = GetBesuRecordV1RequestPB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0X2Jlc3VfcmVjb3JkX3YxX3JlcXVlc3RfcGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2dlbmVyYXRlZC9wcm90by9wcm90b2MtZ2VuLXRzL21vZGVscy9nZXRfYmVzdV9yZWNvcmRfdjFfcmVxdWVzdF9wYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLDhFQUFnRTtBQUNoRSxzREFBd0M7QUFDeEMsSUFBaUIsR0FBRyxDQThGbkI7QUE5RkQsV0FBaUIsR0FBRztJQUFDLElBQUEsV0FBVyxDQThGL0I7SUE5Rm9CLFdBQUEsV0FBVztRQUFDLElBQUEsS0FBSyxDQThGckM7UUE5RmdDLFdBQUEsS0FBSztZQUFDLElBQUEsTUFBTSxDQThGNUM7WUE5RnNDLFdBQUEsTUFBTTtnQkFBQyxJQUFBLE1BQU0sQ0E4Rm5EO2dCQTlGNkMsV0FBQSxNQUFNO29CQUFDLElBQUEsU0FBUyxDQThGN0Q7b0JBOUZvRCxXQUFBLFNBQVM7d0JBQUMsSUFBQSxJQUFJLENBOEZsRTt3QkE5RjhELFdBQUEsSUFBSTs0QkFDL0QsTUFBYSx3QkFBeUIsU0FBUSxJQUFJLENBQUMsT0FBTztnQ0FDdEQsYUFBYSxHQUFlLEVBQUUsQ0FBQztnQ0FDL0IsWUFBWSxJQUdYO29DQUNHLEtBQUssRUFBRSxDQUFDO29DQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztvQ0FDOUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxJQUFJ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