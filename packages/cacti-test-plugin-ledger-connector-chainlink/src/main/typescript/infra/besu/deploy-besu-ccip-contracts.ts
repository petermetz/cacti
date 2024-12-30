import { ethers } from "ethers";

import { LoggerProvider, type LogLevelDesc } from "@hyperledger/cactus-common";
import {
  EthContractInvocationType,
  Web3SigningCredentialPrivateKeyHex,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { type BesuApiClient } from "@hyperledger/cactus-plugin-ledger-connector-besu";
import {
  linkUSDValue,
  linkValue,
} from "@hyperledger/cacti-plugin-ledger-connector-chainlink";

import { deployBesuMockRmn } from "./deploy-besu-mock-rmn";
import { deployBesuRmnProxy } from "./deploy-besu-rmn-proxy";
import { deployBesuTokenAdminRegistry } from "./deploy-besu-token-admin-registry";
import { deployBesuLinkToken } from "./deploy-besu-link-token";
import { deployBesuWeth9 } from "./deploy-besu-weth9";
import { deployBesuRouter } from "./deploy-besu-router";
import { deployBesuLockReleaseTokenPool } from "./deploy-besu-lock-release-token-pool";
import { deployBesuPriceRegistry } from "./deploy-besu-price-registry";
import { deployBesuOnRamp } from "./deploy-besu-on-ramp";

import * as RouterContract from "../../../json/ccip/besu/router-contract.json";
import { deployBesuCommitStoreHelper } from "./deploy-besu-commit-store-helper";
import { deployBesuOffRamp } from "./deploy-besu-off-ramp";
import { deployBesuMaybeRevertMessageReceiver } from "./deploy-besu-maybe-revert-message-receiver";
import { setAdminAndRegisterPool } from "./set-admin-and-register-pool";
import { floatOffRampPool } from "./float-off-ramp-pool";
import { depositAndTransferWeth9 } from "./deposit-and-transfer-weth9";
import { configureTokenPool } from "./configure-token-pool";
import { updateRegistryPrices } from "./update-registry-prices";
import { applyPriceUpdatersUpdates } from "./apply-price-updaters-updates";

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
  readonly web3SigningCredential: Readonly<Web3SigningCredentialPrivateKeyHex>;
  readonly srcApiClient: Readonly<BesuApiClient>;
  readonly dstApiClient: Readonly<BesuApiClient>;
  readonly sourceFinalityDepth: Readonly<number>;
  readonly destFinalityDepth: Readonly<number>;
  readonly tokenDecimals: Readonly<number>;
}): Promise<{
  readonly srcMockRmnAddr: Readonly<string>;
  readonly srcRmnProxyAddr: Readonly<string>;
  readonly srcTokenAdminRegistryAddr: Readonly<string>;
  readonly srcLinkTokenAddr: Readonly<string>;
  readonly srcCustomLinkTokenAddr: Readonly<string>;
  readonly srcWeth9Addr: Readonly<string>;
  readonly srcRouterAddr: Readonly<string>;
  readonly srcLinkPoolAddr: Readonly<string>;
  readonly srcWeth9PoolAddr: Readonly<string>;
  readonly srcPriceRegistryAddr: Readonly<string>;
  readonly dstMockRmnAddr: Readonly<string>;
  readonly dstRmnProxyAddr: Readonly<string>;
  readonly dstTokenAdminRegistryAddr: Readonly<string>;
  readonly dstLinkTokenAddr: Readonly<string>;
  readonly dstCustomLinkTokenAddr: Readonly<string>;
  readonly dstWeth9Addr: Readonly<string>;
  readonly dstRouterAddr: Readonly<string>;
  readonly dstWeth9PoolAddr: Readonly<string>;
  readonly dstLinkPoolAddr: Readonly<string>;
  readonly dstPriceRegistryAddr: Readonly<string>;
  readonly dstCommitStoreHelperAddr: Readonly<string>;
  readonly dstOffRampAddr: Readonly<string>;
  readonly dstMaybeRevertMessageReceiver1Addr: Readonly<string>;
  readonly dstMaybeRevertMessageReceiver2Addr: Readonly<string>;
}> {
  const {
    logLevel = "WARN",
    srcApiClient,
    dstApiClient,
    web3SigningCredential,
  } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "deployBesuCcipContracts()",
    level: logLevel,
  });

  // spells "fabric" in ASCII
  // 112568449526115n as a decimal number
  const destChainSelector = BigInt(
    "0b011001100110000101100010011100100110100101100011",
  );

  const sourceChainSelector = 1337;

  const { contractAddress: srcMockRmnAddr } = await deployBesuMockRmn({
    web3SigningCredential,
    apiClient: srcApiClient,
    logLevel,
  });

  const { contractAddress: dstMockRmnAddr } = await deployBesuMockRmn({
    web3SigningCredential,
    apiClient: dstApiClient,
    logLevel,
  });

  const { contractAddress: srcRmnProxyAddr } = await deployBesuRmnProxy({
    armSourceAddress: srcMockRmnAddr,
    web3SigningCredential,
    apiClient: srcApiClient,
    logLevel,
  });

  const { contractAddress: dstRmnProxyAddr } = await deployBesuRmnProxy({
    armSourceAddress: dstMockRmnAddr,
    web3SigningCredential,
    apiClient: dstApiClient,
    logLevel,
  });

  const { contractAddress: srcTokenAdminRegistryAddr } =
    await deployBesuTokenAdminRegistry({
      web3SigningCredential,
      apiClient: srcApiClient,
      logLevel,
    });

  const { contractAddress: dstTokenAdminRegistryAddr } =
    await deployBesuTokenAdminRegistry({
      web3SigningCredential,
      apiClient: dstApiClient,
      logLevel,
    });

  const { contractAddress: srcLinkTokenAddr } = await deployBesuLinkToken({
    web3SigningCredential,
    apiClient: srcApiClient,
    logLevel,
  });

  const { contractAddress: srcCustomLinkTokenAddr } = await deployBesuLinkToken(
    {
      web3SigningCredential,
      apiClient: srcApiClient,
      logLevel,
    },
  );

  const { contractAddress: srcWeth9Addr } = await deployBesuWeth9({
    web3SigningCredential,
    apiClient: srcApiClient,
    logLevel,
  });

  const { contractAddress: dstLinkTokenAddr } = await deployBesuLinkToken({
    web3SigningCredential,
    apiClient: dstApiClient,
    logLevel,
  });

  const { contractAddress: dstCustomLinkTokenAddr } = await deployBesuLinkToken(
    {
      web3SigningCredential,
      apiClient: dstApiClient,
      logLevel,
    },
  );

  const { contractAddress: dstWeth9Addr } = await deployBesuWeth9({
    web3SigningCredential,
    apiClient: dstApiClient,
    logLevel,
  });

  const { contractAddress: srcRouterAddr } = await deployBesuRouter({
    armProxyAddr: srcRmnProxyAddr,
    weth9Addr: srcWeth9Addr,
    web3SigningCredential,
    apiClient: srcApiClient,
    logLevel,
  });

  const { contractAddress: dstRouterAddr } = await deployBesuRouter({
    armProxyAddr: dstRmnProxyAddr,
    weth9Addr: dstWeth9Addr,
    web3SigningCredential,
    apiClient: dstApiClient,
    logLevel,
  });

  const { contractAddress: srcLinkPoolAddr } =
    await deployBesuLockReleaseTokenPool({
      armProxyAddr: srcRmnProxyAddr,
      acceptLiquidity: true,
      linkTokenAddr: srcLinkTokenAddr,
      routerAddr: srcRouterAddr,
      tokenDecimals: opts.tokenDecimals,
      web3SigningCredential,
      apiClient: srcApiClient,
      logLevel,
    });

  await setAdminAndRegisterPool({
    apiClient: srcApiClient,
    evmAdminAccountAddr: web3SigningCredential.ethAccount,
    poolAddr: srcLinkPoolAddr,
    tokenAddr: srcLinkTokenAddr,
    tokenAdminRegistryAddr: srcTokenAdminRegistryAddr,
    web3SigningCredential,
    logLevel,
  });

  const { contractAddress: srcWeth9PoolAddr } =
    await deployBesuLockReleaseTokenPool({
      armProxyAddr: srcRmnProxyAddr,
      acceptLiquidity: true,
      linkTokenAddr: srcWeth9Addr,
      routerAddr: srcRouterAddr,
      tokenDecimals: opts.tokenDecimals,
      web3SigningCredential,
      apiClient: srcApiClient,
      logLevel,
    });

  await setAdminAndRegisterPool({
    apiClient: srcApiClient,
    evmAdminAccountAddr: web3SigningCredential.ethAccount,
    poolAddr: srcWeth9PoolAddr,
    tokenAddr: srcWeth9Addr,
    tokenAdminRegistryAddr: srcTokenAdminRegistryAddr,
    web3SigningCredential,
    logLevel,
  });

  const { contractAddress: dstLinkPoolAddr } =
    await deployBesuLockReleaseTokenPool({
      armProxyAddr: dstRmnProxyAddr,
      acceptLiquidity: true,
      linkTokenAddr: dstLinkTokenAddr,
      routerAddr: dstRouterAddr,
      tokenDecimals: opts.tokenDecimals,
      web3SigningCredential,
      apiClient: dstApiClient,
      logLevel,
    });

  await setAdminAndRegisterPool({
    apiClient: dstApiClient,
    evmAdminAccountAddr: web3SigningCredential.ethAccount,
    poolAddr: dstLinkPoolAddr,
    tokenAddr: dstLinkTokenAddr,
    tokenAdminRegistryAddr: dstTokenAdminRegistryAddr,
    web3SigningCredential,
    logLevel,
  });

  await floatOffRampPool({
    apiClient: dstApiClient,
    evmAdminAccountAddr: web3SigningCredential.ethAccount,
    poolAddr: dstLinkPoolAddr,
    tokenAddr: dstLinkTokenAddr,
    web3SigningCredential,
    logLevel,
  });

  const { contractAddress: dstWeth9PoolAddr } =
    await deployBesuLockReleaseTokenPool({
      armProxyAddr: dstRmnProxyAddr,
      acceptLiquidity: true,
      linkTokenAddr: dstWeth9Addr,
      routerAddr: dstRouterAddr,
      tokenDecimals: opts.tokenDecimals,
      web3SigningCredential,
      apiClient: dstApiClient,
      logLevel,
    });

  await setAdminAndRegisterPool({
    apiClient: dstApiClient,
    evmAdminAccountAddr: web3SigningCredential.ethAccount,
    poolAddr: dstWeth9PoolAddr,
    tokenAddr: dstWeth9Addr,
    tokenAdminRegistryAddr: dstTokenAdminRegistryAddr,
    web3SigningCredential,
    logLevel,
  });

  await depositAndTransferWeth9({
    apiClient: dstApiClient,
    logLevel,
    poolAddr: dstWeth9PoolAddr,
    tokenAddr: dstWeth9Addr,
    value: BigInt(1e18),
    web3SigningCredential,
  });

  const inboundRateLimiterConfig = {
    isEnabled: true,
    capacity: linkValue(100n),
    rate: BigInt(1e18),
  };
  const outboundRateLimiterConfig = inboundRateLimiterConfig;

  const abiCoder = ethers.AbiCoder.defaultAbiCoder();

  // Configure the **LinkToken** pool on the **source** chain - 1
  const abiEncodedDestLinkPool = abiCoder.encode(
    ["address[]"],
    [[dstLinkPoolAddr]],
  );

  const abiEncodedDestLinkTokenAddress = abiCoder.encode(
    ["address[]"],
    [[dstLinkTokenAddr]],
  );

  await configureTokenPool({
    logLevel,
    apiClient: srcApiClient,
    poolAddr: srcLinkPoolAddr,
    remoteChainSelectorsToRemove: [],
    tokenPoolChainUpdate: [
      {
        remoteChainSelector: destChainSelector,
        remotePoolAddresses: [abiEncodedDestLinkPool],
        remoteTokenAddress: abiEncodedDestLinkTokenAddress,
        outboundRateLimiterConfig,
        inboundRateLimiterConfig,
      },
    ],
    web3SigningCredential,
  });

  // Configure the **WETH9** pool on the **source** chain - 2
  const abiEncodedDestWrappedPool = abiCoder.encode(
    ["address[]"],
    [[dstWeth9PoolAddr]],
  );

  const abiEncodedDestWrappedTokenAddr = abiCoder.encode(
    ["address[]"],
    [[dstWeth9Addr]],
  );

  await configureTokenPool({
    logLevel,
    apiClient: srcApiClient,
    poolAddr: srcWeth9PoolAddr,
    remoteChainSelectorsToRemove: [],
    tokenPoolChainUpdate: [
      {
        remoteChainSelector: destChainSelector,
        remotePoolAddresses: [abiEncodedDestWrappedPool],
        remoteTokenAddress: abiEncodedDestWrappedTokenAddr,
        outboundRateLimiterConfig,
        inboundRateLimiterConfig,
      },
    ],
    web3SigningCredential,
  });

  // Configure the **LinkToken** pool on the **destination** chain - 3
  const abiEncodedSourceLinkPool = abiCoder.encode(
    ["address[]"],
    [[srcLinkPoolAddr]],
  );

  const abiEncodedSourceLinkTokenAddr = abiCoder.encode(
    ["address[]"],
    [[srcLinkTokenAddr]],
  );

  await configureTokenPool({
    logLevel,
    apiClient: dstApiClient,
    poolAddr: dstLinkPoolAddr,
    remoteChainSelectorsToRemove: [],
    tokenPoolChainUpdate: [
      {
        remoteChainSelector: sourceChainSelector,
        remotePoolAddresses: [abiEncodedSourceLinkPool],
        remoteTokenAddress: abiEncodedSourceLinkTokenAddr,
        outboundRateLimiterConfig,
        inboundRateLimiterConfig,
      },
    ],
    web3SigningCredential,
  });

  // Configure the **WET9** pool on the **destination** chain - 4
  const abiEncodedSourceWrappedPool = abiCoder.encode(
    ["address[]"],
    [[srcWeth9PoolAddr]],
  );

  const abiEncodedSourceWrappedTokenAddr = abiCoder.encode(
    ["address[]"],
    [[srcWeth9Addr]],
  );

  await configureTokenPool({
    logLevel,
    apiClient: dstApiClient,
    poolAddr: dstWeth9PoolAddr,
    remoteChainSelectorsToRemove: [],
    tokenPoolChainUpdate: [
      {
        remoteChainSelector: sourceChainSelector,
        remotePoolAddresses: [abiEncodedSourceWrappedPool],
        remoteTokenAddress: abiEncodedSourceWrappedTokenAddr,
        outboundRateLimiterConfig,
        inboundRateLimiterConfig,
      },
    ],
    web3SigningCredential,
  });

  const { contractAddress: srcPriceRegistryAddr } =
    await deployBesuPriceRegistry({
      feeTokens: [srcLinkTokenAddr, srcWeth9Addr],
      priceUpdaters: [],
      stalenessThreshold: 60 * 60 * 24 * 14, // two weeks
      web3SigningCredential,
      apiClient: srcApiClient,
      logLevel,
    });

  await updateRegistryPrices({
    logLevel,
    apiClient: srcApiClient,
    priceRegistryAddr: srcPriceRegistryAddr,
    web3SigningCredential,
    internalPriceUpdates: {
      tokenPriceUpdates: [
        {
          sourceToken: srcLinkTokenAddr,
          usdPerToken: BigInt(1e18) * BigInt(20),
        },
        {
          sourceToken: srcWeth9Addr,
          usdPerToken: BigInt(1e18) * BigInt(2000),
        },
      ],
      gasPriceUpdates: [
        {
          destChainSelector: destChainSelector,
          usdPerUnitGas: BigInt(20000e9),
        },
      ],
    },
  });

  const { contractAddress: dstPriceRegistryAddr } =
    await deployBesuPriceRegistry({
      feeTokens: [dstLinkTokenAddr, dstWeth9Addr],
      priceUpdaters: [],
      stalenessThreshold: 60 * 60 * 24 * 14, // two weeks
      web3SigningCredential,
      apiClient: dstApiClient,
      logLevel,
    });

  const maxNopFeesJuels = BigInt(100_000) * BigInt(1e9);

  const { contractAddress: srcOnRampAddr } = await deployBesuOnRamp({
    staticConfig: {
      chainSelector: 1337n,
      defaultTxGasLimit: 200_000n,
      destChainSelector,
      linkToken: srcLinkTokenAddr,
      maxNopFeesJuels,
      prevOnRamp: "0x0000000000000000000000000000000000000000",
      rmnProxy: srcRmnProxyAddr,
      tokenAdminRegistry: srcTokenAdminRegistryAddr,
    },
    dynamicConfig: {
      router: srcRouterAddr,
      maxNumberOfTokensPerMsg: 5,
      destGasOverhead: 350_000,
      destGasPerPayloadByte: 16,
      destDataAvailabilityOverheadGas: 33_596,
      destGasPerDataAvailabilityByte: 16,
      destDataAvailabilityMultiplierBps: 6840, // 0.684
      priceRegistry: srcPriceRegistryAddr,
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
        token: srcLinkTokenAddr,
        networkFeeUSDCents: 1_00,
        gasMultiplierWeiPerEth: 1e12,
        premiumMultiplierWeiPerEth: 9e10,
        enabled: true,
      },
      {
        token: srcWeth9Addr,
        networkFeeUSDCents: 1_00,
        gasMultiplierWeiPerEth: 1e12,
        premiumMultiplierWeiPerEth: 1e12,
        enabled: true,
      },
    ],
    tokenTransferFeeConfigArgs: [
      {
        token: srcLinkTokenAddr,
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
    apiClient: srcApiClient,
    logLevel,
  });

  await srcApiClient.invokeContractV1({
    invocationType: EthContractInvocationType.Send,
    methodName: "applyRampUpdates",
    params: [[{ destChainSelector, onRamp: srcOnRampAddr }], [], []],
    signingCredential: web3SigningCredential,
    contractName: RouterContract.contractName,
    contractAbi: RouterContract.ABI,
    contractAddress: srcRouterAddr,
    gas: 9000000,
    gasPrice: 1000000,
  });

  const { contractAddress: dstCommitStoreHelperAddr } =
    await deployBesuCommitStoreHelper({
      staticConfig: {
        chainSelector: destChainSelector,
        sourceChainSelector,
        onRamp: srcOnRampAddr,
        armProxy: dstRmnProxyAddr,
      },
      web3SigningCredential,
      apiClient: dstApiClient,
      logLevel,
    });

  const { contractAddress: dstOffRampAddr } = await deployBesuOffRamp({
    staticConfig: {
      prevOffRamp: "0x0000000000000000000000000000000000000000",
      tokenAdminRegistry: dstTokenAdminRegistryAddr,
      commitStore: dstCommitStoreHelperAddr,
      chainSelector: destChainSelector,
      sourceChainSelector,
      onRamp: srcOnRampAddr,
      rmnProxy: dstRmnProxyAddr,
    },
    rateLimiterConfig: {
      isEnabled: true,
      capacity: linkUSDValue(100n),
      rate: linkUSDValue(1n),
    },
    web3SigningCredential,
    apiClient: dstApiClient,
    logLevel,
  });

  await applyPriceUpdatersUpdates({
    logLevel,
    apiClient: dstApiClient,
    priceRegistryAddr: dstPriceRegistryAddr,
    priceUpdatersToAdd: [dstCommitStoreHelperAddr],
    priceUpdatersToRemove: [],
    web3SigningCredential,
  });

  await srcApiClient.invokeContractV1({
    invocationType: EthContractInvocationType.Send,
    methodName: "applyRampUpdates",
    params: [
      [], // onRampUpdates []router.RouterOnRamp
      [], // offRampRemoves []router.RouterOffRamp
      [{ sourceChainSelector, offRamp: dstOffRampAddr }], // offRampAdds []router.RouterOffRamp
    ],
    signingCredential: web3SigningCredential,
    contractName: RouterContract.contractName,
    contractAbi: RouterContract.ABI,
    contractAddress: dstRouterAddr,
  });

  const { contractAddress: dstMaybeRevertMessageReceiver1Addr } =
    await deployBesuMaybeRevertMessageReceiver({
      toRevert: false,
      web3SigningCredential,
      apiClient: dstApiClient,
      logLevel,
    });

  const { contractAddress: dstMaybeRevertMessageReceiver2Addr } =
    await deployBesuMaybeRevertMessageReceiver({
      toRevert: false,
      web3SigningCredential,
      apiClient: dstApiClient,
      logLevel,
    });

  const out = {
    srcMockRmnAddr,
    srcRmnProxyAddr,
    srcTokenAdminRegistryAddr,
    srcLinkTokenAddr,
    srcCustomLinkTokenAddr,
    srcWeth9Addr,
    srcRouterAddr,
    srcLinkPoolAddr,
    srcWeth9PoolAddr,
    srcPriceRegistryAddr,
    srcOnRampAddr,
    dstMockRmnAddr,
    dstRmnProxyAddr,
    dstTokenAdminRegistryAddr,
    dstLinkTokenAddr,
    dstCustomLinkTokenAddr,
    dstWeth9Addr,
    dstRouterAddr,
    dstWeth9PoolAddr,
    dstLinkPoolAddr,
    dstPriceRegistryAddr,
    dstCommitStoreHelperAddr,
    dstOffRampAddr,
    dstMaybeRevertMessageReceiver1Addr,
    dstMaybeRevertMessageReceiver2Addr,
  };

  log.info("CCIP Solidity contracts to Besu ledger deployed OK: %o", out);

  return out;
}
