import safeStringify from "fast-safe-stringify";

import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import { Web3SigningCredential } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as LinkTokenContract from "../../../json/ccip/besu/link-token-contract.json";

export async function deployBesuLinkToken(opts: {
  readonly logLevel?: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
}): Promise<{ readonly contractAddress: Readonly<string> }> {
  const { logLevel = "WARN", apiClient, web3SigningCredential } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "deployBesuLinkToken()",
    level: logLevel,
  });

  const {
    Bin: bytecode,
    ABI: contractAbi,
    contractName,
    gas,
  } = LinkTokenContract;

  const res = await apiClient.deployContractSolBytecodeNoKeychainV1({
    bytecode,
    constructorArgs: [],
    contractAbi,
    contractName,
    web3SigningCredential,
    gas,
  });

  const { contractAddress, blockNumber, gasUsed } = res.data.transactionReceipt;
  const ctx = safeStringify({ contractAddress, blockNumber, gasUsed });
  log.debug("LinkToken deployed: %s", ctx);

  if (!contractAddress) {
    throw new Error("deployBesuLinkToken() contractAddress is falsy.");
  }
  return { contractAddress };
}
