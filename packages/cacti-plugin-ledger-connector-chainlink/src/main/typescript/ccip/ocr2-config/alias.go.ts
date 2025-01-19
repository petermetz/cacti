// offchainreporting2/confighelper/alias.go:118

import {
  IOracleIdentityExtra,
  contractSetConfigArgsForTests as configHelperContractSetConfigArgsForTests,
} from "./confighelper.go";

export async function contractSetConfigArgsForTests(
  deltaProgress: bigint,
  deltaResend: bigint,
  deltaRound: bigint,
  deltaGrace: bigint,
  deltaStage: bigint,
  rMax: number,
  s: Array<number>,
  oracles: Array<IOracleIdentityExtra>,
  reportingPluginConfig: Uint8Array,
  maxDurationInitialization: bigint,
  maxDurationQuery: bigint,
  maxDurationObservation: bigint,
  maxDurationReport: bigint,
  maxDurationShouldAcceptFinalizedReport: bigint,
  maxDurationShouldTransmitAcceptedReport: bigint,

  f: number,
  onchainConfig: Uint8Array,
): Promise<unknown> {
  return configHelperContractSetConfigArgsForTests(
    deltaProgress,
    deltaResend,
    deltaRound,
    deltaGrace,
    deltaStage,
    rMax,
    s,
    oracles,
    reportingPluginConfig,
    maxDurationInitialization,
    maxDurationQuery,
    maxDurationObservation,
    maxDurationReport,
    maxDurationShouldAcceptFinalizedReport,
    maxDurationShouldTransmitAcceptedReport,
    f,
    onchainConfig,
  );
}
