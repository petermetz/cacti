import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import { Web3SigningCredentialType } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import * as RMNDeployReq from "../../../../test/json/ccip/contracts/RMN.cacti.deploy.besu.json";

/**
 * The relevant constructor parameters of the RMN.sol contract:
 *
 * ```solidity
 *  struct Voter {
 *    // This is the address the voter should use to call voteToBless.
 *    address blessVoteAddr;
 *    // This is the address the voter should use to call voteToCurse.
 *    address curseVoteAddr;
 *    // The weight of this voter's vote for blessing.
 *    uint8 blessWeight;
 *    // The weight of this voter's vote for cursing.
 *    uint8 curseWeight;
 *  }
 *
 *  struct Config {
 *    Voter[] voters;
 *    // When the total weight of voters that have voted to bless a tagged root reaches
 *    // or exceeds blessWeightThreshold, the tagged root becomes blessed.
 *    uint16 blessWeightThreshold;
 *    // When the total weight of voters that have voted to curse a subject reaches or
 *    // exceeds curseWeightThreshold, the subject becomes cursed.
 *    uint16 curseWeightThreshold;
 *  }
 *
 *  constructor(Config memory config) {
 *   {
 *     // Ensure that the bitmap is large enough to hold MAX_NUM_VOTERS.
 *     // We do this in the constructor because MAX_NUM_VOTERS is constant.
 *     BlessVoteProgress memory vp = BlessVoteProgress({
 *       configVersion: 0,
 *       voterBitmap: type(uint200).max, // will not compile if it doesn't fit
 *       accumulatedWeight: 0,
 *       weightThresholdMet: false
 *     });
 *     assert(vp.voterBitmap >> (MAX_NUM_VOTERS - 1) >= 1);
 *   }
 *   _setConfig(config);
 * }
 * ```
 *
 * @param opts
 * @returns
 */
export async function deployBesuRmn(opts: {
  readonly logLevel?: Readonly<LogLevelDesc>;
  readonly apiClient: Readonly<BesuApiClient>;
  readonly constructorArgs: Array<unknown>;
}): Promise<{ readonly contractAddress: Readonly<string> }> {
  const { logLevel = "WARN", apiClient, constructorArgs } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "deployBesuRmn",
    level: logLevel,
  });

  const { bytecode, contractAbi, contractName, gas, web3SigningCredential } =
    RMNDeployReq;

  const res = await apiClient.deployContractSolBytecodeNoKeychainV1({
    bytecode,
    constructorArgs,
    contractAbi,
    contractName,
    web3SigningCredential: {
      ...web3SigningCredential,
      type: Web3SigningCredentialType.PrivateKeyHex,
    },
    gas,
  });
  log.info("CCIP Router to Besu ledger deployed OK: %o", res.data);

  const {
    data: {
      transactionReceipt: { contractAddress },
    },
  } = res;

  if (!contractAddress) {
    throw new Error("deployBesuRouter() contractAddress is falsy.");
  }
  return { contractAddress };
}
