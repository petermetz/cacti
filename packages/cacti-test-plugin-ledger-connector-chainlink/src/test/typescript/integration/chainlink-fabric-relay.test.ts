import "jest-extended";

import { Contract, Web3, WebSocketProvider } from "web3";

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { PluginImportType } from "@hyperledger/cactus-core-api";
import { PluginRegistry } from "@hyperledger/cactus-core";
import {
  createApiclient,
  IAuthArgs,
  IConnectionArgs,
  PluginFactoryLedgerConnector as PluginFactoryLedgerConnectorChainlink,
} from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { mustEncodeAddress } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { getEvmExtraArgsV2 } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
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
import { MockV3AggregatorContractAbi } from "../../../main/typescript/infra/besu/mock-v3-aggregator-factory";
import { setUpNodesAndJobs } from "../../../main/typescript/infra/besu/set-up-nodes-and-jobs";

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

  const contractLogSubscriptions: Array<{ unsubscribe: () => Promise<void> }> =
    [];

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

  // spells "fabric" in ASCII
  // 112568449526115n as a decimal number
  // const destChainSelector = BigInt(
  //   "0b011001100110000101100010011100100110100101100011",
  // );

  // const sourceChainSelector = BigInt(3379446385462418246n);

  const genesisWeb3SigningCredential: Web3SigningCredential = {
    ethAccount: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
    secret: "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
    type: Web3SigningCredentialType.PrivateKeyHex,
  };

  const srcWeb3WsProvider = new WebSocketProvider("ws://127.0.0.1:8546");
  // const srcWeb3 = new Web3("http://127.0.0.1:8545");
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
  // const dstWeb3 = new Web3("http://127.0.0.1:9545");
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

  log.debug("SrcWeb3 Account: %o", JSON.stringify(srcAccount));
  log.debug("DstWeb3 Account: %o", JSON.stringify(dstAccount));

  let infra: IDeployBesuCcipContractsOutput;

  beforeAll(() => {
    log.warn("Note: Overriding BigInt.prototype.toJSON() to call .toString()");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (BigInt.prototype as any).toJSON = function () {
      return this.toString();
    };
  });

  beforeAll(async () => {
    log.debug("Seeding source chain test account with whale money");
    const srcSeedOut = await srcWeb3.eth.sendTransaction({
      from: genesisWeb3SigningCredential.ethAccount,
      to: srcWeb3SigningCredential.ethAccount,
      value: 999_999_999_999_999_999_999n,
      gas: 10_000_000n,
    });
    log.debug("Src SeedOut=%s", JSON.stringify(srcSeedOut));

    const srcBalance = await srcWeb3.eth.getBalance(
      srcWeb3SigningCredential.ethAccount,
    );
    log.debug("Balance of srcWeb3SigningCredential after seed: %o", srcBalance);

    log.debug("Seeding dst chain test account with whale money");
    const seedOut = await dstWeb3.eth.sendTransaction({
      from: genesisWeb3SigningCredential.ethAccount,
      to: dstWeb3SigningCredential.ethAccount,
      value: 999_999_999_999_999_999_999n,
      gas: 10_000_000n,
    });
    log.debug("Dst SeedOut=%s", JSON.stringify(seedOut));

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

    srcWeb3.eth.defaultAccount = srcWeb3SigningCredential.ethAccount;
    dstWeb3.eth.defaultAccount = dstWeb3SigningCredential.ethAccount;

    const srcRouter = new Contract(RouterAbi, infra.srcRouterAddr, srcWeb3);
    const srcLinkToken = new Contract(
      LinkTokenAbi,
      infra.srcLinkTokenAddr,
      srcWeb3,
    );
    const srcOnRamp = new Contract(OnRampAbi, infra.srcOnRampAddr, srcWeb3);
    const dstOffRamp = new Contract(OffRampAbi, infra.dstOffRampAddr, dstWeb3);
    const srcMockV3Aggregator = new Contract(
      MockV3AggregatorContractAbi,
      infra.srcMockV3AggregatorAddr,
      srcWeb3,
    );
    const dstMockV3Aggregator = new Contract(
      MockV3AggregatorContractAbi,
      infra.dstMockV3AggregatorAddr,
      dstWeb3,
    );

    try {
      // big.NewInt(50), big.NewInt(17000000), big.NewInt(1000), big.NewInt(1000)
      const srcUpdateRoundDataOut = await srcMockV3Aggregator.methods
        .updateRoundData(50n, 17_000_000n, 1_000n, 1_000n)
        .send({ from: srcWeb3SigningCredential.ethAccount });
      log.debug("srcUpdateRoundDataOut=%o", srcUpdateRoundDataOut);
    } catch (ex: unknown) {
      log.error("Failed to get srcUpdateRoundDataOut: ", ex);
      throw ex;
    }

    try {
      // (big.NewInt(50), big.NewInt(8000000), big.NewInt(1000), big.NewInt(1000))
      const dstUpdateRoundDataOut = await dstMockV3Aggregator.methods
        .updateRoundData(50n, 8_000_000n, 1_000n, 1_000n)
        .send({ from: dstWeb3SigningCredential.ethAccount });
      log.debug("dstUpdateRoundDataOut=%o", dstUpdateRoundDataOut);
    } catch (ex: unknown) {
      log.error("Failed to get dstUpdateRoundDataOut: ", ex);
      throw ex;
    }

    const clApiClientOut1 = await createApiclient({
      authArgs: authArgs1,
      connectionArgs: connectionArgs1,
      level: logLevel,
    });

    const clApiClientOut2 = await createApiclient({
      authArgs: authArgs2,
      connectionArgs: connectionArgs2,
      level: logLevel,
    });

    const clApiClientOut3 = await createApiclient({
      authArgs: authArgs3,
      connectionArgs: connectionArgs3,
      level: logLevel,
    });

    const clApiClientOut4 = await createApiclient({
      authArgs: authArgs4,
      connectionArgs: connectionArgs4,
      level: logLevel,
    });

    const clApiClientOut5 = await createApiclient({
      authArgs: authArgs5,
      connectionArgs: connectionArgs5,
      level: logLevel,
    });

    const priceGetterConfig = {};

    const { jobParams } = await setUpNodesAndJobs({
      sourceChainId,
      destChainId,
      sourceChainSelector,
      destChainSelector,
      contracts: infra,
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
    expect(jobParams).toBeTruthy();

    // END SECTION SETTING UP THE ENVIRONMENT
    //=========================================================================
    //=========================================================================
    //=========================================================================
    //=========================================================================
    //=========================================================================
    //=========================================================================

    try {
      const linkAvailableForPayment1 = await srcOnRamp.methods
        .linkAvailableForPayment()
        .call();
      log.debug("linkAvailableForPayment1=%o", linkAvailableForPayment1);
    } catch (ex: unknown) {
      log.error("Failed to get linkAvailableForPayment1: ", ex);
      throw ex;
    }

    try {
      const getDynamicConfig = await dstOffRamp.methods
        .getDynamicConfig()
        .call();
      log.debug("getDynamicConfig=%o", getDynamicConfig);
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
      log.debug("Link Approval 1 (ETH_Whale_1)=%o", linkApproval);
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
      log.debug("Link Approval 2 (srcOnRamp)=%o", linkApproval);
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
      log.debug("Link Allowance -2 (ETH_Whale_1)=%o", linkAllowance);
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
      log.debug("Link Allowance -3 (srcOnRamp)=%o", linkAllowance3);
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

    try {
      const subscription = srcRouter.events.DebugMessageLogged();
      contractLogSubscriptions.push(subscription);
      subscription.on("data", (anEvent) => {
        log.debug("srcRouter.DebugLogEvent msg=%s", anEvent.returnValues.msg);
      });
    } catch (ex: unknown) {
      log.error("Failed to set up DebugMessageLogged event capture:", ex);
      throw ex;
    }

    try {
      const subscription = dstOffRamp.events.ExecutionStateChanged();
      contractLogSubscriptions.push(subscription);
      subscription.on("data", (anEvent) => {
        log.debug(
          "dstOffRamp.ExecutionStateChanged msg=%s",
          JSON.stringify(anEvent.returnValues, null, 4),
        );
      });
    } catch (ex: unknown) {
      log.error("Failed to set up ExecutionStateChanged event capture:", ex);
      throw ex;
    }

    try {
      const subscription = dstOffRamp.events.allEvents();
      contractLogSubscriptions.push(subscription);
      subscription.on("data", (anEvent) => {
        log.debug(
          "dstOffRamp.allEvents:%s msg=%s",
          anEvent.event,
          JSON.stringify(anEvent.returnValues, null, 4),
        );
      });
    } catch (ex: unknown) {
      log.error("Failed to set up allEvents event capture:", ex);
      throw ex;
    }

    try {
      const subscription = srcOnRamp.events.CCIPSendRequested();
      contractLogSubscriptions.push(subscription);
      subscription.on("data", (anEvent) => {
        log.debug(
          "srcOnRamp.CCIPSendRequested msg=%s",
          JSON.stringify(anEvent.returnValues, null, 4),
        );
      });
    } catch (ex: unknown) {
      log.error("Failed to set up CCIPSendRequested event capture:", ex);
      throw ex;
    }

    try {
      const subscription = srcOnRamp.events.allEvents();
      contractLogSubscriptions.push(subscription);
      subscription.on("data", (anEvent) => {
        log.debug(
          "srcOnRamp.allEvents: %s msg=%s",
          anEvent.event,
          JSON.stringify(anEvent.returnValues, null, 4),
        );
      });
    } catch (ex: unknown) {
      log.error("Failed to set up allEvents event capture:", ex);
      throw ex;
    }

    try {
      //Works now
      const web3Res = await srcRouter.methods
        .ccipSend(destChainSelector, clientEVM2AnyMessage)
        .send({
          from: srcWeb3SigningCredential.ethAccount,
          gas: 10_000_000n.toString(10),
        });
      log.debug("************* SUCCESS", web3Res);
      expect(web3Res).toBeTruthy();
    } catch (ex: unknown) {
      log.error("Web3 ccipSend failed:", ex);
      throw ex;
    }
  });
});
