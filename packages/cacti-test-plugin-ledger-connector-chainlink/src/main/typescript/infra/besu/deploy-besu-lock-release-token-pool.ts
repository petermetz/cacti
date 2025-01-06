import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import { Web3SigningCredential } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as LockReleaseTokenPool from "../../../json/ccip/besu/lock-release-token-pool-contract.json";

export async function deployBesuLockReleaseTokenPool(opts: {
  readonly logLevel?: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly acceptLiquidity: Readonly<boolean>;
  readonly routerAddr: Readonly<string>;
  readonly armProxyAddr: Readonly<string>;
  readonly linkTokenAddr: Readonly<string>;
  readonly tokenDecimals: Readonly<number>;
}): Promise<{ readonly contractAddress: Readonly<string> }> {
  const { logLevel = "WARN", apiClient, web3SigningCredential } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "deployBesuLockReleaseTokenPool()",
    level: logLevel,
  });

  const {
    Bin: bytecode,
    ABI: contractAbi,
    contractName,
    gas,
  } = LockReleaseTokenPool;

  const res = await apiClient.deployContractSolBytecodeNoKeychainV1({
    bytecode,
    constructorArgs: [
      opts.linkTokenAddr,
      opts.tokenDecimals,
      [],
      opts.armProxyAddr,
      opts.acceptLiquidity,
      opts.routerAddr,
    ],
    contractAbi,
    contractName,
    web3SigningCredential,
    gas,
  });
  const ctx = JSON.stringify(res.data.transactionReceipt);
  log.debug("LockReleaseTokenPool deployed: %o", ctx);

  const {
    data: {
      transactionReceipt: { contractAddress },
    },
  } = res;

  if (!contractAddress) {
    throw new Error("deployBesuLockReleaseTokenPool() address is falsy.");
  }
  return { contractAddress };
}
