import "jest-extended";

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { PluginImportType } from "@hyperledger/cactus-core-api";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { PluginFactoryLedgerConnector as PluginFactoryLedgerConnectorChainlink } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { awaitOffRampTxV1Impl } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { mustEncodeAddress } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { getEVMExtraArgsV1 } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import {
  BesuApiClient,
  Web3SigningCredential,
  Web3SigningCredentialType,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { BesuApiClientOptions } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import { deployBesuCcipContracts } from "../../../main/typescript/infra/besu/deploy-besu-ccip-contracts";
import { ccipSend } from "../../../main/typescript/infra/besu/ccip-send";

describe("PluginLedgerConnectorChainlink", () => {
  const logLevel: LogLevelDesc = "DEBUG";

  const log = LoggerProvider.getOrCreate({
    label: "chainlink-fabric-relay.test.ts",
    level: logLevel,
  });

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

  // spells "fabric" in ASCII
  // 112568449526115n as a decimal number
  const destChainSelector = BigInt(
    "0b011001100110000101100010011100100110100101100011",
  );

  const sourceChainSelector = BigInt(1337n);

  const web3SigningCredential: Web3SigningCredential = {
    ethAccount: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
    secret: "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
    type: Web3SigningCredentialType.PrivateKeyHex,
  };

  let deploymentResult: any;

  beforeAll(() => {
    log.warn("Note: Overriding BigInt.prototype.toJSON() to call .toString()");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (BigInt.prototype as any).toJSON = function () {
      return this.toString();
    };
  });

  beforeAll(async () => {
    deploymentResult = await deployBesuCcipContracts({
      sourceChainSelector,
      destChainSelector,
      srcApiClient,
      sourceFinalityDepth: 2,
      dstApiClient,
      destFinalityDepth: 2,
      tokenDecimals: 18, // If this is set to 15, deployments get reverted
      web3SigningCredential,
      logLevel,
    });

    log.info("CCIP Contract Addresses on Besu: %o", deploymentResult);
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

    const txFinishedPromise = awaitOffRampTxV1Impl({
      ccipMessageId: "FIXME",
      logLevel: "DEBUG",
      offRampAddress: deploymentResult.dstOffRampAddr,
    });

    // extraArgs, err := testhelpers.GetEVMExtraArgsV1(big.NewInt(200_003),
    const extraArgs = getEVMExtraArgsV1({ gasLimit: 99999999n, strict: false });
    // router.ClientEVM2AnyMessage{
    //   Receiver:     testhelpers.MustEncodeAddress(t, ccipTH.Dest.Receivers[0].Receiver.Address()),
    //   Data:         utils.RandomAddress().Bytes(),
    //   TokenAmounts: []router.ClientEVMTokenAmount{},
    //   FeeToken:     ccipTH.Source.LinkToken.Address(),
    //   ExtraArgs:    extraArgs,
    // }
    const receiverAddr = deploymentResult.dstMaybeRevertMessageReceiver1Addr;
    const abiEncodedReceiverAddrBytes = mustEncodeAddress(receiverAddr);
    log.debug("Receiver Address: %s", receiverAddr);
    log.debug(
      "abiEncodedReceiverAddrBytes: %s",
      abiEncodedReceiverAddrBytes.join("; "),
    );

    const clientEVM2AnyMessage = {
      receiver: Array.from(abiEncodedReceiverAddrBytes),
      data: Array.from(Buffer.from("Hello CCIP!", "utf-8")),
      tokenAmounts: [
        {
          token: deploymentResult.srcLinkTokenAddr,
          amount: BigInt(200_000),
        },
      ],
      feeToken: deploymentResult.srcLinkTokenAddr,
      extraArgs: Array.from(extraArgs),
    };

    log.debug("JSON clientEVM2AnyMessage:");
    log.debug(JSON.stringify(clientEVM2AnyMessage, null, 4));
    // Things to check:
    // 1. source chain locator 1337 vs 1337n
    // 2. decimal places 18 vs 15
    // 3. other amounts that were very large numbers (25 zeros or similar) that we just
    // reduced because it allowed us to deploy the contracts at the time (but we
    // never figured out why was it reverting with a weird code...)
    // 4. https://besu.hyperledger.org/24.5.0/public-networks/how-to/troubleshoot/trace-transactions
    const { resCcipSend } = await ccipSend({
      logLevel,
      apiClient: srcApiClient,
      clientEVM2AnyMessage,
      destinationChainSelector: destChainSelector,
      routerAddr: deploymentResult.srcRouterAddr,
      web3SigningCredential,
    });
    log.info("CCIP Send finished OK: %o", resCcipSend);

    expect(txFinishedPromise).toResolve();
  });
});
