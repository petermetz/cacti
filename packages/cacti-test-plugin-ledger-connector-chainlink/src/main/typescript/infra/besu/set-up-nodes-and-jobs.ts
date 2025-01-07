import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";

/**
 * ```go
 * priceGetterConfig := config.DynamicPriceGetterConfig{
 *   AggregatorPrices: map[common.Address]config.AggregatorPriceConfig{
 *     ccipTH.Source.WrappedNative.Address(): {
 *       ChainID:                   ccipTH.Source.ChainID,
 *       AggregatorContractAddress: aggSrcNatAddr,
 *     },
 *     ccipTH.Dest.LinkToken.Address(): {
 *       ChainID:                   ccipTH.Dest.ChainID,
 *       AggregatorContractAddress: aggDstLnkAddr,
 *     },
 *     ccipTH.Dest.WrappedNative.Address(): {
 *       ChainID:                   ccipTH.Dest.ChainID,
 *       AggregatorContractAddress: aggDstLnkAddr,
 *     },
 *   },
 *   StaticPrices: map[common.Address]config.StaticPriceConfig{},
 * }
 * ```
 */
export async function setUpNodesAndJobs(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly tokenPricesUSDPipeline: Readonly<string>;
  readonly priceGetterConfig: Readonly<Record<string, unknown>>;
}): Promise<{
  readonly jobParams: Readonly<Record<string, unknown>>;
}> {
  const { logLevel = "WARN" } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "deployBesuCcipContracts()",
    level: logLevel,
  });
  log.debug("ENTRY");

  return { jobParams: {} };
}
