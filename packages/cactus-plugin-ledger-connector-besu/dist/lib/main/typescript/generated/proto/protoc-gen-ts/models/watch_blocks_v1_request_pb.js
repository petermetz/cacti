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
const dependency_2 = __importStar(require("./watch_blocks_v1_pb"));
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
                            class WatchBlocksV1RequestPB extends pb_1.Message {
                                #one_of_decls = [];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") {
                                        if ("event" in data && data.event != undefined) {
                                            this.event = data.event;
                                        }
                                    }
                                }
                                get event() {
                                    return pb_1.Message.getFieldWithDefault(this, 96891546, dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.WatchBlocksV1PB.WatchBlocksV1PB_Subscribe);
                                }
                                set event(value) {
                                    pb_1.Message.setField(this, 96891546, value);
                                }
                                static fromObject(data) {
                                    const message = new WatchBlocksV1RequestPB({});
                                    if (data.event != null) {
                                        message.event = data.event;
                                    }
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    if (this.event != null) {
                                        data.event = this.event;
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.event != dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.WatchBlocksV1PB.WatchBlocksV1PB_Subscribe)
                                        writer.writeEnum(96891546, this.event);
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new WatchBlocksV1RequestPB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
                                            case 96891546:
                                                message.event = reader.readEnum();
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
                                    return WatchBlocksV1RequestPB.deserialize(bytes);
                                }
                            }
                            besu.WatchBlocksV1RequestPB = WatchBlocksV1RequestPB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hfYmxvY2tzX3YxX3JlcXVlc3RfcGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2dlbmVyYXRlZC9wcm90by9wcm90b2MtZ2VuLXRzL21vZGVscy93YXRjaF9ibG9ja3NfdjFfcmVxdWVzdF9wYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLG1FQUFxRDtBQUNyRCxzREFBd0M7QUFDeEMsSUFBaUIsR0FBRyxDQW9FbkI7QUFwRUQsV0FBaUIsR0FBRztJQUFDLElBQUEsV0FBVyxDQW9FL0I7SUFwRW9CLFdBQUEsV0FBVztRQUFDLElBQUEsS0FBSyxDQW9FckM7UUFwRWdDLFdBQUEsS0FBSztZQUFDLElBQUEsTUFBTSxDQW9FNUM7WUFwRXNDLFdBQUEsTUFBTTtnQkFBQyxJQUFBLE1BQU0sQ0FvRW5EO2dCQXBFNkMsV0FBQSxNQUFNO29CQUFDLElBQUEsU0FBUyxDQW9FN0Q7b0JBcEVvRCxXQUFBLFNBQVM7d0JBQUMsSUFBQSxJQUFJLENBb0VsRTt3QkFwRThELFdBQUEsSUFBSTs0QkFDL0QsTUFBYSxzQkFBdUIsU0FBUSxJQUFJLENBQUMsT0FBTztnQ0FDcEQsYUFBYSxHQUFlLEVBQUUsQ0FBQztnQ0FDL0IsWUFBWSxJQUVYO29DQUNHLEtBQUssRUFBRSxDQUFDO29DQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztvQ0FDOUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxJQUFJLElBQUks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