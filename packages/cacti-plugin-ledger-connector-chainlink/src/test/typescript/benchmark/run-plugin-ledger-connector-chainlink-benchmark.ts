// FIXME
// import path from "path";
// import { EOL } from "os";
// import * as Benchmark from "benchmark";

// import { v4 as uuidv4 } from "uuid";
// import { Server as SocketIoServer } from "socket.io";
// import fse from "fs-extra";
// import express from "express";
// import bodyParser from "body-parser";
// import http from "http";
// import { AddressInfo } from "net";

// import {
//   PluginLedgerConnectorChainlink,
//   ChainlinkApiClient,
//   IPluginLedgerConnectorChainlinkOptions,
// } from "../../../main/typescript/public-api";
// import HelloWorldContractJson from "../../solidity/hello-world-contract/HelloWorld.json";
// import { ChainlinkApiClientOptions } from "../../../main/typescript/api-client/chainlink-api-client";
// import OAS from "../../../main/json/openapi.json";

// import {
//   IListenOptions,
//   KeyFormat,
//   LogLevelDesc,
//   Logger,
//   LoggerProvider,
//   Secp256k1Keys,
//   Servers,
// } from "@hyperledger/cactus-common";
// import { Constants } from "@hyperledger/cactus-core-api";
// import { PluginRegistry } from "@hyperledger/cactus-core";
// import { installOpenapiValidationMiddleware } from "@hyperledger/cactus-core";
// import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";
// import { ChainlinkTestLedger } from "@hyperledger/cactus-test-tooling";

// const LOG_TAG =
//   "[packages/cacti-plugin-ledger-connector-chainlink/src/test/typescript/benchmark/run-plugin-ledger-connector-chainlink-benchmark.ts]";

// const createTestInfrastructure = async (opts: {
//   readonly logLevel: LogLevelDesc;
// }) => {
//   const logLevel = opts.logLevel || "DEBUG";
//   const keychainIdForSigned = uuidv4();
//   const keychainIdForUnsigned = uuidv4();
//   const keychainRefForSigned = uuidv4();
//   const keychainRefForUnsigned = uuidv4();

//   const ledger = new ChainlinkTestLedger();
//   await ledger.start();
//   const rpcApiHttpHost = await ledger.getRpcApiHttpHost();
//   const rpcApiWsHost = await ledger.getRpcApiWsHost();

//   const testEthAccount1 = await ledger.createEthTestAccount();

//   // keychainPlugin for signed transactions
//   const { privateKey } = Secp256k1Keys.generateKeyPairsBuffer();
//   const keyHex = privateKey.toString("hex");
//   const pem = keyEncoder.encodePrivate(keyHex, KeyFormat.Raw, KeyFormat.PEM);
//   const signedKeychainPlugin = new PluginKeychainMemory({
//     instanceId: uuidv4(),
//     keychainId: keychainIdForSigned,
//     backend: new Map([[keychainRefForSigned, pem]]),
//     logLevel,
//   });

//   // keychainPlugin for unsigned transactions
//   const keychainEntryValue = testEthAccount1.privateKey;
//   const unsignedKeychainPlugin = new PluginKeychainMemory({
//     instanceId: uuidv4(),
//     keychainId: keychainIdForUnsigned,
//     backend: new Map([[keychainRefForUnsigned, keychainEntryValue]]),
//     logLevel,
//   });
//   unsignedKeychainPlugin.set(
//     HelloWorldContractJson.contractName,
//     JSON.stringify(HelloWorldContractJson),
//   );

//   const pluginRegistry = new PluginRegistry({
//     plugins: [signedKeychainPlugin, unsignedKeychainPlugin],
//   });

//   const options: IPluginLedgerConnectorChainlinkOptions = {
//     instanceId: uuidv4(),
//     rpcApiHttpHost,
//     rpcApiWsHost,
//     pluginRegistry,
//     logLevel,
//   };
//   const connector = new PluginLedgerConnectorChainlink(options);
//   pluginRegistry.add(connector);

//   const expressApp = express();
//   expressApp.use(bodyParser.json({ limit: "250mb" }));
//   const server = http.createServer(expressApp);

//   const wsApi = new SocketIoServer(server, {
//     path: Constants.SocketIoConnectionPathV1,
//   });

//   const listenOptions: IListenOptions = {
//     hostname: "127.0.0.1",
//     port: 0,
//     server,
//   };
//   const addressInfo = (await Servers.listen(listenOptions)) as AddressInfo;
//   const { address, port } = addressInfo;
//   const apiHost = `http://${address}:${port}`;

//   const chainlinkApiClientOptions = new ChainlinkApiClientOptions({
//     basePath: apiHost,
//   });
//   const apiClient = new ChainlinkApiClient(chainlinkApiClientOptions);

//   await installOpenapiValidationMiddleware({
//     logLevel,
//     app: expressApp,
//     apiSpec: OAS,
//   });

//   await connector.getOrCreateWebServices();
//   await connector.registerWebServices(expressApp, wsApi);

//   return {
//     httpApi: apiClient,
//     apiServer: connector,
//     chainlinkTestLedger: ledger,
//   };
// };

// const main = async (opts: { readonly argv: Readonly<Array<string>> }) => {
//   const logLevel: LogLevelDesc = "INFO";

//   const { apiServer, httpApi, chainlinkTestLedger } = await createTestInfrastructure(
//     { logLevel },
//   );

//   const level = apiServer.options.logLevel || "INFO";
//   const label = apiServer.className;
//   const log: Logger = LoggerProvider.getOrCreate({ level, label });

//   try {
//     const gitRootPath = path.join(
//       __dirname,
//       "../../../../../../", // walk back up to the project root
//     );

//     log.info("%s gitRootPath=%s", LOG_TAG, gitRootPath);

//     const DEFAULT_OUTPUT_FILE_RELATIVE_PATH =
//       ".tmp/benchmark-results/plugin-ledger-connector-chainlink/run-plugin-ledger-connector-chainlink-benchmark.ts.log";

//     const relativeOutputFilePath =
//       opts.argv[2] === undefined
//         ? DEFAULT_OUTPUT_FILE_RELATIVE_PATH
//         : opts.argv[2];

//     log.info(
//       "%s DEFAULT_OUTPUT_FILE_RELATIVE_PATH=%s",
//       LOG_TAG,
//       DEFAULT_OUTPUT_FILE_RELATIVE_PATH,
//     );

//     log.info("%s opts.argv[2]=%s", LOG_TAG, opts.argv[2]);

//     log.info("%s relativeOutputFilePath=%s", LOG_TAG, relativeOutputFilePath);

//     const absoluteOutputFilePath = path.join(
//       gitRootPath,
//       relativeOutputFilePath,
//     );

//     log.info("%s absoluteOutputFilePath=%s", LOG_TAG, absoluteOutputFilePath);

//     const absoluteOutputDirPath = path.dirname(absoluteOutputFilePath);
//     log.info("%s absoluteOutputDirPath=%s", LOG_TAG, absoluteOutputDirPath);

//     await fse.mkdirp(absoluteOutputDirPath);
//     log.info("%s mkdir -p OK: %s", LOG_TAG, absoluteOutputDirPath);

//     const minSamples = 100;
//     const suite = new Benchmark.Suite({});

//     const cycles: string[] = [];

//     await new Promise((resolve, reject) => {
//       suite
//         .add("plugin-ledger-connector-chainlink_HTTP_GET_getOpenApiSpecV1", {
//           defer: true,
//           minSamples,
//           fn: async function (deferred: Benchmark.Deferred) {
//             await httpApi.getOpenApiSpecV1();
//             deferred.resolve();
//           },
//         })
//         .on("cycle", (event: { target: unknown }) => {
//           // Output benchmark result by converting benchmark result to string
//           // Example line on stdout:
//           // plugin-ledger-connector-chainlink_HTTP_GET_getOpenApiSpecV1 x 1,020 ops/sec ±2.25% (177 runs sampled)
//           const cycle = String(event.target);
//           log.info("%s Benchmark.js CYCLE: %s", LOG_TAG, cycle);
//           cycles.push(cycle);
//         })
//         .on("complete", function () {
//           log.info("%s Benchmark.js COMPLETE.", LOG_TAG);
//           resolve(suite);
//         })
//         .on("error", async (ex: unknown) => {
//           log.info("%s Benchmark.js ERROR: %o", LOG_TAG, ex);
//           reject(ex);
//         })
//         .run();
//     });

//     const data = cycles.join(EOL);
//     log.info("%s Writing results...", LOG_TAG);
//     await fse.writeFile(absoluteOutputFilePath, data, { encoding: "utf-8" });
//     log.info("%s Wrote results to %s", LOG_TAG, absoluteOutputFilePath);
//   } finally {
//     await apiServer.shutdown();
//     log.info("%s Shut down API server OK", LOG_TAG);

//     await chainlinkTestLedger.stop();
//     await chainlinkTestLedger.destroy();
//   }
// };

// main({ argv: process.argv })
//   .then(async () => {
//     console.log("%s Script execution completed successfully", LOG_TAG);
//     process.exit(0);
//   })
//   .catch((ex) => {
//     console.error("%s process crashed with:", LOG_TAG, ex);
//     process.exit(1);
//   });
