import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import { Web3SigningCredential } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as RouterContract from "../../../json/ccip/besu/router-contract.json";

export async function deployBesuRouter(opts: {
  readonly logLevel?: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly weth9Addr: Readonly<string>;
  readonly armProxyAddr: Readonly<string>;
}): Promise<{ readonly contractAddress: Readonly<string> }> {
  const { logLevel = "WARN", apiClient, web3SigningCredential } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "deployBesuRouter()",
    level: logLevel,
  });

  const { Bin: bytecode, ABI: contractAbi, contractName, gas } = RouterContract;

  const constructorArgs = [opts.weth9Addr, opts.armProxyAddr];
  log.info("Deploying Router with args: %o", constructorArgs);

  const res = await apiClient.deployContractSolBytecodeNoKeychainV1({
    bytecode,
    constructorArgs,
    contractAbi,
    contractName,
    web3SigningCredential,
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
