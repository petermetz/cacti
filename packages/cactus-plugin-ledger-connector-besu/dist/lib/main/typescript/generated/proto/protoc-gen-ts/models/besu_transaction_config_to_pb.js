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
                            class BesuTransactionConfigToPB extends pb_1.Message {
                                #one_of_decls = [];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") { }
                                }
                                static fromObject(data) {
                                    const message = new BesuTransactionConfigToPB({});
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new BesuTransactionConfigToPB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
                                            default: reader.skipField();
                                        }
                                    }
                                    return message;
                                }
                                serializeBinary() {
                                    return this.serialize();
                                }
                                static deserializeBinary(bytes) {
                                    return BesuTransactionConfigToPB.deserialize(bytes);
                                }
                            }
                            besu.BesuTransactionConfigToPB = BesuTransactionConfigToPB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVzdV90cmFuc2FjdGlvbl9jb25maWdfdG9fcGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2dlbmVyYXRlZC9wcm90by9wcm90b2MtZ2VuLXRzL21vZGVscy9iZXN1X3RyYW5zYWN0aW9uX2NvbmZpZ190b19wYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLHNEQUF3QztBQUN4QyxJQUFpQixHQUFHLENBeUNuQjtBQXpDRCxXQUFpQixHQUFHO0lBQUMsSUFBQSxXQUFXLENBeUMvQjtJQXpDb0IsV0FBQSxXQUFXO1FBQUMsSUFBQSxLQUFLLENBeUNyQztRQXpDZ0MsV0FBQSxLQUFLO1lBQUMsSUFBQSxNQUFNLENBeUM1QztZQXpDc0MsV0FBQSxNQUFNO2dCQUFDLElBQUEsTUFBTSxDQXlDbkQ7Z0JBekM2QyxXQUFBLE1BQU07b0JBQUMsSUFBQSxTQUFTLENBeUM3RDtvQkF6Q29ELFdBQUEsU0FBUzt3QkFBQyxJQUFBLElBQUksQ0F5Q2xFO3dCQXpDOEQsV0FBQSxJQUFJOzRCQUMvRCxNQUFhLHlCQUEwQixTQUFRLElBQUksQ0FBQyxPQUFPO2dDQUN2RCxhQUFhLEdBQWUsRUFBRSxDQUFDO2dDQUMvQixZQUFZLElBQWlCO29DQUN6QixLQUFLLEVBQUUsQ0FBQztvQ0FDUixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0NBQzlGLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sSUFBSSxJQUFJLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztnQ0FDNUQsQ0FBQztnQ0FDRCxNQUFNLENBQUMsVUFBVSxDQUFDLElBQVE7b0NBQ3RCLE1BQU0sT0FBTyxHQUFHLElBQUkseUJBQXlCLENBQUMsRUFBRSxDQUFDLENBQUM7b0NBQ2xELE9BQU8sT0FBTyxDQUFDO2dDQUNuQixDQUFDO2dDQUNELFFBQVE7b0NBQ0osTUFBTSxJQUFJLEdBQU8sRUFBRSxDQUFDO29DQUNwQixPQUFPLElBQUksQ0FBQztnQ0FDaEIsQ0FBQztnQ0FHRCxTQUFTLENBQUMsQ0FBcUI7b0NBQzNCLE1BQU0sTUFBTSxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQ0FDNUMsSUFBSSxDQUFDLENBQUM7d0NBQ0YsT0FBTyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7Z0NBQ3hDLENBQUM7Z0NBQ0QsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFxQztvQ0FDcEQsTUFBTSxNQUFNLEdBQUcsS0FBSyxZQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sR0FBRyxJQUFJLHlCQUF5QixFQUFFLENBQUM7b0NBQ3BJLE9BQU8sTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7d0NBQ3hCLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTs0Q0FDbkIsTUFBTTt3Q0FDVixRQUFRLE1BQU0sQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDOzRDQUM5QixPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7d0NBQ2hDLENBQUM7b0NBQ0wsQ0FBQztvQ0FDRCxPQUFPLE9BQU8sQ0FBQztnQ0FDbkIsQ0FBQztnQ0FDRCxlQUFlO29DQUNYLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dDQUM1QixDQUFDO2dDQUNELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFpQjtvQ0FDdEMsT0FBTyx5QkFBeUIsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7Z0NBQ3hELENBQUM7NkJBQ0o7NEJBdkNZLDhCQUF5Qiw0QkF1Q3JDLENBQUE7d0JBQ0wsQ0FBQyxFQXpDOEQsSUFBSSxHQUFKLGNBQUksS0FBSixjQUFJLFFBeUNsRTtvQkFBRCxDQUFDLEVBekNvRCxTQUFTLEdBQVQsZ0JBQVMsS0FBVCxnQkFBUyxRQXlDN0Q7Z0JBQUQsQ0FBQyxFQXpDNkMsTUFBTSxHQUFOLGFBQU0sS0FBTixhQUFNLFFBeUNuRDtZQUFELENBQUMsRUF6Q3NDLE1BQU0sR0FBTixZQUFNLEtBQU4sWUFBTSxRQXlDNUM7UUFBRCxDQUFDLEVBekNnQyxLQUFLLEdBQUwsaUJBQUssS0FBTCxpQkFBSyxRQXlDckM7SUFBRCxDQUFDLEVBekNvQixXQUFXLEdBQVgsZUFBVyxLQUFYLGVBQVcsUUF5Qy9CO0FBQUQsQ0FBQyxFQXpDZ0IsR0FBRyxtQkFBSCxHQUFHLFFBeUNuQiJ9