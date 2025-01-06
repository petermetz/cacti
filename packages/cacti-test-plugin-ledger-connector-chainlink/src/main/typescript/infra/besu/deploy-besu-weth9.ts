import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import { Web3SigningCredential } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as Weth9Contract from "../../../json/ccip/besu/weth9-contract.json";

export async function deployBesuWeth9(opts: {
  readonly logLevel?: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
}): Promise<{ readonly contractAddress: Readonly<string> }> {
  const { logLevel = "WARN", apiClient, web3SigningCredential } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "deployBesuWeth9()",
    level: logLevel,
  });

  const { Bin: bytecode, ABI: contractAbi, contractName, gas } = Weth9Contract;

  const res = await apiClient.deployContractSolBytecodeNoKeychainV1({
    bytecode,
    constructorArgs: [],
    contractAbi,
    contractName,
    web3SigningCredential,
    gas,
  });

  const ctx = JSON.stringify(res.data.transactionReceipt);
  log.debug("WETH9 deployed: %o", ctx);

  const {
    data: {
      transactionReceipt: { contractAddress },
    },
  } = res;

  if (!contractAddress) {
    throw new Error("deployBesuWeth9() contractAddress is falsy.");
  }
  return { contractAddress };
}
