import { v4 as uuidv4 } from "uuid";
import {
  Logger,
  Checks,
  LogLevelDesc,
  LoggerProvider,
} from "@hyperledger/cactus-common";
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";

import {
  BesuTestLedger,
  FabricTestLedgerV1,
  QuorumTestLedger,
} from "@hyperledger/cactus-test-tooling";

import { IContractDeploymentInfo } from "@hyperledger/cacti-example-harmonia-plugin";

import { IPluginKeychain } from "@hyperledger/cactus-core-api";
import { Web3Account } from "web3-eth-accounts";

export interface IAppDummyInfrastructureOptions {
  logLevel?: LogLevelDesc;
  keychain?: IPluginKeychain;
}

/**
 * Contains code that is meant to simulate parts of a production grade deployment
 * that would otherwise not be part of the application itself.
 *
 * The reason for this being in existence is so that we can have tutorials that
 * are self-contained instead of starting with a multi-hour setup process where
 * the user is expected to set up ledgers from scratch with all the bells and
 * whistles.
 * The sole purpose of this is to have people ramp up with Cactus as fast as
 * possible.
 */
export class AppDummyInfrastructure {
  public static readonly CLASS_NAME = "AppDummyInfrastructure";

  public readonly besu: BesuTestLedger;
  public readonly quorum: QuorumTestLedger;
  public readonly fabric: FabricTestLedgerV1;
  public readonly keychain: IPluginKeychain;
  private readonly log: Logger;
  private _quorumAccount?: Web3Account;
  private _besuAccount?: Web3Account;

  public get quorumAccount(): Web3Account {
    if (!this._quorumAccount) {
      throw new Error(`Must call deployContracts() first.`);
    } else {
      return this._quorumAccount;
    }
  }

  public get besuAccount(): Web3Account {
    if (!this._besuAccount) {
      throw new Error(`Must call deployContracts() first.`);
    } else {
      return this._besuAccount;
    }
  }

  public get className(): string {
    return AppDummyInfrastructure.CLASS_NAME;
  }

  constructor(public readonly options: IAppDummyInfrastructureOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });

    this.besu = new BesuTestLedger({
      logLevel: level,
      emitContainerLogs: true,
    });
    this.quorum = new QuorumTestLedger({
      logLevel: level,
      emitContainerLogs: true,
    });
    this.fabric = new FabricTestLedgerV1({
      publishAllPorts: true,
      imageName: "ghcr.io/hyperledger/cactus-fabric-all-in-one",
      logLevel: level,
      emitContainerLogs: true,
    });

    if (this.options.keychain) {
      this.keychain = this.options.keychain;
      this.log.info("Reusing the provided keychain plugin...");
    } else {
      this.log.info("Instantiating new keychain plugin...");
      this.keychain = new PluginKeychainMemory({
        instanceId: uuidv4(),
        keychainId: uuidv4(),
        logLevel: this.options.logLevel || "INFO",
      });
    }
    this.log.info("KeychainID=%o", this.keychain.getKeychainId());
  }

  public async stop(): Promise<void> {
    try {
      this.log.info(`Stopping...`);
      await Promise.all([
        this.besu.stop().then(() => this.besu.destroy()),
        this.quorum.stop().then(() => this.quorum.destroy()),
        this.fabric.stop().then(() => this.fabric.destroy()),
      ]);
      this.log.info(`Stopped OK`);
    } catch (ex) {
      this.log.error(`Stopping crashed: `, ex);
      throw ex;
    }
  }

  public async start(): Promise<void> {
    try {
      this.log.info(`Starting dummy infrastructure...`);
      await this.fabric.start();
      await this.besu.start();
      await this.quorum.start();
      this.log.info(`Started dummy infrastructure OK`);
    } catch (ex) {
      this.log.error(`Starting of dummy infrastructure crashed: `, ex);
      throw ex;
    }
  }

  public async deployContracts(): Promise<IContractDeploymentInfo> {
    try {
      this.log.info(`Deploying smart contracts...`);

      // FIXME
      // await this.keychain.set(
      //   BambooHarvestRepositoryJSON.contractName,
      //   JSON.stringify(BambooHarvestRepositoryJSON),
      // );

      // FIXME
      // {
      //   this._besuAccount = await this.besu.createEthTestAccount(2000000);
      //   const rpcApiHttpHost = await this.besu.getRpcApiHttpHost();
      //   const rpcApiWsHost = await this.besu.getRpcApiWsHost();

      //   const pluginRegistry = new PluginRegistry();
      //   pluginRegistry.add(this.keychain);
      //   const connector = new PluginLedgerConnectorBesu({
      //     instanceId: "PluginLedgerConnectorBesu_Contract_Deployment",
      //     rpcApiHttpHost,
      //     rpcApiWsHost,
      //     logLevel: this.options.logLevel,
      //     pluginRegistry,
      //   });

      //   const res = await connector.deployContract({
      //     contractName: BookshelfRepositoryJSON.contractName,
      //     bytecode: BookshelfRepositoryJSON.bytecode,
      //     contractAbi: BookshelfRepositoryJSON.abi,
      //     constructorArgs: [],
      //     gas: 1000000,
      //     web3SigningCredential: {
      //       ethAccount: this.besuAccount.address,
      //       secret: this.besuAccount.privateKey,
      //       type: Web3SigningCredentialType.PrivateKeyHex,
      //     },
      //     keychainId: this.keychain.getKeychainId(),
      //   });
      //   const {
      //     transactionReceipt: { contractAddress },
      //   } = res;

      //   bookshelfRepository = {
      //     abi: BookshelfRepositoryJSON.abi,
      //     address: contractAddress as string,
      //     bytecode: BookshelfRepositoryJSON.bytecode,
      //     contractName: BookshelfRepositoryJSON.contractName,
      //     keychainId: this.keychain.getKeychainId(),
      //   };
      // }

      // FIXME
      const out: IContractDeploymentInfo = {
        bambooHarvestRepository: {
          address: "",
          abi: undefined,
          bytecode: "",
          contractName: "",
          keychainId: "",
        },
        bookshelfRepository: {
          address: "",
          abi: undefined,
          bytecode: "",
          contractName: "",
          keychainId: "",
        },
        cordaContractDeployment: {
          flowNames: [],
        },
      };

      this.log.info(`Deployed smart contracts OK`);

      return out;
    } catch (ex) {
      this.log.error(`Deployment of smart contracts crashed: `, ex);
      throw ex;
    }
  }
}
