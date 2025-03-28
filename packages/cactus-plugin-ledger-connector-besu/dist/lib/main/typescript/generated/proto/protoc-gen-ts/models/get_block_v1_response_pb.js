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
const dependency_2 = __importStar(require("./evm_block_pb"));
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
                            class GetBlockV1ResponsePB extends pb_1.Message {
                                #one_of_decls = [];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") {
                                        if ("block" in data && data.block != undefined) {
                                            this.block = data.block;
                                        }
                                    }
                                }
                                get block() {
                                    return pb_1.Message.getWrapperField(this, dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmBlockPB, 93832333);
                                }
                                set block(value) {
                                    pb_1.Message.setWrapperField(this, 93832333, value);
                                }
                                get has_block() {
                                    return pb_1.Message.getField(this, 93832333) != null;
                                }
                                static fromObject(data) {
                                    const message = new GetBlockV1ResponsePB({});
                                    if (data.block != null) {
                                        message.block = dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmBlockPB.fromObject(data.block);
                                    }
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    if (this.block != null) {
                                        data.block = this.block.toObject();
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.has_block)
                                        writer.writeMessage(93832333, this.block, () => this.block.serialize(writer));
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new GetBlockV1ResponsePB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
                                            case 93832333:
                                                reader.readMessage(message.block, () => message.block = dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmBlockPB.deserialize(reader));
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
                                    return GetBlockV1ResponsePB.deserialize(bytes);
                                }
                            }
                            besu.GetBlockV1ResponsePB = GetBlockV1ResponsePB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0X2Jsb2NrX3YxX3Jlc3BvbnNlX3BiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9nZW5lcmF0ZWQvcHJvdG8vcHJvdG9jLWdlbi10cy9tb2RlbHMvZ2V0X2Jsb2NrX3YxX3Jlc3BvbnNlX3BiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUEsNkRBQStDO0FBQy9DLHNEQUF3QztBQUN4QyxJQUFpQixHQUFHLENBdUVuQjtBQXZFRCxXQUFpQixHQUFHO0lBQUMsSUFBQSxXQUFXLENBdUUvQjtJQXZFb0IsV0FBQSxXQUFXO1FBQUMsSUFBQSxLQUFLLENBdUVyQztRQXZFZ0MsV0FBQSxLQUFLO1lBQUMsSUFBQSxNQUFNLENBdUU1QztZQXZFc0MsV0FBQSxNQUFNO2dCQUFDLElBQUEsTUFBTSxDQXVFbkQ7Z0JBdkU2QyxXQUFBLE1BQU07b0JBQUMsSUFBQSxTQUFTLENBdUU3RDtvQkF2RW9ELFdBQUEsU0FBUzt3QkFBQyxJQUFBLElBQUksQ0F1RWxFO3dCQXZFOEQsV0FBQSxJQUFJOzRCQUMvRCxNQUFhLG9CQUFxQixTQUFRLElBQUksQ0FBQyxPQUFPO2dDQUNsRCxhQUFhLEdBQWUsRUFBRSxDQUFDO2dDQUMvQixZQUFZLElBRVg7b0NBQ0csS0FBSyxFQUFFLENBQUM7b0NBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29DQUM5RixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLElBQUksSUFBSSxRQUFR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