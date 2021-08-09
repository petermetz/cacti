import test, { Test } from "tape";
import { v4 as uuidv4 } from "uuid";
import { PluginRegistry } from "@hyperledger/cactus-core";
import {
  EthContractInvocationType,
  Web3SigningCredentialType,
  PluginLedgerConnectorBesu,
  PluginFactoryLedgerConnector,
  //Web3SigningCredentialCactusKeychainRef,
  ReceiptType,
} from "../../../../main/typescript/public-api";
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";
import { BesuTestLedger } from "@hyperledger/cactus-test-tooling";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import LockAssetContractJson from "../../../solidity/hello-world-contract/LockAsset.json";
import Web3 from "web3";
import { PluginImportType } from "@hyperledger/cactus-core-api";

test("deploys contract via .json file", async (t: Test) => {
  const logLevel: LogLevelDesc = "TRACE";
  const besuTestLedger = new BesuTestLedger();
  await besuTestLedger.start();

  test.onFinish(async () => {
    await besuTestLedger.stop();
    await besuTestLedger.destroy();
  });

  const rpcApiHttpHost = await besuTestLedger.getRpcApiHttpHost();
  const rpcApiWsHost = await besuTestLedger.getRpcApiWsHost();

  /**
   * Constant defining the standard 'dev' Besu genesis.json contents.
   *
   * @see https://github.com/hyperledger/besu/blob/1.5.1/config/src/main/resources/dev.json
   */
  const firstHighNetWorthAccount = besuTestLedger.getGenesisAccountPubKey();
  const besuKeyPair = {
    privateKey: besuTestLedger.getGenesisAccountPrivKey(),
  };
  const contractName = "LockAsset";

  const web3 = new Web3(rpcApiHttpHost);
  const testEthAccount = web3.eth.accounts.create(uuidv4());

  const keychainEntryKey = uuidv4();
  const keychainEntryValue = testEthAccount.privateKey;
  const keychainPlugin = new PluginKeychainMemory({
    instanceId: uuidv4(),
    keychainId: uuidv4(),
    // pre-provision keychain with mock backend holding the private key of the
    // test account that we'll reference while sending requests with the
    // signing credential pointing to this keychain entry.
    backend: new Map([[keychainEntryKey, keychainEntryValue]]),
    logLevel,
  });
  keychainPlugin.set(LockAssetContractJson.contractName, LockAssetContractJson);
  const factory = new PluginFactoryLedgerConnector({
    pluginImportType: PluginImportType.Local,
  });
  const connector: PluginLedgerConnectorBesu = await factory.create({
    rpcApiHttpHost,
    rpcApiWsHost,
    instanceId: uuidv4(),
    pluginRegistry: new PluginRegistry({ plugins: [keychainPlugin] }),
  });

  await connector.transact({
    web3SigningCredential: {
      ethAccount: firstHighNetWorthAccount,
      secret: besuKeyPair.privateKey,
      type: Web3SigningCredentialType.PrivateKeyHex,
    },
    consistencyStrategy: {
      blockConfirmations: 0,
      receiptType: ReceiptType.NodeTxPoolAck,
    },
    transactionConfig: {
      from: firstHighNetWorthAccount,
      to: testEthAccount.address,
      value: 10e9,
      gas: 1000000,
    },
  });

  const balance = await web3.eth.getBalance(testEthAccount.address);
  t.ok(balance, "Retrieved balance of test account OK");
  t.equals(parseInt(balance, 10), 10e9, "Balance of test account is OK");

  let contractAddress: string;

  test("deploys contract via .json file", async (t2: Test) => {
    const deployOut = await connector.deployContract({
      keychainId: keychainPlugin.getKeychainId(),
      contractName: LockAssetContractJson.contractName,
      contractAbi: LockAssetContractJson.abi,
      constructorArgs: [],
      web3SigningCredential: {
        ethAccount: firstHighNetWorthAccount,
        secret: besuKeyPair.privateKey,
        type: Web3SigningCredentialType.PrivateKeyHex,
      },
      bytecode: LockAssetContractJson.bytecode,
      gas: 1000000,
    });
    t2.ok(deployOut, "deployContract() output is truthy OK");
    t2.ok(
      deployOut.transactionReceipt,
      "deployContract() output.transactionReceipt is truthy OK",
    );
    t2.ok(
      deployOut.transactionReceipt.contractAddress,
      "deployContract() output.transactionReceipt.contractAddress is truthy OK",
    );

    contractAddress = deployOut.transactionReceipt.contractAddress as string;
    t2.ok(
      typeof contractAddress === "string",
      "contractAddress typeof string OK",
    );

    const {
      callOutput: unLockedAssetAfterCreate,
    } = await connector.invokeContract({
      contractName,
      keychainId: keychainPlugin.getKeychainId(),
      invocationType: EthContractInvocationType.Call,
      methodName: "createAsset",
      params: [100],
      signingCredential: {
        ethAccount: testEthAccount.address,
        secret: besuKeyPair.privateKey,
        type: Web3SigningCredentialType.PrivateKeyHex,
      },
    });
    t2.ok(unLockedAssetAfterCreate, "create Asset() output is truthy");
    t2.equals(parseInt(unLockedAssetAfterCreate, 10), 100, "create Asset Ok");
    const {
      callOutput: { unLockedAssetAfterLock, lockedAssetAfterLock },
    } = await connector.invokeContract({
      contractName,
      keychainId: keychainPlugin.getKeychainId(),
      invocationType: EthContractInvocationType.Call,
      methodName: "lockAsset",
      params: [30],
      signingCredential: {
        ethAccount: testEthAccount.address,
        secret: besuKeyPair.privateKey,
        type: Web3SigningCredentialType.PrivateKeyHex,
      },
    });
    t2.ok(unLockedAssetAfterLock, "lock Asset() output is truthy");
    t2.ok(lockedAssetAfterLock, "lock Asset() output is truthy");
    t2.equal(
      parseInt(unLockedAssetAfterLock, 10),
      70,
      "unlocked asset num equals after lock",
    );
    t2.equal(
      parseInt(lockedAssetAfterLock, 10),
      30,
      "locked asset num equals after lock",
    );
    const {
      callOutput: { unLockedAssetAfterUnLock, lockedAssetAfterUnLock },
    } = await connector.invokeContract({
      contractName,
      keychainId: keychainPlugin.getKeychainId(),
      invocationType: EthContractInvocationType.Call,
      methodName: "unLockAsset",
      params: [5],
      signingCredential: {
        ethAccount: testEthAccount.address,
        secret: besuKeyPair.privateKey,
        type: Web3SigningCredentialType.PrivateKeyHex,
      },
    });
    t2.ok(unLockedAssetAfterLock, "unlock Asset() output is truthy");
    t2.ok(lockedAssetAfterLock, "unlock Asset() output is truthy");
    t2.equal(
      parseInt(unLockedAssetAfterUnLock, 10),
      75,
      "unlocked asset num equals after lock",
    );
    t2.equal(
      parseInt(lockedAssetAfterUnLock, 10),
      25,
      "locked asset num equals after lock",
    );
    const {
      callOutput: { lockedAssetAfterDelete },
    } = await connector.invokeContract({
      contractName,
      keychainId: keychainPlugin.getKeychainId(),
      invocationType: EthContractInvocationType.Call,
      methodName: "deleteAsset",
      params: [5],
      signingCredential: {
        ethAccount: testEthAccount.address,
        secret: besuKeyPair.privateKey,
        type: Web3SigningCredentialType.PrivateKeyHex,
      },
    });
    t2.ok(lockedAssetAfterLock, "unlock Asset() output is truthy");
    t2.equal(
      parseInt(lockedAssetAfterUnLock, 10),
      20,
      "locked asset num equals after delete",
    );
  });
  t.end();
});
