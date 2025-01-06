import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import {
  EthContractInvocationType,
  InvokeContractV1Response,
  Web3SigningCredential,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as PriceRegistryContract from "../../../json/ccip/besu/price-registry-contract.json";

/**
 * `core/services/ocr2/plugins/ccip/testhelpers/ccip_contracts.go`
 *
 * ```go
 * _, err = destPriceRegistry.ApplyPriceUpdatersUpdates(destUser, []common.Address{commitStoreAddress}, []common.Address{})
 * ```
 */
export async function applyPriceUpdatersUpdates(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly priceRegistryAddr: Readonly<string>;
  readonly priceUpdatersToAdd: ReadonlyArray<string>;
  readonly priceUpdatersToRemove: ReadonlyArray<string>;
}): Promise<{
  readonly resApplyPriceUpdatersUpdates: Readonly<InvokeContractV1Response>;
}> {
  const { logLevel: level = "WARN", apiClient, web3SigningCredential } = opts;
  const { ABI: contractAbi, contractName, gas } = PriceRegistryContract;

  const log = LoggerProvider.getOrCreate({
    label: "applyPriceUpdatersUpdates()",
    level,
  });

  const { data } = await apiClient.invokeContractV1({
    methodName: "applyPriceUpdatersUpdates",
    invocationType: EthContractInvocationType.Send,
    params: [opts.priceUpdatersToAdd, opts.priceUpdatersToRemove],
    contractAddress: opts.priceRegistryAddr,
    contractAbi,
    contractName,
    signingCredential: web3SigningCredential,
    gas,
  });
  const ctx = JSON.stringify(data);
  log.debug("CCIP PriceRegistry applyPriceUpdatersUpdates() OK: %o", ctx);

  return { resApplyPriceUpdatersUpdates: data };
}
