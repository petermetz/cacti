import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import {
  EthContractInvocationType,
  InvokeContractV1Response,
  Web3SigningCredential,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as LockReleaseTokenPoolContract from "../../../json/ccip/besu/lock-release-token-pool-contract.json";
import * as LinkTokenContract from "../../../json/ccip/besu/link-token-contract.json";
import { linkValue } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";

/**
 * The relevant code from `core/services/ocr2/plugins/ccip/testhelpers/ccip_contracts.go`
 * can be seen below (which we are replicating here):
 *
 * ```go
 * // Float the offramp pool
 * o, err := destLinkPool.Owner(nil)
 * require.NoError(t, err)
 * require.Equal(t, destUser.From.String(), o.String())
 * _, err = destLinkPool.SetRebalancer(destUser, destUser.From)
 * require.NoError(t, err)
 * destChain.Commit()
 * _, err = destLinkToken.Approve(destUser, destPoolLinkAddress, Link(200))
 * require.NoError(t, err)
 * destChain.Commit()
 * _, err = destLinkPool.ProvideLiquidity(destUser, Link(200))
 * require.NoError(t, err)
 * destChain.Commit()
 * ```
 */
export async function floatOffRampPool(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly tokenAddr: Readonly<string>;
  readonly poolAddr: Readonly<string>;
  readonly evmAdminAccountAddr: Readonly<string>;
}): Promise<{
  readonly resOwner: Readonly<InvokeContractV1Response>;
  readonly resSetRebalancer: Readonly<InvokeContractV1Response>;
  readonly resApprove: Readonly<InvokeContractV1Response>;
  readonly resProvideLiquidity: Readonly<InvokeContractV1Response>;
}> {
  const { logLevel, apiClient, web3SigningCredential } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "floatOffRampPool()",
    level: logLevel,
  });

  const { data: resOwner } = await apiClient.invokeContractV1({
    contractAddress: opts.poolAddr,
    contractAbi: LockReleaseTokenPoolContract.ABI,
    contractName: LockReleaseTokenPoolContract.contractName,
    gas: LockReleaseTokenPoolContract.gas,
    invocationType: EthContractInvocationType.Send,
    methodName: "owner",
    params: [],
    signingCredential: web3SigningCredential,
  });
  log.debug("CCIP LockReleaseTokenPool owner set OK: %o", resOwner);

  const { data: resSetRebalancer } = await apiClient.invokeContractV1({
    contractAddress: opts.poolAddr,
    contractAbi: LockReleaseTokenPoolContract.ABI,
    contractName: LockReleaseTokenPoolContract.contractName,
    gas: LockReleaseTokenPoolContract.gas,
    invocationType: EthContractInvocationType.Send,
    methodName: "setRebalancer",
    params: [opts.evmAdminAccountAddr],
    signingCredential: web3SigningCredential,
  });
  log.debug("CCIP LockReleaseTokenPool setRebalancer OK: %o", resSetRebalancer);

  const { data: resApprove } = await apiClient.invokeContractV1({
    contractAddress: opts.tokenAddr,
    contractAbi: LinkTokenContract.ABI,
    contractName: LinkTokenContract.contractName,
    gas: LinkTokenContract.gas,
    invocationType: EthContractInvocationType.Send,
    methodName: "approve",
    params: [opts.poolAddr, linkValue(200n)],
    signingCredential: web3SigningCredential,
  });
  log.debug("CCIP LinkToken approve() OK: %o", resApprove);

  const { data: resProvideLiquidity } = await apiClient.invokeContractV1({
    contractAddress: opts.poolAddr,
    contractAbi: LockReleaseTokenPoolContract.ABI,
    contractName: LockReleaseTokenPoolContract.contractName,
    gas: LockReleaseTokenPoolContract.gas,
    invocationType: EthContractInvocationType.Send,
    methodName: "provideLiquidity",
    params: [linkValue(200n)],
    signingCredential: web3SigningCredential,
  });
  log.debug("CCIP LockReleaseTokenPool provideLiquidity:", resProvideLiquidity);

  return { resOwner, resSetRebalancer, resApprove, resProvideLiquidity };
}
