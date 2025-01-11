import safeStringify from "fast-safe-stringify";

import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import { Web3SigningCredential } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as MockRmnContract from "../../../json/ccip/besu/mock-rmn-contract.json";

export async function deployBesuMockRmn(opts: {
  readonly logLevel?: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
}): Promise<{ readonly contractAddress: Readonly<string> }> {
  const { logLevel = "WARN", apiClient, web3SigningCredential } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "deployBesuMockRmn()",
    level: logLevel,
  });

  const {
    Bin: bytecode,
    ABI: contractAbi,
    contractName,
    gas,
  } = MockRmnContract;

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
  log.debug("MockRMN deployed: %s", ctx);

  if (!contractAddress) {
    throw new Error("deployBesuMockRmn() contractAddress is falsy.");
  }
  return { contractAddress };
}
