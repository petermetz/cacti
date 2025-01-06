import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import { Web3SigningCredential } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as MaybeRevertMessageReceiverContract from "../../../json/ccip/besu/maybe-revert-message-receiver-contract.json";

export async function deployBesuMaybeRevertMessageReceiver(opts: {
  readonly logLevel?: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly toRevert: Readonly<boolean>;
}): Promise<{ readonly contractAddress: Readonly<string> }> {
  const { logLevel = "WARN", apiClient, web3SigningCredential } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "deployBesuMaybeRevertMessageReceiver()",
    level: logLevel,
  });

  const {
    Bin: bytecode,
    ABI: contractAbi,
    contractName,
    gas,
  } = MaybeRevertMessageReceiverContract;

  const res = await apiClient.deployContractSolBytecodeNoKeychainV1({
    bytecode,
    constructorArgs: [opts.toRevert],
    contractAbi,
    contractName,
    web3SigningCredential,
    gas,
  });
  const ctx = JSON.stringify(res.data.transactionReceipt);
  log.debug("MaybeRevertMessageReceiver deployed: %o", ctx);

  const {
    data: {
      transactionReceipt: { contractAddress },
    },
  } = res;

  if (!contractAddress) {
    throw new Error("deployBesuMaybeRevertMessageReceiver() address is falsy.");
  }
  return { contractAddress };
}
