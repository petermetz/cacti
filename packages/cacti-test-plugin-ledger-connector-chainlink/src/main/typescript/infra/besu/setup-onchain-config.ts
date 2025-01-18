import safeStringify from "fast-safe-stringify";

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";

/**
 * ```go
 * type OCR2Config struct {
 *     Signers               []common.Address
 *     Transmitters          []common.Address
 *     F                     uint8
 *     OnchainConfig         []byte
 *     OffchainConfigVersion uint64
 *     OffchainConfig        []byte
 * }
 * ```
 */
export interface IOcr2Config {
  signers: ReadonlyArray<Readonly<string>>;
  transmitters: ReadonlyArray<Readonly<string>>;
  f: number; // uint8 in Go maps to number in TypeScript
  onchainConfig: Readonly<Uint8Array>;
  offchainConfigVersion: bigint; // uint64 in Go maps to bigint in TypeScript
  offchainConfig: Readonly<Uint8Array>;
}

/**
 *```go
 * func (c *CCIPContracts) SetupOnchainConfig(t *testing.T, commitOnchainConfig, commitOffchainConfig, execOnchainConfig, execOffchainConfig []byte) int64 {
 *  // Note We do NOT set the payees, payment is done in the OCR2Base implementation
 *  blockBeforeConfig, err := c.Dest.Chain.Client().BlockByNumber(tests.Context(t), nil)
 *  require.NoError(t, err)
 *
 *  c.SetupCommitOCR2Config(t, commitOnchainConfig, commitOffchainConfig)
 *  c.SetupExecOCR2Config(t, execOnchainConfig, execOffchainConfig)
 *
 *  return blockBeforeConfig.Number().Int64()
 * }
 *```
 * @param opts
 */
export async function setupOnchainConfig(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
}): Promise<{ readonly blockBeforeConfig: Readonly<bigint> }> {
  const log = LoggerProvider.getOrCreate({
    label: "setupOnchainConfig()",
    level: opts.logLevel,
  });
  log.debug("ENTER");
  const blockBeforeConfig = 0n; // FIXME

  const out = { blockBeforeConfig };
  log.debug("EXIT: blockBeforeConfig=%d", blockBeforeConfig);
  return out;
}

/**
 * ```go
 * func (c *CCIPContracts) SetupCommitOCR2Config(t *testing.T, commitOnchainConfig, commitOffchainConfig []byte) {
 * 	c.commitOCRConfig = c.DeriveOCR2Config(t, c.Oracles, commitOnchainConfig, commitOffchainConfig)
 * 	// Set the DON on the commit store
 * 	_, err := c.Dest.CommitStore.SetOCR2Config(
 * 		c.Dest.User,
 * 		c.commitOCRConfig.Signers,
 * 		c.commitOCRConfig.Transmitters,
 * 		c.commitOCRConfig.F,
 * 		c.commitOCRConfig.OnchainConfig,
 * 		c.commitOCRConfig.OffchainConfigVersion,
 * 		c.commitOCRConfig.OffchainConfig,
 * 	)
 * 	require.NoError(t, err)
 * 	c.Dest.Chain.Commit()
 * }
 * ```
 * @param opts
 * @returns
 */
export async function setupCommitOcr2Config(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
}): Promise<{ readonly txHash: Readonly<string> }> {
  const log = LoggerProvider.getOrCreate({
    label: "setupCommitOcr2Config()",
    level: opts.logLevel,
  });
  log.debug("ENTER");
  const txHash = "FIXME-add-this-once-it-is-working"; // FIXME

  const out = { txHash };
  log.debug("EXIT: txHash=%d", txHash);
  return out;
}

/**
 * ```go
 * func (c *CCIPContracts) SetupExecOCR2Config(t *testing.T, execOnchainConfig, execOffchainConfig []byte) {
 * 	c.execOCRConfig = c.DeriveOCR2Config(t, c.Oracles, execOnchainConfig, execOffchainConfig)
 * 	// Same DON on the offramp
 * 	_, err := c.Dest.OffRamp.SetOCR2Config(
 * 		c.Dest.User,
 * 		c.execOCRConfig.Signers,
 * 		c.execOCRConfig.Transmitters,
 * 		c.execOCRConfig.F,
 * 		c.execOCRConfig.OnchainConfig,
 * 		c.execOCRConfig.OffchainConfigVersion,
 * 		c.execOCRConfig.OffchainConfig,
 * 	)
 * 	require.NoError(t, err)
 * 	c.Dest.Chain.Commit()
 * }
 * ```
 * @param opts
 * @returns
 */
export async function setupExecOCR2Config(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
}): Promise<{ readonly txHash: Readonly<string> }> {
  const log = LoggerProvider.getOrCreate({
    label: "setupExecOCR2Config()",
    level: opts.logLevel,
  });
  log.debug("ENTER");
  const txHash = "FIXME-add-this-once-it-is-working"; // FIXME

  const out = { txHash };
  log.debug("EXIT: txHash=%d", txHash);
  return out;
}

/**
 * Source: `core/services/ocr2/plugins/ccip/testhelpers/ccip_contracts.go`
 *
 * ```go
 * func (c *CCIPContracts) DeriveOCR2Config(t *testing.T, oracles []confighelper.OracleIdentityExtra, rawOnchainConfig []byte, rawOffchainConfig []byte) *OCR2Config {
 *
 * 	signers, transmitters, threshold, onchainConfig, offchainConfigVersion, offchainConfig, err := confighelper.ContractSetConfigArgsForTests(
 * 		2*time.Second,        // deltaProgress
 * 		1*time.Second,        // deltaResend
 * 		1*time.Second,        // deltaRound
 * 		500*time.Millisecond, // deltaGrace
 * 		2*time.Second,        // deltaStage
 * 		3,
 * 		[]int{1, 1, 1, 1},
 * 		oracles,
 * 		rawOffchainConfig,
 * 		nil,
 * 		50*time.Millisecond, // Max duration query
 * 		1*time.Second,       // Max duration observation
 * 		100*time.Millisecond,
 * 		100*time.Millisecond,
 * 		100*time.Millisecond,
 * 		1, // faults
 * 		rawOnchainConfig,
 * 	)
 * 	require.NoError(t, err)
 * 	lggr := logger.TestLogger(t)
 * 	lggr.Infow("Setting Config on Oracle Contract",
 * 		"signers", signers,
 * 		"transmitters", transmitters,
 * 		"threshold", threshold,
 * 		"onchainConfig", onchainConfig,
 * 		"encodedConfigVersion", offchainConfigVersion,
 * 	)
 * 	signerAddresses, err := OnchainPublicKeyToAddress(signers)
 * 	require.NoError(t, err)
 * 	transmitterAddresses, err := AccountToAddress(transmitters)
 * 	require.NoError(t, err)
 *
 * 	return &OCR2Config{
 * 		Signers:               signerAddresses,
 * 		Transmitters:          transmitterAddresses,
 * 		F:                     threshold,
 * 		OnchainConfig:         onchainConfig,
 * 		OffchainConfigVersion: offchainConfigVersion,
 * 		OffchainConfig:        offchainConfig,
 * 	}
 * }
 * ```
 * @param opts
 * @returns
 */
export async function deriveOCR2Config(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
}): Promise<{ readonly ocr2Config: Readonly<IOcr2Config> }> {
  const log = LoggerProvider.getOrCreate({
    label: "deriveOCR2Config()",
    level: opts.logLevel,
  });
  log.debug("ENTER");

  const ocr2Config: IOcr2Config = {
    signers: [Object.freeze("0xFIXME0000000000000000000000000000000000")],
    transmitters: [Object.freeze("0xFIXME0000000000000000000000000000000000")],
    f: 0, // FIXME: Replace with the actual value
    onchainConfig: Object.freeze(new Uint8Array([])), // FIXME: Replace with the actual data
    offchainConfigVersion: BigInt(0), // FIXME: Replace with the actual version
    offchainConfig: Object.freeze(new Uint8Array([])), // FIXME: Replace with the actual data
  };

  const out = { ocr2Config };
  log.debug("EXIT: ocr2Config=%s", safeStringify(ocr2Config));
  return out;
}
