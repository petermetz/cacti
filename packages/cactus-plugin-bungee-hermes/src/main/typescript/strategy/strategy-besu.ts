import { NetworkDetails, ObtainLedgerStrategy } from "./obtain-ledger-strategy";
import {
  Checks,
  LogLevelDesc,
  Logger,
  LoggerProvider,
} from "@hyperledger/cactus-common";
import {
  DefaultApi as BesuApi,
  EthContractInvocationType,
  EvmBlock,
  EvmLog,
  EvmTransaction,
  GetBlockV1Request,
  GetPastLogsV1Request,
  GetTransactionV1Request,
  InvokeContractV1Request,
  PluginLedgerConnectorBesu,
  Web3SigningCredential,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { State } from "../view-creation/state";
import { StateProof } from "../view-creation/state-proof";
import { Configuration } from "@hyperledger/cactus-core-api";
import { Transaction } from "../view-creation/transaction";
import Web3 from "web3";
import { Proof } from "../view-creation/proof";
import { TransactionProof } from "../view-creation/transaction-proof";
export interface BesuNetworkDetails extends NetworkDetails {
  signingCredential: Web3SigningCredential;
  keychainId: string;
  contractName: string;
  contractAddress: string;
}

export class StrategyBesu implements ObtainLedgerStrategy {
  public static readonly CLASS_NAME = "StrategyBesu";

  public log: Logger;

  constructor(level: LogLevelDesc) {
    this.log = LoggerProvider.getOrCreate({
      label: StrategyBesu.CLASS_NAME,
      level,
    });
  }
  public async generateLedgerStates(
    stateIds: string[],
    networkDetails: BesuNetworkDetails,
  ): Promise<Map<string, State>> {
    const fnTag = `${StrategyBesu.CLASS_NAME}#generateLedgerStates()`;
    this.log.debug(`Generating ledger snapshot`);
    Checks.truthy(networkDetails, `${fnTag} networkDetails`);

    let besuApi: BesuApi | undefined;
    let connector: PluginLedgerConnectorBesu | undefined;

    if (networkDetails.connector) {
      connector = networkDetails.connector as PluginLedgerConnectorBesu;
    } else if (networkDetails.connectorApiPath) {
      const config = new Configuration({
        basePath: networkDetails.connectorApiPath,
      });
      besuApi = new BesuApi(config);
    } else {
      throw new Error(
        `${StrategyBesu.CLASS_NAME}#generateLedgerStates: networkDetails must have either connector or connectorApiPath`,
      );
    }
    const ledgerStates = new Map<string, State>();
    const assetsKey =
      stateIds.length == 0
        ? await this.getAllAssetsKey(networkDetails, connector, besuApi)
        : stateIds;
    this.log.debug("Current assets detected to capture: " + assetsKey);
    for (const assetKey of assetsKey) {
      const { transactions, values, blocks } = await this.getAllInfoByKey(
        assetKey,
        networkDetails,
        connector,
        besuApi,
      );

      const state = new State(assetKey, values, transactions);

      const stateProof = new StateProof(
        state.getValue(),
        parseInt(state.getVersion()),
        state.getId(),
      );
      const blocksHash: string[] = [];
      for (const block of blocks.values()) {
        if (blocksHash.indexOf(block.hash as string) !== -1) {
          continue;
        }
        blocksHash.push(block.hash as string);
        stateProof.addBlock({
          blockHash: block.hash as string,
          blockCreator: block.miner as string,
          blockSigners: [], // FIXME: query blocksigners (blockchain specific)
        });
      }
      state.setStateProof([stateProof]);
      ledgerStates.set(assetKey, state);
    }
    return ledgerStates;
  }

  async getAllAssetsKey(
    networkDetails: BesuNetworkDetails,
    connector: PluginLedgerConnectorBesu | undefined,
    api: BesuApi | undefined,
  ): Promise<string[]> {
    const parameters = {
      contractName: networkDetails.contractName,
      keychainId: networkDetails.keychainId,
      invocationType: EthContractInvocationType.Call,
      methodName: "getAllAssetsIDs",
      params: [],
      signingCredential: networkDetails.signingCredential,
      gas: 1000000,
    };
    const response = await this.invokeContract(
      parameters as InvokeContractV1Request,
      connector,
      api,
    );
    return response;
  }

  async getAllInfoByKey(
    key: string,
    networkDetails: BesuNetworkDetails,
    connector: PluginLedgerConnectorBesu | undefined,
    api: BesuApi | undefined,
  ): Promise<{
    transactions: Transaction[];
    values: string[];
    blocks: Map<string, EvmBlock>;
  }> {
    const req = {
      fromBlock: "earliest",
      toBlock: "latest",
      address: networkDetails.contractAddress,
      topics: [[null], [Web3.utils.keccak256(key)]], //filter logs by asset key
    };

    const decoded = await this.getPastLogs(req, connector, api);
    const transactions: Transaction[] = [];
    const blocks: Map<string, EvmBlock> = new Map<string, EvmBlock>();
    const values: string[] = [];
    this.log.debug("Getting transaction logs for asset: " + key);

    for (const log of decoded) {
      const txTx = await this.getTransaction(
        {
          transactionHash: log.transactionHash,
        } as GetTransactionV1Request,
        connector,
        api,
      );

      const txBlock = await this.getBlock(
        {
          blockHashOrBlockNumber: log.blockHash,
        } as GetBlockV1Request,
        connector,
        api,
      );

      this.log.debug(
        "Transaction: " +
          log.transactionHash +
          "\nData: " +
          JSON.stringify(log.data) +
          "\n =========== \n",
      );
      const proof = new Proof({
        creator: txTx.from as string, //no sig for besu
      });
      const transaction: Transaction = new Transaction(
        log.transactionHash,
        txBlock.timestamp,
        new TransactionProof(proof, log.transactionHash),
      );
      transaction.setStateId(key);
      transaction.setTarget(networkDetails.contractAddress as string);
      transaction.setPayload(txTx.input ? txTx.input : ""); //FIXME: payload = transaction input ?
      transactions.push(transaction);
      values.push(JSON.stringify(log.data));

      blocks.set(transaction.getId(), txBlock);
    }

    return { transactions: transactions, values: values, blocks: blocks };
  }

  async invokeContract(
    parameters: InvokeContractV1Request,
    connector: PluginLedgerConnectorBesu | undefined,
    api: BesuApi | undefined,
  ): Promise<string[]> {
    if (connector) {
      const response = await connector.invokeContract(parameters);
      if (response.callOutput) {
        return response.callOutput as string[];
      } else {
        throw new Error(
          `${StrategyBesu.CLASS_NAME}#invokeContract: contract ${parameters.contractName} method ${parameters.methodName} output is falsy`,
        );
      }
    } else if (api) {
      const response = await api.invokeContractV1(parameters);
      if (response.status >= 200 && response.status < 300) {
        if (response.data.callOutput) {
          return response.data.callOutput as string[];
        } else {
          throw new Error(
            `${StrategyBesu.CLASS_NAME}#invokeContract: contract ${parameters.contractName} method ${parameters.methodName} output is falsy`,
          );
        }
      }
      throw new Error(
        `${StrategyBesu.CLASS_NAME}#invokeContract: BesuAPI error with status ${response.status}: ` +
          response.data,
      );
    }
    throw new Error(
      `${StrategyBesu.CLASS_NAME}#invokeContract: BesuAPI or Connector were not defined`,
    );
  }

  async getPastLogs(
    req: GetPastLogsV1Request,
    connector: PluginLedgerConnectorBesu | undefined,
    api: BesuApi | undefined,
  ): Promise<EvmLog[]> {
    if (connector) {
      const response = await connector.getPastLogs(req);
      if (response.logs) {
        return response.logs;
      } else {
        throw new Error(
          `${StrategyBesu.CLASS_NAME}#getPastLogs: BesuAPI getPastLogs output is falsy`,
        );
      }
    }
    if (api) {
      const response = await api.getPastLogsV1(req);
      if (response.status < 200 || response.status >= 300) {
        throw new Error(
          `${StrategyBesu.CLASS_NAME}#getAllInfoByKey: BesuAPI getPastLogsV1 error with status ${response.status}: ` +
            response.data,
        );
      }
      if (!response.data.logs) {
        throw new Error(
          `${StrategyBesu.CLASS_NAME}#getAllInfoByKey: BesuAPI getPastLogsV1 API call successfull but output data is falsy`,
        );
      }
      return response.data.logs as EvmLog[];
    }
    throw new Error(
      `${StrategyBesu.CLASS_NAME}#getTransaction: BesuAPI or Connector were not defined`,
    );
  }

  async getTransaction(
    req: GetTransactionV1Request,
    connector: PluginLedgerConnectorBesu | undefined,
    api: BesuApi | undefined,
  ): Promise<EvmTransaction> {
    if (connector) {
      const response = await connector.getTransaction(req);
      if (response.transaction) {
        return response.transaction;
      } else {
        throw new Error(
          `${StrategyBesu.CLASS_NAME}#getTransaction: BesuAPI getTransaction output is falsy`,
        );
      }
    }
    if (api) {
      const txTx = await api.getTransactionV1(req);

      if (txTx.status < 200 || txTx.status >= 300) {
        throw new Error(
          `${StrategyBesu.CLASS_NAME}#getAllInfoByKey: BesuAPI getTransactionV1 error with status ${txTx.status}: ` +
            txTx.data,
        );
      }
      if (!txTx.data.transaction) {
        throw new Error(
          `${StrategyBesu.CLASS_NAME}#getAllInfoByKey: BesuAPI getTransactionV1 call successfull but output data is falsy`,
        );
      }
      return txTx.data.transaction;
    }
    throw new Error(
      `${StrategyBesu.CLASS_NAME}#getTransaction: BesuAPI or Connector were not defined`,
    );
  }

  async getBlock(
    req: GetBlockV1Request,
    connector: PluginLedgerConnectorBesu | undefined,
    api: BesuApi | undefined,
  ): Promise<EvmBlock> {
    if (connector) {
      const response = await connector.getBlock(req);
      if (response.block) {
        return response.block;
      } else {
        throw new Error(
          `${StrategyBesu.CLASS_NAME}#getBlock: BesuAPI getBlock output is falsy`,
        );
      }
    }
    if (api) {
      const txBlock = await api.getBlockV1(req);
      if (txBlock.status < 200 || txBlock.status >= 300) {
        throw new Error(
          `${StrategyBesu.CLASS_NAME}#getAllInfoByKey: BesuAPI getBlockV1 error with status ${txBlock.status}: ` +
            txBlock.data,
        );
      }
      if (!txBlock.data.block) {
        throw new Error(
          `${StrategyBesu.CLASS_NAME}#getAllInfoByKey: BesuAPI getBlockV1 call successfull but output data is falsy`,
        );
      }
      return txBlock.data.block;
    }
    throw new Error(
      `${StrategyBesu.CLASS_NAME}#getTransaction: BesuAPI or Connector were not defined`,
    );
  }
}
