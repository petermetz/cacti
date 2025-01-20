import safeStringify from "fast-safe-stringify";

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { IOracleIdentityExtra } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { contractSetConfigArgsForTests } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { DurationNano } from "@hyperledger/cactus-common";

import { ABI as CommitStoreHelperAbi } from "../../../../main/typescript/infra/besu/commit-store-helper-factory";
import { ABI as OffRampAbi } from "../../../../main/typescript/infra/besu/off-ramp-factory";
import Web3, { Contract } from "web3";
import { Web3SigningCredentialPrivateKeyHex } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { IDeployBesuCcipContractsOutput } from "./deploy-besu-ccip-contracts";

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
  readonly contracts: Readonly<IDeployBesuCcipContractsOutput>;
  readonly dstCommitStoreHelper: Readonly<
    Contract<typeof CommitStoreHelperAbi>
  >;
  readonly dstOffRamp: Readonly<Contract<typeof OffRampAbi>>;
  readonly oracles: Readonly<Array<IOracleIdentityExtra>>;
  readonly commitOffchainConfig: Readonly<Uint8Array>;
  readonly commitOnchainConfig: Readonly<Uint8Array>;
  readonly execOffchainConfig: Readonly<Uint8Array>;
  readonly execOnchainConfig: Readonly<Uint8Array>;
  readonly srcWeb3: Readonly<Web3>;
  readonly srcWeb3SigningCredential: Readonly<Web3SigningCredentialPrivateKeyHex>;
  readonly dstWeb3: Readonly<Web3>;
  readonly dstWeb3SigningCredential: Readonly<Web3SigningCredentialPrivateKeyHex>;
}): Promise<{ readonly blockBeforeConfig: Readonly<bigint> }> {
  const log = LoggerProvider.getOrCreate({
    label: "setupOnchainConfig()",
    level: opts.logLevel,
  });
  log.debug("ENTER");
  const blockBeforeConfig = await opts.dstWeb3.eth.getBlockNumber();

  await setupCommitOcr2Config({
    ...opts,
  });

  await setupExecOCR2Config({
    ...opts,
  });

  const out = { blockBeforeConfig };
  log.debug("EXIT: blockBeforeConfig=%d", blockBeforeConfig);
  return out;
}

// DONE
async function setupCommitOcr2Config(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly contracts: Readonly<IDeployBesuCcipContractsOutput>;
  readonly dstWeb3SigningCredential: Readonly<Web3SigningCredentialPrivateKeyHex>;
  readonly srcWeb3SigningCredential: Readonly<Web3SigningCredentialPrivateKeyHex>;
  readonly dstCommitStoreHelper: Readonly<
    Contract<typeof CommitStoreHelperAbi>
  >;
  readonly oracles: Readonly<Array<IOracleIdentityExtra>>;
  readonly commitOnchainConfig: Readonly<Uint8Array>;
  readonly commitOffchainConfig: Readonly<Uint8Array>;
}): Promise<{
  readonly blockNumber: Readonly<bigint>;
  readonly cumulativeGasUsed: Readonly<bigint>;
  readonly gasUsed: Readonly<bigint>;
  readonly transactionHash: Readonly<string>;
}> {
  const { logLevel = "WARN" } = opts;
  const { ocr2Config: commitOCRConfig } = await deriveOCR2Config({
    logLevel: opts.logLevel,
    oracles: opts.oracles,
    rawOffchainConfig: opts.commitOffchainConfig,
    rawOnchainConfig: opts.commitOnchainConfig,
  });

  const log = LoggerProvider.getOrCreate({
    label: "setupCommitOcr2Config()",
    level: logLevel,
  });

  const { f, offchainConfigVersion, signers, transmitters } = commitOCRConfig;

  const inputCtx = safeStringify({
    f,
    offchainConfigVersion,
    signers,
    transmitters,
  });
  log.debug("Invoking dstCommitStoreHelper.setOCR2Config... in: %s", inputCtx);

  const out = await opts.dstCommitStoreHelper.methods
    .setOCR2Config(
      commitOCRConfig.signers as string[],
      commitOCRConfig.transmitters as string[],
      commitOCRConfig.f,
      commitOCRConfig.onchainConfig,
      commitOCRConfig.offchainConfigVersion,
      commitOCRConfig.offchainConfig,
    )
    .send({ from: opts.dstWeb3SigningCredential.ethAccount });

  const { blockNumber, cumulativeGasUsed, gasUsed, transactionHash } = out;
  const ctx = { blockNumber, cumulativeGasUsed, gasUsed, transactionHash };
  log.debug("dstCommitStoreHelper.setOCR2Config() OK: %s", safeStringify(ctx));

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
  readonly dstOffRamp: Readonly<Contract<typeof OffRampAbi>>;
  readonly oracles: Readonly<Array<IOracleIdentityExtra>>;
  readonly execOnchainConfig: Readonly<Uint8Array>;
  readonly execOffchainConfig: Readonly<Uint8Array>;
  readonly srcWeb3SigningCredential: Readonly<Web3SigningCredentialPrivateKeyHex>;
  readonly dstWeb3SigningCredential: Readonly<Web3SigningCredentialPrivateKeyHex>;
}): Promise<{
  readonly blockNumber: Readonly<bigint>;
  readonly transactionHash: Readonly<string>;
  readonly cumulativeGasUsed: Readonly<bigint>;
}> {
  const { logLevel = "WARN", oracles } = opts;
  const log = LoggerProvider.getOrCreate({
    label: "setupExecOCR2Config()",
    level: logLevel,
  });
  log.debug("ENTER");

  const { ocr2Config: execOCRConfig } = await deriveOCR2Config({
    logLevel,
    oracles,
    rawOffchainConfig: opts.execOffchainConfig,
    rawOnchainConfig: opts.execOnchainConfig,
  });

  const out = await opts.dstOffRamp.methods
    .setOCR2Config(
      execOCRConfig.signers as string[],
      execOCRConfig.transmitters as string[],
      execOCRConfig.f,
      execOCRConfig.onchainConfig,
      execOCRConfig.offchainConfigVersion,
      execOCRConfig.offchainConfig,
    )
    .send({ from: opts.dstWeb3SigningCredential.ethAccount });

  const { blockNumber, transactionHash, cumulativeGasUsed } = out;
  const ctx = {
    blockNumber,
    transactionHash,
    cumulativeGasUsed,
  };
  log.debug("EXIT: dstOffRamp.setOCR2Config() OK:%s", safeStringify(ctx));
  return ctx;
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
  readonly oracles: Readonly<Array<IOracleIdentityExtra>>;
  readonly rawOnchainConfig: Uint8Array;
  readonly rawOffchainConfig: Uint8Array;
}): Promise<{ readonly ocr2Config: Readonly<IOcr2Config> }> {
  const log = LoggerProvider.getOrCreate({
    label: "deriveOCR2Config()",
    level: opts.logLevel,
  });
  log.debug("ENTER");

  const deltaProgress = BigInt(2) * DurationNano.Second;
  const deltaResend = BigInt(1) * DurationNano.Second;
  const deltaRound = BigInt(1) * DurationNano.Second;
  const deltaGrace = BigInt(500) * DurationNano.Millisecond;
  const deltaStage = BigInt(2) * DurationNano.Second;
  const rMax = 3;
  const s = [1, 1, 1, 1];
  const oracles = opts.oracles;
  const reportingPluginConfig: Uint8Array = opts.rawOffchainConfig;
  const maxDurationInitialization = BigInt(30) * DurationNano.Second; // FIXME - figure out why this is nil in the go code
  const maxDurationQuery = BigInt(50) * DurationNano.Millisecond;
  const maxDurationObservation = BigInt(1) * DurationNano.Second;
  const maxDurationReport = BigInt(100) * DurationNano.Millisecond;

  const maxDurationShouldAcceptFinalizedReport =
    BigInt(100) * DurationNano.Millisecond;

  const maxDurationShouldTransmitAcceptedReport =
    BigInt(100) * DurationNano.Millisecond;

  const f = 1;

  const rawOnchainConfig = opts.rawOnchainConfig;

  const [
    signers,
    transmitters,
    threshold,
    onchainConfig,
    offchainConfigVersion,
    offchainConfig,
  ] = await contractSetConfigArgsForTests(
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
    rawOnchainConfig,
  );

  const EVM_ADDRESS_BYTE_LENGTH = 20;
  const signerAddresses = signers
    .map((pubKey: Uint8Array) =>
      pubKey.subarray(pubKey.length - EVM_ADDRESS_BYTE_LENGTH),
    )
    .map((pubKey: Uint8Array) => Buffer.from(pubKey).toString("hex"));

  const ocr2Config: IOcr2Config = {
    signers: signerAddresses,
    transmitters,
    f: threshold,
    onchainConfig,
    offchainConfigVersion: offchainConfigVersion,
    offchainConfig: offchainConfig,
  };

  const out = { ocr2Config };
  log.debug("EXIT");
  return out;
}
