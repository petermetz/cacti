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
const dependency_2 = __importStar(require("./evm_log_pb"));
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
                            class GetPastLogsV1ResponsePB extends pb_1.Message {
                                #one_of_decls = [];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [3327407], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") {
                                        if ("logs" in data && data.logs != undefined) {
                                            this.logs = data.logs;
                                        }
                                    }
                                }
                                get logs() {
                                    return pb_1.Message.getRepeatedWrapperField(this, dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmLogPB, 3327407);
                                }
                                set logs(value) {
                                    pb_1.Message.setRepeatedWrapperField(this, 3327407, value);
                                }
                                static fromObject(data) {
                                    const message = new GetPastLogsV1ResponsePB({});
                                    if (data.logs != null) {
                                        message.logs = data.logs.map(item => dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmLogPB.fromObject(item));
                                    }
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    if (this.logs != null) {
                                        data.logs = this.logs.map((item) => item.toObject());
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.logs.length)
                                        writer.writeRepeatedMessage(3327407, this.logs, (item) => item.serialize(writer));
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new GetPastLogsV1ResponsePB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
                                            case 3327407:
                                                reader.readMessage(message.logs, () => pb_1.Message.addToRepeatedWrapperField(message, 3327407, dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmLogPB.deserialize(reader), dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmLogPB));
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
                                    return GetPastLogsV1ResponsePB.deserialize(bytes);
                                }
                            }
                            besu.GetPastLogsV1ResponsePB = GetPastLogsV1ResponsePB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0X3Bhc3RfbG9nc192MV9yZXNwb25zZV9wYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvZ2VuZXJhdGVkL3Byb3RvL3Byb3RvYy1nZW4tdHMvbW9kZWxzL2dldF9wYXN0X2xvZ3NfdjFfcmVzcG9uc2VfcGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNQSwyREFBNkM7QUFDN0Msc0RBQXdDO0FBQ3hDLElBQWlCLEdBQUcsQ0FvRW5CO0FBcEVELFdBQWlCLEdBQUc7SUFBQyxJQUFBLFdBQVcsQ0FvRS9CO0lBcEVvQixXQUFBLFdBQVc7UUFBQyxJQUFBLEtBQUssQ0FvRXJDO1FBcEVnQyxXQUFBLEtBQUs7WUFBQyxJQUFBLE1BQU0sQ0FvRTVDO1lBcEVzQyxXQUFBLE1BQU07Z0JBQUMsSUFBQSxNQUFNLENBb0VuRDtnQkFwRTZDLFdBQUEsTUFBTTtvQkFBQyxJQUFBLFNBQVMsQ0FvRTdEO29CQXBFb0QsV0FBQSxTQUFTO3dCQUFDLElBQUEsSUFBSSxDQW9FbEU7d0JBcEU4RCxXQUFBLElBQUk7NEJBQy9ELE1BQWEsdUJBQXdCLFNBQVEsSUFBSSxDQUFDLE9BQU87Z0NBQ3JELGFBQWEsR0FBZSxFQUFFLENBQUM7Z0NBQy9CLFlBQVksSUFFWDtvQ0FDRyxLQUFLLEVBQUUsQ0FBQztvQ0FDUixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO29DQUNyRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxP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