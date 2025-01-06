import "jest-extended";

import { Contract, Web3 } from "web3";

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { PluginImportType } from "@hyperledger/cactus-core-api";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { PluginFactoryLedgerConnector as PluginFactoryLedgerConnectorChainlink } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
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

const RouterAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "wrappedNative",
        type: "address",
      },
      {
        internalType: "address",
        name: "armProxy",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "BadARMSignal",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedToSendValue",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientFeeTokenAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMsgValue",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "InvalidRecipientAddress",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "chainSelector",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "offRamp",
        type: "address",
      },
    ],
    name: "OffRampMismatch",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyOffRamp",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "destChainSelector",
        type: "uint64",
      },
    ],
    name: "UnsupportedDestinationChain",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "messageId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "sourceChainSelector",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "offRamp",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "calldataHash",
        type: "bytes32",
      },
    ],
    name: "MessageExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "sourceChainSelector",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "offRamp",
        type: "address",
      },
    ],
    name: "OffRampAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "sourceChainSelector",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "offRamp",
        type: "address",
      },
    ],
    name: "OffRampRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint64",
        name: "destChainSelector",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "onRamp",
        type: "address",
      },
    ],
    name: "OnRampSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "OwnershipTransferRequested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "MAX_RET_BYTES",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "destChainSelector",
            type: "uint64",
          },
          {
            internalType: "address",
            name: "onRamp",
            type: "address",
          },
        ],
        internalType: "struct Router.OnRamp[]",
        name: "onRampUpdates",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint64",
            name: "sourceChainSelector",
            type: "uint64",
          },
          {
            internalType: "address",
            name: "offRamp",
            type: "address",
          },
        ],
        internalType: "struct Router.OffRamp[]",
        name: "offRampRemoves",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint64",
            name: "sourceChainSelector",
            type: "uint64",
          },
          {
            internalType: "address",
            name: "offRamp",
            type: "address",
          },
        ],
        internalType: "struct Router.OffRamp[]",
        name: "offRampAdds",
        type: "tuple[]",
      },
    ],
    name: "applyRampUpdates",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "destinationChainSelector",
        type: "uint64",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "receiver",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            components: [
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            internalType: "struct Client.EVMTokenAmount[]",
            name: "tokenAmounts",
            type: "tuple[]",
          },
          {
            internalType: "address",
            name: "feeToken",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "extraArgs",
            type: "bytes",
          },
        ],
        internalType: "struct Client.EVM2AnyMessage",
        name: "message",
        type: "tuple",
      },
    ],
    name: "ccipSend",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getArmProxy",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "destinationChainSelector",
        type: "uint64",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "receiver",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            components: [
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            internalType: "struct Client.EVMTokenAmount[]",
            name: "tokenAmounts",
            type: "tuple[]",
          },
          {
            internalType: "address",
            name: "feeToken",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "extraArgs",
            type: "bytes",
          },
        ],
        internalType: "struct Client.EVM2AnyMessage",
        name: "message",
        type: "tuple",
      },
    ],
    name: "getFee",
    outputs: [
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOffRamps",
    outputs: [
      {
        components: [
          {
            internalType: "uint64",
            name: "sourceChainSelector",
            type: "uint64",
          },
          {
            internalType: "address",
            name: "offRamp",
            type: "address",
          },
        ],
        internalType: "struct Router.OffRamp[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "destChainSelector",
        type: "uint64",
      },
    ],
    name: "getOnRamp",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "chainSelector",
        type: "uint64",
      },
    ],
    name: "getSupportedTokens",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getWrappedNative",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "chainSelector",
        type: "uint64",
      },
    ],
    name: "isChainSupported",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "sourceChainSelector",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "offRamp",
        type: "address",
      },
    ],
    name: "isOffRamp",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "recoverTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "messageId",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "sourceChainSelector",
            type: "uint64",
          },
          {
            internalType: "bytes",
            name: "sender",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            components: [
              {
                internalType: "address",
                name: "token",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            internalType: "struct Client.EVMTokenAmount[]",
            name: "destTokenAmounts",
            type: "tuple[]",
          },
        ],
        internalType: "struct Client.Any2EVMMessage",
        name: "message",
        type: "tuple",
      },
      {
        internalType: "uint16",
        name: "gasForCallExactCheck",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "gasLimit",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "routeMessage",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "retData",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "gasUsed",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "wrappedNative",
        type: "address",
      },
    ],
    name: "setWrappedNative",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "typeAndVersion",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

describe("PluginLedgerConnectorChainlink", () => {
  const logLevel: LogLevelDesc = "DEBUG";

  const log = LoggerProvider.getOrCreate({
    label: "chainlink-fabric-relay.test.ts",
    level: logLevel,
  });

  // In the Go code this is what it looks like:
  //
  // []uint8 len: 5, cap: 5, [104,101,108,108,111]
  // string() =
  // "hello"
  // [0] =
  // 104 = 0x68
  // [1] =
  // 101 = 0x65
  // [2] =
  // 108 = 0x6c
  // [3] =
  // 108 = 0x6c
  // [4] =
  // 111 = 0x6f
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

  // spells "fabric" in ASCII
  // 112568449526115n as a decimal number
  const destChainSelector = BigInt(
    "0b011001100110000101100010011100100110100101100011",
  );

  const sourceChainSelector = BigInt(1337n);

  const genesisWeb3SigningCredential: Web3SigningCredential = {
    ethAccount: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
    secret: "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
    type: Web3SigningCredentialType.PrivateKeyHex,
  };

  const srcWeb3 = new Web3("http://127.0.0.1:8545");
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

  const dstWeb3 = new Web3("http://127.0.0.1:9545");
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
    const seedOut = await srcWeb3.eth.sendTransaction({
      from: genesisWeb3SigningCredential.ethAccount,
      to: srcWeb3SigningCredential.ethAccount,
      value: 999_999_999_999_999_999_999n,
      gas: 100_000_000n,
    });
    log.debug("SeedOut=%s", JSON.stringify(seedOut));

    const balance = await srcWeb3.eth.getBalance(
      srcWeb3SigningCredential.ethAccount,
    );
    log.debug("Balance of srcWeb3SigningCredential after seed: %o", balance);
  });

  beforeAll(async () => {
    const seedOut = await dstWeb3.eth.sendTransaction({
      from: genesisWeb3SigningCredential.ethAccount,
      to: dstWeb3SigningCredential.ethAccount,
      value: 999_999_999_999_999_999_999n,
      gas: 100_000_000n,
    });
    log.debug("SeedOut=%s", JSON.stringify(seedOut));

    const balance = await dstWeb3.eth.getBalance(
      dstWeb3SigningCredential.ethAccount,
    );
    log.debug("Balance of dstWeb3SigningCredential after seed: %o", balance);
  });

  beforeAll(async () => {
    infra = await deployBesuCcipContracts({
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

    const srcRouter = new Contract(RouterAbi, infra.srcRouterAddr, srcWeb3);
    const srcLinkToken = new Contract(
      LinkTokenAbi,
      infra.srcLinkTokenAddr,
      srcWeb3,
    );
    const srcOnRamp = new Contract(OnRampAbi, infra.srcOnRampAddr, srcWeb3);
    const dstOffRamp = new Contract(OffRampAbi, infra.dstOffRampAddr, dstWeb3);

    srcWeb3.eth.defaultAccount = genesisWeb3SigningCredential.ethAccount;
    dstWeb3.eth.defaultAccount = genesisWeb3SigningCredential.ethAccount;

    try {
      const linkAvailableForPayment1 = await srcOnRamp.methods
        .linkAvailableForPayment()
        .call();
      log.debug("linkAvailableForPayment1=%o", linkAvailableForPayment1);
    } catch (ex: unknown) {
      log.error("Failed to get linkAvailableForPayment1: ", ex);
    }

    try {
      const getDynamicConfig = await dstOffRamp.methods
        .getDynamicConfig()
        .call();
      log.debug("getDynamicConfig=%o", getDynamicConfig);
    } catch (ex: unknown) {
      log.error("Failed to get getDynamicConfig: ", ex);
    }

    try {
      const linkBalance1 = await srcLinkToken.methods
        .balanceOf(genesisWeb3SigningCredential.ethAccount)
        .call();
      log.debug("LinkBalance1 (ETH_Whale_1)=%o", linkBalance1);
    } catch (ex: unknown) {
      log.error("Failed to get LinkBalance1: ", ex);
    }

    try {
      const linkBalance2 = await srcLinkToken.methods
        .balanceOf(infra.srcOnRampAddr)
        .call();
      log.debug("LinkBalance2 (OnRamp)=%o", linkBalance2);
    } catch (ex: unknown) {
      log.error("Failed to get LinkBalance2: ", ex);
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
        {
          token: infra.srcLinkTokenAddr,
          amount: BigInt(200_000),
        },
      ],
      feeToken: infra.srcLinkTokenAddr,
      extraArgs,
    };

    // Mimic this line of the router's ccipSend method:
    // IERC20(message.feeToken).safeTransferFrom(msg.sender, onRamp, feeTokenAmount);
    try {
      const feeTokenAmount = await srcRouter.methods
        .getFee(destChainSelector, clientEVM2AnyMessage)
        .call();
      log.debug("Got the feeTokenAmount: %o", feeTokenAmount);

      const ethBalance = await srcWeb3.eth.getBalance(
        srcWeb3SigningCredential.ethAccount,
      );
      log.debug("ethBalance=%d", ethBalance);

      const transferFromOut = await srcLinkToken.methods
        .transferFrom(
          srcWeb3SigningCredential.ethAccount,
          infra.srcOnRampAddr,
          feeTokenAmount,
        )
        .send({
          from: srcWeb3SigningCredential.ethAccount,
          gas: "77777777",
        });

      log.debug("transferFromOut OK: %s", JSON.stringify(transferFromOut));
    } catch (ex: unknown) {
      log.error("Failed to send transferFrom(): ", ex);
    }

    try {
      const ccipSendFee1 = await srcRouter.methods
        .getFee(destChainSelector, clientEVM2AnyMessage)
        .call();
      log.debug("ccipSendFee1=%o", ccipSendFee1);
    } catch (ex: unknown) {
      log.error("Failed to get ccipSendFee1: ", ex);
    }

    try {
      //Works now
      const web3Res = await srcRouter.methods
        .ccipSend(destChainSelector, clientEVM2AnyMessage)
        .send({
          from: genesisWeb3SigningCredential.ethAccount,
          gas: "88888888888",
        });
      log.debug("************* SUCCESS", web3Res);
    } catch (ex: unknown) {
      log.error("Web3 ccipSend failed:", ex);
    }
  });
});
