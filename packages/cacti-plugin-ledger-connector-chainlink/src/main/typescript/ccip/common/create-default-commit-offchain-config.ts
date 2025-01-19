import { DurationNano } from "@hyperledger/cactus-common";
import safeStringify from "fast-safe-stringify";

/**
 * **Input**: `github.com/smartcontractkit/chainlink-automation/pkg/v3/service.PanicRestartWait (10000000000)` and `github.com/smartcontractkit/chainlink/v2/core/services/ocr2/plugins/ccip/tokendata/usdc.defaultAttestationTimeout (5000000000)`
 * **Output**: `[]uint8 len: 242, cap: 256, [123,34,83,111,117,114,99,101,70,105,110,97,108,105,116,121,68,101,112,116,104,34,58,48,44,34,68,101,115,116,70,105,110,97,108,105,116,121,68,101,112,116,104,34,58,48,44,34,71,97,115,80,114,105,99,101,72,101,97,114,116,66,101,97,116,34,58,34,49,48,115,34,44,34,68,65,71,97,115,80,114,105,99,101,68,101,118,105,97,116,105,111,110,80,80,66,34,58,49,44,34,69,120,101,99,71,97,115,80,114,105,99,101,68,101,118,105,97,116,105,111,110,80,80,66,34,58,49,44,34,84,111,107,101,110,80,114,105,99,101,72,101,97,114,116,66,101,97,116,34,58,34,49,48,115,34,44,34,84,111,107,101,110,80,114,105,99,101,68,101,118,105,97,116,105,111,110,80,80,66,34,58,49,44,34,73,110,102,108,105,103,104,116,67,97,99,104,101,69,120,112,105,114,121,34,58,34,53,115,34,44,34,80,114,105,99,101,82,101,112,111,114,116,105,110,103,68,105,115,97,98,108,101,100,34,58,102,97,108,115,101,125]`
 *
 * `"{\"SourceFinalityDepth\":0,\"DestFinalityDepth\":0,\"GasPriceHeartBeat\":\"10s\",\"DAGasPriceDeviationPPB\":1,\"ExecGasPriceDeviationPPB\":1,\"TokenPriceHeartBeat\":\"10s\",\"TokenPriceDeviationPPB\":1,\"InflightCacheExpiry\":\"5s\",\"PriceReportingDisabled\":false}"`
 * @param destPriceRegistryAddress For example `"0x8610f3910e7D2f1C36066E9216010807eD19D993"`.
 * @returns
 */
export async function createDefaultCommitOffchainConfig(): Promise<
  Readonly<Uint8Array>
> {
  const feeUpdateHearBeat = BigInt(10) * DurationNano.Second;
  const inflightCacheExpiry = BigInt(5) * DurationNano.Second;
  return createCommitOffchainConfig(feeUpdateHearBeat, inflightCacheExpiry);
}

/**
 * ```go
 * func (c *CCIPContracts) createCommitOffchainConfig(t *testing.T, feeUpdateHearBeat time.Duration, inflightCacheExpiry time.Duration) []byte {
 *   config, err := NewCommitOffchainConfig(
 *     *config.MustNewDuration(feeUpdateHearBeat),
 *     1,
 *     1,
 *     *config.MustNewDuration(feeUpdateHearBeat),
 *     1,
 *     *config.MustNewDuration(inflightCacheExpiry),
 *     false,
 *   ).Encode()
 *   require.NoError(t, err)
 *   return config
 * }
 * ```
 * @param feeUpdateHearBeat
 * @param bigint
 * @param inflightCacheExpiry
 * @param bigint
 */
async function createCommitOffchainConfig(
  feeUpdateHearBeat: bigint,
  inflightCacheExpiry: bigint,
): Promise<Readonly<Uint8Array>> {
  const inflightCacheExpirySeconds = inflightCacheExpiry / DurationNano.Second;

  const inflightCacheExpiryStr = inflightCacheExpirySeconds
    .toString(10)
    .concat("s");

  const pojo = {
    SourceFinalityDepth: 0,
    DestFinalityDepth: 0,
    GasPriceHeartBeat: "10s",
    DAGasPriceDeviationPPB: 1,
    ExecGasPriceDeviationPPB: 1,
    TokenPriceHeartBeat: "10s",
    TokenPriceDeviationPPB: 1,
    InflightCacheExpiry: inflightCacheExpiryStr, // 5s
    PriceReportingDisabled: false,
  };
  const json = safeStringify(pojo);
  const buffer = Buffer.from(json, "utf-8");
  const offchainConfigBytes = Uint8Array.from(buffer);
  return offchainConfigBytes;
}
