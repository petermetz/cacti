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
 *   srcPriceRegistry, err := price_registry_1_2_0.NewPriceRegistry(sourcePricesAddress, sourceChain.Client())
 *   require.NoError(t, err)
 *
 *   _, err = srcPriceRegistry.UpdatePrices(sourceUser, price_registry_1_2_0.InternalPriceUpdates{
 *       TokenPriceUpdates: []price_registry_1_2_0.InternalTokenPriceUpdate{
 *           {
 *               SourceToken: sourceLinkTokenAddress,
 *               UsdPerToken: new(big.Int).Mul(big.NewInt(1e18), big.NewInt(20)),
 *           },
 *           {
 *               SourceToken: sourceWeth9addr,
 *               UsdPerToken: new(big.Int).Mul(big.NewInt(1e18), big.NewInt(2000)),
 *           },
 *       },
 *       GasPriceUpdates: []price_registry_1_2_0.InternalGasPriceUpdate{
 *           {
 *               DestChainSelector: destChainSelector,
 *               UsdPerUnitGas:     big.NewInt(20000e9),
 *           },
 *       },
 *   })
 *   require.NoError(t, err)
 *   sourceChain.Commit()
 * ```
 */
export async function updateRegistryPrices(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly priceRegistryAddr: Readonly<string>;
  readonly internalPriceUpdates: Readonly<{
    readonly tokenPriceUpdates: ReadonlyArray<Record<string, unknown>>;
    readonly gasPriceUpdates: ReadonlyArray<Record<string, unknown>>;
  }>;
}): Promise<{
  readonly resUpdatePrices: Readonly<InvokeContractV1Response>;
}> {
  const { logLevel: level = "WARN", apiClient, web3SigningCredential } = opts;
  const { ABI: contractAbi, contractName, gas } = PriceRegistryContract;

  const log = LoggerProvider.getOrCreate({
    label: "updateRegistryPrices()",
    level,
  });

  const { data: resUpdatePrices } = await apiClient.invokeContractV1({
    methodName: "updatePrices",
    invocationType: EthContractInvocationType.Send,
    params: [opts.internalPriceUpdates],
    contractAddress: opts.priceRegistryAddr,
    contractAbi,
    contractName,
    signingCredential: web3SigningCredential,
    gas,
  });
  const ctxUpdatePrices = JSON.stringify(resUpdatePrices);
  log.debug("CCIP PriceRegistry updatePrices() OK: %o", ctxUpdatePrices);

  return { resUpdatePrices };
}
