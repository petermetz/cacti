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
const dependency_2 = __importStar(require("./besu_private_transaction_config_pb"));
const dependency_3 = __importStar(require("./besu_transaction_config_pb"));
const dependency_4 = __importStar(require("./consistency_strategy_pb"));
const dependency_5 = __importStar(require("./web3_signing_credential_pb"));
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
                            class RunTransactionRequestPB extends pb_1.Message {
                                #one_of_decls = [];
                                constructor(data) {
                                    super();
                                    pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [], this.#one_of_decls);
                                    if (!Array.isArray(data) && typeof data == "object") {
                                        if ("web3SigningCredential" in data && data.web3SigningCredential != undefined) {
                                            this.web3SigningCredential = data.web3SigningCredential;
                                        }
                                        if ("transactionConfig" in data && data.transactionConfig != undefined) {
                                            this.transactionConfig = data.transactionConfig;
                                        }
                                        if ("consistencyStrategy" in data && data.consistencyStrategy != undefined) {
                                            this.consistencyStrategy = data.consistencyStrategy;
                                        }
                                        if ("privateTransactionConfig" in data && data.privateTransactionConfig != undefined) {
                                            this.privateTransactionConfig = data.privateTransactionConfig;
                                        }
                                    }
                                }
                                get web3SigningCredential() {
                                    return pb_1.Message.getWrapperField(this, dependency_5.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialPB, 451211679);
                                }
                                set web3SigningCredential(value) {
                                    pb_1.Message.setWrapperField(this, 451211679, value);
                                }
                                get has_web3SigningCredential() {
                                    return pb_1.Message.getField(this, 451211679) != null;
                                }
                                get transactionConfig() {
                                    return pb_1.Message.getWrapperField(this, dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigPB, 478618563);
                                }
                                set transactionConfig(value) {
                                    pb_1.Message.setWrapperField(this, 478618563, value);
                                }
                                get has_transactionConfig() {
                                    return pb_1.Message.getField(this, 478618563) != null;
                                }
                                get consistencyStrategy() {
                                    return pb_1.Message.getWrapperField(this, dependency_4.org.hyperledger.cacti.plugin.ledger.connector.besu.ConsistencyStrategyPB, 86789548);
                                }
                                set consistencyStrategy(value) {
                                    pb_1.Message.setWrapperField(this, 86789548, value);
                                }
                                get has_consistencyStrategy() {
                                    return pb_1.Message.getField(this, 86789548) != null;
                                }
                                get privateTransactionConfig() {
                                    return pb_1.Message.getWrapperField(this, dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuPrivateTransactionConfigPB, 276796542);
                                }
                                set privateTransactionConfig(value) {
                                    pb_1.Message.setWrapperField(this, 276796542, value);
                                }
                                get has_privateTransactionConfig() {
                                    return pb_1.Message.getField(this, 276796542) != null;
                                }
                                static fromObject(data) {
                                    const message = new RunTransactionRequestPB({});
                                    if (data.web3SigningCredential != null) {
                                        message.web3SigningCredential = dependency_5.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialPB.fromObject(data.web3SigningCredential);
                                    }
                                    if (data.transactionConfig != null) {
                                        message.transactionConfig = dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigPB.fromObject(data.transactionConfig);
                                    }
                                    if (data.consistencyStrategy != null) {
                                        message.consistencyStrategy = dependency_4.org.hyperledger.cacti.plugin.ledger.connector.besu.ConsistencyStrategyPB.fromObject(data.consistencyStrategy);
                                    }
                                    if (data.privateTransactionConfig != null) {
                                        message.privateTransactionConfig = dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuPrivateTransactionConfigPB.fromObject(data.privateTransactionConfig);
                                    }
                                    return message;
                                }
                                toObject() {
                                    const data = {};
                                    if (this.web3SigningCredential != null) {
                                        data.web3SigningCredential = this.web3SigningCredential.toObject();
                                    }
                                    if (this.transactionConfig != null) {
                                        data.transactionConfig = this.transactionConfig.toObject();
                                    }
                                    if (this.consistencyStrategy != null) {
                                        data.consistencyStrategy = this.consistencyStrategy.toObject();
                                    }
                                    if (this.privateTransactionConfig != null) {
                                        data.privateTransactionConfig = this.privateTransactionConfig.toObject();
                                    }
                                    return data;
                                }
                                serialize(w) {
                                    const writer = w || new pb_1.BinaryWriter();
                                    if (this.has_web3SigningCredential)
                                        writer.writeMessage(451211679, this.web3SigningCredential, () => this.web3SigningCredential.serialize(writer));
                                    if (this.has_transactionConfig)
                                        writer.writeMessage(478618563, this.transactionConfig, () => this.transactionConfig.serialize(writer));
                                    if (this.has_consistencyStrategy)
                                        writer.writeMessage(86789548, this.consistencyStrategy, () => this.consistencyStrategy.serialize(writer));
                                    if (this.has_privateTransactionConfig)
                                        writer.writeMessage(276796542, this.privateTransactionConfig, () => this.privateTransactionConfig.serialize(writer));
                                    if (!w)
                                        return writer.getResultBuffer();
                                }
                                static deserialize(bytes) {
                                    const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new RunTransactionRequestPB();
                                    while (reader.nextField()) {
                                        if (reader.isEndGroup())
                                            break;
                                        switch (reader.getFieldNumber()) {
                                            case 451211679:
                                                reader.readMessage(message.web3SigningCredential, () => message.web3SigningCredential = dependency_5.org.hyperledger.cacti.plugin.ledger.connector.besu.Web3SigningCredentialPB.deserialize(reader));
                                                break;
                                            case 478618563:
                                                reader.readMessage(message.transactionConfig, () => message.transactionConfig = dependency_3.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuTransactionConfigPB.deserialize(reader));
                                                break;
                                            case 86789548:
                                                reader.readMessage(message.consistencyStrategy, () => message.consistencyStrategy = dependency_4.org.hyperledger.cacti.plugin.ledger.connector.besu.ConsistencyStrategyPB.deserialize(reader));
                                                break;
                                            case 276796542:
                                                reader.readMessage(message.privateTransactionConfig, () => message.privateTransactionConfig = dependency_2.org.hyperledger.cacti.plugin.ledger.connector.besu.BesuPrivateTransactionConfigPB.deserialize(reader));
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
                                    return RunTransactionRequestPB.deserialize(bytes);
                                }
                            }
                            besu.RunTransactionRequestPB = RunTransactionRequestPB;
                        })(besu = connector.besu || (connector.besu = {}));
                    })(connector = ledger.connector || (ledger.connector = {}));
                })(ledger = plugin.ledger || (plugin.ledger = {}));
            })(plugin = cacti.plugin || (cacti.plugin = {}));
        })(cacti = hyperledger.cacti || (hyperledger.cacti = {}));
    })(hyperledger = org.hyperledger || (org.hyperledger = {}));
})(org || (exports.org = org = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuX3RyYW5zYWN0aW9uX3JlcXVlc3RfcGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2dlbmVyYXRlZC9wcm90by9wcm90b2MtZ2VuLXRzL21vZGVscy9ydW5fdHJhbnNhY3Rpb25fcmVxdWVzdF9wYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLG1GQUFxRTtBQUNyRSwyRUFBNkQ7QUFDN0Qsd0VBQTBEO0FBQzFELDJFQUE2RDtBQUM3RCxzREFBd0M7QUFDeEMsSUFBaUIsR0FBRyxDQXFKbkI7QUFySkQsV0FBaUIsR0FBRztJQUFDLElBQUEsV0FBVyxDQXFKL0I7SUFySm9CLFdBQUEsV0FBVztRQUFDLElBQUEsS0FBSyxDQXFKckM7UUFySmdDLFdBQUEsS0FBSztZQUFDLElBQUEsTUFBTSxDQXFKNUM7WUFySnNDLFdBQUEsTUFBTTtnQkFBQyxJQUFBLE1BQU0sQ0FxSm5EO2dCQXJKNkMsV0FBQSxNQUFNO29CQUFDLElBQUEsU0FBUyxDQXFKN0Q7b0JBckpvRCxXQUFBLFNBQVM7d0JBQUMsSUFBQSxJQUFJLENBcUpsRTt3QkFySjhELFdBQUEsSUFBSTs0QkFDL0QsTUFBYSx1QkFBd0IsU0FBUSxJQUFJLENBQUMsT0FBTztnQ0FDckQsYUFBYSxHQUFlLEVBQUUsQ0FBQztnQ0FDL0IsWUFBWSxJQUtYO29DQUNHLEtBQUssRUFBRSxDQUFDO29DQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztvQ0FDOUYsSUFBSSxDQUFDLEtBQUssQ0FBQyxP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