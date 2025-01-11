import safeStringify from "fast-safe-stringify";

import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import {
  EthContractInvocationType,
  InvokeContractV1Response,
  Web3SigningCredential,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as Weth9Contract from "../../../json/ccip/besu/weth9-contract.json";

/**
 *
 *```go
 * poolFloatValue := big.NewInt(1e18)
 * destUser.Value = poolFloatValue
 * destWrapped.Deposit(destUser)
 * destUser.Value = nil
 * destWrapped.Transfer(destUser, destWrappedPool.Address(), poolFloatValue)
 *```
 */
export async function depositAndTransferWeth9(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly tokenAddr: Readonly<string>;
  readonly poolAddr: Readonly<string>;
  readonly value: Readonly<bigint>;
}): Promise<{
  readonly resDeposit: Readonly<InvokeContractV1Response>;
  readonly resTransfer: Readonly<InvokeContractV1Response>;
}> {
  const { logLevel = "WARN", apiClient, web3SigningCredential } = opts;
  const { ABI: contractAbi, contractName, gas } = Weth9Contract;

  const log = LoggerProvider.getOrCreate({
    label: "depositAndTransferWeth9()",
    level: logLevel,
  });

  const { data: deposit } = await apiClient.invokeContractV1({
    methodName: "deposit",
    value: opts.value.toString(),
    invocationType: EthContractInvocationType.Send,
    params: [],
    contractAddress: opts.tokenAddr,
    contractAbi,
    contractName,
    signingCredential: web3SigningCredential,
    gas,
  });

  // FIXME - this is a bug in the besu endpoint which returns an incorrect shape
  // for the response body not compliant with the OpenAPI specifications.
  const out = (deposit as unknown as { out: unknown })
    .out as InvokeContractV1Response;

  if (!out.transactionReceipt) {
    throw new Error("Failed to WETH9.deposit() TransactionReceipt was falsy.");
  }
  {
    const { transactionReceipt } = out;
    const { contractAddress, blockNumber, gasUsed } = transactionReceipt;
    const ctx = safeStringify({ contractAddress, blockNumber, gasUsed });
    log.debug("WETH9 deposit call OK: %s", ctx);
  }

  const { data: transfer } = await apiClient.invokeContractV1({
    methodName: "transfer",
    invocationType: EthContractInvocationType.Send,
    params: [opts.poolAddr, opts.value.toString()],
    contractAddress: opts.tokenAddr,
    contractAbi,
    contractName,
    signingCredential: web3SigningCredential,
    gas,
  });

  {
    // FIXME - this is a bug in the besu endpoint which returns an incorrect shape
    // for the response body not compliant with the OpenAPI specifications.
    const out = (transfer as unknown as { out: unknown })
      .out as InvokeContractV1Response;
    if (!out.transactionReceipt) {
      throw new Error("WETH9 transfer tx receipt falsy.");
    }
    const { transactionReceipt, callOutput } = out;
    const { blockNumber, gasUsed } = transactionReceipt;
    const ctx = safeStringify({ blockNumber, gasUsed, callOutput });
    log.debug("WETH9 transfer OK: %s", ctx);
  }

  return {
    resDeposit: deposit,
    resTransfer: transfer,
  };
}
