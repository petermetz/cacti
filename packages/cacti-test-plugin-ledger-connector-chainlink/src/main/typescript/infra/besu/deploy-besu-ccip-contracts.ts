import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import {
  EthContractInvocationType,
  Web3SigningCredential,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import { deployBesuMockRmn } from "./deploy-besu-mock-rmn";
import { deployBesuRmnProxy } from "./deploy-besu-rmn-proxy";
import { deployBesuTokenAdminRegistry } from "./deploy-besu-token-admin-registry";
import { deployBesuLinkToken } from "./deploy-besu-link-token";
import { deployBesuWeth9 } from "./deploy-besu-weth9";
import { deployBesuRouter } from "./deploy-besu-router";
import { deployBesuLockReleaseTokenPool } from "./deploy-besu-lock-release-token-pool";
import { deployBesuPriceRegistry } from "./deploy-besu-price-registry";
import { deployBesuOnRamp } from "./deploy-besu-on-ramp";
import { linkUSDValue } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";

import * as RouterContract from "../../../json/ccip/besu/router-contract.json";

/**
 * Mimics the functionality of the integration tests of the Chainlink node at
 * https://github.com/smartcontractkit/chainlink
 *
 * The file:
 * `core/services/ocr2/plugins/ccip/testhelpers/ccip_contracts.go`
 * in which there is a function called:
 * ```go
 * func SetupCCIPContracts(t *testing.T, sourceChainID, sourceChainSelector, destChainID, destChainSelector uint64,
 *   sourceFinalityDepth, destFinalityDepth uint32) CCIPContracts {
 * ```
 */
export async function deployBesuCcipContracts(opts: {
  readonly logLevel?: Readonly<LogLevelDesc>;
  readonly web3SigningCredential: Readonly<Web3SigningCredential>;
  readonly apiClient: Readonly<BesuApiClient>;
}): Promise<{
  readonly mockRmnAddr: Readonly<string>;
  readonly rmnProxyAddr: Readonly<string>;
  readonly tokenAdminRegistryAddr: Readonly<string>;
  readonly linkTokenAddr: Readonly<string>;
  readonly weth9Addr: Readonly<string>;
  readonly routerAddr: Readonly<string>;
  readonly linkPoolAddr: Readonly<string>;
  readonly weth9PoolAddr: Readonly<string>;
  readonly priceRegistryAddr: Readonly<string>;
  readonly offRampAddr: Readonly<string>;
}> {
  const { logLevel = "WARN", apiClient, web3SigningCredential } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "deployBesuCcipContracts()",
    level: logLevel,
  });

  const { contractAddress: mockRmnAddr } = await deployBesuMockRmn({
    web3SigningCredential,
    apiClient,
    logLevel,
  });

  const { contractAddress: rmnProxyAddr } = await deployBesuRmnProxy({
    armSourceAddress: mockRmnAddr,
    web3SigningCredential,
    apiClient,
    logLevel,
  });

  const { contractAddress: tokenAdminRegistryAddr } =
    await deployBesuTokenAdminRegistry({
      web3SigningCredential,
      apiClient,
      logLevel,
    });

  const { contractAddress: linkTokenAddr } = await deployBesuLinkToken({
    web3SigningCredential,
    apiClient,
    logLevel,
  });

  const { contractAddress: weth9Addr } = await deployBesuWeth9({
    web3SigningCredential,
    apiClient,
    logLevel,
  });

  const { contractAddress: routerAddr } = await deployBesuRouter({
    armProxyAddr: rmnProxyAddr,
    weth9Addr,
    web3SigningCredential,
    apiClient,
    logLevel,
  });

  const { contractAddress: linkPoolAddr } =
    await deployBesuLockReleaseTokenPool({
      armProxyAddr: rmnProxyAddr,
      acceptLiquidity: true,
      linkTokenAddr,
      routerAddr,
      tokenDecimals: 18,
      web3SigningCredential,
      apiClient,
      logLevel,
    });

  const { contractAddress: weth9PoolAddr } =
    await deployBesuLockReleaseTokenPool({
      armProxyAddr: rmnProxyAddr,
      acceptLiquidity: true,
      linkTokenAddr: weth9Addr,
      routerAddr,
      tokenDecimals: 18,
      web3SigningCredential,
      apiClient,
      logLevel,
    });

  const { contractAddress: priceRegistryAddr } = await deployBesuPriceRegistry({
    feeTokens: [linkTokenAddr, weth9Addr],
    priceUpdaters: [],
    stalenessThreshold: 60 * 60 * 24 * 14, // two weeks
    web3SigningCredential,
    apiClient,
    logLevel,
  });

  // spells "fabric" in ASCII
  const destChainSelector = BigInt(
    "0b011001100110000101100010011100100110100101100011",
  );
  const maxNopFeesJuels = BigInt(100_000) * BigInt(1e9);

  const { contractAddress: onRampAddr } = await deployBesuOnRamp({
    staticConfig: {
      chainSelector: 1337n,
      defaultTxGasLimit: 200_000n,
      destChainSelector,
      linkToken: linkTokenAddr,
      maxNopFeesJuels,
      prevOnRamp: "0x0000000000000000000000000000000000000000",
      rmnProxy: rmnProxyAddr,
      tokenAdminRegistry: tokenAdminRegistryAddr,
    },
    dynamicConfig: {
      router: routerAddr,
      maxNumberOfTokensPerMsg: 5,
      destGasOverhead: 350_000,
      destGasPerPayloadByte: 16,
      destDataAvailabilityOverheadGas: 33_596,
      destGasPerDataAvailabilityByte: 16,
      destDataAvailabilityMultiplierBps: 6840, // 0.684
      priceRegistry: priceRegistryAddr,
      maxDataBytes: 1e5,
      maxPerMsgGasLimit: 4_000_000,
      defaultTokenFeeUSDCents: 50,
      defaultTokenDestGasOverhead: 125_000,
    },
    rateLimiterConfig: {
      isEnabled: true,
      capacity: linkUSDValue(100n),
      rate: linkUSDValue(1n),
    },
    feeTokenConfigArgs: [
      {
        token: linkTokenAddr,
        networkFeeUSDCents: 1_00,
        gasMultiplierWeiPerEth: 1e12,
        premiumMultiplierWeiPerEth: 9e10,
        enabled: true,
      },
      {
        token: weth9Addr,
        networkFeeUSDCents: 1_00,
        gasMultiplierWeiPerEth: 1e12,
        premiumMultiplierWeiPerEth: 1e12,
        enabled: true,
      },
    ],
    tokenTransferFeeConfigArgs: [
      {
        token: linkTokenAddr,
        minFeeUSDCents: 50, // $0.5
        maxFeeUSDCents: 1_000_000_00, // $ 1 million
        deciBps: 5_0, // 5 bps
        destGasOverhead: 350_000,
        destBytesOverhead: 32,
        aggregateRateLimitEnabled: true,
      },
    ],
    nopAndWeight: [],
    web3SigningCredential,
    apiClient,
    logLevel,
  });

  const rampUpdates = [{ destChainSelector, onRamp: onRampAddr }];
  log.debug("Updating Ramp configuration in Router... %o", rampUpdates);

  const applyRampUpdatesOut = await apiClient.invokeContractV1({
    invocationType: EthContractInvocationType.Send,
    methodName: "applyRampUpdates",
    params: [rampUpdates, [], []],
    signingCredential: web3SigningCredential,
    contractName: RouterContract.contractName,
    contractAbi: RouterContract.ABI,
    contractAddress: routerAddr,
    gas: 9000000,
    gasPrice: 1000000,
  });
  log.debug("applyRampUpdatesOut.data=%o", applyRampUpdatesOut.data);

  const out = {
    mockRmnAddr,
    rmnProxyAddr,
    tokenAdminRegistryAddr,
    linkTokenAddr,
    weth9Addr,
    routerAddr,
    linkPoolAddr,
    weth9PoolAddr,
    priceRegistryAddr,
    onRampAddr,
    offRampAddr: "FIXME",
  };

  log.info("CCIP Solidity contracts to Besu ledger deployed OK: %o", out);

  return out;
}
