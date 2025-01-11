import { randomUUID } from "node:crypto";

import { AxiosResponse } from "axios";
import safeStringify from "fast-safe-stringify";
import json2toml from "json2toml";

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { IChainlinkApiClient } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";

import { IDeployBesuCcipContractsOutput } from "./deploy-besu-ccip-contracts";

export interface ICreateChainlinkJobResponse {
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
  readonly sourceChainId: Readonly<bigint>;
  readonly destChainId: Readonly<bigint>;
  readonly sourceChainSelector: Readonly<bigint>;
  readonly destChainSelector: Readonly<bigint>;
  readonly bootstrapNodeP2pId: Readonly<string>;
  readonly contracts: Readonly<IDeployBesuCcipContractsOutput>;
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
    chainID: opts.sourceChainId,
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
      chainID: opts.sourceChainId,
    },
  };

  const bootstrapJobSpecToml = json2toml(bootstrapJobSpec, {
    indent: 2,
    newlineAfterSection: true,
  });

  //
  // Chainlink Node #1 - bootstrap job
  //
  log.debug("Creating Bootstrap job with TOML spec:\n%s", bootstrapJobSpecToml);
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
  const { address: transmitterID } =
    ethKeysDto.response.data.data.ethKeys.results[transmitterKeyIdx];

  log.debug(
    "Determined transmitterID=%s for chainId=%s",
    transmitterID,
    opts.destChainId,
  );

  log.debug("Fetching P2P keys of Chainlink Node...");
  const p2pKeysDto = await opts.node.clApiClient.getP2pKeys();

  const [firstP2pKey] = p2pKeysDto.response.data.data.p2pKeys.results;
  const p2pKeyID = firstP2pKey.id;
  log.debug("Chainlink Node P2P keys[0]=%s", safeStringify(firstP2pKey));

  const p2pv2Bootstrappers = [opts.bootstrapNodeP2pId];

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
    transmitterID,
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
      tokenPricesUSDPipeline:
        '\n        // Price 1\n        link [type=http method=GET url="http://127.0.0.1:34335"];\n        link_parse [type=jsonparse path="UsdPerLink"];\n        link->link_parse;\n        eth [type=http method=GET url="http://127.0.0.1:33895"];\n        eth_parse [type=jsonparse path="UsdPerETH"];\n        eth->eth_parse;\n      ',
      // FIXME add this back later once we fixed the syntax
      // tokenPricesUSDPipeline: `"""

      // // Price 1
      // link [type=http method=GET url="http://127.0.0.1:39485"];
      // link_parse [type=jsonparse path="UsdPerLink"];
      // link->link_parse;
      // eth [type=http method=GET url="http://127.0.0.1:34519"];
      // eth_parse [type=jsonparse path="UsdPerETH"];
      // eth->eth_parse;
      // merge [type=merge left="{}" right="{\\\"0x2744fc83c9172c4A009e2eA89C88F2d512e4CCB1\\\":$(link_parse), \\\"0x2598CFC480c2e4E0080A271173dA19dDcc327272\\\":$(eth_parse), \\\"0xCd88E2a770606934F91E37736B9537FCFFe73a08\\\":$(eth_parse)}"];
      // """
      //       `,
    },
  };

  const jobSpecToml = json2toml(jobSpec, {
    indent: 2,
    newlineAfterSection: true,
  });
  log.debug("Creating CCIP-commit job with spec:\n%s", jobSpecToml);

  const { response: createJobResponse } = await opts.node.clApiClient.createJob(
    {
      jobSpecToml,
    },
  );

  const ctx = safeStringify(createJobResponse.data);
  log.debug("Created CCIP-commit job OK %s", ctx);
  return {
    externalJobId,
    createJobResponse,
    jobSpecToml,
    jobSpec,
  };
}

async function createExecOcr2Job(opts: {
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

  const jobSpec = {
    type: "offchainreporting2",
    name: "ccip-exec-SimulatedSource-SimulatedDest",
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
  log.debug("Creating CCIP-exec job with spec:\n%s", jobSpecToml);

  const { response: createJobResponse } = await opts.node.clApiClient.createJob(
    {
      jobSpecToml,
    },
  );
  const ctx = safeStringify(createJobResponse.data);
  log.debug("Created CCIP-exec job OK %s", ctx);
  return {
    externalJobId,
    createJobResponse,
    jobSpecToml,
    jobSpec,
  };
}
