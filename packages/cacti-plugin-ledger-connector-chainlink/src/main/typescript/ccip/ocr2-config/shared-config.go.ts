/**
 * ```go
 * type SharedConfig struct {
 *     PublicConfig
 *     SharedSecret *[config.SharedSecretSize]byte
 * }
 * SharedConfig is the configuration shared by all oracles running an instance of the protocol. It's disseminated through the smart contract, but parts of it are encrypted so that only oracles can access them.
 *
 * // Embedded fields:
 * DeltaProgress                           time.Duration           // through PublicConfig
 * DeltaResend                             time.Duration           // through PublicConfig
 * DeltaRound                              time.Duration           // through PublicConfig
 * DeltaGrace                              time.Duration           // through PublicConfig
 * DeltaStage                              time.Duration           // through PublicConfig
 * RMax                                    uint8                   // through PublicConfig
 * S                                       []int                   // through PublicConfig
 * OracleIdentities                        []config.OracleIdentity // through PublicConfig
 * ReportingPluginConfig                   []byte                  // through PublicConfig
 * MaxDurationInitialization               *time.Duration          // through PublicConfig
 * MaxDurationQuery                        time.Duration           // through PublicConfig
 * MaxDurationObservation                  time.Duration           // through PublicConfig
 * MaxDurationReport                       time.Duration           // through PublicConfig
 * MaxDurationShouldAcceptFinalizedReport  time.Duration           // through PublicConfig
 * MaxDurationShouldTransmitAcceptedReport time.Duration           // through PublicConfig
 * F                                       int                     // through PublicConfig
 * OnchainConfig                           []byte                  // through PublicConfig
 * ConfigDigest                            types.ConfigDigest      // through PublicConfig
 * func (c *PublicConfig) CheckParameterBounds() error
 * func (c *SharedConfig) LeaderSelectionKey() [16]byte
 * func (c *PublicConfig) N() int
 * func (c *SharedConfig) TransmissionOrderKey() [16]byte
 * ```
 *
 * ```go
 * func XXXContractSetConfigArgsFromSharedConfig(
 *	c SharedConfig,
 *	sharedSecretEncryptionPublicKeys []types.ConfigEncryptionPublicKey,
 *) (
 *	signers []types.OnchainPublicKey,
 *	transmitters []types.Account,
 *	f uint8,
 *	onchainConfig []byte,
 *	offchainConfigVersion uint64,
 *	offchainConfig_ []byte,
 *	err error,
 *) {
 *	offChainPublicKeys := []types.OffchainPublicKey{}
 *	peerIDs := []string{}
 *	for _, identity := range c.OracleIdentities {
 *		signers = append(signers, identity.OnchainPublicKey)
 *		transmitters = append(transmitters, identity.TransmitAccount)
 *		offChainPublicKeys = append(offChainPublicKeys, identity.OffchainPublicKey)
 *		peerIDs = append(peerIDs, identity.PeerID)
 *	}
 *	sharedSecretEncryptions, err := config.EncryptSharedSecret(
 *		sharedSecretEncryptionPublicKeys,
 *		c.SharedSecret,
 *		cryptorand.Reader,
 *	)
 *	if err != nil {
 *		return nil, nil, 0, nil, 0, nil, err
 *	}
 *	offchainConfig_ = (offchainConfig{
 *		c.DeltaProgress,
 *		c.DeltaResend,
 *		c.DeltaRound,
 *		c.DeltaGrace,
 *		c.DeltaStage,
 *		c.RMax,
 *		c.S,
 *		offChainPublicKeys,
 *		peerIDs,
 *		c.ReportingPluginConfig,
 *		c.MaxDurationInitialization,
 *		c.MaxDurationQuery,
 *		c.MaxDurationObservation,
 *		c.MaxDurationReport,
 *		c.MaxDurationShouldAcceptFinalizedReport,
 *		c.MaxDurationShouldTransmitAcceptedReport,
 *		sharedSecretEncryptions,
 *	}).serialize()
 *	return signers, transmitters, uint8(c.F), c.OnchainConfig, config.OCR2OffchainConfigVersion, offchainConfig_, nil
 *}
 * ```
 */
export function xxxContractSetConfigArgsFromSharedConfig() {}
