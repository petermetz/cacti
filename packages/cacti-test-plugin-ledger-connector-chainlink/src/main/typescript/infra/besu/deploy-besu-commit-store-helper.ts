import safeStringify from "fast-safe-stringify";

import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import { Web3SigningCredential } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as CommitStoreHelperContract from "../../../json/ccip/besu/commit-store-helper-contract.json";

export async function deployBesuCommitStoreHelper(opts: {
  readonly logLevel?: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly staticConfig: Readonly<Record<string, unknown>>;
}): Promise<{ readonly contractAddress: Readonly<string> }> {
  const { logLevel = "WARN", apiClient, web3SigningCredential } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "deployBesuCommitStoreHelper()",
    level: logLevel,
  });

  const {
    Bin: bytecode,
    ABI: contractAbi,
    contractName,
    gas,
  } = CommitStoreHelperContract;

  const res = await apiClient.deployContractSolBytecodeNoKeychainV1({
    bytecode,
    constructorArgs: [opts.staticConfig],
    contractAbi,
    contractName,
    web3SigningCredential,
    gas,
  });

  const { contractAddress, blockNumber, gasUsed } = res.data.transactionReceipt;
  const ctx = safeStringify({ contractAddress, blockNumber, gasUsed });
  log.debug("CommitStoreHelper deployed: %s", ctx);

  if (!contractAddress) {
    throw new Error("deployBesuCommitStoreHelper() contractAddress is falsy.");
  }
  return { contractAddress };
}
