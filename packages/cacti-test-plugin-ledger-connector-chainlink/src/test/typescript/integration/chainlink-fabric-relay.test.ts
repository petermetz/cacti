import "jest-extended";

import {
  Logger,
  LoggerProvider,
  LogLevelDesc,
} from "@hyperledger/cactus-common";
import { PluginImportType } from "@hyperledger/cactus-core-api";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { PluginFactoryLedgerConnector as PluginFactoryLedgerConnectorChainlink } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { awaitOffRampTxV1Impl } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import {
  BesuApiClient,
  Web3SigningCredentialType,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { BesuApiClientOptions } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as LinkTokenDeployReq from "../../json/ccip/contracts/LinkToken.cacti.deploy.besu.json";
import * as RouterDeployReq from "../../json/ccip/contracts/Router.cacti.deploy.besu.tpl.json";
import * as SenderDeployReq from "../../json/ccip/contracts/Sender.cacti.deploy.besu.tpl.json";
import { deployBesuRmn } from "../../../main/typescript/infra/besu/deploy-besu-rmn";

async function deployBesuLinkToken(opts: {
  readonly log: Readonly<Logger>;
  readonly apiClient: Readonly<BesuApiClient>;
}): Promise<{ readonly contractAddress: Readonly<string> }> {
  const { log, apiClient } = opts;

  const { bytecode, contractAbi, contractName, gas, web3SigningCredential } =
    LinkTokenDeployReq;

  const res = await apiClient.deployContractSolBytecodeNoKeychainV1({
    bytecode,
    constructorArgs: [],
    contractAbi,
    contractName,
    web3SigningCredential: {
      ...web3SigningCredential,
      type: Web3SigningCredentialType.PrivateKeyHex,
    },
    gas,
  });
  log.info("CCIP LinkToken to Besu ledger deployed OK: %o", res.data);

  const {
    data: {
      transactionReceipt: { contractAddress },
    },
  } = res;

  if (!contractAddress) {
    throw new Error("deployBesuLinkToken() contractAddress is falsy.");
  }
  return { contractAddress };
}

async function deployBesuRouter(opts: {
  readonly log: Readonly<Logger>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly constructorArgs: Array<string>;
}): Promise<{ readonly contractAddress: Readonly<string> }> {
  const { log, apiClient, constructorArgs } = opts;

  const { bytecode, contractAbi, contractName, gas, web3SigningCredential } =
    RouterDeployReq;

  const res = await apiClient.deployContractSolBytecodeNoKeychainV1({
    bytecode,
    constructorArgs,
    contractAbi,
    contractName,
    web3SigningCredential: {
      ...web3SigningCredential,
      type: Web3SigningCredentialType.PrivateKeyHex,
    },
    gas,
  });
  log.info("CCIP Router to Besu ledger deployed OK: %o", res.data);

  const {
    data: {
      transactionReceipt: { contractAddress },
    },
  } = res;

  if (!contractAddress) {
    throw new Error("deployBesuRouter() contractAddress is falsy.");
  }
  return { contractAddress };
}

async function deployBesuSender(opts: {
  readonly log: Readonly<Logger>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly constructorArgs: Array<string>;
}): Promise<{ readonly contractAddress: Readonly<string> }> {
  const { log, apiClient, constructorArgs } = opts;

  const { bytecode, contractAbi, contractName, gas, web3SigningCredential } =
    SenderDeployReq;

  const res = await apiClient.deployContractSolBytecodeNoKeychainV1({
    bytecode,
    constructorArgs,
    contractAbi,
    contractName,
    web3SigningCredential: {
      ...web3SigningCredential,
      type: Web3SigningCredentialType.PrivateKeyHex,
    },
    gas,
  });
  log.info("CCIP Sender to Besu ledger deployed OK: %o", res.data);

  const {
    data: {
      transactionReceipt: { contractAddress },
    },
  } = res;

  if (!contractAddress) {
    throw new Error("deployBesuSender() contractAddress is falsy.");
  }
  return { contractAddress };
}

// async function deployBesuOnRamp(opts: {
//   readonly log: Readonly<Logger>;
//   readonly apiClient: Readonly<BesuApiClient>;
//   readonly constructorArgs: Array<string>;
// }): Promise<{ readonly contractAddress: Readonly<string> }> {
//   const { log, apiClient, constructorArgs } = opts;

//   const { bytecode, contractAbi, contractName, gas, web3SigningCredential } =
//     OnRampDeployReq;

//   const res = await apiClient.deployContractSolBytecodeNoKeychainV1({
//     bytecode,
//     constructorArgs,
//     contractAbi,
//     contractName,
//     web3SigningCredential: {
//       ...web3SigningCredential,
//       type: Web3SigningCredentialType.PrivateKeyHex,
//     },
//     gas,
//   });
//   log.info("CCIP OnRamp to Besu ledger deployed OK: %o", res.data);

//   const {
//     data: {
//       transactionReceipt: { contractAddress },
//     },
//   } = res;

//   if (!contractAddress) {
//     throw new Error("deployBesuOnRamp() contractAddress is falsy.");
//   }
//   return { contractAddress };
// }

// async function deployBesuOffRamp(opts: {
//   readonly log: Readonly<Logger>;
//   readonly apiClient: Readonly<BesuApiClient>;
//   readonly constructorArgs: Array<unknown>;
// }): Promise<{ readonly contractAddress: Readonly<string> }> {
//   const { log, apiClient, constructorArgs } = opts;

//   const { bytecode, contractAbi, contractName, gas, web3SigningCredential } =
//     OffRampDeployReq;

//   const { data } = await apiClient.deployContractSolBytecodeNoKeychainV1({
//     bytecode,
//     constructorArgs,
//     contractAbi,
//     contractName,
//     web3SigningCredential: {
//       ...web3SigningCredential,
//       type: Web3SigningCredentialType.PrivateKeyHex,
//     },
//     gas,
//   });
//   const {
//     transactionReceipt: { contractAddress },
//   } = data;

//   log.debug("CCIP OffRamp Besu deployed: %o", contractAddress);

//   if (!contractAddress) {
//     throw new Error("deployBesuOffRamp() contractAddress is falsy.");
//   }
//   return { contractAddress };
// }

describe("PluginLedgerConnectorChainlink", () => {
  const logLevel: LogLevelDesc = "DEBUG";

  const log = LoggerProvider.getOrCreate({
    label: "chainlink-fabric-relay.test.ts",
    level: logLevel,
  });

  const cactiHost = "http://127.0.0.1:4000";
  const besuApiClientOptions = new BesuApiClientOptions({
    basePath: cactiHost,
  });

  const apiClient = new BesuApiClient(besuApiClientOptions);

  let rmnAddrBesu: string;
  let linkTokenAddrBesu: string;
  let routerAddrBesu: string;
  let senderAddrBesu: string;

  beforeAll(async () => {
    const rmnVoter = {
      blessVoteAddr: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
      curseVoteAddr: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
      blessWeight: 1,
      curseWeight: 1,
    };

    const rmnConfig = {
      voters: [rmnVoter],
      // When the total weight of voters that have voted to bless a tagged root reaches
      // or exceeds blessWeightThreshold, the tagged root becomes blessed.
      blessWeightThreshold: 1,
      // When the total weight of voters that have voted to curse a subject reaches or
      // exceeds curseWeightThreshold, the subject becomes cursed.
      curseWeightThreshold: 1,
    };
    const { contractAddress } = await deployBesuRmn({
      logLevel,
      apiClient,
      constructorArgs: [rmnConfig],
    });
    rmnAddrBesu = contractAddress;
    log.info("CCIP RMN Adress on Besu: %s", rmnAddrBesu);
  });

  // beforeAll(async () => {
  //   const { contractAddress } = await deployBesuLinkToken({
  //     log,
  //     apiClient,
  //   });
  //   linkTokenAddrBesu = contractAddress;
  //   log.info("CCIP LinkToken Adress on Besu: %s", linkTokenAddrBesu);
  // });

  // beforeAll(async () => {
  //   const { contractAddress } = await deployBesuRouter({
  //     log,
  //     apiClient,
  //     constructorArgs: [linkTokenAddrBesu],
  //   });
  //   routerAddrBesu = contractAddress;
  //   log.info("CCIP Router Adress on Besu: %s", routerAddrBesu);
  // });

  // beforeAll(async () => {
  //   const { contractAddress } = await deployBesuSender({
  //     log,
  //     constructorArgs: [routerAddrBesu, linkTokenAddrBesu],
  //     apiClient,
  //   });
  //   senderAddrBesu = contractAddress;
  //   log.info("CCIP Sender Adress on Besu: %s", senderAddrBesu);
  // });

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

    await awaitOffRampTxV1Impl({
      ccipMessageId: "FIXME",
      logLevel: "DEBUG",
      offRampAddress: linkTokenAddrBesu,
    });
  });
});
