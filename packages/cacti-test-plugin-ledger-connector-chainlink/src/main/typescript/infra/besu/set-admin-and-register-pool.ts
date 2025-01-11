import safeStringify from "fast-safe-stringify";

import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import {
  EthContractInvocationType,
  InvokeContractV1Response,
  Web3SigningCredential,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as TokenAdminRegistryContract from "../../../json/ccip/besu/token-admin-registry-contract.json";

/**
 * ```go
 * func SetAdminAndRegisterPool(t *testing.T,
 *     chain *simulated.Backend,
 *     user *bind.TransactOpts,
 *     tokenAdminRegistry *token_admin_registry.TokenAdminRegistry,
 *     tokenAddress common.Address,
 *     poolAddress common.Address) {
 *
 *     _, err := tokenAdminRegistry.ProposeAdministrator(user, tokenAddress, user.From)
 *     require.NoError(t, err)
 *     chain.Commit()
 *
 *     _, err = tokenAdminRegistry.AcceptAdminRole(user, tokenAddress)
 *     require.NoError(t, err)
 *     chain.Commit()
 *
 *     _, err = tokenAdminRegistry.SetPool(user, tokenAddress, poolAddress)
 *     require.NoError(t, err)
 *
 *     chain.Commit()
 * }
 * ```
 */
export async function setAdminAndRegisterPool(opts: {
  readonly logLevel?: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly tokenAddr: Readonly<string>;
  readonly poolAddr: Readonly<string>;
  readonly tokenAdminRegistryAddr: Readonly<string>;
  readonly evmAdminAccountAddr: Readonly<string>;
}): Promise<{
  readonly resProposeAdmin: Readonly<InvokeContractV1Response>;
  readonly resAcceptAdminRole: Readonly<InvokeContractV1Response>;
  readonly resSetPool: Readonly<InvokeContractV1Response>;
}> {
  const { logLevel = "WARN", apiClient, web3SigningCredential } = opts;
  const { ABI: contractAbi, contractName, gas } = TokenAdminRegistryContract;

  const log = LoggerProvider.getOrCreate({
    label: "setAdminAndRegisterPool()",
    level: logLevel,
  });

  const { data: resProposeAdmin } = await apiClient.invokeContractV1({
    methodName: "proposeAdministrator",
    invocationType: EthContractInvocationType.Send,
    params: [opts.tokenAddr, opts.evmAdminAccountAddr],
    contractAddress: opts.tokenAdminRegistryAddr,
    contractAbi,
    contractName,
    signingCredential: web3SigningCredential,
    gas,
  });
  {
    // FIXME - this is a bug in the besu endpoint which returns an incorrect shape
    // for the response body not compliant with the OpenAPI specifications.
    const out = (resProposeAdmin as unknown as { out: unknown })
      .out as InvokeContractV1Response;
    if (!out.transactionReceipt) {
      throw new Error("TokenAdminRegistry admin proposal tx receipt falsy.");
    }
    const { transactionReceipt, callOutput } = out;
    const { blockNumber, gasUsed } = transactionReceipt;
    const ctx = safeStringify({ blockNumber, gasUsed, callOutput });
    log.debug("CCIP TokenAdminRegistry admin proposed OK: %s", ctx);
  }

  const { data: resAcceptAdminRole } = await apiClient.invokeContractV1({
    methodName: "acceptAdminRole",
    invocationType: EthContractInvocationType.Send,
    params: [opts.tokenAddr],
    contractAddress: opts.tokenAdminRegistryAddr,
    contractAbi,
    contractName,
    signingCredential: web3SigningCredential,
    gas,
  });

  {
    // FIXME - this is a bug in the besu endpoint which returns an incorrect shape
    // for the response body not compliant with the OpenAPI specifications.
    const out = (resAcceptAdminRole as unknown as { out: unknown })
      .out as InvokeContractV1Response;
    if (!out.transactionReceipt) {
      throw new Error("TokenAdminRegistry admin accept tx receipt falsy.");
    }
    const { transactionReceipt, callOutput } = out;
    const { blockNumber, gasUsed } = transactionReceipt;
    const ctx = safeStringify({ blockNumber, gasUsed, callOutput });
    log.debug("CCIP TokenAdminRegistry admin accept OK: %s", ctx);
  }

  const { data: resSetPool } = await apiClient.invokeContractV1({
    methodName: "setPool",
    invocationType: EthContractInvocationType.Send,
    params: [opts.tokenAddr, opts.poolAddr],
    contractAddress: opts.tokenAdminRegistryAddr,
    contractAbi,
    contractName,
    signingCredential: web3SigningCredential,
    gas,
  });

  {
    // FIXME - this is a bug in the besu endpoint which returns an incorrect shape
    // for the response body not compliant with the OpenAPI specifications.
    const out = (resSetPool as unknown as { out: unknown })
      .out as InvokeContractV1Response;
    if (!out.transactionReceipt) {
      throw new Error("TokenAdminRegistry setting pool tx receipt falsy.");
    }
    const { transactionReceipt, callOutput } = out;
    const { blockNumber, gasUsed } = transactionReceipt;
    const ctx = safeStringify({ blockNumber, gasUsed, callOutput });
    log.debug("CCIP TokenAdminRegistry setting pool OK: %s", ctx);
  }

  return { resProposeAdmin, resSetPool, resAcceptAdminRole };
}
