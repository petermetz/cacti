import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import {
  EthContractInvocationType,
  InvokeContractV1Response,
  Web3SigningCredential,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as LockReleaseTokenPoolContract from "../../../json/ccip/besu/lock-release-token-pool-contract.json";

/**
 * Updates the configuration of pool (WETH9, Link, etc.) contracts on-chain.
 *
 *```go
 * // ================================================================
 * // │                    Configure token pools                     │
 * // ================================================================
 *
 *   abiEncodedDestLinkPool, err := abihelpers.EncodeAddress(destLinkPool.Address())
 *   require.NoError(t, err)
 *   abiEncodedDestLinkTokenAddress, err := abihelpers.EncodeAddress(destLinkToken.Address())
 *   require.NoError(t, err)
 *   _, err = sourceLinkPool.ApplyChainUpdates(
 *       sourceUser,
 *       []uint64{},
 *       []lock_release_token_pool.TokenPoolChainUpdate{{
 *           RemoteChainSelector: DestChainSelector,
 *           RemotePoolAddresses: [][]byte{abiEncodedDestLinkPool},
 *           RemoteTokenAddress:  abiEncodedDestLinkTokenAddress,
 *           OutboundRateLimiterConfig: lock_release_token_pool.RateLimiterConfig{
 *               IsEnabled: true,
 *               Capacity:  HundredLink,
 *               Rate:      big.NewInt(1e18),
 *           },
 *           InboundRateLimiterConfig: lock_release_token_pool.RateLimiterConfig{
 *               IsEnabled: true,
 *               Capacity:  HundredLink,
 *               Rate:      big.NewInt(1e18),
 *           },
 *       }},
 *   )
 *   require.NoError(t, err)
 *
 *   abiEncodedDestWrappedPool, err := abihelpers.EncodeAddress(destWrappedPool.Address())
 *   require.NoError(t, err)
 *   abiEncodedDestWrappedTokenAddr, err := abihelpers.EncodeAddress(destWeth9addr)
 *   require.NoError(t, err)
 *   _, err = sourceWeth9Pool.ApplyChainUpdates(
 *       sourceUser,
 *       []uint64{},
 *       []lock_release_token_pool.TokenPoolChainUpdate{{
 *           RemoteChainSelector: DestChainSelector,
 *           RemotePoolAddresses: [][]byte{abiEncodedDestWrappedPool},
 *           RemoteTokenAddress:  abiEncodedDestWrappedTokenAddr,
 *           OutboundRateLimiterConfig: lock_release_token_pool.RateLimiterConfig{
 *               IsEnabled: true,
 *               Capacity:  HundredLink,
 *               Rate:      big.NewInt(1e18),
 *           },
 *           InboundRateLimiterConfig: lock_release_token_pool.RateLimiterConfig{
 *               IsEnabled: true,
 *               Capacity:  HundredLink,
 *               Rate:      big.NewInt(1e18),
 *           },
 *       }},
 *   )
 *   require.NoError(t, err)
 *   sourceChain.Commit()
 *
 *   abiEncodedSourceLinkPool, err := abihelpers.EncodeAddress(sourceLinkPool.Address())
 *   require.NoError(t, err)
 *   abiEncodedSourceLinkTokenAddr, err := abihelpers.EncodeAddress(sourceLinkTokenAddress)
 *   require.NoError(t, err)
 *   _, err = destLinkPool.ApplyChainUpdates(
 *       destUser,
 *       []uint64{},
 *       []lock_release_token_pool.TokenPoolChainUpdate{{
 *           RemoteChainSelector: SourceChainSelector,
 *           RemotePoolAddresses: [][]byte{abiEncodedSourceLinkPool},
 *           RemoteTokenAddress:  abiEncodedSourceLinkTokenAddr,
 *           OutboundRateLimiterConfig: lock_release_token_pool.RateLimiterConfig{
 *               IsEnabled: true,
 *               Capacity:  HundredLink,
 *               Rate:      big.NewInt(1e18),
 *           },
 *           InboundRateLimiterConfig: lock_release_token_pool.RateLimiterConfig{
 *               IsEnabled: true,
 *               Capacity:  HundredLink,
 *               Rate:      big.NewInt(1e18),
 *           },
 *       }},
 *   )
 *   require.NoError(t, err)
 *
 *   abiEncodedSourceWrappedPool, err := abihelpers.EncodeAddress(sourceWeth9Pool.Address())
 *   require.NoError(t, err)
 *   abiEncodedSourceWrappedTokenAddr, err := abihelpers.EncodeAddress(sourceWrapped.Address())
 *   require.NoError(t, err)
 *   _, err = destWrappedPool.ApplyChainUpdates(
 *       destUser,
 *       []uint64{},
 *       []lock_release_token_pool.TokenPoolChainUpdate{{
 *           RemoteChainSelector: SourceChainSelector,
 *           RemotePoolAddresses: [][]byte{abiEncodedSourceWrappedPool},
 *           RemoteTokenAddress:  abiEncodedSourceWrappedTokenAddr,
 *           OutboundRateLimiterConfig: lock_release_token_pool.RateLimiterConfig{
 *               IsEnabled: true,
 *               Capacity:  HundredLink,
 *               Rate:      big.NewInt(1e18),
 *           },
 *           InboundRateLimiterConfig: lock_release_token_pool.RateLimiterConfig{
 *               IsEnabled: true,
 *               Capacity:  HundredLink,
 *               Rate:      big.NewInt(1e18),
 *           },
 *       }},
 *   )
 *   require.NoError(t, err)
 *   destChain.Commit()
 *```
 */
export async function configureTokenPool(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly remoteChainSelectorsToRemove: ReadonlyArray<bigint>;
  readonly tokenPoolChainUpdate: ReadonlyArray<Record<string, unknown>>;
  readonly poolAddr: Readonly<string>;
}): Promise<{
  readonly resApplyChainUpdates: Readonly<InvokeContractV1Response>;
}> {
  const { logLevel = "WARN", apiClient, web3SigningCredential } = opts;
  const { ABI: contractAbi, contractName, gas } = LockReleaseTokenPoolContract;

  const log = LoggerProvider.getOrCreate({
    label: "configureTokenPool()",
    level: logLevel,
  });

  const { data: resApplyChainUpdates } = await apiClient.invokeContractV1({
    methodName: "applyChainUpdates",
    invocationType: EthContractInvocationType.Send,
    params: [opts.remoteChainSelectorsToRemove, opts.tokenPoolChainUpdate],
    contractAddress: opts.poolAddr,
    contractAbi,
    contractName,
    signingCredential: web3SigningCredential,
    gas,
  });
  const ctx = JSON.stringify(resApplyChainUpdates);
  log.debug("CCIP token pool applyChainUpdates() OK: %o", ctx);

  return { resApplyChainUpdates };
}
