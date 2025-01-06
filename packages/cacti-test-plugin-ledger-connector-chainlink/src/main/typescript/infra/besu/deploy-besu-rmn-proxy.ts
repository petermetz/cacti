import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import { Web3SigningCredential } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as RmnProxyContract from "../../../json/ccip/besu/rmn-proxy-contract.json";

export async function deployBesuRmnProxy(opts: {
  readonly logLevel?: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly armSourceAddress: Readonly<string>;
}): Promise<{ readonly contractAddress: Readonly<string> }> {
  const { logLevel = "WARN", apiClient, web3SigningCredential } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "deployBesuRmnProxy()",
    level: logLevel,
  });

  const {
    Bin: bytecode,
    ABI: contractAbi,
    contractName,
    gas,
  } = RmnProxyContract;

  const res = await apiClient.deployContractSolBytecodeNoKeychainV1({
    bytecode,
    constructorArgs: [opts.armSourceAddress],
    contractAbi,
    contractName,
    web3SigningCredential,
    gas,
  });

  const ctx = JSON.stringify(res.data.transactionReceipt);
  log.debug("RMNProxy deployed: %o", ctx);

  const {
    data: {
      transactionReceipt: { contractAddress },
    },
  } = res;

  if (!contractAddress) {
    throw new Error("deployBesuRmnProxy() contractAddress is falsy.");
  }
  return { contractAddress };
}
