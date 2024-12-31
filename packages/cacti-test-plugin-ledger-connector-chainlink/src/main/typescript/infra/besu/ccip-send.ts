import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import {
  EthContractInvocationType,
  InvokeContractV1Response,
  Web3SigningCredential,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as RouterContract from "../../../json/ccip/besu/router-contract.json";

/**
 *
 * ## Mirrored Function:
 *
 * File: `core/services/ocr2/plugins/ccip/testhelpers/ccip_contracts.go`
 *
 * ```go
 * func (c *CCIPContracts) SendRequest(t *testing.T, msg router.ClientEVM2AnyMessage) *types.Transaction {
 *   tx, err := c.Source.Router.CcipSend(c.Source.User, c.Dest.ChainSelector, msg)
 *   require.NoError(t, err)
 *   c.Source.Chain.Commit()
 *   ConfirmTxs(t, []*types.Transaction{tx}, c.Source.Chain)
 *   return tx
 * }
 *
 * ```
 * ## Types for Messaging
 * File: `core/gethwrappers/ccip/generated/router/router.go`
 *
 * ```go
 * type ClientAny2EVMMessage struct {
 *   MessageId           [32]byte
 *   SourceChainSelector uint64
 *   Sender              []byte
 *   Data                []byte
 *   DestTokenAmounts    []ClientEVMTokenAmount
 * }
 *
 * type ClientEVM2AnyMessage struct {
 *   Receiver     []byte
 *   Data         []byte
 *   TokenAmounts []ClientEVMTokenAmount
 *   FeeToken     common.Address
 *   ExtraArgs    []byte
 * }
 *
 * type ClientEVMTokenAmount struct {
 *   Token  common.Address
 *   Amount *big.Int
 * }
 * ```
 */
export async function ccipSend(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly destinationChainSelector: Readonly<bigint>;
  readonly routerAddr: Readonly<string>;
  readonly clientEVM2AnyMessage: Readonly<Record<string, unknown>>;
}): Promise<{
  readonly resCcipSend: Readonly<InvokeContractV1Response>;
}> {
  const { logLevel: level = "WARN", apiClient, web3SigningCredential } = opts;
  const { ABI: contractAbi, contractName, gas } = RouterContract;

  const log = LoggerProvider.getOrCreate({
    label: "updateRegistryPrices()",
    level,
  });

  const { data: resCcipSend } = await apiClient.invokeContractV1({
    methodName: "ccipSend",
    invocationType: EthContractInvocationType.Send,
    params: [opts.destinationChainSelector, opts.clientEVM2AnyMessage],
    contractAddress: opts.routerAddr,
    contractAbi,
    contractName,
    signingCredential: web3SigningCredential,
    gas,
  });
  log.debug("CCIP Router ccipSend() OK: %o", resCcipSend);

  return { resCcipSend };
}
