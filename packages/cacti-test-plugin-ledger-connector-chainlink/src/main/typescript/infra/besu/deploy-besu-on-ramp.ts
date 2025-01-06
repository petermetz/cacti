import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import { Web3SigningCredential } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { IEVM2EVMOnRampStaticConfig } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";

import * as OnRampContract from "../../../json/ccip/besu/on-ramp-contract.json";

export async function deployBesuOnRamp(opts: {
  readonly logLevel?: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly staticConfig: Readonly<IEVM2EVMOnRampStaticConfig>;
  readonly dynamicConfig: Readonly<Record<string, any>>;
  readonly rateLimiterConfig: Readonly<Record<string, any>>;
  readonly feeTokenConfigArgs: ReadonlyArray<Record<string, any>>;
  readonly tokenTransferFeeConfigArgs: ReadonlyArray<Record<string, any>>;
  readonly nopAndWeight: ReadonlyArray<Record<string, any>>;
}): Promise<{ readonly contractAddress: Readonly<string> }> {
  const { logLevel = "WARN", apiClient, web3SigningCredential } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "deployBesuOnRamp()",
    level: logLevel,
  });

  const { Bin: bytecode, ABI: contractAbi, contractName, gas } = OnRampContract;

  const res = await apiClient.deployContractSolBytecodeNoKeychainV1({
    bytecode,
    constructorArgs: [
      opts.staticConfig,
      opts.dynamicConfig,
      opts.rateLimiterConfig,
      opts.feeTokenConfigArgs,
      opts.tokenTransferFeeConfigArgs,
      opts.nopAndWeight,
    ],
    contractAbi,
    contractName,
    web3SigningCredential,
    gas,
  });

  const ctx = JSON.stringify(res.data.transactionReceipt);
  log.debug("OnRamp deployed: %o", ctx);

  const {
    data: {
      transactionReceipt: { contractAddress },
    },
  } = res;

  if (!contractAddress) {
    throw new Error("deployBesuOnRamp() contractAddress is falsy.");
  }
  return { contractAddress };
}
