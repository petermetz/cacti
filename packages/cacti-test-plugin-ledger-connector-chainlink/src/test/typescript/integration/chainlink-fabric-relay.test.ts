import safeStringify from "fast-safe-stringify";
import { Contract, Web3, WebSocketProvider } from "web3";

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { PluginImportType } from "@hyperledger/cactus-core-api";
import { PluginRegistry } from "@hyperledger/cactus-core";
import {
  createApiClient,
  createDefaultCommitOffchainConfig,
  createDefaultCommitOnchainConfig,
  createDefaultExecOffchainConfig,
  createDefaultExecOnchainConfig,
  IAuthArgs,
  IChainlinkApiClient,
  IConnectionArgs,
  PluginFactoryLedgerConnector as PluginFactoryLedgerConnectorChainlink,
} from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { mustEncodeAddress } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { getEvmExtraArgsV2 } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { IOracleIdentityExtra } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import {
  BesuApiClient,
  Web3SigningCredential,
  Web3SigningCredentialType,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { BesuApiClientOptions } from "@hyperledger/cactus-plugin-ledger-connector-besu";

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

  const helloBuffer = Buffer.from("hello", "utf-8");

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

  log.debug("SrcWeb3 Accounts: %s", safeStringify(srcAccount));
  log.debug("DstWeb3 Accounts: %s", safeStringify(dstAccount));

  let infra: IDeployBesuCcipContractsOutput;
  let srcRouter: Contract<typeof RouterAbi>;

  beforeAll(() => {
    log.warn("Note: Overriding BigInt.prototype.toJSON() to call .toString()");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (BigInt.prototype as any).toJSON = function () {
      return this.toString();
    };
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
    });

    const dstMockRmn = new Contract(MockRmnAbi, infra.dstMockRmnAddr, dstWeb3);
    await logAllEventsOfContract({
      logLevel,
      contract: dstMockRmn,
      contractLogSubscriptions,
      contractName: "dstMockRmn",
    });

    const srcMockRmn = new Contract(MockRmnAbi, infra.srcMockRmnAddr, srcWeb3);
    await logAllEventsOfContract({
      logLevel,
      contract: srcMockRmn,
      contractLogSubscriptions,
      contractName: "srcMockRmn",
    });

    srcRouter = new Contract(RouterAbi, infra.srcRouterAddr, srcWeb3);
    await logAllEventsOfContract({
      logLevel,
      contract: srcRouter,
      contractLogSubscriptions,
      contractName: "srcRouter",
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
      contractName: "srcOnRamp",
    });

    const srcOnRamp = new Contract(OnRampAbi, infra.srcOnRampAddr, srcWeb3);
    await logAllEventsOfContract({
      logLevel,
      contract: srcOnRamp,
      contractLogSubscriptions,
      contractName: "srcOnRamp",
    });

    const dstOffRamp = new Contract(OffRampAbi, infra.dstOffRampAddr, dstWeb3);
    await logAllEventsOfContract({
      logLevel,
      contract: dstOffRamp,
      contractLogSubscriptions,
      contractName: "dstOffRamp",
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

    log.debug("Waiting for Chainlink nodes and jobs to be ready.");
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    log.debug("Waited for Chainlink nodes and jobs. Sending CCIP message...");

    const receiverAddr = infra.dstMaybeRevertMessageReceiver1Addr;
    const receiver = mustEncodeAddress(receiverAddr);
    const data = "0x".concat(helloBuffer.toString("hex"));
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

    try {
      const ccipSendFee1 = await srcRouter.methods
        .getFee(destChainSelector, clientEVM2AnyMessage)
        .call();
      log.debug("ccipSendFee1=%o", ccipSendFee1);
    } catch (ex: unknown) {
      log.error("Failed to get ccipSendFee1: ", ex);
      throw ex;
    }

    let ccipSendCount = 0;
    await new Promise<void>((resolve) => {
      setInterval(async () => {
        if (ccipSendCount > 100) {
          resolve();
        }
        try {
          ccipSendCount++;
          //Works now
          const web3Res = await srcRouter.methods
            .ccipSend(destChainSelector, clientEVM2AnyMessage)
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
      }, 5000);
    });
  });
});

async function logAllEventsOfContract(opts: {
  readonly contractName: Readonly<string>;
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly contract: Readonly<Contract<never>>;
  readonly contractLogSubscriptions: Array<IUnsubscribeable>;
}): Promise<void> {
  const log = LoggerProvider.getOrCreate({
    level: opts.logLevel,
    label: "logAllEventsOfContract()",
  });
  try {
    const subscription = opts.contract.events.allEvents();
    opts.contractLogSubscriptions.push(subscription);
    subscription.on("data", (anEvent) => {
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
