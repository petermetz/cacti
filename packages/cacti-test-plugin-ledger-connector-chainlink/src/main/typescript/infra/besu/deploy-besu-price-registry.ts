import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import { Web3SigningCredential } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as PriceRegistryContract from "../../../json/ccip/besu/price-registry-contract.json";

export async function deployBesuPriceRegistry(opts: {
  readonly logLevel?: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly priceUpdaters: Readonly<ReadonlyArray<string>>;
  readonly feeTokens: Readonly<ReadonlyArray<string>>;
  readonly stalenessThreshold: Readonly<number>;
}): Promise<{ readonly contractAddress: Readonly<string> }> {
  const { logLevel = "WARN", apiClient, web3SigningCredential } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "deployBesuPriceRegistry()",
    level: logLevel,
  });

  const {
    Bin: bytecode,
    ABI: contractAbi,
    contractName,
    gas,
  } = PriceRegistryContract;

  const res = await apiClient.deployContractSolBytecodeNoKeychainV1({
    bytecode,
    constructorArgs: [
      opts.priceUpdaters,
      opts.feeTokens,
      opts.stalenessThreshold,
    ],
    contractAbi,
    contractName,
    web3SigningCredential,
    gas,
  });
  const ctx = JSON.stringify(res.data.transactionReceipt);
  log.debug("PriceRegistry deployed: %o", ctx);

  const {
    data: {
      transactionReceipt: { contractAddress },
    },
  } = res;

  if (!contractAddress) {
    throw new Error("deployBesuPriceRegistry() contractAddress is falsy.");
  }
  return { contractAddress };
}
