import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import { Web3SigningCredential } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as TokenAdminRegistryContract from "../../../json/ccip/besu/token-admin-registry-contract.json";

export async function deployBesuTokenAdminRegistry(opts: {
  readonly logLevel?: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
}): Promise<{ readonly contractAddress: Readonly<string> }> {
  const { logLevel = "WARN", apiClient, web3SigningCredential } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "deployBesuTokenAdminRegistry()",
    level: logLevel,
  });

  const {
    Bin: bytecode,
    ABI: contractAbi,
    contractName,
    gas,
  } = TokenAdminRegistryContract;

  const res = await apiClient.deployContractSolBytecodeNoKeychainV1({
    bytecode,
    constructorArgs: [],
    contractAbi,
    contractName,
    web3SigningCredential,
    gas,
  });

  const ctx = JSON.stringify(res.data.transactionReceipt);
  log.debug("TokenAdminRegistry deployed: %o", ctx);

  const {
    data: {
      transactionReceipt: { contractAddress },
    },
  } = res;

  if (!contractAddress) {
    throw new Error("deployBesuTokenAdminRegistry() contractAddress is falsy.");
  }
  return { contractAddress };
}
