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
                            class GetTransactionV1RequestPB extends pb_1.Message {
                                #one_of_decls = [];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") {
                                        if ("transactionHash" in data && data.transactionHash != undefined) {
                                            this.transactionHash = data.transactionHash;
                                        }
                                    }
                                }
                                get transactionHash() {
                                    return pb_1.Message.getFieldWithDefault(this, 188901646, "");
                                }
                                set transactionHash(value) {
                                    pb_1.Message.setField(this, 188901646, value);
                                }
                                static fromObject(data) {
                                    const message = new GetTransactionV1RequestPB({});
                                    if (data.transactionHash != null) {
                                        message.transactionHash = data.transactionHash;
                                    }
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    if (this.transactionHash != null) {
                                        data.transactionHash = this.transactionHash;
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.transactionHash.length)
                                        writer.writeString(188901646, this.transactionHash);
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new GetTransactionV1RequestPB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
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
                                    return GetTransactionV1RequestPB.deserialize(bytes);
                                }
                            }
                            besu.GetTransactionV1RequestPB = GetTransactionV1RequestPB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0X3RyYW5zYWN0aW9uX3YxX3JlcXVlc3RfcGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2dlbmVyYXRlZC9wcm90by9wcm90b2MtZ2VuLXRzL21vZGVscy9nZXRfdHJhbnNhY3Rpb25fdjFfcmVxdWVzdF9wYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLHNEQUF3QztBQUN4QyxJQUFpQixHQUFHLENBb0VuQjtBQXBFRCxXQUFpQixHQUFHO0lBQUMsSUFBQSxXQUFXLENBb0UvQjtJQXBFb0IsV0FBQSxXQUFXO1FBQUMsSUFBQSxLQUFLLENBb0VyQztRQXBFZ0MsV0FBQSxLQUFLO1lBQUMsSUFBQSxNQUFNLENBb0U1QztZQXBFc0MsV0FBQSxNQUFNO2dCQUFDLElBQUEsTUFBTSxDQW9FbkQ7Z0JBcEU2QyxXQUFBLE1BQU07b0JBQUMsSUFBQSxTQUFTLENBb0U3RDtvQkFwRW9ELFdBQUEsU0FBUzt3QkFBQyxJQUFBLElBQUksQ0FvRWxFO3dCQXBFOEQsV0FBQSxJQUFJOzRCQUMvRCxNQUFhLHlCQUEwQixTQUFRLElBQUksQ0FBQyxPQUFPO2dDQUN2RCxhQUFhLEdBQWUsRUFBRSxDQUFDO2dDQUMvQixZQUFZLElBRVg7b0NBQ0csS0FBSyxFQUFFLENBQUM7b0NBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29DQUM5RixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLElBQUksSUFBSSxRQUFRLEVBQUUsQ0FBQzt3Q0FDbEQsSUFBSSxpQkFBaUIsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxTQUFTLEVBQUUsQ0FBQzs0Q0FDakUsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO3dDQUNoRCxDQUFDO29DQUNMLENBQUM7Z0NBQ0wsQ0FBQztnQ0FDRCxJQUFJLGVBQWU7b0NBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFXLENBQUM7Z0NBQzNFLENBQUM7Z0NBQ0QsSUFBSSxlQUFlLENBQUMsS0FBYTtvQ0FDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztnQ0FDbEQsQ0FBQztnQ0FDRCxNQUFNLENBQUMsVUFBVSxDQUFDLElBRWpCO29DQUNHLE1BQU0sT0FBTyxHQUFHLElBQUkseUJBQXlCLENBQUMsRUFBRSxDQUFDLENBQUM7b0NBQ2xELElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLEVBQUUsQ0FBQzt3Q0FDL0IsT0FBTyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO29DQUNuRCxDQUFDO29DQUNELE9BQU8sT0FBTyxDQUFDO2dDQUNuQixDQUFDO2dDQUNELFFBQVE7b0NBQ0osTUFBTSxJQUFJLEdBRU4sRUFBRSxDQUFDO29DQUNQLElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLEVBQUUsQ0FBQzt3Q0FDL0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO29DQUNoRCxDQUFDO29DQUNELE9BQU8sSUFBSSxDQUFDO2dDQUNoQixDQUFDO2dDQUdELFNBQVMsQ0FBQyxDQUFxQjtvQ0FDM0IsTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO29DQUM1QyxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTTt3Q0FDM0IsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO29DQUN4RCxJQUFJLENBQUMsQ0FBQzt3Q0FDRixPQUFPLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQ0FDeEMsQ0FBQztnQ0FDRCxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQXFDO29DQUNwRCxNQUFNLE1BQU0sR0FBRyxLQUFLLFlBQVksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxHQUFHLElBQUkseUJBQXlCLEVBQUUsQ0FBQztvQ0FDcEksT0FBTyxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQzt3Q0FDeEIsSUFBSSxNQUFNLENBQUMsVUFBVSxFQUFFOzRDQUNuQixNQUFNO3dDQUNWLFFBQVEsTUFBTSxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUM7NENBQzlCLEtBQUssU0FBUztnREFDVixPQUFPLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztnREFDOUMsTUFBTTs0Q0FDVixPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7d0NBQ2hDLENBQUM7b0NBQ0wsQ0FBQztvQ0FDRCxPQUFPLE9BQU8sQ0FBQztnQ0FDbkIsQ0FBQztnQ0FDRCxlQUFlO29DQUNYLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dDQUM1QixDQUFDO2dDQUNELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFpQjtvQ0FDdEMsT0FBTyx5QkFBeUIsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7Z0NBQ3hELENBQUM7NkJBQ0o7NEJBbEVZLDhCQUF5Qiw0QkFrRXJDLENBQUE7d0JBQ0wsQ0FBQyxFQXBFOEQsSUFBSSxHQUFKLGNBQUksS0FBSixjQUFJLFFBb0VsRTtvQkFBRCxDQUFDLEVBcEVvRCxTQUFTLEdBQVQsZ0JBQVMsS0FBVCxnQkFBUyxRQW9FN0Q7Z0JBQUQsQ0FBQyxFQXBFNkMsTUFBTSxHQUFOLGFBQU0sS0FBTixhQUFNLFFBb0VuRDtZQUFELENBQUMsRUFwRXNDLE1BQU0sR0FBTixZQUFNLEtBQU4sWUFBTSxRQW9FNUM7UUFBRCxDQUFDLEVBcEVnQyxLQUFLLEdBQUwsaUJBQUssS0FBTCxpQkFBSyxRQW9FckM7SUFBRCxDQUFDLEVBcEVvQixXQUFXLEdBQVgsZUFBVyxLQUFYLGVBQVcsUUFvRS9CO0FBQUQsQ0FBQyxFQXBFZ0IsR0FBRyxtQkFBSCxHQUFHLFFBb0VuQiJ9