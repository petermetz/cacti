import { randomUUID } from "node:crypto";

import { AxiosResponse } from "axios";
import safeStringify from "fast-safe-stringify";
import json2toml from "json2toml";
import { Contract } from "web3";

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { IChainlinkApiClient } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { OCR2KeyBundle } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { Web3SigningCredentialPrivateKeyHex } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import { IDeployBesuCcipContractsOutput } from "./deploy-besu-ccip-contracts";
import { ABI as CommitStoreHelperAbi } from "../../../../main/typescript/infra/besu/commit-store-helper-factory";

export interface ICreateChainlinkJobResponse {
  readonly peerId: Readonly<string>;
  readonly transmitterId: Readonly<string>;
  readonly ocrKeyBundle: Readonly<OCR2KeyBundle>;
  readonly externalJobId: Readonly<string>;
  readonly jobSpecToml: Readonly<string>;
  readonly jobSpec: Readonly<Record<string, unknown>>;
  readonly createJobResponse: Readonly<AxiosResponse<unknown, unknown>>;
}

/**
 * ```go
 * priceGetterConfig := config.DynamicPriceGetterConfig{
 *   AggregatorPrices: map[common.Address]config.AggregatorPriceConfig{
 *     ccipTH.Source.WrappedNative.Address(): {
 *       ChainID:                   ccipTH.Source.ChainID,
 *       AggregatorContractAddress: aggSrcNatAddr,
 *     },
 *     ccipTH.Dest.LinkToken.Address(): {
 *       ChainID:                   ccipTH.Dest.ChainID,
 *       AggregatorContractAddress: aggDstLnkAddr,
 *     },
 *     ccipTH.Dest.WrappedNative.Address(): {
 *       ChainID:                   ccipTH.Dest.ChainID,
 *       AggregatorContractAddress: aggDstLnkAddr,
 *     },
 *   },
 *   StaticPrices: map[common.Address]config.StaticPriceConfig{},
 * }
 * ```
 */
export async function setUpNodesAndJobs(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly srcWeb3SigningCredential: Readonly<Web3SigningCredentialPrivateKeyHex>;
  readonly dstWeb3SigningCredential: Readonly<Web3SigningCredentialPrivateKeyHex>;
  readonly sourceChainId: Readonly<bigint>;
  readonly destChainId: Readonly<bigint>;
  readonly sourceChainSelector: Readonly<bigint>;
  readonly destChainSelector: Readonly<bigint>;
  readonly bootstrapNodeP2pId: Readonly<string>;
  readonly contracts: Readonly<IDeployBesuCcipContractsOutput>;
  readonly dstCommitStoreHelper: Readonly<
    Contract<typeof CommitStoreHelperAbi>
  >;
  readonly node1: Readonly<{
    readonly clApiClient: Readonly<IChainlinkApiClient>;
  }>;
  readonly node2: Readonly<{
    readonly clApiClient: Readonly<IChainlinkApiClient>;
  }>;
  readonly node3: Readonly<{
    readonly clApiClient: Readonly<IChainlinkApiClient>;
  }>;
  readonly node4: Readonly<{
    readonly clApiClient: Readonly<IChainlinkApiClient>;
  }>;
  readonly node5: Readonly<{
    readonly clApiClient: Readonly<IChainlinkApiClient>;
  }>;
  readonly tokenPricesUSDPipeline: Readonly<string>;
  readonly priceGetterConfig: Readonly<Record<string, unknown>>;
}): Promise<{
  readonly commitJob2: Readonly<ICreateChainlinkJobResponse>;
  readonly commitJob3: Readonly<ICreateChainlinkJobResponse>;
  readonly commitJob4: Readonly<ICreateChainlinkJobResponse>;
  readonly commitJob5: Readonly<ICreateChainlinkJobResponse>;
  readonly execJob2: Readonly<ICreateChainlinkJobResponse>;
  readonly execJob3: Readonly<ICreateChainlinkJobResponse>;
  readonly execJob4: Readonly<ICreateChainlinkJobResponse>;
  readonly execJob5: Readonly<ICreateChainlinkJobResponse>;
}> {
  const { logLevel = "WARN" } = opts;

  const log = LoggerProvider.getOrCreate({
    label: "setUpNodesAndJobs()",
    level: logLevel,
  });
  log.debug("ENTRY");
  log.debug("Creating the bootstrap job...");

  const bootstrapJobSpec = {
    name: "bootstrap-".concat(opts.sourceChainId.toString(10)),
    type: "bootstrap",
    schemaVersion: 1,
    maxTaskDuration: "30s",
    forwardingAllowed: false,

    contractID: opts.contracts.dstCommitStoreHelperAddr,
    relay: "evm",
    chainID: opts.destChainId,
    p2pv2Bootstrappers: [],
    ocrKeyBundleID: "",
    monitoringEndpoint: "",
    transmitterID: "",
    blockchainTimeout: "0s",
    contractConfigTrackerPollInterval: "20s",
    contractConfigConfirmations: 1,
    pluginType: "",
    captureEATelemetry: false,
    captureAutomationCustomTelemetry: false,

    relayConfig: {
      chainID: opts.destChainId,
    },
  };

  const bootstrapJobSpecToml = json2toml(bootstrapJobSpec, {
    indent: 2,
    newlineAfterSection: true,
  });

  //
  // Chainlink Node #1 - bootstrap job
  //
  const {
    ocrKeyBundleID,
    pluginType,
    p2pv2Bootstrappers,
    transmitterID,
    chainID,
  } = bootstrapJobSpec;
  const ctxBootstrapJob = {
    ocrKeyBundleID,
    pluginType,
    p2pv2Bootstrappers,
    transmitterID,
    chainID,
  };
  log.debug("Creating Bootstrap job: %s", safeStringify(ctxBootstrapJob));
  await opts.node1.clApiClient.createJob({ jobSpecToml: bootstrapJobSpecToml });
  log.debug("Created bootstrap job OK");

  //
  // Chainlink Node #2 - ccip-commit job
  //
  const commitJob2 = await createCommitOcr2Job({
    ...opts,
    nodeLabel: "chainlink2",
    node: opts.node2,
  });

  //
  // Chainlink Node #3 - ccip-commit job
  //
  const commitJob3 = await createCommitOcr2Job({
    ...opts,
    nodeLabel: "chainlink3",
    node: opts.node3,
  });

  //
  // Chainlink Node #4 - ccip-commit job
  //
  const commitJob4 = await createCommitOcr2Job({
    ...opts,
    nodeLabel: "chainlink4",
    node: opts.node4,
  });

  //
  // Chainlink Node #5 - ccip-commit job
  //
  const commitJob5 = await createCommitOcr2Job({
    ...opts,
    nodeLabel: "chainlink5",
    node: opts.node5,
  });

  //
  // Chainlink Node #2 - ccip-exec job
  //
  const execJob2 = await createExecOcr2Job({
    ...opts,
    nodeLabel: "chainlink2",
    node: opts.node2,
  });

  //
  // Chainlink Node #3 - ccip-exec job
  //
  const execJob3 = await createExecOcr2Job({
    ...opts,
    nodeLabel: "chainlink3",
    node: opts.node3,
  });

  //
  // Chainlink Node #4 - ccip-exec job
  //
  const execJob4 = await createExecOcr2Job({
    ...opts,
    nodeLabel: "chainlink4",
    node: opts.node4,
  });

  //
  // Chainlink Node #5 - ccip-exec job
  //
  const execJob5 = await createExecOcr2Job({
    ...opts,
    nodeLabel: "chainlink5",
    node: opts.node5,
  });

  return {
    commitJob2,
    commitJob3,
    commitJob4,
    commitJob5,
    execJob2,
    execJob3,
    execJob4,
    execJob5,
  };
}

async function createCommitOcr2Job(opts: {
  readonly nodeLabel: Readonly<string>;
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly sourceChainId: Readonly<bigint>;
  readonly destChainId: Readonly<bigint>;
  readonly sourceChainSelector: Readonly<bigint>;
  readonly destChainSelector: Readonly<bigint>;
  readonly bootstrapNodeP2pId: Readonly<string>;
  readonly contracts: Readonly<IDeployBesuCcipContractsOutput>;
  readonly node: Readonly<{
    readonly clApiClient: Readonly<IChainlinkApiClient>;
  }>;
  readonly tokenPricesUSDPipeline: Readonly<string>;
  readonly priceGetterConfig: Readonly<Record<string, unknown>>;
}): Promise<Readonly<ICreateChainlinkJobResponse>> {
  const { logLevel = "WARN" } = opts;
  const externalJobId = randomUUID();

  const log = LoggerProvider.getOrCreate({
    label: "setUpNodesAndJobs()".concat(opts.nodeLabel),
    level: logLevel,
  });
  log.debug("ENTRY externalJobId=%s", externalJobId);
  log.debug("Fetching OCR2 key bundles of Chainlink Node");
  const ocr2KbOut = await opts.node.clApiClient.getOcr2KeyBundles({
    limit: 1,
    offset: 0,
  });
  log.debug("OCR2 key bundles of Chainlink Node fetched OK");

  const [ocrKeyBundle] = ocr2KbOut.response.data.data.ocr2KeyBundles.results;
  const ocrKeyBundleIDs = [ocrKeyBundle.id];
  log.debug("ocrKeyBundleIDs=%s", safeStringify(ocrKeyBundleIDs));

  log.debug("Fetching EVM keys to determine transmitter ID...");
  const ethKeysDto = await opts.node.clApiClient.getEthKeys({
    offset: 0,
    limit: 1000,
  });
  log.debug("Fetched ETH keys DTO OK.");

  const transmitterKeyIdx =
    ethKeysDto.response.data.data.ethKeys.results.findIndex(
      (x) => x.chain.id === opts.destChainId.toString(10),
    );
  if (transmitterKeyIdx === -1) {
    const ctx = ethKeysDto.response.data.data.ethKeys.results;
    const msg =
      "No keys for destChainId=" +
      opts.destChainId +
      ", ethKeysDtoJson=" +
      safeStringify(ctx);

    throw new Error(msg);
  }
  const { address: transmitterId } =
    ethKeysDto.response.data.data.ethKeys.results[transmitterKeyIdx];

  log.debug(
    "Determined transmitterID=%s for chainId=%s",
    transmitterId,
    opts.destChainId,
  );

  log.debug("Fetching P2P keys of Chainlink Node...");
  const p2pKeysDto = await opts.node.clApiClient.getP2pKeys();

  const [firstP2pKey] = p2pKeysDto.response.data.data.p2pKeys.results;
  const p2pKeyID = firstP2pKey.id;
  const peerId = firstP2pKey.peerID;
  log.debug("Chainlink Node P2P keys[0]=%s", safeStringify(firstP2pKey));

  const p2pv2Bootstrappers = [opts.bootstrapNodeP2pId];

  const priceGetterConfig = {
    aggregatorPrices: {
      [opts.contracts.srcWeth9Addr]: {
        chainID: opts.sourceChainId,
        contractAddress: opts.contracts.srcMockV3AggregatorAddr,
      },
      [opts.contracts.dstLinkTokenAddr]: {
        chainID: opts.destChainId,
        contractAddress: opts.contracts.dstMockV3AggregatorAddr,
      },
      [opts.contracts.dstWeth9Addr]: {
        chainID: opts.destChainId,
        contractAddress: opts.contracts.dstMockV3AggregatorAddr,
      },
    },
    staticPrices: {},
  };

  const priceGetterConfigJson = safeStringify(priceGetterConfig, undefined, 2);

  const jobSpec = {
    name: "ccip-commit-SimulatedSource-SimulatedDest",
    type: "offchainreporting2",
    externalJobID: externalJobId,
    schemaVersion: 1,
    relay: "evm",
    maxTaskDuration: "1h",
    forwardingAllowed: false,
    contractID: opts.contracts.dstCommitStoreHelperAddr,
    pluginType: "ccip-commit",
    transmitterID: transmitterId,
    ocrKeyBundleIDs,
    ocrKeyBundleID: ocrKeyBundle.id,
    p2pKeyID,
    p2pv2Bootstrappers,
    relayConfig: {
      chainID: opts.destChainId,
    },
    pluginConfig: {
      sourceStartBlock: 0,
      destStartBlock: 0,
      offRamp: opts.contracts.dstOffRampAddr,
      priceGetterConfig: priceGetterConfigJson,
    },
  };

  const jobSpecToml = json2toml(jobSpec, {
    indent: 2,
    newlineAfterSection: true,
  });
  const { externalJobID, type, pluginType, transmitterID, contractID } =
    jobSpec;
  const ctxIn = safeStringify({
    externalJobID,
    type,
    pluginType,
    p2pKeyID,
    transmitterID,
    contractID,
  });
  log.debug("Creating Job %s with details: %s", ctxIn);

  const { response: createJobResponse } = await opts.node.clApiClient.createJob(
    {
      jobSpecToml,
    },
  );

  const ctxOut = safeStringify(createJobResponse.data);
  log.debug("Created CCIP-commit job OK %s", ctxOut);
  return {
    ocrKeyBundle,
    externalJobId,
    createJobResponse,
    jobSpecToml,
    jobSpec,
    transmitterId,
    peerId,
  };
}

async function createExecOcr2Job(opts: {
  readonly nodeLabel: Readonly<string>;
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly srcWeb3SigningCredential: Readonly<Web3SigningCredentialPrivateKeyHex>;
  readonly dstWeb3SigningCredential: Readonly<Web3SigningCredentialPrivateKeyHex>;
  readonly dstCommitStoreHelper: Readonly<
    Contract<typeof CommitStoreHelperAbi>
  >;
  readonly sourceChainId: Readonly<bigint>;
  readonly destChainId: Readonly<bigint>;
  readonly sourceChainSelector: Readonly<bigint>;
  readonly destChainSelector: Readonly<bigint>;
  readonly bootstrapNodeP2pId: Readonly<string>;
  readonly contracts: Readonly<IDeployBesuCcipContractsOutput>;
  readonly node: Readonly<{
    readonly clApiClient: Readonly<IChainlinkApiClient>;
  }>;
  readonly tokenPricesUSDPipeline: Readonly<string>;
  readonly priceGetterConfig: Readonly<Record<string, unknown>>;
}): Promise<Readonly<ICreateChainlinkJobResponse>> {
  const { logLevel = "WARN" } = opts;
  const externalJobId = randomUUID();

  const log = LoggerProvider.getOrCreate({
    label: "setUpNodesAndJobs()".concat(opts.nodeLabel),
    level: logLevel,
  });
  log.debug("ENTRY externalJobId=%s", externalJobId);
  log.debug("Fetching OCR2 key bundles of Chainlink Node");
  const ocr2KbOut = await opts.node.clApiClient.getOcr2KeyBundles({
    limit: 1,
    offset: 0,
  });
  log.debug("OCR2 key bundles of Chainlink Node fetched OK");

  const [ocrKeyBundle] = ocr2KbOut.response.data.data.ocr2KeyBundles.results;
  const ocrKeyBundleIDs = [ocrKeyBundle.id];
  log.debug("ocrKeyBundleIDs=%s", safeStringify(ocrKeyBundleIDs));

  log.debug("Fetching EVM keys to determine transmitter ID...");
  const ethKeysDto = await opts.node.clApiClient.getEthKeys({
    offset: 0,
    limit: 1000,
  });
  log.debug("Fetched ETH keys DTO OK.");

  const transmitterKeyIdx =
    ethKeysDto.response.data.data.ethKeys.results.findIndex(
      (x) => x.chain.id === opts.destChainId.toString(10),
    );
  if (transmitterKeyIdx === -1) {
    const errorMessage =
      "Could not locate any keys with destChainId=" +
      opts.destChainId +
      ", ethKeysDtoJson=" +
      safeStringify(ethKeysDto.response.data.data.ethKeys.results);

    throw new Error(errorMessage);
  }
  const { address: transmitterId } =
    ethKeysDto.response.data.data.ethKeys.results[transmitterKeyIdx];

  log.debug("transmitterID=%s for chainId=%s", transmitterId, opts.destChainId);

  log.debug("Fetching P2P keys of Chainlink Node...");
  const p2pKeysDto = await opts.node.clApiClient.getP2pKeys();

  const [firstP2pKey] = p2pKeysDto.response.data.data.p2pKeys.results;
  log.debug("Chainlink Node P2P keys[0]=%s", safeStringify(firstP2pKey));
  const peerId = firstP2pKey.peerID;

  const jobSpec = {
    type: "offchainreporting2",
    name: "ccip-exec-SimulatedSource-SimulatedDest",
    externalJobID: externalJobId,
    forwardingAllowed: false,
    pluginType: "ccip-execution",
    relay: "evm",
    schemaVersion: 1,
    contractID: opts.contracts.dstOffRampAddr,
    ocrKeyBundleID: ocrKeyBundle.id,
    transmitterID: transmitterId,
    contractConfigConfirmations: 1,
    contractConfigTrackerPollInterval: "20s",
    pluginConfig: {
      destStartBlock: 0,
    },
    relayConfig: {
      chainID: opts.destChainId,
    },
  };

  const jobSpecToml = json2toml(jobSpec, {
    indent: 2,
    newlineAfterSection: true,
  });

  const { externalJobID, type, pluginType, transmitterID, contractID } =
    jobSpec;
  const ctxIn = safeStringify({
    externalJobID,
    type,
    pluginType,
    transmitterID,
    contractID,
  });
  log.debug("Creating Job %s with details: %s", ctxIn);

  const { response: createJobResponse } = await opts.node.clApiClient.createJob(
    {
      jobSpecToml,
    },
  );
  const ctx = safeStringify(createJobResponse.data);
  log.debug("Created CCIP-exec job OK %s", ctx);

  return {
    ocrKeyBundle,
    externalJobId,
    createJobResponse,
    jobSpecToml,
    jobSpec,
    peerId,
    transmitterId,
  };
}
