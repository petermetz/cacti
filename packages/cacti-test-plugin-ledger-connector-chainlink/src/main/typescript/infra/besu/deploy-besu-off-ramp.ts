import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import { Web3SigningCredential } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as OffRampContract from "../../../json/ccip/besu/off-ramp-contract.json";

/**
 * `core/services/ocr2/plugins/ccip/testhelpers/ccip_contracts.go`
 *
 * ```go
 *    evm_2_evm_offramp.EVM2EVMOffRampStaticConfig{
 * 			CommitStore:         commitStore.Address(),
 * 			ChainSelector:       destChainSelector,
 * 			SourceChainSelector: sourceChainSelector,
 * 			OnRamp:              onRampAddress,
 * 			PrevOffRamp:         common.HexToAddress(""),
 * 			RmnProxy:            armProxyDestAddress, // RMN, formerly ARM
 * 			TokenAdminRegistry:  destTokenAdminRegistryAddress,
 * 		},
 * 		evm_2_evm_offramp.RateLimiterConfig{
 * 			IsEnabled: true,
 * 			Capacity:  LinkUSDValue(100),
 * 			Rate:      LinkUSDValue(1),
 * 		},
 * ```
 */
export async function deployBesuOffRamp(opts: {
  readonly logLevel?: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly staticConfig: Readonly<Record<string, unknown>>;
  readonly rateLimiterConfig: Readonly<Record<string, unknown>>;
}): Promise<{ readonly contractAddress: Readonly<string> }> {
  const { logLevel = "WARN", apiClient, web3SigningCredential } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "deployBesuOffRamp()",
    level: logLevel,
  });

  const {
    Bin: bytecode,
    ABI: contractAbi,
    contractName,
    gas,
  } = OffRampContract;

  const res = await apiClient.deployContractSolBytecodeNoKeychainV1({
    bytecode,
    constructorArgs: [opts.staticConfig, opts.rateLimiterConfig],
    contractAbi,
    contractName,
    web3SigningCredential,
    gas,
  });
  const ctx = JSON.stringify(res.data.transactionReceipt);
  log.debug("OffRamp deployed: %o", ctx);

  const {
    data: {
      transactionReceipt: { contractAddress },
    },
  } = res;

  if (!contractAddress) {
    throw new Error("deployBesuOffRamp() contractAddress is falsy.");
  }
  return { contractAddress };
}
