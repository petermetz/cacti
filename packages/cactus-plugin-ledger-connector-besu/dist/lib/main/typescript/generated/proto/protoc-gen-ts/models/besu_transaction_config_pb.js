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
const dependency_2 = __importStar(require("./besu_transaction_config_to_pb"));
const dependency_3 = __importStar(require("./web3_block_header_timestamp_pb"));
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
                            class BesuTransactionConfigPB extends pb_1.Message {
                                #one_of_decls = [];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") {
                                        if ("rawTransaction" in data && data.rawTransaction != undefined) {
                                            this.rawTransaction = data.rawTransaction;
                                        }
                                        if ("from" in data && data.from != undefined) {
                                            this.from = data.from;
                                        }
                                        if ("to" in data && data.to != undefined) {
                                            this.to = data.to;
                                        }
                                        if ("value" in data && data.value != undefined) {
                                            this.value = data.value;
                                        }
                                        if ("gas" in data && data.gas != undefined) {
                                            this.gas = data.gas;
                                        }
                                        if ("gasPrice" in data && data.gasPrice != undefined) {
                                            this.gasPrice = data.gasPrice;
                                        }
                                        if ("nonce" in data && data.nonce != undefined) {
                                            this.nonce = data.nonce;
                                        }
                                        if ("data" in data && data.data != undefined) {
                                            this.data = data.data;
                                        }
                                    }
                                }
                                get rawTransaction() {
                                    return pb_1.Message.getFieldWithDefault(this, 185047449, "");
                                }
                                set rawTransaction(value) {
                                    pb_1.Message.setField(this, 185047449, value);
                                }
                                get from() {
                                    return pb_1.Message.getWrapperField(this, dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB, 3151786);
                                }
                                set from(value) {
                                    pb_1.Message.setWrapperField(this, 3151786, value);
                                }
                                get has_from() {
                                    return pb_1.Message.getField(this, 3151786) != null;
                                }
                                get to() {
                                    return pb_1.Message.getWrapperField(this, dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigToPB, 3707);
                                }
                                set to(value) {
                                    pb_1.Message.setWrapperField(this, 3707, value);
                                }
                                get has_to() {
                                    return pb_1.Message.getField(this, 3707) != null;
                                }
                                get value() {
                                    return pb_1.Message.getWrapperField(this, dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB, 111972721);
                                }
                                set value(value) {
                                    pb_1.Message.setWrapperField(this, 111972721, value);
                                }
                                get has_value() {
                                    return pb_1.Message.getField(this, 111972721) != null;
                                }
                                get gas() {
                                    return pb_1.Message.getWrapperField(this, dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB, 102105);
                                }
                                set gas(value) {
                                    pb_1.Message.setWrapperField(this, 102105, value);
                                }
                                get has_gas() {
                                    return pb_1.Message.getField(this, 102105) != null;
                                }
                                get gasPrice() {
                                    return pb_1.Message.getWrapperField(this, dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB, 5271059);
                                }
                                set gasPrice(value) {
                                    pb_1.Message.setWrapperField(this, 5271059, value);
                                }
                                get has_gasPrice() {
                                    return pb_1.Message.getField(this, 5271059) != null;
                                }
                                get nonce() {
                                    return pb_1.Message.getFieldWithDefault(this, 105002991, 0);
                                }
                                set nonce(value) {
                                    pb_1.Message.setField(this, 105002991, value);
                                }
                                get data() {
                                    return pb_1.Message.getWrapperField(this, dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigToPB, 3076010);
                                }
                                set data(value) {
                                    pb_1.Message.setWrapperField(this, 3076010, value);
                                }
                                get has_data() {
                                    return pb_1.Message.getField(this, 3076010) != null;
                                }
                                static fromObject(data) {
                                    const message = new BesuTransactionConfigPB({});
                                    if (data.rawTransaction != null) {
                                        message.rawTransaction = data.rawTransaction;
                                    }
                                    if (data.from != null) {
                                        message.from = dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.fromObject(data.from);
                                    }
                                    if (data.to != null) {
                                        message.to = dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigToPB.fromObject(data.to);
                                    }
                                    if (data.value != null) {
                                        message.value = dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.fromObject(data.value);
                                    }
                                    if (data.gas != null) {
                                        message.gas = dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.fromObject(data.gas);
                                    }
                                    if (data.gasPrice != null) {
                                        message.gasPrice = dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.fromObject(data.gasPrice);
                                    }
                                    if (data.nonce != null) {
                                        message.nonce = data.nonce;
                                    }
                                    if (data.data != null) {
                                        message.data = dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigToPB.fromObject(data.data);
                                    }
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    if (this.rawTransaction != null) {
                                        data.rawTransaction = this.rawTransaction;
                                    }
                                    if (this.from != null) {
                                        data.from = this.from.toObject();
                                    }
                                    if (this.to != null) {
                                        data.to = this.to.toObject();
                                    }
                                    if (this.value != null) {
                                        data.value = this.value.toObject();
                                    }
                                    if (this.gas != null) {
                                        data.gas = this.gas.toObject();
                                    }
                                    if (this.gasPrice != null) {
                                        data.gasPrice = this.gasPrice.toObject();
                                    }
                                    if (this.nonce != null) {
                                        data.nonce = this.nonce;
                                    }
                                    if (this.data != null) {
                                        data.data = this.data.toObject();
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.rawTransaction.length)
                                        writer.writeString(185047449, this.rawTransaction);
                                    if (this.has_from)
                                        writer.writeMessage(3151786, this.from, () => this.from.serialize(writer));
                                    if (this.has_to)
                                        writer.writeMessage(3707, this.to, () => this.to.serialize(writer));
                                    if (this.has_value)
                                        writer.writeMessage(111972721, this.value, () => this.value.serialize(writer));
                                    if (this.has_gas)
                                        writer.writeMessage(102105, this.gas, () => this.gas.serialize(writer));
                                    if (this.has_gasPrice)
                                        writer.writeMessage(5271059, this.gasPrice, () => this.gasPrice.serialize(writer));
                                    if (this.nonce != 0)
                                        writer.writeFloat(105002991, this.nonce);
                                    if (this.has_data)
                                        writer.writeMessage(3076010, this.data, () => this.data.serialize(writer));
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new BesuTransactionConfigPB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
                                            case 185047449:
                                                message.rawTransaction = reader.readString();
                                                break;
                                            case 3151786:
                                                reader.readMessage(message.from, () => message.from = dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.deserialize(reader));
                                                break;
                                            case 3707:
                                                reader.readMessage(message.to, () => message.to = dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigToPB.deserialize(reader));
                                                break;
                                            case 111972721:
                                                reader.readMessage(message.value, () => message.value = dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.deserialize(reader));
                                                break;
                                            case 102105:
                                                reader.readMessage(message.gas, () => message.gas = dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.deserialize(reader));
                                                break;
                                            case 5271059:
                                                reader.readMessage(message.gasPrice, () => message.gasPrice = dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3BlockHeaderTimestampPB.deserialize(reader));
                                                break;
                                            case 105002991:
                                                message.nonce = reader.readFloat();
                                                break;
                                            case 3076010:
                                                reader.readMessage(message.data, () => message.data = dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigToPB.deserialize(reader));
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
                                    return BesuTransactionConfigPB.deserialize(bytes);
                                }
                            }
                            besu.BesuTransactionConfigPB = BesuTransactionConfigPB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVzdV90cmFuc2FjdGlvbl9jb25maWdfcGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2dlbmVyYXRlZC9wcm90by9wcm90b2MtZ2VuLXRzL21vZGVscy9iZXN1X3RyYW5zYWN0aW9uX2NvbmZpZ19wYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLDhFQUFnRTtBQUNoRSwrRUFBaUU7QUFDakUsc0RBQXdDO0FBQ3hDLElBQWlCLEdBQUcsQ0F1UG5CO0FBdlBELFdBQWlCLEdBQUc7SUFBQyxJQUFBLFdBQVcsQ0F1UC9CO0lBdlBvQixXQUFBLFdBQVc7UUFBQyxJQUFBLEtBQUssQ0F1UHJDO1FBdlBnQyxXQUFBLEtBQUs7WUFBQyxJQUFBLE1BQU0sQ0F1UDVDO1lBdlBzQyxXQUFBLE1BQU07Z0JBQUMsSUFBQSxNQUFNLENBdVBuRDtnQkF2UDZDLFdBQUEsTUFBTTtvQkFBQyxJQUFBLFNBQVMsQ0F1UDdEO29CQXZQb0QsV0FBQSxTQUFTO3dCQUFDLElBQUEsSUFBSSxDQXVQbEU7d0JBdlA4RCxXQUFBLElBQUk7NEJBQy9ELE1BQWEsdUJBQXdCLFNBQVEsSUFBSSxDQUFDLE9BQU87Z0NBQ3JELGFBQWEsR0FBZSxFQUFFLENBQUM7Z0NBQy9CLFlBQVksSUFTWDtvQ0FDRyxLQUFLLEVBQUUsQ0FBQztvQ0FDUixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0NBQzlGLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE9B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QUFNLENBQUMsVUFBVSxFQUFFLENBQUM7Z0RBQzdDLE1BQU07NENBQ1YsS0FBSyxPQUFPO2dEQUNSLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0RBQ3RLLE1BQU07NENBQ1YsS0FBSyxJQUFJO2dEQUNMLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0RBQ2pLLE1BQU07NENBQ1YsS0FBSyxTQUFTO2dEQUNWLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0RBQ3hLLE1BQU07NENBQ1YsS0FBSyxNQUFNO2dEQUNQLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0RBQ3BLLE1BQU07NENBQ1YsS0FBSyxPQUFPO2dEQUNSLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0RBQzlLLE1BQU07NENBQ1YsS0FBSyxTQUFTO2dEQUNWLE9BQU8sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dEQUNuQyxNQUFNOzRDQUNWLEtBQUssT0FBTztnREFDUixNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dEQUNySyxNQUFNOzRDQUNWLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzt3Q0FDaEMsQ0FBQztvQ0FDTCxDQUFDO29DQUNELE9BQU8sT0FBTyxDQUFDO2dDQUNuQixDQUFDO2dDQUNELGVBQWU7b0NBQ1gsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7Z0NBQzVCLENBQUM7Z0NBQ0QsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQWlCO29DQUN0QyxPQUFPLHVCQUF1QixDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQ0FDdEQsQ0FBQzs2QkFDSjs0QkFyUFksNEJBQXVCLDBCQXFQbkMsQ0FBQTt3QkFDTCxDQUFDLEVBdlA4RCxJQUFJLEdBQUosY0FBSSxLQUFKLGNBQUksUUF1UGxFO29CQUFELENBQUMsRUF2UG9ELFNBQVMsR0FBVCxnQkFBUyxLQUFULGdCQUFTLFFBdVA3RDtnQkFBRCxDQUFDLEVBdlA2QyxNQUFNLEdBQU4sYUFBTSxLQUFOLGFBQU0sUUF1UG5EO1lBQUQsQ0FBQyxFQXZQc0MsTUFBTSxHQUFOLFlBQU0sS0FBTixZQUFNLFFBdVA1QztRQUFELENBQUMsRUF2UGdDLEtBQUssR0FBTCxpQkFBSyxLQUFMLGlCQUFLLFFBdVByQztJQUFELENBQUMsRUF2UG9CLFdBQVcsR0FBWCxlQUFXLEtBQVgsZUFBVyxRQXVQL0I7QUFBRCxDQUFDLEVBdlBnQixHQUFHLG1CQUFILEdBQUcsUUF1UG5CIn0=