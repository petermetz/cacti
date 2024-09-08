import type Web3 from "web3";
import { ContractKit } from "@celo/contractkit";

import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import { BadRequestError } from "http-errors-enhanced-cjs";

export async function deployContractImpl(opts: {
  readonly logLevel: LogLevelDesc;
  readonly web3: Readonly<Web3>;
  readonly kit: Readonly<ContractKit>;
  readonly req: {
    readonly web3SigningCredential: {
      readonly secret: string;
      readonly ethAccount: string;
    };
    readonly chainId: number;
    readonly contractAbi: any;
    readonly constructorArgs: Array<unknown>;
    readonly bytecode: any;
  };
}): Promise<unknown> {
  const fn = `cacti-plugin-ledger-connector-celo::deployContractImpl()`;
  const log = LoggerProvider.getOrCreate({
    level: opts.logLevel,
    label: fn,
  });
  const { web3, kit, req } = opts;
  const { chainId, contractAbi, bytecode, web3SigningCredential } = req;
  const { constructorArgs } = req;
  const { secret, ethAccount } = web3SigningCredential;
  log.trace("ENTER");
  log.debug("ethAccount=%s", ethAccount);
  log.debug("chainId=%s", chainId);
  log.debug("constructorArgs.length=%d", constructorArgs.length);

  // Create a contract instance with ABI
  const contract = new web3.eth.Contract(contractAbi);
  const methodNames = Object.keys(contract.methods).join("\n\t");
  log.debug("Contract method names: \n\t%s", methodNames);

  log.debug("Creating contract deployment...");
  // Prepare transaction for contract deployment
  const deployTx = contract.deploy({
    data: bytecode,
    arguments: constructorArgs, // Pass constructor arguments if any
  });
  log.debug("Created contract deployment OK");

  // Estimate gas
  log.debug("Estimating gas for contract deployment tx...");
  const gas = await deployTx.estimateGas({ from: ethAccount });
  log.debug("Estimated gas for contract deployment tx: %o", gas);

  log.debug("Getting balance of ETH account %s", ethAccount);
  const balance = await web3.eth.getBalance(ethAccount);
  log.debug("Obtained balance of ETH account %s OK: %o", ethAccount, balance);

  const accounts = await kit.connection.getLocalAccounts();
  log.debug("Kit connection has %d accounts: %o", accounts.length, accounts);

  if (!secret.startsWith("0x")) {
    const errorMessage = `EVM account secret was not in hexadecimal format (0x prefix)`;
    throw new BadRequestError(errorMessage);
  }
  if (!accounts.includes(secret as `0x${string}`)) {
    log.debug("Adding EVM account secret to ContractKit connection.");
    kit.connection.addAccount(secret);
  } else {
    log.debug("Not adding EVM account secret to ContractKit: Already present.");
  }

  const blockNumber = await kit.connection.getBlockNumber();
  log.debug("Fetched blockNumber via celo contractkit OK: %d", blockNumber);

  log.debug("Encoding deployment tx API (to include contract ctor args)");
  const data = deployTx.encodeABI();
  log.debug("Sending final deployment tx to ledger... data=%s", data);

  const tx = await kit.sendTransaction({
    from: ethAccount,
    data,
    chainId,
  });
  log.debug("Tx sent. Waiting for tx receipt from ledger...");

  const receipt = await tx.waitReceipt();
  log.debug("Deployment tx confirmed with receipt: %o", receipt);

  log.trace("EXIT");
  return { receipt };
}
