import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { encryptSharedSecret } from "./shared-secret-encrypt.go";
import { OffchainConfigProto } from "../../public-api";
import { serialize } from "./serialize.go";

/**
 * ```go
 *
 * // Digest of the configuration for a OCR2 protocol instance. The first two
 * // bytes indicate which config digester (typically specific to a targeted
 * // blockchain) was used to compute a ConfigDigest. This value is used as a
 * // domain separator between different protocol instances and is thus security
 * // critical. It should be the output of a cryptographic hash function over all
 * // relevant configuration fields as well as e.g. the address of the target
 * // contract/state accounts/...
 * type ConfigDigest [32]byte
 *
 * func (c ConfigDigest) Hex() string {
 *     return fmt.Sprintf("%x", c[:])
 * }
 *
 * func BytesToConfigDigest(b []byte) (ConfigDigest, error) {
 *     configDigest := ConfigDigest{}
 *
 *     if len(b) != len(configDigest) {
 *         return ConfigDigest{}, fmt.Errorf("cannot convert bytes to ConfigDigest. bytes have wrong length %v", len(b))
 *     }
 *
 *     if len(configDigest) != copy(configDigest[:], b) {
 *         // assertion
 *         panic("copy returned wrong length")
 *     }
 *
 *     return configDigest, nil
 * }
 *
 *
 * // OffchainPublicKey is the public key used to cryptographically identify an
 * // oracle in inter-oracle communications.
 * type OffchainPublicKey [ed25519.PublicKeySize]byte
 *
 * // OnchainPublicKey is the public key used to cryptographically identify an
 * // oracle to the on-chain smart contract.
 * type OnchainPublicKey []byte
 *
 *
 *
 * type OracleIdentity struct {
 *  // 32 bytes long UInt8Array
 *     OffchainPublicKey types.OffchainPublicKey
 *
 *  // UInt8Array of unspecified length
 *     OnchainPublicKey  types.OnchainPublicKey
 *
 *     PeerID            string
 *     TransmitAccount   string
 * }
 *
 *
 * // PublicConfig is the configuration disseminated through the smart contract
 * // It's public, because anybody can read it from the blockchain
 * type PublicConfig struct {
 *   // If an epoch (driven by a leader) fails to achieve progress (generate a
 *   // report) after DeltaProgress, we enter a new epoch. This parameter must be
 *   // chosen carefully. If the duration is too short, we may keep prematurely
 *   // switching epochs without ever achieving any progress, resulting in a
 *   // liveness failure!
 *   DeltaProgress time.Duration
 *   // DeltaResend determines how often Pacemaker newepoch messages should be
 *   // resent, allowing oracles that had crashed and are recovering to rejoin
 *   // the protocol more quickly. ~30s should be a reasonable default under most
 *   // circumstances.
 *   DeltaResend time.Duration
 *   // DeltaRound determines the minimal amount of time that should pass between
 *   // the start of report generation rounds. With OCR2 only (not OCR1!) you can
 *   // set this value very aggressively. Note that this only provides a lower
 *   // bound on the round interval; actual rounds might take longer.
 *   DeltaRound time.Duration
 *   // Once the leader of a report generation round has collected sufficiently
 *   // many observations, it will wait for DeltaGrace to pass to allow slower
 *   // oracles to still contribute an observation before moving on to generating
 *   // the report. Consequently, rounds driven by correct leaders will always
 *   // take at least DeltaGrace.
 *   DeltaGrace time.Duration
 *   // DeltaStage determines the duration between stages of the transmission
 *   // protocol. In each stage, a certain number of oracles (determined by S)
 *   // will attempt to transmit, assuming that no other oracle has yet
 *   // successfully transmitted a report.
 *   DeltaStage time.Duration
 *   // The maximum number of rounds during an epoch.
 *   RMax uint8
 *   // S is the transmission schedule. For example, S = [1,2,3] indicates that
 *   // in the first stage of transmission one oracle will attempt to transmit,
 *   // in the second stage two more will attempt to transmit (if in their view
 *   // the first stage didn't succeed), and in the third stage three more will
 *   // attempt to transmit (if in their view the first and second stage didn't
 *   // succeed).
 *   //
 *   // sum(S) should equal n.
 *   S []int
 *   // Identities (i.e. public keys) of the oracles participating in this
 *   // protocol instance.
 *   OracleIdentities []config.OracleIdentity
 *
 *   // Binary blob containing configuration passed through to the
 *   // ReportingPlugin.
 *   ReportingPluginConfig []byte
 *
 *   // MaxDurationX is the maximum duration a ReportingPlugin should spend
 *   // performing X. Reasonable values for these will be specific to each
 *   // ReportingPlugin. Be sure to not set these too short, or the corresponding
 *   // ReportingPlugin function may always time out.
 *   MaxDurationInitialization               *time.Duration // Used for NewReportingPlugin()
 *   MaxDurationQuery                        time.Duration
 *   MaxDurationObservation                  time.Duration // Used to be an environment variable called OCR_OBSERVATION_TIMEOUT in OCR1 in the Chainlink node.
 *   MaxDurationReport                       time.Duration
 *   MaxDurationShouldAcceptFinalizedReport  time.Duration
 *   MaxDurationShouldTransmitAcceptedReport time.Duration
 *
 *   // The maximum number of oracles that are assumed to be faulty while the
 *   // protocol can retain liveness and safety. Unless you really know what
 *   // you’re doing, be sure to set this to floor((n-1)/3) where n is the total
 *   // number of oracles.
 *   F int
 *
 *   // Binary blob containing configuration passed through to the
 *   // ReportingPlugin, and also available to the contract. (Unlike
 *   // ReportingPluginConfig which is only available offchain.)
 *   OnchainConfig []byte
 *
 *   ConfigDigest types.ConfigDigest
 * }
 *
 * type SharedConfig struct {
 *     PublicConfig
 *     SharedSecret *[config.SharedSecretSize]byte
 * }
 * ```
 *
 * ```go
 * func XXXContractSetConfigArgsFromSharedConfig(
 *  c SharedConfig,
 *  sharedSecretEncryptionPublicKeys []types.ConfigEncryptionPublicKey,
 *) (
 *  signers []types.OnchainPublicKey,
 *  transmitters []types.Account,
 *  f uint8,
 *  onchainConfig []byte,
 *  offchainConfigVersion uint64,
 *  offchainConfig_ []byte,
 *  err error,
 *) {
 *  offChainPublicKeys := []types.OffchainPublicKey{}
 *  peerIDs := []string{}
 *  for _, identity := range c.OracleIdentities {
 *    signers = append(signers, identity.OnchainPublicKey)
 *    transmitters = append(transmitters, identity.TransmitAccount)
 *    offChainPublicKeys = append(offChainPublicKeys, identity.OffchainPublicKey)
 *    peerIDs = append(peerIDs, identity.PeerID)
 *  }
 *  sharedSecretEncryptions, err := config.EncryptSharedSecret(
 *    sharedSecretEncryptionPublicKeys,
 *    c.SharedSecret,
 *    cryptorand.Reader,
 *  )
 *  if err != nil {
 *    return nil, nil, 0, nil, 0, nil, err
 *  }
 *  offchainConfig_ = (offchainConfig{
 *    c.DeltaProgress,
 *    c.DeltaResend,
 *    c.DeltaRound,
 *    c.DeltaGrace,
 *    c.DeltaStage,
 *    c.RMax,
 *    c.S,
 *    offChainPublicKeys,
 *    peerIDs,
 *    c.ReportingPluginConfig,
 *    c.MaxDurationInitialization,
 *    c.MaxDurationQuery,
 *    c.MaxDurationObservation,
 *    c.MaxDurationReport,
 *    c.MaxDurationShouldAcceptFinalizedReport,
 *    c.MaxDurationShouldTransmitAcceptedReport,
 *    sharedSecretEncryptions,
 *  }).serialize()
 *  return signers, transmitters, uint8(c.F), c.OnchainConfig, config.OCR2OffchainConfigVersion, offchainConfig_, nil
 *}
 * ```
 */

export const enum ConfigDigestPrefix {
  /**
   * Reserved to prevent errors where a zero-default creeps through somewhere.
   */
  None = 0,

  ConfigDigestPrefixEVMSimple = 0x0001,

  ConfigDigestPrefixTerra = 0x0002,

  ConfigDigestPrefixSolana = 0x0003,

  ConfigDigestPrefixStarknet = 0x0004,

  /**
   * Reserved, not sure for what.
   */
  Reserved1 = 0x0005,

  /**
   * Mercury v0.2 and v0.3.
   */
  ConfigDigestPrefixMercuryV02 = 0x0006,

  /**
   * Run Threshold/S4 plugins as part of another product under one contract.
   */
  ConfigDigestPrefixEVMThresholdDecryption = 0x0007,

  /**
   * Run Threshold/S4 plugins as part of another product under one contract.
   */
  ConfigDigestPrefixEVMS4 = 0x0008,

  /**
   * Mercury v1.
   */
  ConfigDigestPrefixLLO = 0x0009,

  /**
   * CCIP multi role.
   */
  ConfigDigestPrefixCCIPMultiRole = 0x000a,

  /**
   * CCIP multi role RMN.
   */
  ConfigDigestPrefixCCIPMultiRoleRMN = 0x000b,

  /**
   * CCIP multi role & RMN combined.
   */
  ConfigDigestPrefixCCIPMultiRoleRMNCombo = 0x000c,

  /**
   * Reserved.
   */
  Reserved2 = 0x000d,

  ConfigDigestPrefixKeystoneOCR3Capability = 0x000e,

  /**
   * We translate OCR1 config digest to OCR2 config digests in the networking layer.
   */
  ConfigDigestPrefixOCR1 = 0xeeee,

  /**
   * Reserved for future use.
   */
  Reserved3 = 0xffff,

  /**
   * Deprecated: Use equivalent ConfigDigestPrefixEVMSimple instead.
   */
  ConfigDigestPrefixEVM = ConfigDigestPrefix.ConfigDigestPrefixEVMSimple,
}

export interface IOracleIdentity {
  /**
   * 32 bytes long
   *
   * OffchainPublicKey is the public key used to cryptographically identify an
   * oracle in inter-oracle communications.
   */
  readonly offchainPublicKey: Uint8Array;
  /**
   * OnchainPublicKey is the public key used to cryptographically identify an oracle to the on-chain smart contract.
   */
  readonly onchainPublicKey: Uint8Array;
  readonly peerID: string;
  readonly transmitAccount: string;
}

export interface IPublicConfig {
  /**
   * If an epoch (driven by a leader) fails to achieve progress (generate a
   * report) after DeltaProgress, we enter a new epoch. This parameter must be
   * chosen carefully. If the duration is too short, we may keep prematurely
   * switching epochs without ever achieving any progress, resulting in a
   * liveness failure!
   */
  deltaProgress: bigint;

  /**
   * DeltaResend determines how often Pacemaker newepoch messages should be
   * resent, allowing oracles that had crashed and are recovering to rejoin
   * the protocol more quickly. ~30s should be a reasonable default under most
   * circumstances.
   */
  deltaResend: bigint;

  /**
   * DeltaRound determines the minimal amount of time that should pass between
   * the start of report generation rounds. With OCR2 only (not OCR1!) you can
   * set this value very aggressively. Note that this only provides a lower
   * bound on the round interval; actual rounds might take longer.
   */
  deltaRound: bigint;

  /**
   * Once the leader of a report generation round has collected sufficiently
   * many observations, it will wait for DeltaGrace to pass to allow slower
   * oracles to still contribute an observation before moving on to generating
   * the report. Consequently, rounds driven by correct leaders will always
   * take at least DeltaGrace.
   */
  deltaGrace: bigint;

  /**
   * DeltaStage determines the duration between stages of the transmission
   * protocol. In each stage, a certain number of oracles (determined by S)
   * will attempt to transmit, assuming that no other oracle has yet
   * successfully transmitted a report.
   */
  deltaStage: bigint;

  /**
   * The maximum number of rounds during an epoch.
   */
  rMax: number;

  /**
   * S is the transmission schedule. For example, S = [1,2,3] indicates that
   * in the first stage of transmission one oracle will attempt to transmit,
   * in the second stage two more will attempt to transmit (if in their view
   * the first stage didn't succeed), and in the third stage three more will
   * attempt to transmit (if in their view the first and second stage didn't
   * succeed).
   *
   * sum(S) should equal n.
   */
  s: number[];

  /**
   * Identities (i.e. public keys) of the oracles participating in this
   * protocol instance.
   */
  oracleIdentities: IOracleIdentity[];

  /**
   * Binary blob containing configuration passed through to the
   * ReportingPlugin.
   */
  reportingPluginConfig: Uint8Array;

  /**
   * MaxDurationX is the maximum duration a ReportingPlugin should spend
   * performing X. Reasonable values for these will be specific to each
   * ReportingPlugin. Be sure to not set these too short, or the corresponding
   * ReportingPlugin function may always time out.
   */
  maxDurationInitialization?: bigint;
  maxDurationQuery: bigint;
  maxDurationObservation: bigint;
  maxDurationReport: bigint;
  maxDurationShouldAcceptFinalizedReport: bigint;
  maxDurationShouldTransmitAcceptedReport: bigint;

  /**
   * The maximum number of oracles that are assumed to be faulty while the
   * protocol can retain liveness and safety. Unless you really know what
   * you’re doing, be sure to set this to floor((n-1)/3) where n is the total
   * number of oracles.
   */
  f: number;

  /**
   * Binary blob containing configuration passed through to the
   * ReportingPlugin, and also available to the contract. (Unlike
   * ReportingPluginConfig which is only available offchain.)
   */
  onchainConfig: Uint8Array;

  /**
   * 32 bytes long
   *
   * ConfigDigest is the digest of the configuration, used for integrity checking.
   * Digest of the configuration for a OCR2 protocol instance.
   * The first two bytes indicate which config digester (typically specific to a
   * targeted blockchain) was used to compute a ConfigDigest.
   * This value is used as a domain separator between different protocol
   * instances and is thus security critical. It should be the output of a
   * cryptographic hash function over all relevant configuration fields as
   *  well as e.g. the address of the target contract/state accounts/...
   */
  configDigest: Uint8Array;
}

/**
 * SharedConfig is the configuration shared by all oracles running an instance
 * of the protocol. It's disseminated through the smart contract,
 * but parts of it are encrypted so that only oracles can access them.
 */
export interface ISharedConfig extends IPublicConfig {
  /**
   * 16 bytes long
   */
  readonly sharedSecret: Uint8Array;
}

export const OffchainConfigVersion = {
  OCR2: BigInt(2),
  OCR3: BigInt(30),
};

export async function xxxContractSetConfigArgsFromSharedConfig(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly sharedConfig: Readonly<ISharedConfig>;
  /**
   * 16 bytes long
   */
  readonly sharedSecretEncryptionPublicKeys: Readonly<Array<Uint8Array>>;
}): Promise<Array<any>> {
  const { logLevel = "WARN" } = opts;
  const log = LoggerProvider.getOrCreate({
    label: "xxxContractSetConfigArgsFromSharedConfig()",
    level: logLevel,
  });

  log.debug("ENTER");

  const signers: Array<Uint8Array> = [];
  const offChainPublicKeys: Array<Uint8Array> = [];
  const transmitters: Array<string> = [];
  const peerIds: Array<string> = [];

  opts.sharedConfig.oracleIdentities.forEach((identity) => {
    signers.push(identity.onchainPublicKey);
    transmitters.push(identity.transmitAccount);
    offChainPublicKeys.push(identity.offchainPublicKey);
    peerIds.push(identity.peerID);
  });

  const sharedSecretEncryptions = await encryptSharedSecret(
    opts.sharedSecretEncryptionPublicKeys,
    opts.sharedConfig.sharedSecret,
  );

  const offchainConfigPojo: OffchainConfigProto = {
    deltaProgressNanoseconds: opts.sharedConfig.deltaProgress,
    deltaResendNanoseconds: opts.sharedConfig.deltaResend,
    deltaRoundNanoseconds: opts.sharedConfig.deltaRound,
    deltaGraceNanoseconds: opts.sharedConfig.deltaGrace,
    deltaStageNanoseconds: opts.sharedConfig.deltaStage,
    rMax: opts.sharedConfig.rMax,
    s: opts.sharedConfig.s,
    offchainPublicKeys: offChainPublicKeys,
    peerIds,
    reportingPluginConfig: opts.sharedConfig.reportingPluginConfig,
    maxDurationInitializationNanoseconds:
      opts.sharedConfig.maxDurationInitialization,
    maxDurationQueryNanoseconds: opts.sharedConfig.maxDurationQuery,
    maxDurationObservationNanoseconds: opts.sharedConfig.maxDurationObservation,
    maxDurationReportNanoseconds: opts.sharedConfig.maxDurationReport,
    maxDurationShouldAcceptFinalizedReportNanoseconds:
      opts.sharedConfig.maxDurationShouldAcceptFinalizedReport,
    maxDurationShouldTransmitAcceptedReportNanoseconds:
      opts.sharedConfig.maxDurationShouldTransmitAcceptedReport,
    sharedSecretEncryptions,
  };

  const offchainConfigBytes = serialize(offchainConfigPojo);

  return [
    signers,
    transmitters,
    opts.sharedConfig.f,
    opts.sharedConfig.onchainConfig,
    OffchainConfigVersion.OCR2,
    offchainConfigBytes,
  ];

  // TODO: Complete the implementation of this function
}
