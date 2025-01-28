import "jest-extended";
import safeStringify from "fast-safe-stringify";
import { Contract, EventLog, Web3, WebSocketProvider } from "web3";

import {
  authorizeSshKey,
  FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_1,
  FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_2,
  FabricTestLedgerV1,
} from "@hyperledger/cactus-test-tooling";
import {
  hasKey,
  LoggerProvider,
  LogLevelDesc,
} from "@hyperledger/cactus-common";
import { PluginImportType } from "@hyperledger/cactus-core-api";
import { PluginRegistry } from "@hyperledger/cactus-core";
import {
  DefaultApi as KeychainApi,
  PluginKeychainMemory,
} from "@hyperledger/cactus-plugin-keychain-memory";
import { Configuration as KeychainApiConfig } from "@hyperledger/cactus-plugin-keychain-memory";
import { PluginFactoryLedgerConnector as PluginFactoryLedgerConnectorChainlink } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { createApiClient } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { createDefaultCommitOffchainConfig } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { createDefaultCommitOnchainConfig } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { createDefaultExecOffchainConfig } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { createDefaultExecOnchainConfig } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { createFileGoDotMod } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { createFileGoDotSum } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { createFileRouterDotGo } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { IAuthArgs } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { IChainlinkApiClient } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { IConnectionArgs } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { mustEncodeAddress } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { getEvmExtraArgsV2 } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { IOracleIdentityExtra } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { Web3SigningCredential } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { Web3SigningCredentialType } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { BesuApiClientOptions } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import {
  ChainCodeProgrammingLanguage,
  ConnectionProfile,
  DefaultEventHandlerStrategy,
  FabricContractInvocationType,
  IPluginLedgerConnectorFabricOptions,
  PluginLedgerConnectorFabric,
} from "@hyperledger/cactus-plugin-ledger-connector-fabric";
import { FabricApiClientOptions } from "@hyperledger/cactus-plugin-ledger-connector-fabric";
import { FabricApiClient } from "@hyperledger/cactus-plugin-ledger-connector-fabric";

import { deployBesuCcipContracts } from "../../../main/typescript/infra/besu/deploy-besu-ccip-contracts";
import { IDeployBesuCcipContractsOutput } from "../../../main/typescript/infra/besu/deploy-besu-ccip-contracts";
import { ABI as LinkTokenAbi } from "../../../main/typescript/infra/besu/link-token-factory";
import { ABI as OnRampAbi } from "../../../main/typescript/infra/besu/on-ramp-factory";
import { ABI as OffRampAbi } from "../../../main/typescript/infra/besu/off-ramp-factory";
import { ABI as RouterAbi } from "../../../main/typescript/infra/besu/router-factory";
import { ABI as RmnProxyAbi } from "../../../main/typescript/infra/besu/rmn-proxy-factory";
import { ABI as MockRmnAbi } from "../../../main/typescript/infra/besu/mock-rmn-factory";
import { ABI as CommitStoreHelperAbi } from "../../../main/typescript/infra/besu/commit-store-helper-factory";
import { MockV3AggregatorContractAbi } from "../../../main/typescript/infra/besu/mock-v3-aggregator-factory";
import { setUpNodesAndJobs } from "../../../main/typescript/infra/besu/set-up-nodes-and-jobs";
import { setupOnchainConfig } from "../../../main/typescript/infra/besu/setup-onchain-config";

interface IUnsubscribeable {
  unsubscribe: () => Promise<void>;
}

describe("PluginLedgerConnectorChainlink", () => {
  const logLevel: LogLevelDesc = "DEBUG";

  const log = LoggerProvider.getOrCreate({
    label: "chainlink-fabric-relay.test.ts",
    level: logLevel,
  });

  const evmEvents: Array<EventLog> = [];

  const fabricKeychainEntryKey = "user2";

  const ledgerFabric = new FabricTestLedgerV1({
    publishAllPorts: true,
    useRunningLedger: true,
    imageName: "chainlink-fabric",
    imageVersion: "latest",
    // imageName: DEFAULT_FABRIC_2_AIO_IMAGE_NAME,
    // imageVersion: FABRIC_25_LTS_AIO_IMAGE_VERSION,
  });

  const cacti3ApiHost = "http://127.0.0.1:6000";
  const fabricKeychainId = "keychain_id_2";
  const fabricKeychainInstanceId = "plugin-keychain-memory-2";

  const fabricKeychainPlugin = new PluginKeychainMemory({
    instanceId: fabricKeychainInstanceId,
    keychainId: fabricKeychainId,
    logLevel,
    backend: new Map([["some-other-entry-key", "some-other-entry-value"]]),
  });
  const fabricPluginRegistry = new PluginRegistry({
    plugins: [fabricKeychainPlugin],
  });

  const fabricKeychainClient = new KeychainApi(
    new KeychainApiConfig({ basePath: cacti3ApiHost }),
  );

  let fabricConnector: PluginLedgerConnectorFabric;
  let connectionProfile: ConnectionProfile;
  let contractEventListenerFabric: any; // FIXME(petermetz) - do not use any

  const fabricChannelId = "mychannel";
  const fabricChannelName = fabricChannelId;
  const fabricContractName = "router";
  const fabricSshPublicKey =
    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDMoCzWglI2aZZo60/rLBSYkbJo33JWkd9seuQ4267oPSSh/lGo3Kg6V8jQJwy7RxA0ydsKJEG2kny5X0H4QCcP876I+jdx2NjbAQMATFxn/F+Ee8Cu46aeX2COC6cvX5AntMkckL/pxk64U4TtWv7ghzrHiBnu8PTdL7qN0QwsRJGy9IUBMr4OCVLoIkywbXyReFELC5JxZl+gVFPOWOtCumHIjrQIeMGy/bCIGl3Gmkl2lU8wCzDPMeN8ifn0Mt5KgBAF5KxxiRxAUEDxqmgn8WsFq20PoZZCHAP/cH35PNsS1Kc3lI00LDMVBBjkNkUgfwNDOV/AfnHqpHfIxK1uixQwUFdGUN/hBJTk69mIqA+Dkl94x4Lr3BSgmxhJFVmTlaniZ+iQmiIOX0z65uvLHIdIeVcfKAoKgOkPpeAW6YstrJO5uUmlwUMv5sVWE7WgIvKwIV102qnXgqblSslbxL5ObXmBsoLXP0Ut01uphBhYqcv/1mD2SqdN6BEGqDk= root@buildkitsandbox";
  const fabricContainerName = "fabric";

  const chainlinkNodeDemoEmailAndPw = "cacti-dev@cacti.example.com";

  // The P2P ID extracted from the keys hardcoded into the containers via mounts.
  const bootstrapNodeP2pId =
    "12D3KooWSPPcj5FKg9fmQ3jBRB27bdLD1QbLBKwLCZDmpgnzNRzf@chainlink1:6690";

  const connectionArgs1: IConnectionArgs = {
    protocol: "http",
    host: "127.0.0.1",
    port: 6688,
  };
  const connectionArgs2: IConnectionArgs = {
    protocol: "http",
    host: "127.0.0.1",
    port: 16688,
  };
  const connectionArgs3: IConnectionArgs = {
    protocol: "http",
    host: "127.0.0.1",
    port: 26688,
  };
  const connectionArgs4: IConnectionArgs = {
    protocol: "http",
    host: "127.0.0.1",
    port: 36688,
  };
  const connectionArgs5: IConnectionArgs = {
    protocol: "http",
    host: "127.0.0.1",
    port: 46688,
  };
  const authArgs1: IAuthArgs = {
    email: chainlinkNodeDemoEmailAndPw,
    password: chainlinkNodeDemoEmailAndPw,
  };
  const authArgs2 = authArgs1;
  const authArgs3 = authArgs1;
  const authArgs4 = authArgs1;
  const authArgs5 = authArgs1;

  const contractLogSubscriptions: Array<IUnsubscribeable> = [];

  afterAll(async () => {
    log.debug(
      "Unsubscribing %d solidity event subs...",
      contractLogSubscriptions.length,
    );
    const unSubResults = await Promise.allSettled(
      contractLogSubscriptions.map((x) => x.unsubscribe()),
    );
    log.debug("Solidity event unsubscribe operations settled:", unSubResults);

    log.debug("Disconnecting Web3 WS Providers...");
    await dstWeb3WsProvider.safeDisconnect();
    await srcWeb3WsProvider.safeDisconnect();
    log.debug("Disconnected Web3 WS Providers OK");
  });

  afterAll(async () => {
    log.debug("Removing Fabric CCIP Router Contract Listener...");
    routerContractFabric.removeContractListener(contractEventListenerFabric);
    log.debug("Fabric CCIP Router Contract Listener removed OK.");
  });

  const apiFabric = new FabricApiClient(
    new FabricApiClientOptions({
      basePath: "http://127.0.0.1:6000",
      accessToken: "FIXME(petermetz)",
    }),
  );

  const helloBuffer = Buffer.from("hello_cacti_ccip", "utf-8");

  const srcCactiHost = "http://127.0.0.1:4000";
  const besuApiClientOptions = new BesuApiClientOptions({
    basePath: srcCactiHost,
  });

  const dstCactiHost = "http://127.0.0.1:5000";
  const proxyApiClientOptions = new BesuApiClientOptions({
    basePath: dstCactiHost,
  });

  const dstApiClient = new BesuApiClient(proxyApiClientOptions);
  const srcApiClient = new BesuApiClient(besuApiClientOptions);

  // https://github.com/smartcontractkit/chain-selectors/blob/52181932b9e18957b9bd09b574ce49947ccf69fc/test_selectors.yml
  // ```yaml
  //   90000001:
  //   selector: 909606746561742123
  // 90000002:
  //   selector: 5548718428018410741
  // ```
  //
  const sourceChainSelector = BigInt(909606746561742123n);
  const destChainSelector = BigInt(5548718428018410741n);
  const destChainId = BigInt(90000002);
  const sourceChainId = BigInt(90000001);

  const genesisWeb3SigningCredential: Web3SigningCredential = {
    ethAccount: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
    secret: "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
    type: Web3SigningCredentialType.PrivateKeyHex,
  };

  const srcWeb3WsProvider = new WebSocketProvider("ws://127.0.0.1:8546");
  const srcWeb3 = new Web3(srcWeb3WsProvider);

  const srcAccount = srcWeb3.eth.accounts.wallet.add(
    "0x" + genesisWeb3SigningCredential.secret,
  );

  const srcAccount2 = srcWeb3.eth.accounts.create();
  srcWeb3.eth.accounts.wallet.add(srcAccount2);

  const srcWeb3SigningCredential: Web3SigningCredential = {
    ethAccount: srcAccount2.address,
    secret: srcAccount2.privateKey,
    type: Web3SigningCredentialType.PrivateKeyHex,
  };

  const dstWeb3WsProvider = new WebSocketProvider("ws://127.0.0.1:9546");
  const dstWeb3 = new Web3(dstWeb3WsProvider);
  const dstAccount = dstWeb3.eth.accounts.wallet.add(
    "0x" + genesisWeb3SigningCredential.secret,
  );

  const dstAccount2 = dstWeb3.eth.accounts.create();
  dstWeb3.eth.accounts.wallet.add(dstAccount2);

  const dstWeb3SigningCredential: Web3SigningCredential = {
    ethAccount: dstAccount2.address,
    secret: dstAccount2.privateKey,
    type: Web3SigningCredentialType.PrivateKeyHex,
  };

  const srcAddresses = srcAccount.map((x) => x.address);
  const dstAddresses = dstAccount.map((x) => x.address);
  log.debug("SrcWeb3 Accounts: %s", safeStringify(srcAddresses));
  log.debug("DstWeb3 Accounts: %s", safeStringify(dstAddresses));

  let infra: IDeployBesuCcipContractsOutput;
  let srcRouter: Contract<typeof RouterAbi>;
  let dstRouter: Contract<typeof RouterAbi>;
  let routerContractFabric: any; // FIXME(petermetz)

  beforeAll(() => {
    log.warn("Note: Overriding BigInt.prototype.toJSON() to call .toString()");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (BigInt.prototype as any).toJSON = function () {
      return this.toString();
    };
  });

  beforeAll(async () => {
    log.debug("Starting Fabric Test Ledger...");
    let error: unknown = null;
    try {
      await ledgerFabric.start();
      log.debug("Started Fabric Test Ledger OK");
    } catch (cause: unknown) {
      const msg = "Starting of Fabric Test Ledger crashed.";
      log.error(msg, cause);
      error = cause;
    }
    expect(error).toBeFalsy();
  });

  beforeAll(async () => {
    const cp = await ledgerFabric.getConnectionProfileOrg1();
    const cp2 = JSON.parse(safeStringify(cp));

    const peer0Org1UrlNew = "grpcs://peer0.org1.example.com:7051";
    const peer0Org1UrlOld = cp.peers["peer0.org1.example.com"].url;
    log.debug("Peer0_Org1: Old: %s, new: %s", peer0Org1UrlOld, peer0Org1UrlNew);
    cp.peers["peer0.org1.example.com"].url = peer0Org1UrlNew;

    if (typeof cp.peers["peer0.org2.example.com"] === "object") {
      const peer0Org2UrlNew = "grpcs://peer0.org2.example.com:9051";
      const peer0Org2UrlOld = cp.peers["peer0.org2.example.com"].url;
      log.debug("Peer0_Org2: %s => %s", peer0Org2UrlOld, peer0Org2UrlNew);
      cp.peers["peer0.org2.example.com"].url = peer0Org2UrlNew;
    }

    const ordererUrlNew = "grpcs://orderer.example.com:7050";
    const ordererUrlOld = cp.orderers["orderer.example.com"].url;
    log.debug("Orderer URL: %s => %s", ordererUrlOld, ordererUrlNew);

    cp.orderers["orderer.example.com"].url = ordererUrlNew;

    const caUrlOld = cp.certificateAuthorities["ca.org1.example.com"].url;
    const caUrlNew = "https://ca.org1.example.com:7054";
    log.debug("CA URL: %s => %s", caUrlOld, caUrlNew);

    cp.certificateAuthorities["ca.org1.example.com"].url = caUrlNew;

    log.debug("Overriding Fabric Connection Profile...");
    connectionProfile = cp;

    let error: unknown = null;
    try {
      const cpB64 = Buffer.from(safeStringify(cp)).toString("base64");
      await apiFabric.setConnectionProfileBase64V1({
        connectionProfileB64: cpB64,
      });
      log.debug("Overriding Fabric Connection Profile OK");
    } catch (cause: unknown) {
      const msg = "Overriding Fabric Connection Profile crashed.";
      log.error(msg, cause);
      error = cause;
    }
    expect(error).toBeFalsy();

    // port and host for SSH config are different compared to the compose file because
    // this code runs on the host machine's network while the compose-file's code runs
    // on the docker subnet
    const fabricConnectorOpts: IPluginLedgerConnectorFabricOptions = {
      pluginRegistry: fabricPluginRegistry,
      instanceId: "plugin-connector-fabric-2",
      dockerBinary: "/usr/local/bin/docker",
      peerBinary: "/fabric-samples/bin/peer",
      goBinary: "/usr/local/go/bin/go",
      cliContainerEnv: FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_1,
      sshConfig: {
        host: "localhost",
        privateKey:
          "-----BEGIN OPENSSH PRIVATE KEY-----\n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\n-----END OPENSSH PRIVATE KEY-----\n",
        username: "root",
        port: 30022,
      },
      connectionProfile: cp2,
      discoveryOptions: { enabled: true, asLocalhost: false },
      eventHandlerOptions: {
        strategy: DefaultEventHandlerStrategy.NetworkScopeAllfortx,
        commitTimeout: 300,
      },
    };
    fabricConnector = new PluginLedgerConnectorFabric(fabricConnectorOpts);
  });

  beforeAll(async () => {
    log.debug("Configuring Fabric Keychain A...");
    let error: unknown = null;
    try {
      const enrollAdminOut = await ledgerFabric.enrollAdmin();
      const adminWallet = enrollAdminOut[1];
      const [userIdentity] = await ledgerFabric.enrollUser(adminWallet);
      const fabricKeychainValue = safeStringify(userIdentity);
      await fabricKeychainPlugin.set(
        fabricKeychainEntryKey,
        fabricKeychainValue,
      );
      await fabricKeychainClient.setKeychainEntryV1({
        key: fabricKeychainEntryKey,
        value: fabricKeychainValue,
      });
      log.debug("Configuring Fabric Keychain A OK");
    } catch (cause: unknown) {
      const msg = "Configuring Fabric Keychain A crashed.";
      log.error(msg, cause);
      error = cause;
    }
    expect(error).toBeFalsy();
  });

  beforeAll(async () => {
    log.debug("Initializing Fabric Connector Plugin...");
    let error: unknown = null;
    try {
      await fabricConnector.onPluginInit();
      log.debug("Initialized Fabric Connector Plugin OK");
    } catch (cause: unknown) {
      const msg = "Plugin Initialization of Fabric Connector crashed.";
      log.error(msg, cause);
      error = cause;
    }
    expect(error).toBeFalsy();
    log.debug("Obtaining Fabric transaction stream...");
    const stream = await fabricConnector.getTxSubjectObservable();
    log.debug("Obtained Fabric transaction stream OK");

    stream.subscribe((tx) => {
      log.debug("Fabric Tx: %s", safeStringify(tx));
    });

    const channelName = fabricChannelName;
    const contractName = fabricContractName;
    log.debug("Creating Fabric gateway within the test case itself...");

    const gateway = await fabricConnector.createGateway({
      contractName: fabricContractName,
      channelName: fabricChannelName,
      params: [],
      methodName: "CcipSend",
      invocationType: FabricContractInvocationType.Send,
      signingCredential: {
        keychainId: fabricKeychainId,
        keychainRef: fabricKeychainEntryKey,
      },
    });
    log.debug("Created Fabric gateway within the test case OK.");

    log.debug("Obtaining Fabric gateway network instance...");
    const network = await gateway.getNetwork(channelName);

    log.debug("Obtaining Fabric contract instance...");
    routerContractFabric = network.getContract(contractName);
  });

  beforeAll(async () => {
    const publicKey = fabricSshPublicKey;
    const containerName = fabricContainerName;
    await authorizeSshKey({ containerName, logLevel, publicKey });
    log.info("Fabric Connector's SSH key is now authorized in AIO container");
  });

  beforeAll(async () => {
    log.debug("Deploying Fabric CCIP Router contract...");
    let error: unknown = null;
    try {
      // const channelName = fabricChannelName;
      const channelId = fabricChannelName;
      const contractName = fabricContractName;

      // packages/cacti-plugin-ledger-connector-chainlink/src/main/go/ccip/fabric/router/router.go
      // packages/cacti-plugin-ledger-connector-chainlink/src/main/go/ccip/fabric/router/go.mod
      // packages/cacti-plugin-ledger-connector-chainlink/src/main/go/ccip/fabric/router/go.sum
      const routerDotGo = await createFileRouterDotGo();
      const goDotMod = await createFileGoDotMod();
      const goDotSum = await createFileGoDotSum();
      const sourceFiles = [routerDotGo, goDotSum, goDotMod];

      const res = await apiFabric.deployContractV1({
        channelId,
        ccVersion: "1.0.0",
        // constructorArgs: { Args: ["john", "99"] },
        sourceFiles,
        ccName: contractName,
        targetOrganizations: [
          FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_1,
          FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_2,
        ],
        caFile:
          FABRIC_25_LTS_FABRIC_SAMPLES_ENV_INFO_ORG_1.ORDERER_TLS_ROOTCERT_FILE,
        ccLabel: "router",
        ccLang: ChainCodeProgrammingLanguage.Golang,
        ccSequence: 1,
        orderer: "orderer.example.com:7050",
        ordererTLSHostnameOverride: "orderer.example.com",
        connTimeout: 60,
      });
      const { packageIds, lifecycle, success } = res.data;
      expect(res.status).toBe(200);
      expect(success).toBeTruthy();
      const {
        approveForMyOrgList,
        installList,
        queryInstalledList,
        commit,
        packaging,
        queryCommitted,
      } = lifecycle;
      expect(packageIds).toBeTruthy();
      expect(Array.isArray(packageIds)).toBe(true);
      expect(approveForMyOrgList).toBeTruthy();
      expect(Array.isArray(approveForMyOrgList)).toBe(true);
      expect(installList).toBeTruthy();
      expect(Array.isArray(installList)).toBe(true);
      expect(queryInstalledList).toBeTruthy();
      expect(Array.isArray(queryInstalledList)).toBe(true);
      expect(commit).toBeTruthy();
      expect(packaging).toBeTruthy();
      expect(queryCommitted).toBeTruthy();
      const ctx = safeStringify({ packageIds, success });
      log.debug("Fabric CCIP Router deployed OK: %s", ctx);
    } catch (cause: unknown) {
      const msg = "Deployment of Fabric CCIP Router crashed.";
      log.error(msg, cause);
      error = cause;
    }
    expect(error).toBeFalsy();
  });

  // FIXME and TODO
  // beforeAll(async () => {
  //   await startEvmProxy({
  //     logLevel,
  //     chainId: destChainId,
  //     mnemonic: "asdf",
  //     passphrase: "",
  //   });
  // });

  beforeAll(async () => {
    log.debug("Seeding source chain test account with whale money");
    const srcSeedOut = await srcWeb3.eth.sendTransaction({
      from: genesisWeb3SigningCredential.ethAccount,
      to: srcWeb3SigningCredential.ethAccount,
      value: 999_999_999_999_999_999_999n,
      gas: 10_000_000n,
    });
    log.debug("Src SeedOut=%s", safeStringify(srcSeedOut));

    const srcBalance = await srcWeb3.eth.getBalance(
      srcWeb3SigningCredential.ethAccount,
    );
    log.debug("Balance of srcWeb3SigningCredential after seed: %o", srcBalance);

    const genesisDstAccountBalance = await dstWeb3.eth.getBalance(
      genesisWeb3SigningCredential.ethAccount,
    );
    log.debug(
      "genesisDstAccountBalance(%s): %d",
      genesisWeb3SigningCredential.ethAccount,
      genesisDstAccountBalance,
    );

    log.debug("Seeding dst chain test account with whale money");

    const seedOut = await dstWeb3.eth.sendTransaction({
      from: genesisWeb3SigningCredential.ethAccount,
      to: dstWeb3SigningCredential.ethAccount,
      value: 999_999_999_999_999_999_999n,
      gas: 10_000_000n,
      maxFeePerGas: 2_500_000_000,
    });
    log.debug("Dst SeedOut=%s", safeStringify(seedOut));

    const balance = await dstWeb3.eth.getBalance(
      dstWeb3SigningCredential.ethAccount,
    );
    log.debug("Balance of dstWeb3SigningCredential after seed: %o", balance);

    infra = await deployBesuCcipContracts({
      sourceChainId,
      destChainId,
      sourceChainSelector,
      destChainSelector,
      srcApiClient,
      sourceFinalityDepth: 2,
      dstApiClient,
      destFinalityDepth: 2,
      tokenDecimals: 18, // If this is set to 15, deployments get reverted
      srcWeb3SigningCredential,
      dstWeb3SigningCredential,
      logLevel,
      dstWeb3,
      srcWeb3,
    });

    srcWeb3.eth.defaultAccount = srcWeb3SigningCredential.ethAccount;
    dstWeb3.eth.defaultAccount = dstWeb3SigningCredential.ethAccount;

    const dstCommitStoreHelper = new Contract(
      CommitStoreHelperAbi,
      infra.dstCommitStoreHelperAddr,
      dstWeb3,
    );
    await logAllEventsOfContract({
      logLevel,
      contract: dstCommitStoreHelper,
      contractLogSubscriptions,
      contractName: "dstCommitStoreHelper",
      evmEvents,
    });

    const dstRmnProxy = new Contract(
      RmnProxyAbi,
      infra.dstRmnProxyAddr,
      dstWeb3,
    );
    await logAllEventsOfContract({
      logLevel,
      contract: dstRmnProxy,
      contractLogSubscriptions,
      contractName: "dstRmnProxy",
      evmEvents,
    });

    const srcRmnProxy = new Contract(
      RmnProxyAbi,
      infra.srcRmnProxyAddr,
      srcWeb3,
    );
    await logAllEventsOfContract({
      logLevel,
      contract: srcRmnProxy,
      contractLogSubscriptions,
      contractName: "srcRmnProxy",
      evmEvents,
    });

    const dstMockRmn = new Contract(MockRmnAbi, infra.dstMockRmnAddr, dstWeb3);
    await logAllEventsOfContract({
      logLevel,
      contract: dstMockRmn,
      contractLogSubscriptions,
      contractName: "dstMockRmn",
      evmEvents,
    });

    const srcMockRmn = new Contract(MockRmnAbi, infra.srcMockRmnAddr, srcWeb3);
    await logAllEventsOfContract({
      logLevel,
      contract: srcMockRmn,
      contractLogSubscriptions,
      contractName: "srcMockRmn",
      evmEvents,
    });

    srcRouter = new Contract(RouterAbi, infra.srcRouterAddr, srcWeb3);
    await logAllEventsOfContract({
      logLevel,
      contract: srcRouter,
      contractLogSubscriptions,
      contractName: "srcRouter",
      evmEvents,
    });

    dstRouter = new Contract(RouterAbi, infra.dstRouterAddr, dstWeb3);
    await logAllEventsOfContract({
      logLevel,
      contract: dstRouter,
      contractLogSubscriptions,
      contractName: "dstRouter",
      evmEvents,
    });

    const srcLinkToken = new Contract(
      LinkTokenAbi,
      infra.srcLinkTokenAddr,
      srcWeb3,
    );
    await logAllEventsOfContract({
      logLevel,
      contract: srcLinkToken,
      contractLogSubscriptions,
      contractName: "srcLinkToken",
      evmEvents,
    });

    const srcOnRamp = new Contract(OnRampAbi, infra.srcOnRampAddr, srcWeb3);
    await logAllEventsOfContract({
      logLevel,
      contract: srcOnRamp,
      contractLogSubscriptions,
      contractName: "srcOnRamp",
      evmEvents,
    });

    const dstOffRamp = new Contract(OffRampAbi, infra.dstOffRampAddr, dstWeb3);
    await logAllEventsOfContract({
      logLevel,
      contract: dstOffRamp,
      contractLogSubscriptions,
      contractName: "dstOffRamp",
      evmEvents,
    });

    const srcMockV3Aggregator = new Contract(
      MockV3AggregatorContractAbi,
      infra.srcMockV3AggregatorAddr,
      srcWeb3,
    );
    await logAllEventsOfContract({
      logLevel,
      contract: srcMockV3Aggregator,
      contractLogSubscriptions,
      contractName: "srcMockV3Aggregator",
      evmEvents,
    });

    const dstMockV3Aggregator = new Contract(
      MockV3AggregatorContractAbi,
      infra.dstMockV3AggregatorAddr,
      dstWeb3,
    );
    await logAllEventsOfContract({
      logLevel,
      contract: dstMockV3Aggregator,
      contractLogSubscriptions,
      contractName: "dstMockV3Aggregator",
      evmEvents,
    });

    try {
      // big.NewInt(50), big.NewInt(17000000), big.NewInt(1000), big.NewInt(1000)
      const out = await srcMockV3Aggregator.methods
        .updateRoundData(50n, 17_000_000n, 1_000n, 1_000n)
        .send({ from: srcWeb3SigningCredential.ethAccount });
      const { blockNumber, cumulativeGasUsed, gasUsed, transactionHash } = out;
      const ctx = { blockNumber, cumulativeGasUsed, gasUsed, transactionHash };
      log.debug("MockV3Aggregator srcUpdateRoundData=%s", safeStringify(ctx));
    } catch (ex: unknown) {
      log.error("Failed to get srcUpdateRoundDataOut: ", ex);
      throw ex;
    }

    try {
      // (big.NewInt(50), big.NewInt(8000000), big.NewInt(1000), big.NewInt(1000))
      const out = await dstMockV3Aggregator.methods
        .updateRoundData(50n, 8_000_000n, 1_000n, 1_000n)
        .send({ from: dstWeb3SigningCredential.ethAccount });
      const { blockNumber, cumulativeGasUsed, gasUsed, transactionHash } = out;
      const ctx = { blockNumber, cumulativeGasUsed, gasUsed, transactionHash };
      log.debug("MockV3Aggregator dstUpdateRoundData=%o", safeStringify(ctx));
    } catch (ex: unknown) {
      log.error("Failed to get dstUpdateRoundDataOut: ", ex);
      throw ex;
    }

    try {
      const linkAvailable = await srcOnRamp.methods
        .linkAvailableForPayment()
        .call();
      log.debug("srcOnRamp.linkAvailableForPayment=%o", linkAvailable);
    } catch (ex: unknown) {
      log.error("Failed to get srcOnRamp.linkAvailableForPayment1: ", ex);
      throw ex;
    }

    try {
      const cfg = await dstOffRamp.methods.getDynamicConfig().call();
      log.debug("dstOffRamp.getDynamicConfig=%o", safeStringify(cfg));
    } catch (ex: unknown) {
      log.error("Failed to get getDynamicConfig: ", ex);
      throw ex;
    }

    try {
      const linkBalance1 = await srcLinkToken.methods
        .balanceOf(srcWeb3SigningCredential.ethAccount)
        .call();
      log.debug("LinkBalance1 (ETH_Whale_1)=%o", linkBalance1);
    } catch (ex: unknown) {
      log.error("Failed to get LinkBalance1: ", ex);
      throw ex;
    }

    try {
      const owner = srcWeb3SigningCredential.ethAccount;
      const spender = srcWeb3SigningCredential.ethAccount;
      const linkAllowance = await srcLinkToken.methods
        .allowance(owner, spender)
        .call();
      log.debug("Link Allowance -1 (ETH_Whale_1)=%o", linkAllowance);
    } catch (ex: unknown) {
      log.error("Failed to get linkAllowance: ", ex);
      throw ex;
    }

    try {
      const amount = await srcLinkToken.methods
        .balanceOf(srcWeb3SigningCredential.ethAccount)
        .call();
      const spender = srcWeb3SigningCredential.ethAccount;

      const linkApproval = await srcLinkToken.methods
        .approve(spender, amount)
        .send({ from: srcWeb3SigningCredential.ethAccount });

      const { blockNumber, cumulativeGasUsed, gasUsed, transactionHash } =
        linkApproval;

      const ctx = safeStringify({
        blockNumber,
        cumulativeGasUsed,
        gasUsed,
        transactionHash,
      });
      log.debug("Link Approval 1 (ETH_Whale_1)=%s", ctx);
    } catch (ex: unknown) {
      log.error("Failed to get linkApproval 1: ", ex);
      throw ex;
    }

    try {
      const amount = await srcLinkToken.methods
        .balanceOf(srcWeb3SigningCredential.ethAccount)
        .call();
      const spender = infra.srcOnRampAddr;
      const linkApproval = await srcLinkToken.methods
        .approve(spender, amount)
        .send({ from: srcWeb3SigningCredential.ethAccount });

      const { blockNumber, cumulativeGasUsed, gasUsed, transactionHash } =
        linkApproval;

      const ctx = safeStringify({
        blockNumber,
        cumulativeGasUsed,
        gasUsed,
        transactionHash,
      });
      log.debug("Link Approval 2 (srcOnRamp)=%s", ctx);
    } catch (ex: unknown) {
      log.error("Failed to get linkApproval 2: ", ex);
      throw ex;
    }

    try {
      const owner = srcWeb3SigningCredential.ethAccount;
      const spender = srcWeb3SigningCredential.ethAccount;

      const linkAllowance = await srcLinkToken.methods
        .allowance(owner, spender)
        .call();

      log.debug("Link Allowance -2 (ETH_Whale_1)=%d", linkAllowance);
    } catch (ex: unknown) {
      log.error("Failed to get linkAllowance: ", ex);
      throw ex;
    }

    try {
      const owner = srcWeb3SigningCredential.ethAccount;
      const spender = infra.srcOnRampAddr;
      const linkAllowance3 = await srcLinkToken.methods
        .allowance(owner, spender)
        .call();

      log.debug("Link Allowance -3 (srcOnRamp)=%d", linkAllowance3);
    } catch (ex: unknown) {
      log.error("Failed to get linkAllowance3: ", ex);
      throw ex;
    }

    try {
      const linkBalance2 = await srcLinkToken.methods
        .balanceOf(infra.srcOnRampAddr)
        .call();
      log.debug("LinkBalance2 (OnRamp)=%o", linkBalance2);
    } catch (ex: unknown) {
      log.error("Failed to get LinkBalance2: ", ex);
      throw ex;
    }

    const clApiClientOut1 = await createApiClient({
      authArgs: authArgs1,
      connectionArgs: connectionArgs1,
      level: logLevel,
    });

    const clApiClientOut2 = await createApiClient({
      authArgs: authArgs2,
      connectionArgs: connectionArgs2,
      level: logLevel,
    });

    const clApiClientOut3 = await createApiClient({
      authArgs: authArgs3,
      connectionArgs: connectionArgs3,
      level: logLevel,
    });

    const clApiClientOut4 = await createApiClient({
      authArgs: authArgs4,
      connectionArgs: connectionArgs4,
      level: logLevel,
    });

    const clApiClientOut5 = await createApiClient({
      authArgs: authArgs5,
      connectionArgs: connectionArgs5,
      level: logLevel,
    });

    //
    // Funding the transmitter addresses the Chainlink nodes use to send messages (transactions)
    //
    const clients = [
      { apiClient: clApiClientOut1.apiClient, nodeLabel: "chainlink1" },
      { apiClient: clApiClientOut2.apiClient, nodeLabel: "chainlink2" },
      { apiClient: clApiClientOut3.apiClient, nodeLabel: "chainlink3" },
      { apiClient: clApiClientOut4.apiClient, nodeLabel: "chainlink4" },
      { apiClient: clApiClientOut5.apiClient, nodeLabel: "chainlink5" },
    ];

    for (const client of clients) {
      await fundChainlinkNodeAccountsWithSomeEth({
        logLevel,
        apiClient: client.apiClient,
        destChainId,
        destChainSelector,
        dstWeb3,
        nodeLabel: client.nodeLabel,
        sourceChainId,
        sourceChainSelector,
        srcWeb3,
      });
    }

    const priceGetterConfig = {};

    const { commitJob2, commitJob3, commitJob4, commitJob5 } =
      await setUpNodesAndJobs({
        sourceChainId,
        destChainId,
        srcWeb3SigningCredential,
        dstWeb3SigningCredential,
        sourceChainSelector,
        destChainSelector,
        contracts: infra,
        dstCommitStoreHelper,
        bootstrapNodeP2pId,
        node1: { clApiClient: clApiClientOut1.apiClient },
        node2: { clApiClient: clApiClientOut2.apiClient },
        node3: { clApiClient: clApiClientOut3.apiClient },
        node4: { clApiClient: clApiClientOut4.apiClient },
        node5: { clApiClient: clApiClientOut5.apiClient },
        logLevel,
        priceGetterConfig,
        tokenPricesUSDPipeline: "",
      });
    expect(commitJob2).toBeTruthy();
    expect(commitJob3).toBeTruthy();
    expect(commitJob4).toBeTruthy();
    expect(commitJob5).toBeTruthy();

    const commitJobs = [commitJob2, commitJob3, commitJob4, commitJob5];

    const oracles = commitJobs.map((job, i) => {
      const { ocrKeyBundle, peerId, transmitterId } = job;
      // Example: "ocr2on_evm_895678a3d21cab4282ed30a1bcd9ddaa1661117e"
      // Example: "ocr2off_evm_5b6f3dffe3bf03bb8740ef2baed82046fa788a26d1c01c398487578ed648ee9e"
      const { offChainPublicKey, onChainPublicKey } = ocrKeyBundle;
      // Example: "ocr2cfg_evm_44b690e2a47421468e5d58c6139adf1c54e19b19210aeedac37f860147e0cc45"
      const { configPublicKey } = ocrKeyBundle;

      const offChainPublicKeyHex = offChainPublicKey.substring(12);
      const offchainPublicKeyBuffer = Buffer.from(offChainPublicKeyHex, "hex");
      const offchainPublicKeyBytes = Uint8Array.from(offchainPublicKeyBuffer);

      const onChainPublicKeyHex = onChainPublicKey.substring(11);
      const onchainPublicKeyBuffer = Buffer.from(onChainPublicKeyHex, "hex");
      const onchainPublicKeyBytes = Uint8Array.from(onchainPublicKeyBuffer);

      const configPublicKeyHex = configPublicKey.substring(12);
      const configPublicKeyBuffer = Buffer.from(configPublicKeyHex, "hex");
      const configPublicKeyBytes = Uint8Array.from(configPublicKeyBuffer);

      // Example: p2p_12D3KooWMD8a8tXGmJ2YPP1d67sfJ8eYQNyuAifdnKeNGx1HRCpM
      // Becomes: 12D3KooWMD8a8tXGmJ2YPP1d67sfJ8eYQNyuAifdnKeNGx1HRCpM
      // If we don't do this the OCR2 job in the Chainlink peer node crashes with
      //
      // ERROR] runWithContractConfig: function exited with non-retriable error. not retrying managed/run_with_contract_config.go:189
      // configDigest=000164936443061b8d662239cc458715520d805915860f2186e21f04cbe5f03f contractID=0xCdf60a682681e0e628bE6cAAF737F223b51c005e
      // error=OnchainPublicKey 723985842f54715be8bfa492d2f5f2ecb665a507 in publicConfig matches mine,
      // but PeerID does not: p2p_12D3KooWMD8a8tXGmJ2YPP1d67sfJ8eYQNyuAifdnKeNGx1HRCpM (config) vs 12D3KooWMD8a8tXGmJ2YPP1d67sfJ8eYQNyuAifdnKeNGx1HRCpM (mine)
      const peerIdR = peerId.substring(4);
      log.debug("Oracle%d peer=%s, transmitter=%s", i, peerIdR, transmitterId);

      const oracle: IOracleIdentityExtra = {
        offchainPublicKey: offchainPublicKeyBytes,
        onchainPublicKey: onchainPublicKeyBytes,
        peerID: peerIdR,
        transmitAccount: transmitterId,
        configEncryptionPublicKey: configPublicKeyBytes,
      };
      return oracle;
    });

    const commitOffchainConfig = await createDefaultCommitOffchainConfig();
    const commitOnchainConfig = await createDefaultCommitOnchainConfig(
      infra.dstPriceRegistryAddr,
    );

    const execOffchainConfig = await createDefaultExecOffchainConfig();
    const execOnchainConfig = await createDefaultExecOnchainConfig({
      dstPriceRegistryAddr: infra.dstPriceRegistryAddr,
      dstRouterAddr: infra.dstRouterAddr,
      logLevel,
    });

    await setupOnchainConfig({
      logLevel,
      commitOffchainConfig,
      commitOnchainConfig,
      execOffchainConfig,
      execOnchainConfig,
      dstOffRamp,
      contracts: infra,
      dstCommitStoreHelper,
      oracles,
      srcWeb3,
      dstWeb3,
      srcWeb3SigningCredential,
      dstWeb3SigningCredential,
    });
  });

  it("Can observe on/off ramp events", async () => {
    const factory = new PluginFactoryLedgerConnectorChainlink({
      pluginImportType: PluginImportType.Local,
    });

    const pluginRegistry = new PluginRegistry();

    const plugin = await factory.create({
      instanceId: "chainlink-connector-1",
      ledgerHttpHost: "https://localhost:8080",
      ledgerHttpPort: 1234,
      pluginRegistry,
      logLevel,
    });

    await plugin.onPluginInit();

    // const channel = network.getChannel();

    // interface ListenerOptions {
    //   startBlock?: number | string | bigint;
    //   type?: EventType;
    //   checkpointer?: Checkpointer;
    // }
    const listenerOptions = { startBlock: 0 };

    /**
     * @param {String} listenerName the name of the event listener
     * @param {String} eventName the name of the event being listened to
     * @param {Function} callback the callback function with signature (error, event, blockNumber, transactionId, status)
     * @param {module:fabric-network.Network~EventListenerOptions} options
     **/
    contractEventListenerFabric =
      await routerContractFabric.addContractListener(
        async (event: unknown): Promise<void> => {
          /**
           * ```json
           * {
           *   "chaincodeId": "router",
           *   "eventName": "CCIPMessageSent",
           *   "payload": {
           *     "type": "Buffer",
           *     "data": [
           *       123, 34, 114, 101, 99, 101, 105, 118, 101, 114, 34, 58, 34, 97, 34, 44,
           *       34, 100, 97, 116, 97, 34, 58, 34, 98, 34, 44, 34, 116, 111, 107, 101, 110,
           *       65, 109, 111, 117, 110, 116, 115, 34, 58, 91, 123, 34, 116, 111, 107, 101,
           *       110, 34, 58, 34, 116, 111, 107, 101, 110, 65, 34, 44, 34, 97, 109, 111,
           *       117, 110, 116, 34, 58, 34, 49, 48, 48, 34, 125, 44, 123, 34, 116, 111,
           *       107, 101, 110, 34, 58, 34, 116, 111, 107, 101, 110, 66, 34, 44, 34, 97,
           *       109, 111, 117, 110, 116, 34, 58, 34, 50, 48, 48, 34, 125, 93, 44, 34, 102,
           *       101, 101, 84, 111, 107, 101, 110, 34, 58, 34, 99, 34, 44, 34, 101, 120,
           *       116, 114, 97, 65, 114, 103, 115, 34, 58, 34, 100, 34, 125
           *     ]
           *   }
           * }
           *```
           *
           * If you then deserialize the payload.data bytes into a JSON string then you get the folowing structure:
           * ```json
           * {
           *   receiver: 'a',
           *   data: 'b',
           *   tokenAmounts: [
           *     { token: 'tokenA', amount: '100' },
           *     { token: 'tokenB', amount: '200' }
           *   ],
           *   feeToken: 'c',
           *   extraArgs: 'd'
           * }
           * ```
           */
          const ctx = safeStringify(event);
          log.debug("Fabric Event Fired: router.CCIPMessageSent: %s", ctx);

          if (!hasKey(event, "payload")) {
            throw new Error("Fabric CCIPMessageSent: No payload");
          }
          if (typeof event.payload !== "object") {
            throw new Error("Fabric CCIPMessageSent: Non-object payload");
          }

          // if (!hasKey(event.payload, "data")) {
          //   throw new Error("Fabric CCIPMessageSent: No payload.data");
          // }
          if (!Buffer.isBuffer(event.payload)) {
            throw new Error("Fabric CCIPMessageSent: Non-buffer payload");
          }

          // FIXME(petermetz) - unchecked cast should not be needed here but it is...
          const payloadJson = event.payload.toString("utf-8");
          log.debug("PayloadJSON: %s", payloadJson);
          const payload = JSON.parse(payloadJson);
          log.debug(
            "Fabric CCIPMessageSent Payload: %s",
            safeStringify(payload),
          );

          if (!hasKey(payload, "feeToken")) {
            throw new Error("Fabric CCIPMessageSent: No feeToken");
          }
          if (typeof payload.feeToken !== "string") {
            throw new Error("Fabric CCIPMessageSent: Non-string feeToken");
          }

          if (!hasKey(payload, "receiver")) {
            throw new Error("Fabric CCIPMessageSent: No receiver");
          }
          if (typeof payload.receiver !== "string") {
            throw new Error("Fabric CCIPMessageSent: Non-string receiver");
          }

          if (!hasKey(payload, "tokenAmounts")) {
            throw new Error("Fabric CCIPMessageSent: No tokenAmounts");
          }
          if (!Array.isArray(payload.tokenAmounts)) {
            throw new Error("Fabric CCIPMessageSent: Non-array tokenAmounts");
          }

          if (!hasKey(payload, "data")) {
            throw new Error("Fabric CCIPMessageSent: No data");
          }
          if (typeof payload.data !== "string") {
            throw new Error("Fabric CCIPMessageSent: Non-string data");
          }

          if (!hasKey(payload, "extraArgs")) {
            throw new Error("Fabric CCIPMessageSent: No extraArgs");
          }
          if (typeof payload.extraArgs !== "string") {
            throw new Error("Fabric CCIPMessageSent: Non-string extraArgs");
          }

          const { feeToken, tokenAmounts, receiver, data, extraArgs } = payload;

          const receiverBuffer = Buffer.from(receiver, "hex");
          const receiverBytes = Uint8Array.from(receiverBuffer);

          const extraArgsBuffer = Buffer.from(extraArgs, "hex");
          const extraArgsBytes = Uint8Array.from(extraArgsBuffer);

          const clientEVM2AnyMessage2 = {
            receiver: receiverBytes,
            data,
            tokenAmounts,
            feeToken,
            extraArgs: extraArgsBytes,
          };

          log.debug(
            "clientEVM2AnyMessage2=%s",
            safeStringify(clientEVM2AnyMessage2),
          );

          try {
            //Works now
            const web3Res = await srcRouter.methods
              .ccipSend(destChainSelector, clientEVM2AnyMessage2)
              .send({
                from: srcWeb3SigningCredential.ethAccount,
                gas: 10_000_000n.toString(10),
              });
            const { blockNumber, cumulativeGasUsed, transactionHash } = web3Res;
            const ctx = { blockNumber, cumulativeGasUsed, transactionHash };
            log.debug("ccipSend() called on router OK: ", safeStringify(ctx));
            expect(web3Res).toBeTruthy();
          } catch (ex: unknown) {
            log.error("Web3 ccipSend failed:", ex);
            throw ex;
          }
        },
        listenerOptions,
      );

    log.debug("Fabric CCIP Router Contract Listener registered OK.");

    log.debug("Waiting for Chainlink nodes and jobs to be ready.");
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    log.debug("Waited for Chainlink nodes and jobs. Sending CCIP message...");

    const receiverAddr = infra.dstMaybeRevertMessageReceiver1Addr;
    const receiver = mustEncodeAddress(receiverAddr);
    const data = "0x".concat(helloBuffer.toString("hex"));
    log.debug("Sending CCIP Message with Data: %s", data);
    const extraArgs = getEvmExtraArgsV2({
      gasLimit: BigInt(200_003),
      allowOutOfOrder: true,
    });

    const clientEVM2AnyMessage = {
      receiver,
      data,
      tokenAmounts: [
        // {
        //   token: infra.srcLinkTokenAddr,
        //   amount: BigInt(200_000),
        // },
      ],
      feeToken: infra.srcLinkTokenAddr,
      extraArgs,
    };
    log.debug("clientEVM2AnyMessage=%s", safeStringify(clientEVM2AnyMessage));

    try {
      const ccipSendFee1 = await srcRouter.methods
        .getFee(destChainSelector, clientEVM2AnyMessage)
        .call();
      log.debug("ccipSendFee1=%o", ccipSendFee1);
    } catch (ex: unknown) {
      log.error("Failed to get ccipSendFee1: ", ex);
      throw ex;
    }

    log.debug("Invoking Fabric CCIP Router's CcipSend() method...");
    const receiverHex = Buffer.from(receiver).toString("hex");
    const extraArgsHex = Buffer.from(extraArgs).toString("hex");

    // receiver, data, feeToken, extraArgs, tokenAmountsJson string)
    const ccipSend = await apiFabric.runTransactionV1({
      contractName: fabricContractName,
      channelName: fabricChannelName,
      params: [receiverHex, data, infra.srcLinkTokenAddr, extraArgsHex, "[]"],
      methodName: "CcipSend",
      invocationType: FabricContractInvocationType.Send,
      signingCredential: {
        keychainId: fabricKeychainId,
        keychainRef: fabricKeychainEntryKey,
      },
    });
    expect(ccipSend).toBeTruthy();
    expect(ccipSend.data).toBeTruthy();
    log.debug(`Fabric Router.ccipSend() OK: %s`, safeStringify(ccipSend.data));

    // const startedAt = new Date();
    // const transmissions = await new Promise((resolve, reject) => {
    //   const task = "Polling for CCIP OffRamp.Transmitted Solidity Event";
    //   const timer = setInterval(() => {
    //     const now = new Date();
    //     const timeSpentWaitingMs = now.getTime() - startedAt.getTime();
    //     if (timeSpentWaitingMs > 600_000) {
    //       clearInterval(timer);
    //       reject(new Error(task.concat(" timed out after 600_000ms")));
    //     }
    //     const eventNames = safeStringify(evmEvents.map((x) => x.event));
    //     log.debug("%s - %dms events: %s", task, timeSpentWaitingMs, eventNames);

    //     // evmEvents.forEach(({ event, returnValues }, i) =>
    //     //   log.debug("\t\t%d\t%s: %s", i, event, safeStringify(returnValues)),
    //     // );

    //     const transmissions = evmEvents.filter(
    //       (e) => e.event === "ExecutionStateChanged",
    //     );
    //     if (transmissions.length > 0) {
    //       log.debug("Found %d EVM CCIP Transmissions.", transmissions.length);
    //       clearInterval(timer);
    //       resolve(transmissions);
    //     } else {
    //       log.debug("No EVM CCIP Transmissions found so far.");
    //     }
    //   }, 5000);
    // });

    // const transmissionsJson = safeStringify(transmissions);
    // log.debug("Got EVM CCIP transmission confirmations: %s", transmissionsJson);
    // expect(transmissions).toBeArray();
    // expect(transmissions).not.toBeEmpty();

    const sub = infra.dstOffRamp.events.ExecutionStateChanged();

    const eventLogWait = new Promise<EventLog>((resolve) => {
      sub.on("data", (eventLog) => {
        /**
         * "returnValues": {
         *   "0": "1",
         *   "1": "0x6fa239667bacb64f00433418028215f4723e4386861963cddb383526afa51eab",
         *   "2": "3",
         *   "3": "0xd2316ede",
         *   "__length__": 4,
         *   "sequenceNumber": "1",
         *   "messageId": "0x6fa239667bacb64f00433418028215f4723e4386861963cddb383526afa51eab",
         *   "state": "3",
         *   "returnData": "0xd2316ede"
         * },
         */
        const ctx = safeStringify(eventLog.returnValues);
        log.debug("infra.dstOffRamp.events.ExecutionStateChanged: %s", ctx);
        resolve(eventLog);
      });
    });
    expect(eventLogWait).toResolve();
    const eventLog = await eventLogWait;
    expect(eventLog).toBeObject();
    expect(eventLog).not.toBeEmpty();

    /**
     * ```solidity
     * /// @notice Enum listing the possible message execution states within the offRamp contract.
     * /// 0: UNTOUCHED never executed.
     * /// 1: IN_PROGRESS currently being executed, used a replay protection.
     * /// 2: SUCCESS successfully executed. End state.
     * /// 3: FAILURE unsuccessfully executed, manual execution is now enabled.
     * /// @dev RMN depends on this enum, if changing, please notify the RMN maintainers.
     * enum MessageExecutionState {
     *   UNTOUCHED,
     *   IN_PROGRESS,
     *   SUCCESS,
     *   FAILURE
     * }
     * ```
     */
    const newExecutionState = eventLog.returnValues.state;
    expect(newExecutionState).toEqual(BigInt(2));

    // const receiverAddr = infra.dstMaybeRevertMessageReceiver1Addr;
    // const receiver = mustEncodeAddress(receiverAddr);
    // const data = "0x".concat(helloBuffer.toString("hex"));
    // const extraArgs = getEvmExtraArgsV2({
    //   gasLimit: BigInt(200_003),
    //   allowOutOfOrder: true,
    // });
    // const clientEVM2AnyMessage = {
    //   receiver,
    //   data,
    //   tokenAmounts: [
    //     // {
    //     //   token: infra.srcLinkTokenAddr,
    //     //   amount: BigInt(200_000),
    //     // },
    //   ],
    //   feeToken: infra.srcLinkTokenAddr,
    //   extraArgs,
    // };

    // Mimic this line of the router's ccipSend method:
    // IERC20(message.feeToken).safeTransferFrom(msg.sender, onRamp, feeTokenAmount);
    // try {
    //   const feeTokenAmount = await srcRouter.methods
    //     .getFee(destChainSelector, clientEVM2AnyMessage)
    //     .call();
    //   log.debug("Got the feeTokenAmount: %o", feeTokenAmount);

    //   const ethBalance = await srcWeb3.eth.getBalance(
    //     srcWeb3SigningCredential.ethAccount,
    //   );
    //   log.debug("ethBalance=%d", ethBalance);

    //   const transferFromOut = await srcLinkToken.methods
    //     .transferFrom(
    //       srcWeb3SigningCredential.ethAccount,
    //       infra.srcOnRampAddr,
    //       feeTokenAmount,
    //     )
    //     .send({
    //       from: srcWeb3SigningCredential.ethAccount,
    //       gas: 10_000_000n.toString(10),
    //     });

    //   log.debug("transferFromOut OK: %s", JSON.stringify(transferFromOut));
    // } catch (ex: unknown) {
    //   log.error("Failed to send transferFrom(): ", ex);
    //   throw ex;
    // }

    // let ccipSendCount = 0;
    // await new Promise<void>((resolve, reject) => {
    //   const timer = setInterval(async () => {
    //     if (ccipSendCount > 10) {
    //       resolve();
    //       clearInterval(timer);
    //       return;
    //     }
    //     try {
    //       ccipSendCount++;
    //       //Works now
    //       const web3Res = await srcRouter.methods
    //         .ccipSend(destChainSelector, clientEVM2AnyMessage)
    //         .send({
    //           from: srcWeb3SigningCredential.ethAccount,
    //           gas: 10_000_000n.toString(10),
    //         });
    //       const { blockNumber, cumulativeGasUsed, transactionHash } = web3Res;
    //       const ctx = { blockNumber, cumulativeGasUsed, transactionHash };
    //       log.debug("ccipSend() called on router OK: ", safeStringify(ctx));
    //       expect(web3Res).toBeTruthy();
    //     } catch (ex: unknown) {
    //       log.error("Web3 ccipSend failed:", ex);
    //       clearInterval(timer);
    //       reject(ex);
    //       throw ex;
    //     }
    //   }, 1000);
    // });
  });
});

async function logAllEventsOfContract(opts: {
  readonly contractName: Readonly<string>;
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly contract: Readonly<Contract<never>>;
  readonly contractLogSubscriptions: Array<IUnsubscribeable>;
  readonly evmEvents: Array<EventLog>;
}): Promise<void> {
  const log = LoggerProvider.getOrCreate({
    level: opts.logLevel,
    label: "logAllEventsOfContract()",
  });
  try {
    const subscription = opts.contract.events.allEvents();
    opts.contractLogSubscriptions.push(subscription);
    subscription.on("data", (anEvent) => {
      opts.evmEvents.push(anEvent);
      const { event: eventName } = anEvent;
      log.debug("%s Event Fired => %s", opts.contractName, eventName);
    });
  } catch (ex: unknown) {
    const { contractName } = opts;
    const ctx = safeStringify({ contractName });
    log.error("Failed to set up allEvents event capture %s:", ctx, ex);
    throw ex;
  }
}

async function fundChainlinkNodeAccountsWithSomeEth(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly apiClient: Readonly<IChainlinkApiClient>;
  readonly nodeLabel: Readonly<string>;
  readonly dstWeb3: Readonly<Web3>;
  readonly srcWeb3: Readonly<Web3>;
  readonly sourceChainSelector: Readonly<bigint>;
  readonly destChainSelector: Readonly<bigint>;
  readonly destChainId: Readonly<bigint>;
  readonly sourceChainId: Readonly<bigint>;
}) {
  const log = LoggerProvider.getOrCreate({
    level: opts.logLevel,
    label: "fundChainlinkNodeAccountsWithSomeEth()-" + opts.nodeLabel,
  });
  log.debug("ENTER");
  const ethKeysOut = await opts.apiClient.getEthKeys({ limit: 10, offset: 0 });
  const ethKeys = ethKeysOut.response.data.data.ethKeys.results;
  log.debug("Fetched ETH keys OK: %d", ethKeys.length);
  const srcChainId = opts.sourceChainId.toString(10);
  const dstChainId = opts.destChainId.toString(10);

  // An array of objects that have "address" properties.
  const srcChainKeys = ethKeys.filter((x) => x.chain.id === srcChainId);
  log.debug("Found %d keys for the source chain.", srcChainKeys.length);

  // An array of objects that have "address" properties.
  const dstChainKeys = ethKeys.filter((x) => x.chain.id === dstChainId);
  log.debug("Found %d keys for the destination chain.", dstChainKeys.length);

  // finish the code here, send 10 ETH to all the addresses on the source and destination chains...
  //
  //
  //
  // Function to send ETH to addresses
  async function sendEth(
    web3: Readonly<Web3>,
    fromAccount: string,
    toAddress: string,
    amountInEth: string,
  ): Promise<void> {
    const amountInWei = web3.utils.toWei(amountInEth, "ether");
    try {
      const tx = await web3.eth.sendTransaction({
        from: fromAccount,
        to: toAddress,
        value: amountInWei,
      });
      log.debug(`Transaction successful: ${tx.transactionHash}`);
    } catch (error) {
      log.error(`Error sending ETH to ${toAddress}:`, error);
    }
  }

  const fundAccounts = async (
    web3: Readonly<Web3>,
    keys: { address: string }[],
    amount: string,
    chainName: string,
  ) => {
    const accounts = await web3.eth.getAccounts();
    const fundingAccount = accounts[0];
    log.debug(
      `Using funding account: ${fundingAccount} for chain ${chainName}`,
    );

    for (const key of keys) {
      log.debug(`Funding address: ${key.address} with ${amount} ETH`);
      await sendEth(web3, fundingAccount, key.address, amount);
    }
  };

  // Fund source chain accounts
  await fundAccounts(opts.srcWeb3, srcChainKeys, "10", "source chain");

  // Fund destination chain accounts
  await fundAccounts(opts.dstWeb3, dstChainKeys, "10", "destination chain");

  log.debug("All funding completed.");
}
