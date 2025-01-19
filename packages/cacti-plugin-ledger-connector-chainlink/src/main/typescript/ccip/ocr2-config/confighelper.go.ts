/**
 * ContractSetConfigArgsForTestsWithAuxiliaryArgs generates setConfig args from
 * the relevant parameters. Only use this for testing, *not* for production.
 *
 * func ContractSetConfigArgsForTestsWithAuxiliaryArgs(
 *   deltaProgress  : bigint,
 *   deltaResend  : bigint,
 *   deltaRound  : bigint,
 *   deltaGrace  : bigint,
 *   deltaStage  : bigint,
 *   rMax uint8,
 *   s []int,
 *   oracles []OracleIdentityExtra,
 *   reportingPluginConfig []byte,
 *   maxDurationInitialization *time.Duration,
 *   maxDurationQuery  : bigint,
 *   maxDurationObservation  : bigint,
 *   maxDurationReport  : bigint,
 *   maxDurationShouldAcceptFinalizedReport  : bigint,
 *   maxDurationShouldTransmitAcceptedReport  : bigint,
 *
 *   f int,
 *   onchainConfig []byte,
 *   auxiliaryArgs AuxiliaryArgs,
 * ) (
 *   signers []types.OnchainPublicKey,
 *   transmitters []types.Account,
 *   f_ uint8,
 *   onchainConfig_ []byte,
 *   offchainConfigVersion uint64,
 *   offchainConfig []byte,
 *   err error,
 * ) {
 *   identities := []config.OracleIdentity{}
 *   configEncryptionPublicKeys := []types.ConfigEncryptionPublicKey{}
 *   for _, oracle := range oracles {
 *     identities = append(identities, config.OracleIdentity{
 *       oracle.OffchainPublicKey,
 *       oracle.OnchainPublicKey,
 *       oracle.PeerID,
 *       oracle.TransmitAccount,
 *     })
 *     configEncryptionPublicKeys = append(configEncryptionPublicKeys, oracle.ConfigEncryptionPublicKey)
 *   }
 *
 *   sharedSecret := [config.SharedSecretSize]byte{}
 *   if _, err := io.ReadFull(auxiliaryArgs.rng(), sharedSecret[:]); err != nil {
 *     return nil, nil, 0, nil, 0, nil, err
 *   }
 *
 *   sharedConfig := ocr2config.SharedConfig{
 *     ocr2config.PublicConfig{
 *       deltaProgress,
 *       deltaResend,
 *       deltaRound,
 *       deltaGrace,
 *       deltaStage,
 *       rMax,
 *       s,
 *       identities,
 *       reportingPluginConfig,
 *       maxDurationInitialization,
 *       maxDurationQuery,
 *       maxDurationObservation,
 *       maxDurationReport,
 *       maxDurationShouldAcceptFinalizedReport,
 *       maxDurationShouldTransmitAcceptedReport,
 *       f,
 *       onchainConfig,
 *       types.ConfigDigest{},
 *     },
 *     &sharedSecret,
 *   }
 *   return ocr2config.XXXContractSetConfigArgsFromSharedConfig(sharedConfig, configEncryptionPublicKeys)
 * }
 *
 */

import { randomBytes } from "node:crypto";
import {
  IOracleIdentity,
  ISharedConfig,
  xxxContractSetConfigArgsFromSharedConfig,
} from "./shared-config.go";

export interface IAuxiliaryArgs {
  getRandomBytes: (size: number) => Buffer;
}

export interface IOracleIdentityExtra extends IOracleIdentity {
  // 32 long byte array
  readonly configEncryptionPublicKey: Uint8Array;
}

export async function contractSetConfigArgsForTestsWithAuxiliaryArgs(
  deltaProgress: bigint,
  deltaResend: bigint,
  deltaRound: bigint,
  deltaGrace: bigint,
  deltaStage: bigint,
  rMax: number,
  s: Array<number>,
  oracles: Readonly<Array<IOracleIdentityExtra>>,
  reportingPluginConfig: Uint8Array,
  maxDurationInitialization: bigint,
  maxDurationQuery: bigint,
  maxDurationObservation: bigint,
  maxDurationReport: bigint,
  maxDurationShouldAcceptFinalizedReport: bigint,
  maxDurationShouldTransmitAcceptedReport: bigint,
  f: number,
  onchainConfig: Uint8Array,
  auxiliaryArgs: IAuxiliaryArgs,
): Promise<Array<any>> {
  const identities: Array<IOracleIdentity> = [];
  // 32 long byte arrays
  const configEncryptionPublicKeys: Array<Uint8Array> = [];

  oracles.forEach((oracle) => {
    const anOracleIdentity: IOracleIdentity = {
      ...oracle,
    };
    identities.push(anOracleIdentity);
    configEncryptionPublicKeys.push(oracle.configEncryptionPublicKey);
  });

  const sharedSecret = Uint8Array.from(auxiliaryArgs.getRandomBytes(16));

  const sharedConfig: ISharedConfig = {
    deltaProgress,
    deltaResend,
    deltaRound,
    deltaGrace,
    deltaStage,
    rMax,
    s,
    oracleIdentities: identities,
    reportingPluginConfig,
    maxDurationInitialization,
    maxDurationQuery,
    maxDurationObservation,
    maxDurationReport,
    maxDurationShouldAcceptFinalizedReport,
    maxDurationShouldTransmitAcceptedReport,
    f,
    onchainConfig,
    configDigest: new Uint8Array(32),
    sharedSecret,
  };
  return xxxContractSetConfigArgsFromSharedConfig({
    logLevel: "DEBUG", // FIXME
    sharedConfig,
    sharedSecretEncryptionPublicKeys: configEncryptionPublicKeys,
  });
}

export async function contractSetConfigArgsForTests(
  deltaProgress: bigint,
  deltaResend: bigint,
  deltaRound: bigint,
  deltaGrace: bigint,
  deltaStage: bigint,
  rMax: number,
  s: Array<number>,
  oracles: Readonly<Array<IOracleIdentityExtra>>,
  reportingPluginConfig: Uint8Array,
  maxDurationInitialization: bigint,
  maxDurationQuery: bigint,
  maxDurationObservation: bigint,
  maxDurationReport: bigint,
  maxDurationShouldAcceptFinalizedReport: bigint,
  maxDurationShouldTransmitAcceptedReport: bigint,
  f: number,
  onchainConfig: Uint8Array,
): Promise<Array<any>> {
  const auxiliaryArgs: IAuxiliaryArgs = {
    getRandomBytes(size) {
      return randomBytes(size);
    },
  };
  return contractSetConfigArgsForTestsWithAuxiliaryArgs(
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
    auxiliaryArgs,
  );
}
