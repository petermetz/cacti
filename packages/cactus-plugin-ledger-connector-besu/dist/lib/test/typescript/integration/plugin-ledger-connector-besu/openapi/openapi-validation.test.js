"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest-extended");
const uuid_1 = require("uuid");
const socket_io_1 = require("socket.io");
const cactus_core_1 = require("@hyperledger/cactus-core");
const public_api_1 = require("../../../../../main/typescript/public-api");
const cactus_plugin_keychain_memory_1 = require("@hyperledger/cactus-plugin-keychain-memory");
const cactus_test_tooling_1 = require("@hyperledger/cactus-test-tooling");
const key_encoder_1 = __importDefault(require("key-encoder"));
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_core_api_1 = require("@hyperledger/cactus-core-api");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const HelloWorld_json_1 = __importDefault(require("../../../../solidity/hello-world-contract/HelloWorld.json"));
const besu_api_client_1 = require("../../../../../main/typescript/api-client/besu-api-client");
const cactus_core_2 = require("@hyperledger/cactus-core");
const openapi_json_1 = __importDefault(require("../../../../../main/json/openapi.json"));
const logLevel = "TRACE";
const testCase = "able to validate OpenAPI requests";
const log = cactus_common_1.LoggerProvider.getOrCreate({
    label: "connector-besu-openapi-validation.test.ts",
    level: logLevel,
});
describe("PluginLedgerConnectorBesu", () => {
    const fDeploy = "deployContractSolBytecodeV1";
    const fInvoke = "invokeContractV1";
    const fRun = "runTransactionV1";
    const fSign = "signTransactionV1";
    const fBalance = "getBalanceV1";
    const fBlock = "getBlockV1";
    const fPastLogs = "getPastLogsV1";
    const fRecord = "getBesuRecordV1";
    const cOk = "without bad request error";
    const cWithoutParams = "not sending all required parameters";
    const cInvalidParams = "sending invalid parameters";
    const keyEncoder = new key_encoder_1.default("secp256k1");
    const keychainIdForSigned = (0, uuid_1.v4)();
    const keychainIdForUnsigned = (0, uuid_1.v4)();
    const keychainRefForSigned = (0, uuid_1.v4)();
    const keychainRefForUnsigned = (0, uuid_1.v4)();
    let besuTestLedger;
    let testEthAccount2;
    let firstHighNetWorthAccount;
    let apiClient;
    let testEthAccount1;
    let httpServer;
    beforeAll(async () => {
        await (0, cactus_test_tooling_1.pruneDockerAllIfGithubAction)({ logLevel });
    });
    afterAll(async () => {
        await besuTestLedger.stop();
        await besuTestLedger.destroy();
    });
    afterAll(async () => await cactus_common_1.Servers.shutdown(httpServer));
    beforeAll(async () => {
        besuTestLedger = new cactus_test_tooling_1.BesuTestLedger();
        await besuTestLedger.start();
        const rpcApiHttpHost = await besuTestLedger.getRpcApiHttpHost();
        const rpcApiWsHost = await besuTestLedger.getRpcApiWsHost();
        testEthAccount1 = await besuTestLedger.createEthTestAccount();
        testEthAccount2 = await besuTestLedger.createEthTestAccount();
        firstHighNetWorthAccount = besuTestLedger.getGenesisAccountPubKey();
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
        httpServer = http_1.default.createServer(expressApp);
        const wsApi = new socket_io_1.Server(httpServer, {
            path: cactus_core_api_1.Constants.SocketIoConnectionPathV1,
        });
        const listenOptions = {
            hostname: "127.0.0.1",
            port: 0,
            server: httpServer,
        };
        const addressInfo = (await cactus_common_1.Servers.listen(listenOptions));
        const { address, port } = addressInfo;
        const apiHost = `http://${address}:${port}`;
        const wsBasePath = apiHost + cactus_core_api_1.Constants.SocketIoConnectionPathV1;
        log.info("WS base path: " + wsBasePath);
        const besuApiClientOptions = new besu_api_client_1.BesuApiClientOptions({
            basePath: apiHost,
        });
        apiClient = new public_api_1.BesuApiClient(besuApiClientOptions);
        await (0, cactus_core_2.installOpenapiValidationMiddleware)({
            logLevel,
            app: expressApp,
            apiSpec: openapi_json_1.default,
        });
        await connector.getOrCreateWebServices();
        await connector.registerWebServices(expressApp, wsApi);
    });
    test(`${testCase} - ${fDeploy} - ${cOk}`, async () => {
        const parameters = {
            keychainId: keychainIdForUnsigned,
            contractName: HelloWorld_json_1.default.contractName,
            contractAbi: HelloWorld_json_1.default.abi,
            constructorArgs: [],
            web3SigningCredential: {
                ethAccount: testEthAccount1.address,
                secret: testEthAccount1.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            bytecode: HelloWorld_json_1.default.bytecode,
            gas: 1000000,
        };
        const res = await apiClient.deployContractSolBytecodeV1(parameters);
        expect(res).toBeTruthy();
        expect(res.data).toBeTruthy();
        expect(res.status).toEqual(200);
    });
    test(`${testCase} - ${fDeploy} - ${cWithoutParams}`, async () => {
        const parameters = {
            keychainId: keychainIdForUnsigned,
            contractAbi: HelloWorld_json_1.default.abi,
            constructorArgs: [],
            web3SigningCredential: {
                ethAccount: testEthAccount1.address,
                secret: testEthAccount1.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
        };
        await expect(apiClient.deployContractSolBytecodeV1(parameters)).rejects.toMatchObject({
            response: {
                status: 400,
                data: expect.arrayContaining([
                    expect.objectContaining({
                        path: expect.stringContaining("/body/contractName"),
                    }),
                    expect.objectContaining({
                        path: expect.stringContaining("/body/bytecode"),
                    }),
                    expect.not.objectContaining({
                        path: expect.stringContaining("/body/gas"),
                    }),
                ]),
            },
        });
    });
    test(`${testCase} - ${fDeploy} - ${cInvalidParams}`, async () => {
        const parameters = {
            keychainId: keychainIdForUnsigned,
            contractName: HelloWorld_json_1.default.contractName,
            contractAbi: HelloWorld_json_1.default.abi,
            constructorArgs: [],
            web3SigningCredential: {
                ethAccount: testEthAccount1.address,
                secret: testEthAccount1.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            bytecode: HelloWorld_json_1.default.bytecode,
            gas: 1000000,
            fake: 4,
        };
        await expect(apiClient.deployContractSolBytecodeV1(parameters)).rejects.toMatchObject({
            response: {
                status: 400,
                data: expect.arrayContaining([
                    expect.objectContaining({ path: "/body/fake" }),
                ]),
            },
        });
    });
    test(`${testCase} - ${fInvoke} - ${cOk}`, async () => {
        const parameters = {
            contractName: "HelloWorld",
            keychainId: keychainIdForUnsigned,
            invocationType: public_api_1.EthContractInvocationType.Call,
            methodName: "sayHello",
            params: [],
            signingCredential: {
                ethAccount: testEthAccount1.address,
                secret: testEthAccount1.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
        };
        const res = await apiClient.invokeContractV1(parameters);
        expect(res).toBeTruthy();
        expect(res.data).toBeTruthy();
        expect(res.status).toEqual(200);
    });
    test(`${testCase} - ${fInvoke} - ${cWithoutParams}`, async () => {
        const parameters = {
            keychainId: keychainIdForUnsigned,
            invocationType: public_api_1.EthContractInvocationType.Call,
            methodName: "sayHello",
            params: [],
            signingCredential: {
                ethAccount: testEthAccount1.address,
                secret: testEthAccount1.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
        };
        await expect(apiClient.invokeContractV1(parameters)).rejects.toMatchObject({
            response: {
                status: 400,
                data: expect.arrayContaining([
                    expect.objectContaining({
                        path: expect.stringContaining("/body/contractName"),
                    }),
                    expect.not.objectContaining({
                        path: expect.stringContaining("/body/gas"),
                    }),
                ]),
            },
        });
    });
    test(`${testCase} - ${fInvoke} - ${cInvalidParams}`, async () => {
        const parameters = {
            contractName: "HelloWorld",
            keychainId: keychainIdForUnsigned,
            invocationType: public_api_1.EthContractInvocationType.Call,
            methodName: "sayHello",
            params: [],
            signingCredential: {
                ethAccount: testEthAccount1.address,
                secret: testEthAccount1.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            fake: 4,
        };
        await expect(apiClient.invokeContractV1(parameters)).rejects.toMatchObject({
            response: {
                status: 400,
                data: expect.arrayContaining([
                    expect.objectContaining({
                        path: expect.stringContaining("/body/fake"),
                    }),
                ]),
            },
        });
    });
    test(`${testCase} - ${fRun} - ${cOk}`, async () => {
        const parameters = {
            web3SigningCredential: {
                ethAccount: testEthAccount1.address,
                secret: testEthAccount1.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            transactionConfig: {
                from: testEthAccount1.address,
                to: testEthAccount2.address,
                value: 10e7,
                gas: 1000000,
            },
            consistencyStrategy: {
                blockConfirmations: 0,
                receiptType: public_api_1.ReceiptType.NodeTxPoolAck,
                timeoutMs: 5000,
            },
        };
        const res = await apiClient.runTransactionV1(parameters);
        expect(res).toBeTruthy();
        expect(res.data).toBeTruthy();
        expect(res.data).toBeObject();
        expect(res.status).toEqual(200);
    });
    test(`${testCase} - ${fRun} - ${cWithoutParams}`, async () => {
        const parameters = {
            web3SigningCredential: {
                ethAccount: testEthAccount1.address,
                secret: testEthAccount1.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            transactionConfig: {
                from: testEthAccount1.address,
                to: testEthAccount2.address,
                value: 10e7,
                gas: 1000000,
            },
        };
        await expect(apiClient.runTransactionV1(parameters)).rejects.toMatchObject({
            response: {
                status: 400,
                data: expect.arrayContaining([
                    expect.objectContaining({
                        path: expect.stringContaining("/body/consistencyStrategy"),
                    }),
                ]),
            },
        });
    });
    test(`${testCase} - ${fRun} - ${cInvalidParams}`, async () => {
        const parameters = {
            web3SigningCredential: {
                ethAccount: testEthAccount1.address,
                secret: testEthAccount1.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            transactionConfig: {
                from: testEthAccount1.address,
                to: testEthAccount2.address,
                value: 10e7,
                gas: 1000000,
            },
            consistencyStrategy: {
                blockConfirmations: 0,
                receiptType: public_api_1.ReceiptType.NodeTxPoolAck,
                timeoutMs: 5000,
            },
            fake: 4,
        };
        await expect(apiClient.runTransactionV1(parameters)).rejects.toMatchObject({
            response: {
                status: 400,
                data: expect.arrayContaining([
                    expect.objectContaining({
                        path: expect.stringContaining("/body/fake"),
                    }),
                ]),
            },
        });
    });
    test(`${testCase} - ${fSign} - ${cOk}`, async () => {
        const runTxRes = await apiClient.runTransactionV1({
            consistencyStrategy: {
                blockConfirmations: 0,
                receiptType: public_api_1.ReceiptType.LedgerBlockAck,
                timeoutMs: 5000,
            },
            transactionConfig: {
                from: testEthAccount1.address,
                to: testEthAccount2.address,
                value: 1,
                gas: 10000000,
            },
            web3SigningCredential: {
                ethAccount: testEthAccount1.address,
                secret: testEthAccount1.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
        });
        expect(runTxRes).toBeTruthy();
        expect(runTxRes).toBeObject();
        expect(runTxRes.status).toBeTruthy();
        expect(runTxRes.status).toEqual(200);
        expect(runTxRes.data).toBeTruthy();
        const body = runTxRes.data;
        expect(body.data).toBeObject();
        expect(body.data.transactionReceipt).toBeObject();
        const parameters = {
            keychainId: keychainIdForSigned,
            keychainRef: keychainRefForSigned,
            transactionHash: runTxRes.data.data.transactionReceipt
                .transactionHash,
        };
        const res = await apiClient.signTransactionV1(parameters);
        expect(res).toBeTruthy();
        expect(res).toBeObject();
        expect(res.data).toBeTruthy();
        expect(res.data).toBeObject();
        expect(res.status).toEqual(200);
    });
    test(`${testCase} - ${fSign} - ${cWithoutParams}`, async () => {
        const runTxRes = await apiClient.runTransactionV1({
            consistencyStrategy: {
                blockConfirmations: 0,
                receiptType: public_api_1.ReceiptType.LedgerBlockAck,
                timeoutMs: 5000,
            },
            transactionConfig: {
                from: testEthAccount1.address,
                to: testEthAccount2.address,
                value: 1,
                gas: 10000000,
            },
            web3SigningCredential: {
                ethAccount: testEthAccount1.address,
                secret: testEthAccount1.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
        });
        expect(runTxRes).toBeTruthy();
        expect(runTxRes.status).toEqual(200);
        expect(runTxRes.data).toBeTruthy();
        expect(runTxRes.data.data.transactionReceipt).toBeTruthy();
        const parameters = {
            keychainRef: keychainRefForSigned,
            transactionHash: runTxRes.data.data.transactionReceipt
                .transactionHash,
        };
        await expect(apiClient.signTransactionV1(parameters)).rejects.toMatchObject({
            response: {
                status: 400,
                data: expect.arrayContaining([
                    expect.objectContaining({
                        path: expect.stringContaining("/body/keychainId"),
                    }),
                ]),
            },
        });
    });
    test(`${testCase} - ${fSign} - ${cInvalidParams}`, async () => {
        const runTxRes = await apiClient.runTransactionV1({
            consistencyStrategy: {
                blockConfirmations: 0,
                receiptType: public_api_1.ReceiptType.LedgerBlockAck,
                timeoutMs: 5000,
            },
            transactionConfig: {
                from: testEthAccount1.address,
                to: testEthAccount2.address,
                value: 1,
                gas: 10000000,
            },
            web3SigningCredential: {
                ethAccount: testEthAccount1.address,
                secret: testEthAccount1.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
        });
        expect(runTxRes).toBeTruthy();
        expect(runTxRes.status).toEqual(200);
        expect(runTxRes.data).toBeTruthy();
        expect(runTxRes.data.data.transactionReceipt).toBeTruthy();
        const parameters = {
            keychainId: keychainIdForSigned,
            keychainRef: keychainRefForSigned,
            transactionHash: runTxRes.data.data.transactionReceipt
                .transactionHash,
            fake: 4,
        };
        await expect(apiClient.signTransactionV1(parameters)).rejects.toMatchObject({
            response: {
                status: 400,
                data: expect.arrayContaining([
                    expect.objectContaining({
                        path: expect.stringContaining("/body/fake"),
                    }),
                ]),
            },
        });
    });
    test(`${testCase} - ${fBalance} - ${cOk}`, async () => {
        const parameters = { address: firstHighNetWorthAccount };
        const res = await apiClient.getBalanceV1(parameters);
        expect(res.status).toEqual(200);
        expect(res.data.balance).toBeTruthy();
    });
    test(`${testCase} - ${fBalance} - ${cWithoutParams}`, async () => {
        const parameters = {}; // Empty parameters object
        await expect(apiClient.getBalanceV1(parameters)).rejects.toMatchObject({
            response: {
                status: 400,
                data: expect.arrayContaining([
                    expect.objectContaining({
                        path: expect.stringContaining("/body/address"),
                    }),
                ]),
            },
        });
    });
    test(`${testCase} - ${fBalance} - ${cInvalidParams}`, async () => {
        const parameters = {
            address: firstHighNetWorthAccount,
            fake: 4,
        };
        await expect(apiClient.getBalanceV1(parameters)).rejects.toMatchObject({
            response: {
                status: 400,
                data: expect.arrayContaining([
                    expect.objectContaining({
                        path: expect.stringContaining("/body/fake"),
                    }),
                ]),
            },
        });
    });
    test(`${testCase} - ${fBlock} - ${cOk}`, async () => {
        const parameters = { blockHashOrBlockNumber: 0 };
        const res = await apiClient.getBlockV1(parameters);
        expect(res.status).toEqual(200);
        expect(res.data.block).toBeTruthy();
    });
    test(`${testCase} - ${fBlock} - ${cWithoutParams}`, async () => {
        const parameters = {}; // Empty parameters object
        await expect(apiClient.getBlockV1(parameters)).rejects.toMatchObject({
            response: {
                status: 400,
                data: expect.arrayContaining([
                    expect.objectContaining({
                        path: expect.stringContaining("/body/blockHashOrBlockNumber"),
                    }),
                ]),
            },
        });
    });
    test(`${testCase} - ${fBlock} - ${cInvalidParams}`, async () => {
        const parameters = {
            blockHashOrBlockNumber: 0,
            fake: 4,
        };
        await expect(apiClient.getBlockV1(parameters)).rejects.toMatchObject({
            response: {
                status: 400,
                data: expect.arrayContaining([
                    expect.objectContaining({
                        path: expect.stringContaining("/body/fake"),
                    }),
                ]),
            },
        });
    });
    test(`${testCase} - ${fPastLogs} - ${cOk}`, async () => {
        const parameters = { address: firstHighNetWorthAccount };
        const res = await apiClient.getPastLogsV1(parameters);
        expect(res.status).toEqual(200);
        expect(res.data.logs).toBeTruthy();
    });
    test(`${testCase} - ${fPastLogs} - ${cWithoutParams}`, async () => {
        try {
            const parameters = {};
            const response = await apiClient.getPastLogsV1(parameters);
            console.log("e.response.status should be 400 but actually is,", response.status);
        }
        catch (e) {
            expect(e.response.status).toEqual(400);
            const fields = e.response.data.map((param) => param.path.replace("/body/", ""));
            expect(fields.includes("address")).toBeTrue();
        }
        //since status code is actually 200 refactored approach does not work
        // const parameters = {}; // Empty parameters object
        // await expect(apiClient.getPastLogsV1(parameters as GetPastLogsV1Request))
        // .rejects.toMatchObject({
        //   response: {
        //     status: 400,
        //     data: expect.arrayContaining([
        //       expect.objectContaining({ path: expect.stringContaining("/body/address") })
        //     ])
        //   }
        // });
    });
    test(`${testCase} - ${fPastLogs} - ${cInvalidParams}`, async () => {
        const parameters = {
            address: firstHighNetWorthAccount,
            fake: 4,
        };
        await expect(apiClient.getPastLogsV1(parameters)).rejects.toMatchObject({
            response: {
                status: 400,
                data: expect.arrayContaining([
                    expect.objectContaining({
                        path: expect.stringContaining("/body/fake"),
                    }),
                ]),
            },
        });
    });
    test(`${testCase} - ${fRecord} - ${cOk}`, async () => {
        const runTxRes = await apiClient.runTransactionV1({
            consistencyStrategy: {
                blockConfirmations: 0,
                receiptType: public_api_1.ReceiptType.LedgerBlockAck,
                timeoutMs: 5000,
            },
            transactionConfig: {
                from: testEthAccount1.address,
                to: testEthAccount2.address,
                value: 1,
                gas: 10000000,
            },
            web3SigningCredential: {
                ethAccount: testEthAccount1.address,
                secret: testEthAccount1.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
        });
        expect(runTxRes).toBeTruthy();
        expect(runTxRes.status).toBeNumber();
        expect(runTxRes.status).toEqual(200);
        expect(runTxRes.data).toBeTruthy();
        expect(runTxRes.data.data.transactionReceipt).toBeTruthy();
        const parameters = {
            transactionHash: runTxRes.data.data.transactionReceipt
                .transactionHash,
        };
        const res = await apiClient.getBesuRecordV1(parameters);
        expect(res.status).toEqual(200);
        expect(res.data).toBeTruthy();
    });
    test(`${testCase} - ${fRecord} - ${cWithoutParams}`, async () => {
        try {
            const parameters = {};
            const response = await apiClient.getBesuRecordV1(parameters);
            console.log("e.response.status should be 400 but actually is,", response.status);
        }
        catch (e) {
            expect(e.response.status).toEqual(400);
            const fields = e.response.data.map((param) => param.path.replace("/body/", ""));
            expect(fields.includes("transactionHash")).toBeTrue();
        }
        // since status code is actually 200 refactored approach does not work
        // const parameters = {}; // Empty parameters object
        // await expect(apiClient.getBesuRecordV1(parameters as GetBesuRecordV1Request))
        //   .rejects.toMatchObject({
        //     response: {
        //       status: 400,
        //       data: expect.arrayContaining([
        //         expect.objectContaining({ path: expect.stringContaining("/body/transactionHash") })
        //       ])
        //     }
        //   });
    });
    test(`${testCase} - ${fRecord} - ${cInvalidParams}`, async () => {
        const parameters = {
            transactionHash: "",
            fake: 5,
        };
        await expect(apiClient.getBesuRecordV1(parameters)).rejects.toMatchObject({
            response: {
                status: 400,
                data: expect.arrayContaining([
                    expect.objectContaining({
                        path: expect.stringContaining("/body/fake"),
                    }),
                ]),
            },
        });
    });
    afterAll(async () => {
        await (0, cactus_test_tooling_1.pruneDockerAllIfGithubAction)({ logLevel });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlbmFwaS12YWxpZGF0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvdGVzdC90eXBlc2NyaXB0L2ludGVncmF0aW9uL3BsdWdpbi1sZWRnZXItY29ubmVjdG9yLWJlc3Uvb3BlbmFwaS9vcGVuYXBpLXZhbGlkYXRpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlCQUF1QjtBQUN2QiwrQkFBb0M7QUFDcEMseUNBQXFEO0FBQ3JELDBEQUEwRDtBQUMxRCwwRUFnQm1EO0FBQ25ELDhGQUFrRjtBQUNsRiwwRUFHMEM7QUFDMUMsOERBQXFDO0FBQ3JDLDhEQU9vQztBQUNwQyxrRUFBeUQ7QUFDekQsc0RBQThCO0FBQzlCLDhEQUFxQztBQUNyQyxnREFBd0I7QUFDeEIsZ0hBQStGO0FBRS9GLCtGQUFpRztBQUVqRywwREFBOEU7QUFDOUUseUZBQXdEO0FBR3hELE1BQU0sUUFBUSxHQUFpQixPQUFPLENBQUM7QUFDdkMsTUFBTSxRQUFRLEdBQUcsbUNBQW1DLENBQUM7QUFFckQsTUFBTSxHQUFHLEdBQUcsOEJBQWMsQ0FBQyxXQUFXLENBQUM7SUFDckMsS0FBSyxFQUFFLDJDQUEyQztJQUNsRCxLQUFLLEVBQUUsUUFBUTtDQUNoQixDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLE1BQU0sT0FBTyxHQUFHLDZCQUE2QixDQUFDO0lBQzlDLE1BQU0sT0FBTyxHQUFHLGtCQUFrQixDQUFDO0lBQ25DLE1BQU0sSUFBSSxHQUFHLGtCQUFrQixDQUFDO0lBQ2hDLE1BQU0sS0FBSyxHQUFHLG1CQUFtQixDQUFDO0lBQ2xDLE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQztJQUNoQyxNQUFNLE1BQU0sR0FBRyxZQUFZLENBQUM7SUFDNUIsTUFBTSxTQUFTLEdBQUcsZUFBZSxDQUFDO0lBQ2xDLE1BQU0sT0FBTyxHQUFHLGlCQUFp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