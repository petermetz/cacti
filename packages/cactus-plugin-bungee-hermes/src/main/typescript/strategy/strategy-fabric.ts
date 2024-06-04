import {
  FabricSigningCredential,
  DefaultApi as FabricApi,
  Configuration,
  FabricContractInvocationType,
  RunTransactionRequest,
  PluginLedgerConnectorFabric,
} from "@hyperledger/cactus-plugin-ledger-connector-fabric";
import { NetworkDetails, ObtainLedgerStrategy } from "./obtain-ledger-strategy";
import {
  Checks,
  LogLevelDesc,
  Logger,
  LoggerProvider,
} from "@hyperledger/cactus-common";
import { Transaction } from "../view-creation/transaction";
import { State } from "../view-creation/state";
import { StateProof } from "../view-creation/state-proof";
import { Proof } from "../view-creation/proof";
import { TransactionProof } from "../view-creation/transaction-proof";

export interface FabricNetworkDetails extends NetworkDetails {
  signingCredential: FabricSigningCredential;
  contractName: string;
  channelName: string;
}
export class StrategyFabric implements ObtainLedgerStrategy {
  public static readonly CLASS_NAME = "StrategyFabric";

  public log: Logger;

  constructor(level: LogLevelDesc) {
    this.log = LoggerProvider.getOrCreate({
      label: StrategyFabric.CLASS_NAME,
      level,
    });
  }

  public async generateLedgerStates(
    stateIds: string[],
    networkDetails: FabricNetworkDetails,
  ): Promise<Map<string, State>> {
    const fnTag = `${StrategyFabric.CLASS_NAME}#generateLedgerStates()`;
    this.log.debug(`Generating ledger snapshot`);
    Checks.truthy(networkDetails, `${fnTag} networkDetails`);

    let fabricApi: FabricApi | undefined;
    let connector: PluginLedgerConnectorFabric | undefined;

    if (networkDetails.connector) {
      connector = networkDetails.connector as PluginLedgerConnectorFabric;
    } else if (networkDetails.connectorApiPath) {
      const config = new Configuration({
        basePath: networkDetails.connectorApiPath,
      });
      fabricApi = new FabricApi(config);
    } else {
      throw new Error(
        `${StrategyFabric.CLASS_NAME}#generateLedgerStates: networkDetails must have either connector or connectorApiPath`,
      );
    }

    const assetsKey =
      stateIds.length == 0
        ? (
            await this.getAllAssetsKey(networkDetails, connector, fabricApi)
          ).split(",")
        : stateIds;
    const ledgerStates = new Map<string, State>();
    //For each key in ledgerAssetsKey
    for (const assetKey of assetsKey) {
      const assetValues: string[] = [];
      const txWithTimeS: Transaction[] = [];

      const txs = await this.getAllTxByKey(
        networkDetails,
        assetKey,
        connector,
        fabricApi,
      );
      //For each tx get receipt
      let last_receipt;
      for (const tx of txs) {
        const receipt = JSON.parse(
          await this.fabricGetTxReceiptByTxIDV1(
            networkDetails,
            tx.getId(),
            connector,
            fabricApi,
          ),
        );
        tx.getProof().setCreator(
          new Proof({
            creator: receipt.transactionCreator.creatorID,
            mspid: receipt.transactionCreator.mspid,
          }),
        );
        assetValues.push(JSON.parse(receipt.rwsetWriteData).Value.toString());
        tx.setStateId(assetKey);
        tx.setTarget(receipt.channelID + ": " + receipt.chainCodeName);

        for (const endorsement of receipt.transactionEndorsement) {
          const signature64 = Buffer.from(endorsement.signature).toString(
            "base64",
          );
          tx.addEndorser(
            new Proof({
              mspid: endorsement.mspid,
              creator: endorsement.endorserID,
              signature: signature64,
            }),
          );
        }
        txWithTimeS.push(tx);
        last_receipt = receipt;
      }
      const block = await this.fabricGetBlockByTxID(
        networkDetails,
        txs[txs.length - 1].getId(),
        connector,
        fabricApi,
      );
      const state = new State(assetKey, assetValues, txWithTimeS);
      ledgerStates.set(assetKey, state);
      const stateProof = new StateProof(
        state.getValue(),
        parseInt(state.getVersion()),
        state.getId(),
      );
      //only adding last block for each state, in the state proof
      stateProof.addBlock({
        blockHash: block.hash,
        blockCreator: JSON.stringify({
          mspid: last_receipt.blockMetaData.mspid,
          id: last_receipt.blockMetaData.blockCreatorID,
        }),
        blockSigners: block.signers,
      });

      state.setStateProof([stateProof]);
    }
    return ledgerStates;
  }

  async fabricGetTxReceiptByTxIDV1(
    networkDetails: FabricNetworkDetails,
    transactionId: string,
    connector: PluginLedgerConnectorFabric | undefined,
    api: FabricApi | undefined,
  ): Promise<string> {
    const parameters = {
      signingCredential: networkDetails.signingCredential,
      channelName: networkDetails.channelName,
      contractName: "qscc",
      invocationType: FabricContractInvocationType.Call,
      methodName: "GetBlockByTxID",
      params: [networkDetails.channelName, transactionId],
    } as RunTransactionRequest;

    if (connector) {
      const receiptLockRes =
        await connector.getTransactionReceiptByTxID(parameters);
      if (receiptLockRes) {
        return JSON.stringify(receiptLockRes);
      } else {
        throw new Error(
          `${StrategyFabric.CLASS_NAME}#fabricGetTxReceiptByTxIDV1: contract qscc method GetBlockByTxID invocation output is falsy`,
        );
      }
    } else if (api) {
      const receiptLockRes =
        await api.getTransactionReceiptByTxIDV1(parameters);
      if (receiptLockRes.status >= 200 && receiptLockRes.status < 300) {
        if (receiptLockRes.data) {
          return JSON.stringify(receiptLockRes.data);
        } else {
          throw new Error(
            `${StrategyFabric.CLASS_NAME}#fabricGetTxReceiptByTxIDV1: contract qscc method GetBlockByTxID invocation output is falsy`,
          );
        }
      }
      throw new Error(
        `${StrategyFabric.CLASS_NAME}#fabricGetTxReceiptByTxIDV1: FabricAPI error with status 500: ` +
          receiptLockRes.data,
      );
    } else {
      throw new Error(
        `${StrategyFabric.CLASS_NAME}#fabricGetTxReceiptByTxIDV1: FabricAPI or Connector were not defined`,
      );
    }
  }

  async fabricGetBlockByTxID(
    networkDetails: FabricNetworkDetails,
    txId: string,
    connector: PluginLedgerConnectorFabric | undefined,
    api: FabricApi | undefined,
  ): Promise<{ hash: string; signers: string[] }> {
    const gatewayOptions = {
      identity: networkDetails.signingCredential.keychainRef,
      wallet: {
        keychain: {
          keychainId: networkDetails.signingCredential.keychainId,
          keychainRef: networkDetails.signingCredential.keychainRef,
        },
      },
    };
    const getBlockReq = {
      channelName: networkDetails.channelName as string,
      gatewayOptions,
      query: {
        transactionId: txId,
      },
      skipDecode: false,
    };

    let data;

    if (connector) {
      const getBlockResponse = await connector.getBlock(getBlockReq);
      if (getBlockResponse) {
        data = getBlockResponse;
      } else {
        throw new Error(
          `${StrategyFabric.CLASS_NAME}#fabricGetBlockByTxID: getBlockV1 API call output data is falsy`,
        );
      }
    } else if (api) {
      const getBlockResponse = await api.getBlockV1(getBlockReq);

      if (getBlockResponse.status < 200 || getBlockResponse.status >= 300) {
        throw new Error(
          `${StrategyFabric.CLASS_NAME}#fabricGetTxReceiptByTxIDV1: FabricAPI getBlockV1 error with status ${getBlockResponse.status}: ` +
            getBlockResponse.data,
        );
      }
      if (!getBlockResponse.data) {
        throw new Error(
          `${StrategyFabric.CLASS_NAME}#fabricGetBlockByTxID: getBlockV1 API call output data is falsy`,
        );
      }
      data = getBlockResponse.data;
    } else {
      throw new Error(
        `${StrategyFabric.CLASS_NAME}#fabricGetBlockByTxID: FabricAPI or Connector were not defined`,
      );
    }

    const block = JSON.parse(JSON.stringify(data)).decodedBlock;

    const blockSig = block.metadata.metadata[0].signatures;
    const sigs = [];
    for (const sig of blockSig) {
      const decoded = {
        creator: {
          mspid: sig.signature_header.creator.mspid,
          id: Buffer.from(sig.signature_header.creator.id_bytes.data).toString(
            "hex",
          ),
        },
        signature: Buffer.from(sig.signature.data).toString("hex"),
      };
      sigs.push(JSON.stringify(decoded));
    }
    return {
      hash: Buffer.from(block.header.data_hash.data).toString("hex"),
      signers: sigs,
    };
  }

  async getAllAssetsKey(
    networkDetails: FabricNetworkDetails,
    connector: PluginLedgerConnectorFabric | undefined,
    api: FabricApi | undefined,
  ): Promise<string> {
    const parameters = {
      signingCredential: networkDetails.signingCredential,
      channelName: networkDetails.channelName,
      contractName: networkDetails.contractName,
      methodName: "GetAllAssetsKey",
      invocationType: FabricContractInvocationType.Call,
      params: [],
    } as RunTransactionRequest;
    if (connector) {
      const response = await connector.transact(parameters);
      if (response.functionOutput) {
        return response.functionOutput;
      } else {
        throw new Error(
          `${StrategyFabric.CLASS_NAME}#getAllAssetsKey: contract ${networkDetails.contractName} method GetAllAssetsKey invocation output is falsy`,
        );
      }
    } else if (api) {
      const response = await api.runTransactionV1(parameters);

      if (response.status >= 200 && response.status < 300) {
        if (response.data.functionOutput) {
          return response.data.functionOutput;
        } else {
          throw new Error(
            `${StrategyFabric.CLASS_NAME}#getAllAssetsKey: contract ${networkDetails.contractName} method GetAllAssetsKey invocation output is falsy`,
          );
        }
      }
      throw new Error(
        `${StrategyFabric.CLASS_NAME}#getAllAssetsKey: FabricAPI error with status 500: ` +
          response.data,
      );
    } else {
      throw new Error(
        `${StrategyFabric.CLASS_NAME}#fabricGetBlockByTxID: FabricAPI or Connector were not defined`,
      );
    }
  }

  async getAllTxByKey(
    networkDetails: FabricNetworkDetails,
    key: string,
    connector: PluginLedgerConnectorFabric | undefined,
    api: FabricApi | undefined,
  ): Promise<Transaction[]> {
    const parameters = {
      signingCredential: networkDetails.signingCredential,
      channelName: networkDetails.channelName,
      contractName: networkDetails.contractName,
      methodName: "GetAllTxByKey",
      invocationType: FabricContractInvocationType.Call,
      params: [key],
    } as RunTransactionRequest;

    if (connector) {
      const response = await connector.transact(parameters);
      if (response.functionOutput) {
        return this.txsStringToTxs(response.functionOutput);
      } else {
        throw new Error(
          `${StrategyFabric.CLASS_NAME}#getAllTxByKey: contract ${networkDetails.contractName} method GetAllTxByKey invocation output is falsy`,
        );
      }
    } else if (api) {
      const response = await api.runTransactionV1(parameters);

      if (response.status >= 200 && response.status < 300) {
        if (response.data.functionOutput) {
          return this.txsStringToTxs(response.data.functionOutput);
        } else {
          throw new Error(
            `${StrategyFabric.CLASS_NAME}#getAllTxByKey: contract ${networkDetails.contractName} method GetAllTxByKey invocation output is falsy`,
          );
        }
      }
      throw new Error(
        `${StrategyFabric.CLASS_NAME}#getAllTxByKey: FabricAPI error with status 500: ` +
          response.data,
      );
    } else {
      throw new Error(
        `${StrategyFabric.CLASS_NAME}#getAllTxByKey: FabricAPI or Connector were not defined`,
      );
    }
  }

  // Receive transactions in string format and parses to Transaction []
  txsStringToTxs(txString: string): Transaction[] {
    const transactions: Transaction[] = [];
    const txs = JSON.parse(txString);
    for (const tx of txs) {
      const txId = tx.value.txId;
      const ts = tx.value.timestamp.seconds;
      const transaction = new Transaction(
        txId,
        ts,
        new TransactionProof(new Proof({ creator: "" }), txId), //transaction proof details are set in function 'generateLedgerStates'
      );
      transaction.setPayload(JSON.stringify(tx.value));
      transactions.push(transaction);
    }
    return transactions.reverse();
  }
}
