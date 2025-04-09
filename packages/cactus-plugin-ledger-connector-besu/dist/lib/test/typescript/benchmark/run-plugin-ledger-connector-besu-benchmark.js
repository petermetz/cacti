"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const os_1 = require("os");
const Benchmark = __importStar(require("benchmark"));
const uuid_1 = require("uuid");
const socket_io_1 = require("socket.io");
const fs_extra_1 = __importDefault(require("fs-extra"));
const key_encoder_1 = __importDefault(require("key-encoder"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const public_api_1 = require("../../../main/typescript/public-api");
const HelloWorld_json_1 = __importDefault(require("../../solidity/hello-world-contract/HelloWorld.json"));
const besu_api_client_1 = require("../../../main/typescript/api-client/besu-api-client");
const openapi_json_1 = __importDefault(require("../../../main/json/openapi.json"));
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_core_api_1 = require("@hyperledger/cactus-core-api");
const cactus_core_1 = require("@hyperledger/cactus-core");
const cactus_core_2 = require("@hyperledger/cactus-core");
const cactus_plugin_keychain_memory_1 = require("@hyperledger/cactus-plugin-keychain-memory");
const cactus_test_tooling_1 = require("@hyperledger/cactus-test-tooling");
const LOG_TAG = "[packages/cactus-plugin-ledger-connector-besu/src/test/typescript/benchmark/run-plugin-ledger-connector-besu-benchmark.ts]";
const createTestInfrastructure = async (opts) => {
    const logLevel = opts.logLevel || "DEBUG";
    const keyEncoder = new key_encoder_1.default("secp256k1");
    const keychainIdForSigned = (0, uuid_1.v4)();
    const keychainIdForUnsigned = (0, uuid_1.v4)();
    const keychainRefForSigned = (0, uuid_1.v4)();
    const keychainRefForUnsigned = (0, uuid_1.v4)();
    const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger();
    await besuTestLedger.start();
    const rpcApiHttpHost = await besuTestLedger.getRpcApiHttpHost();
    const rpcApiWsHost = await besuTestLedger.getRpcApiWsHost();
    const testEthAccount1 = await besuTestLedger.createEthTestAccount();
    // keychainPlugin for signed transactions
    const { privateKey } = cactus_common_1.Secp256k1Keys.generateKeyPairsBuffer();
    const keyHex = privateKey.toString("hex");
    const pem = keyEncoder.encodePrivate(keyHex, cactus_common_1.KeyFormat.Raw, cactus_common_1.KeyFormat.PEM);
    const signedKeychainPlugin = new cactus_plugin_keychain_memory_1.PluginKeychainMemory({
        instanceId: (0, uuid_1.v4)(),
        keychainId: keychainIdForSigned,
        backend: new Map([[keychainRefForSigned, pem]]),
        logLevel,
    });
    // keychainPlugin for unsigned transactions
    const keychainEntryValue = testEthAccount1.privateKey;
    const unsignedKeychainPlugin = new cactus_plugin_keychain_memory_1.PluginKeychainMemory({
        instanceId: (0, uuid_1.v4)(),
        keychainId: keychainIdForUnsigned,
        backend: new Map([[keychainRefForUnsigned, keychainEntryValue]]),
        logLevel,
    });
    unsignedKeychainPlugin.set(HelloWorld_json_1.default.contractName, JSON.stringify(HelloWorld_json_1.default));
    const pluginRegistry = new cactus_core_1.PluginRegistry({
        plugins: [signedKeychainPlugin, unsignedKeychainPlugin],
    });
    const options = {
        instanceId: (0, uuid_1.v4)(),
        rpcApiHttpHost,
        rpcApiWsHost,
        pluginRegistry,
        logLevel,
    };
    const connector = new public_api_1.PluginLedgerConnectorBesu(options);
    pluginRegistry.add(connector);
    const expressApp = (0, express_1.default)();
    expressApp.use(body_parser_1.default.json({ limit: "250mb" }));
    const server = http_1.default.createServer(expressApp);
    const wsApi = new socket_io_1.Server(server, {
        path: cactus_core_api_1.Constants.SocketIoConnectionPathV1,
    });
    const listenOptions = {
        hostname: "127.0.0.1",
        port: 0,
        server,
    };
    const addressInfo = (await cactus_common_1.Servers.listen(listenOptions));
    const { address, port } = addressInfo;
    const apiHost = `http://${address}:${port}`;
    const besuApiClientOptions = new besu_api_client_1.BesuApiClientOptions({
        basePath: apiHost,
    });
    const apiClient = new public_api_1.BesuApiClient(besuApiClientOptions);
    await (0, cactus_core_2.installOpenapiValidationMiddleware)({
        logLevel,
        app: expressApp,
        apiSpec: openapi_json_1.default,
    });
    await connector.getOrCreateWebServices();
    await connector.registerWebServices(expressApp, wsApi);
    return {
        httpApi: apiClient,
        apiServer: connector,
        besuTestLedger,
    };
};
const main = async (opts) => {
    const logLevel = "INFO";
    const { apiServer, httpApi, besuTestLedger } = await createTestInfrastructure({ logLevel });
    const level = apiServer.options.logLevel || "INFO";
    const label = apiServer.className;
    const log = cactus_common_1.LoggerProvider.getOrCreate({ level, label });
    try {
        const gitRootPath = path_1.default.join(__dirname, "../../../../../../");
        log.info("%s gitRootPath=%s", LOG_TAG, gitRootPath);
        const DEFAULT_OUTPUT_FILE_RELATIVE_PATH = ".tmp/benchmark-results/plugin-ledger-connector-besu/run-plugin-ledger-connector-besu-benchmark.ts.log";
        const relativeOutputFilePath = opts.argv[2] === undefined
            ? DEFAULT_OUTPUT_FILE_RELATIVE_PATH
            : opts.argv[2];
        log.info("%s DEFAULT_OUTPUT_FILE_RELATIVE_PATH=%s", LOG_TAG, DEFAULT_OUTPUT_FILE_RELATIVE_PATH);
        log.info("%s opts.argv[2]=%s", LOG_TAG, opts.argv[2]);
        log.info("%s relativeOutputFilePath=%s", LOG_TAG, relativeOutputFilePath);
        const absoluteOutputFilePath = path_1.default.join(gitRootPath, relativeOutputFilePath);
        log.info("%s absoluteOutputFilePath=%s", LOG_TAG, absoluteOutputFilePath);
        const absoluteOutputDirPath = path_1.default.dirname(absoluteOutputFilePath);
        log.info("%s absoluteOutputDirPath=%s", LOG_TAG, absoluteOutputDirPath);
        await fs_extra_1.default.mkdirp(absoluteOutputDirPath);
        log.info("%s mkdir -p OK: %s", LOG_TAG, absoluteOutputDirPath);
        const minSamples = 100;
        const suite = new Benchmark.Suite({});
        const cycles = [];
        await new Promise((resolve, reject) => {
            suite
                .add("plugin-ledger-connector-besu_HTTP_GET_getOpenApiSpecV1", {
                defer: true,
                minSamples,
                fn: async function (deferred) {
                    await httpApi.getOpenApiSpecV1();
                    deferred.resolve();
                },
            })
                .on("cycle", (event) => {
                // Output benchmark result by converting benchmark result to string
                // Example line on stdout:
                // plugin-ledger-connector-besu_HTTP_GET_getOpenApiSpecV1 x 1,020 ops/sec ±2.25% (177 runs sampled)
                const cycle = String(event.target);
                log.info("%s Benchmark.js CYCLE: %s", LOG_TAG, cycle);
                cycles.push(cycle);
            })
                .on("complete", function () {
                log.info("%s Benchmark.js COMPLETE.", LOG_TAG);
                resolve(suite);
            })
                .on("error", async (ex) => {
                log.info("%s Benchmark.js ERROR: %o", LOG_TAG, ex);
                reject(ex);
            })
                .run();
        });
        const data = cycles.join(os_1.EOL);
        log.info("%s Writing results...", LOG_TAG);
        await fs_extra_1.default.writeFile(absoluteOutputFilePath, data, { encoding: "utf-8" });
        log.info("%s Wrote results to %s", LOG_TAG, absoluteOutputFilePath);
    }
    finally {
        await apiServer.shutdown();
        log.info("%s Shut down API server OK", LOG_TAG);
        await besuTestLedger.stop();
        await besuTestLedger.destroy();
    }
};
main({ argv: process.argv })
    .then(async () => {
    console.log("%s Script execution completed successfully", LOG_TAG);
    process.exit(0);
})
    .catch((ex) => {
    console.error("%s process crashed with:", LOG_TAG, ex);
    process.exit(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLXBsdWdpbi1sZWRnZXItY29ubmVjdG9yLWJlc3UtYmVuY2htYXJrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3Rlc3QvdHlwZXNjcmlwdC9iZW5jaG1hcmsvcnVuLXBsdWdpbi1sZWRnZXItY29ubmVjdG9yLWJlc3UtYmVuY2htYXJrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsMkJBQXlCO0FBQ3pCLHFEQUF1QztBQUV2QywrQkFBb0M7QUFDcEMseUNBQXFEO0FBQ3JELHdEQUEyQjtBQUMzQiw4REFBcUM7QUFDckMsc0RBQThCO0FBQzlCLDhEQUFxQztBQUNyQyxnREFBd0I7QUFHeEIsb0VBSTZDO0FBQzdDLDBHQUF5RjtBQUN6Rix5RkFBMkY7QUFDM0YsbUZBQWtEO0FBRWxELDhEQVFvQztBQUNwQyxrRUFBeUQ7QUFDekQsMERBQTBEO0FBQzFELDBEQUE4RTtBQUM5RSw4RkFBa0Y7QUFDbEYsMEVBQWtFO0FBRWxFLE1BQU0sT0FBTyxHQUNYLDRIQUE0SCxDQUFDO0FBRS9ILE1BQU0sd0JBQXdCLEdBQUcsS0FBSyxFQUFFLElBRXZDLEVBQUUsRUFBRTtJQUNILE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDO0lBQzFDLE1BQU0sVUFBVSxHQUFlLElBQUkscUJBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMzRCxNQUFNLG1CQUFtQixHQUFHLElBQUEsU0FBTSxHQUFFLENBQUM7SUFDckMsTUFBTSxxQkFBcUIsR0FBRyxJQUFBLFNBQU0sR0FBRSxDQUFDO0lBQ3ZDLE1BQU0sb0JBQW9CLEdBQUcsSUFBQSxTQUFNLEdBQUUsQ0FBQztJQUN0QyxNQUFNLHNCQUFzQixHQUFHLElBQUEsU0FBTSxHQUFFLENBQUM7SUFFeEMsTUFBTSxjQUFjLEdBQUcsSUFBSSxvQ0FBYyxFQUFFLENBQUM7SUFD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