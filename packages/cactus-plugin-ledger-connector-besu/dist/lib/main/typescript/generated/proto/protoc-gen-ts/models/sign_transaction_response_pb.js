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
                            class SignTransactionResponsePB extends pb_1.Message {
                                #one_of_decls = [];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") {
                                        if ("signature" in data && data.signature != undefined) {
                                            this.signature = data.signature;
                                        }
                                    }
                                }
                                get signature() {
                                    return pb_1.Message.getFieldWithDefault(this, 536713401, "");
                                }
                                set signature(value) {
                                    pb_1.Message.setField(this, 536713401, value);
                                }
                                static fromObject(data) {
                                    const message = new SignTransactionResponsePB({});
                                    if (data.signature != null) {
                                        message.signature = data.signature;
                                    }
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    if (this.signature != null) {
                                        data.signature = this.signature;
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.signature.length)
                                        writer.writeString(536713401, this.signature);
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new SignTransactionResponsePB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
                                            case 536713401:
                                                message.signature = reader.readString();
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
                                    return SignTransactionResponsePB.deserialize(bytes);
                                }
                            }
                            besu.SignTransactionResponsePB = SignTransactionResponsePB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbl90cmFuc2FjdGlvbl9yZXNwb25zZV9wYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvZ2VuZXJhdGVkL3Byb3RvL3Byb3RvYy1nZW4tdHMvbW9kZWxzL3NpZ25fdHJhbnNhY3Rpb25fcmVzcG9uc2VfcGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNQSxzREFBd0M7QUFDeEMsSUFBaUIsR0FBRyxDQW9FbkI7QUFwRUQsV0FBaUIsR0FBRztJQUFDLElBQUEsV0FBVyxDQW9FL0I7SUFwRW9CLFdBQUEsV0FBVztRQUFDLElBQUEsS0FBSyxDQW9FckM7UUFwRWdDLFdBQUEsS0FBSztZQUFDLElBQUEsTUFBTSxDQW9FNUM7WUFwRXNDLFdBQUEsTUFBTTtnQkFBQyxJQUFBLE1BQU0sQ0FvRW5EO2dCQXBFNkMsV0FBQSxNQUFNO29CQUFDLElBQUEsU0FBUyxDQW9FN0Q7b0JBcEVvRCxXQUFBLFNBQVM7d0JBQUMsSUFBQSxJQUFJLENBb0VsRTt3QkFwRThELFdBQUEsSUFBSTs0QkFDL0QsTUFBYSx5QkFBMEIsU0FBUSxJQUFJLENBQUMsT0FBTztnQ0FDdkQsYUFBYSxHQUFlLEVBQUUsQ0FBQztnQ0FDL0IsWUFBWSxJQUVYO29DQUNHLEtBQUssRUFBRSxDQUFDO29DQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztvQ0FDOUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxJQUFJLElBQUksUUFBUSxFQUFF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