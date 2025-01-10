import { randomUUID } from "node:crypto";

import safeStringify from "fast-safe-stringify";
import json2toml from "json2toml";

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { IChainlinkApiClient } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";

import { IDeployBesuCcipContractsOutput } from "./deploy-besu-ccip-contracts";

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
  readonly jobParams: Readonly<Record<string, unknown>>;
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
  log.debug("ENTRY");
  log.debug("Fetching OCR2 key bundles of Chainlink Node #2");
  const ocr2KbOut = await opts.node2.clApiClient.getOcr2KeyBundles({
    limit: 1,
    offset: 0,
  });
  log.debug("OCR2 key bundles of Chainlink Node #2 fetched OK");

  const [ocrKeyBundle] = ocr2KbOut.response.data.data.ocr2KeyBundles.results;
  const ocrKeyBundleIDs = [ocrKeyBundle.id];
  log.debug("ocrKeyBundleIDs=%o", ocrKeyBundleIDs);

  log.debug("Fetching EVM keys to determine transmitter ID...");
  const ethKeysDto = await opts.node2.clApiClient.getEthKeys({
    offset: 0,
    limit: 1000,
  });
  log.debug("Fetched ETH keys DTO OK.");

  const transmitterKeyIdx =
    ethKeysDto.response.data.data.ethKeys.results.findIndex(
      (x) => x.chain.id === opts.destChainId.toString(10),
    );
  if (transmitterKeyIdx === -1) {
    throw new Error(
      "Could not locate any keys with destChainId=" +
        opts.destChainId +
        ", ethKeysDtoJson=" +
        safeStringify(ethKeysDto.response.data.data.ethKeys.results),
    );
  }
  const { address: transmitterID } =
    ethKeysDto.response.data.data.ethKeys.results[transmitterKeyIdx];

  log.debug(
    "Determined transmitterID=%s for chainId=%s",
    transmitterID,
    opts.destChainId,
  );

  log.debug("Fetching P2P keys of Node #2...");
  const p2pKeysDto = await opts.node2.clApiClient.getP2pKeys();

  const [firstP2pKey] = p2pKeysDto.response.data.data.p2pKeys.results;
  const p2pKeyID = firstP2pKey.id;
  log.debug("Fetched P2P keys of Node #2 OK. firstP2pKey=%o", firstP2pKey);

  const p2pv2Bootstrappers = [opts.bootstrapNodeP2pId];

  const externalJobID = randomUUID();

  const ccipCommitJobSpec = {
    name: "ccip-commit-SimulatedSource-SimulatedDest",
    type: "offchainreporting2",
    externalJobID,
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

  const ccipCommitJobSpecToml = json2toml(ccipCommitJobSpec, {
    indent: 2,
    newlineAfterSection: true,
  });
  log.debug("Creating CCIP-commit job with spec:\n%s", ccipCommitJobSpecToml);

  const { response: commitJobRes } = await opts.node2.clApiClient.createJob({
    jobSpecToml: ccipCommitJobSpecToml,
  });
  log.debug("Created CCIP-commit job OK: ", commitJobRes.data);

  return { jobParams: { ccipCommitJobSpec } };
}

// async function createCcipCommitJob(opts: {
//   readonly logLevel: Readonly<LogLevelDesc>;
//   readonly sourceChainId: Readonly<bigint>;
//   readonly destChainId: Readonly<bigint>;
//   readonly sourceChainSelector: Readonly<bigint>;
//   readonly destChainSelector: Readonly<bigint>;
//   readonly bootstrapNodeP2pId: Readonly<string>;
//   readonly contracts: Readonly<IDeployBesuCcipContractsOutput>;
//   readonly node: Readonly<{
//     readonly clApiClient: Readonly<IChainlinkApiClient>;
//   }>;
//   readonly tokenPricesUSDPipeline: Readonly<string>;
//   readonly priceGetterConfig: Readonly<Record<string, unknown>>;
// }): Promise<unknown> {
//   const { logLevel = "WARN" } = opts;

//   const log = LoggerProvider.getOrCreate({
//     label: "setUpNodesAndJobs()",
//     level: logLevel,
//   });
//   log.debug("ENTRY");
//   log.debug("Fetching OCR2 key bundles of Chainlink Node #2");
//   const ocr2KbOut = await opts.node2.clApiClient.getOcr2KeyBundles({
//     limit: 1,
//     offset: 0,
//   });
//   log.debug("OCR2 key bundles of Chainlink Node #2 fetched OK");

//   const [ocrKeyBundle] = ocr2KbOut.response.data.data.ocr2KeyBundles.results;
//   const ocrKeyBundleIDs = [ocrKeyBundle.id];
//   log.debug("ocrKeyBundleIDs=%o", ocrKeyBundleIDs);

//   log.debug("Fetching EVM keys to determine transmitter ID...");
//   const ethKeysDto = await opts.node2.clApiClient.getEthKeys({
//     offset: 0,
//     limit: 1000,
//   });
//   log.debug("Fetched ETH keys DTO OK.");

//   const transmitterKeyIdx =
//     ethKeysDto.response.data.data.ethKeys.results.findIndex(
//       (x) => x.chain.id === opts.destChainId.toString(10),
//     );
//   if (transmitterKeyIdx === -1) {
//     throw new Error(
//       "Could not locate any keys with destChainId=" +
//         opts.destChainId +
//         ", ethKeysDtoJson=" +
//         safeStringify(ethKeysDto.response.data.data.ethKeys.results),
//     );
//   }
//   const { address: transmitterID } =
//     ethKeysDto.response.data.data.ethKeys.results[transmitterKeyIdx];

//   log.debug(
//     "Determined transmitterID=%s for chainId=%s",
//     transmitterID,
//     opts.destChainId,
//   );

//   log.debug("Fetching P2P keys of Node #2...");
//   const p2pKeysDto = await opts.node2.clApiClient.getP2pKeys();

//   const [firstP2pKey] = p2pKeysDto.response.data.data.p2pKeys.results;
//   const p2pKeyID = firstP2pKey.id;
//   log.debug("Fetched P2P keys of Node #2 OK. firstP2pKey=%o", firstP2pKey);

//   const p2pv2Bootstrappers = [opts.bootstrapNodeP2pId];

//   const externalJobID = randomUUID();

//   const ccipCommitJobSpec = {
//     name: "ccip-commit-SimulatedSource-SimulatedDest",
//     type: "offchainreporting2",
//     externalJobID,
//     schemaVersion: 1,
//     relay: "evm",
//     maxTaskDuration: "1h",
//     forwardingAllowed: false,
//     contractID: opts.contracts.dstCommitStoreHelperAddr,
//     pluginType: "ccip-commit",
//     transmitterID,
//     ocrKeyBundleIDs,
//     ocrKeyBundleID: ocrKeyBundle.id,
//     p2pKeyID,
//     p2pv2Bootstrappers,
//     relayConfig: {
//       chainID: opts.destChainId,
//     },
//     pluginConfig: {
//       sourceStartBlock: 0,
//       destStartBlock: 0,
//       offRamp: opts.contracts.dstOffRampAddr,
//       tokenPricesUSDPipeline:
//         '\n        // Price 1\n        link [type=http method=GET url="http://127.0.0.1:34335"];\n        link_parse [type=jsonparse path="UsdPerLink"];\n        link->link_parse;\n        eth [type=http method=GET url="http://127.0.0.1:33895"];\n        eth_parse [type=jsonparse path="UsdPerETH"];\n        eth->eth_parse;\n      ',
//       // FIXME add this back later once we fixed the syntax
//       // tokenPricesUSDPipeline: `"""

//       // // Price 1
//       // link [type=http method=GET url="http://127.0.0.1:39485"];
//       // link_parse [type=jsonparse path="UsdPerLink"];
//       // link->link_parse;
//       // eth [type=http method=GET url="http://127.0.0.1:34519"];
//       // eth_parse [type=jsonparse path="UsdPerETH"];
//       // eth->eth_parse;
//       // merge [type=merge left="{}" right="{\\\"0x2744fc83c9172c4A009e2eA89C88F2d512e4CCB1\\\":$(link_parse), \\\"0x2598CFC480c2e4E0080A271173dA19dDcc327272\\\":$(eth_parse), \\\"0xCd88E2a770606934F91E37736B9537FCFFe73a08\\\":$(eth_parse)}"];
//       // """
//       //       `,
//     },
//   };

//   const ccipCommitJobSpecToml = json2toml(ccipCommitJobSpec, {
//     indent: 2,
//     newlineAfterSection: true,
//   });
//   log.debug("Creating CCIP-commit job with spec:\n%s", ccipCommitJobSpecToml);

//   const { response: commitJobRes } = await opts.node2.clApiClient.createJob({
//     jobSpecToml: ccipCommitJobSpecToml,
//   });
//   log.debug("Created CCIP-commit job OK: ", commitJobRes.data);
// }
