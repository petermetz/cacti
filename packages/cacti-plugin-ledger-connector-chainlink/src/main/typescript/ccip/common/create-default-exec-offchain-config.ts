import { DurationNano } from "@hyperledger/cactus-common";
import safeStringify from "fast-safe-stringify";

/**
 * **Inputs**:
 * - `inflightCacheExpiry time.Duration -> Minute (60000000000)`
 * - `rootSnoozeTime time.Duration -> Minute (60000000000)`
 *
 * **Output**: `[123,34,83,111,117,114,99,101,70,105,110,97,108,105,116,121,68,101,112,116,104,34,58,48,44,34,68,101,115,116,79,112,116,105,109,105,115,116,105,99,67,111,110,102,105,114,109,97,116,105,111,110,115,34,58,49,44,34,68,101,115,116,70,105,110,97,108,105,116,121,68,101,112,116,104,34,58,48,44,34,66,97,116,99,104,71,97,115,76,105,109,105,116,34,58,53,48,48,48,48,48,48,44,34,82,101,108,97,116,105,118,101,66,111,111,115,116,80,101,114,87,97,105,116,72,111,117,114,34,58,48,46,48,55,44,34,73,110,102,108,105,103,104,116,67,97,99,104,101,69,120,112,105,114,121,34,58,34,49,109,48,115,34,44,34,82,111,111,116,83,110,111,111,122,101,84,105,109,101,34,58,34,49,109,48,115,34,44,34,66,97,116,99,104,105,110,103,83,116,114,97,116,101,103,121,73,68,34,58,48,44,34,77,101,115,115,97,103,101,86,105,115,105,98,105,108,105,116,121,73,110,116,101,114,118,97,108,34,58,34,48,115,34,125]`
 *
 * `"{\"SourceFinalityDepth\":0,\"DestOptimisticConfirmations\":1,\"DestFinalityDepth\":0,\"BatchGasLimit\":5000000,\"RelativeBoostPerWaitHour\":0.07,\"InflightCacheExpiry\":\"1m0s\",\"RootSnoozeTime\":\"1m0s\",\"BatchingStrategyID\":0,\"MessageVisibilityInterval\":\"0s\"}"`
 * @returns
 */
export async function createDefaultExecOffchainConfig(): Promise<
  Readonly<Uint8Array>
> {
  const inflightCacheExpiry = BigInt(1) * DurationNano.Minute;
  const rootSnoozeTime = BigInt(1) * DurationNano.Minute;
  const rootSnoozeTimeMinutes = rootSnoozeTime / DurationNano.Minute;
  const rootSnoozeTimeStr = rootSnoozeTimeMinutes.toString(10).concat("m0s");

  const inflightCacheExpiryMinutes = inflightCacheExpiry / DurationNano.Minute;
  const inflightCacheExpiryStr = inflightCacheExpiryMinutes
    .toString(10)
    .concat("m0s");

  const pojo = {
    SourceFinalityDepth: 0,
    DestOptimisticConfirmations: 1,
    DestFinalityDepth: 0,
    BatchGasLimit: 5000000,
    RelativeBoostPerWaitHour: 0.07,
    // InflightCacheExpiry: "1m0s",
    InflightCacheExpiry: inflightCacheExpiryStr,
    // RootSnoozeTime: "1m0s",
    RootSnoozeTime: rootSnoozeTimeStr,
    BatchingStrategyID: 0,
    MessageVisibilityInterval: "0s",
  };
  const json = safeStringify(pojo);
  const buffer = Buffer.from(json, "utf-8");
  const offchainConfigBytes = Uint8Array.from(buffer);
  return offchainConfigBytes;
}
