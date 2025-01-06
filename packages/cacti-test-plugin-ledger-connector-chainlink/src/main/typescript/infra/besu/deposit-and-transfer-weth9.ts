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

  const { data: resDeposit } = await apiClient.invokeContractV1({
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
  const ctxDespoit = JSON.stringify(resDeposit);
  log.debug("CCIP WETH9 deposit() OK: %o", ctxDespoit);

  const { data: resTransfer } = await apiClient.invokeContractV1({
    methodName: "transfer",
    invocationType: EthContractInvocationType.Send,
    params: [opts.poolAddr, opts.value.toString()],
    contractAddress: opts.tokenAddr,
    contractAbi,
    contractName,
    signingCredential: web3SigningCredential,
    gas,
  });
  const ctxTransfer = JSON.stringify(resTransfer);
  log.debug("CCIP WETH9 transfer() OK: %o", ctxTransfer);

  return {
    resDeposit,
    resTransfer,
  };
}
