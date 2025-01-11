import safeStringify from "fast-safe-stringify";

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

  {
    // FIXME - this is a bug in the besu endpoint which returns an incorrect shape
    // for the response body not compliant with the OpenAPI specifications.
    const out = (resOwner as unknown as { out: unknown })
      .out as InvokeContractV1Response;
    if (!out.transactionReceipt) {
      throw new Error("LockReleaseTokenPool owner set tx receipt falsy.");
    }
    const { transactionReceipt, callOutput } = out;
    const { blockNumber, gasUsed } = transactionReceipt;
    const ctx = safeStringify({ blockNumber, gasUsed, callOutput });
    log.debug("LockReleaseTokenPool owner set OK: %s", ctx);
  }

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

  {
    // FIXME - this is a bug in the besu endpoint which returns an incorrect shape
    // for the response body not compliant with the OpenAPI specifications.
    const out = (resSetRebalancer as unknown as { out: unknown })
      .out as InvokeContractV1Response;
    if (!out.transactionReceipt) {
      throw new Error("LockReleaseTokenPool setRebalancer tx receipt falsy.");
    }
    const { transactionReceipt, callOutput } = out;
    const { blockNumber, gasUsed } = transactionReceipt;
    const ctx = safeStringify({ blockNumber, gasUsed, callOutput });
    log.debug("LockReleaseTokenPool setRebalancer OK: %s", ctx);
  }

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

  {
    // FIXME - this is a bug in the besu endpoint which returns an incorrect shape
    // for the response body not compliant with the OpenAPI specifications.
    const out = (resApprove as unknown as { out: unknown })
      .out as InvokeContractV1Response;
    if (!out.transactionReceipt) {
      throw new Error("LinkToken approve() tx receipt falsy.");
    }
    const { transactionReceipt, callOutput } = out;
    const { blockNumber, gasUsed } = transactionReceipt;
    const ctx = safeStringify({ blockNumber, gasUsed, callOutput });
    log.debug("LinkToken approve() OK: %s", ctx);
  }

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

  {
    // FIXME - this is a bug in the besu endpoint which returns an incorrect shape
    // for the response body not compliant with the OpenAPI specifications.
    const out = (resProvideLiquidity as unknown as { out: unknown })
      .out as InvokeContractV1Response;
    if (!out.transactionReceipt) {
      throw new Error(
        "LockReleaseTokenPool provideLiquidity tx receipt falsy.",
      );
    }
    const { transactionReceipt, callOutput } = out;
    const { blockNumber, gasUsed } = transactionReceipt;
    const ctx = safeStringify({ blockNumber, gasUsed, callOutput });
    log.debug("LockReleaseTokenPool provideLiquidity OK: %s", ctx);
  }

  return { resOwner, resSetRebalancer, resApprove, resProvideLiquidity };
}
