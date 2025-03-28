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
const cactus_common_1 = require("@hyperledger/cactus-common");
const HelloWorld_json_1 = __importDefault(require("../../../../solidity/hello-world-contract/HelloWorld.json"));
const web3_1 = __importDefault(require("web3"));
const cactus_core_api_1 = require("@hyperledger/cactus-core-api");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const metrics_1 = require("../../../../../main/typescript/prometheus-exporter/metrics");
const besu_api_client_1 = require("../../../../../main/typescript/api-client/besu-api-client");
describe("PluginLedgerConnectorBesu", () => {
    const testCase = "deploys contract via .json file";
    const logLevel = "INFO";
    const containerImageVersion = "2021-08-24--feat-1244";
    const containerImageName = "ghcr.io/hyperledger/cactus-besu-21-1-6-all-in-one";
    const besuOptions = { containerImageName, containerImageVersion };
    const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger(besuOptions);
    const besuKeyPair = {
        privateKey: besuTestLedger.getGenesisAccountPrivKey(),
    };
    const keychainEntryKey = (0, uuid_1.v4)();
    const keychainPlugin = new cactus_plugin_keychain_memory_1.PluginKeychainMemory({
        instanceId: (0, uuid_1.v4)(),
        keychainId: (0, uuid_1.v4)(),
        // pre-provision keychain with mock backend holding the private key of the
        // test account that we'll reference while sending requests with the
        // signing credential pointing to this keychain entry.
        backend: new Map(),
        logLevel,
    });
    const factory = new public_api_1.PluginFactoryLedgerConnector({
        pluginImportType: cactus_core_api_1.PluginImportType.Local,
    });
    const expressApp = (0, express_1.default)();
    expressApp.use(body_parser_1.default.json({ limit: "250mb" }));
    const server = http_1.default.createServer(expressApp);
    const pluginRegistry = new cactus_core_1.PluginRegistry({ plugins: [keychainPlugin] });
    const wsApi = new socket_io_1.Server(server, {
        path: cactus_core_api_1.Constants.SocketIoConnectionPathV1,
    });
    const listenOptions = {
        hostname: "127.0.0.1",
        port: 0,
        server,
    };
    let rpcApiHttpHost;
    let rpcApiWsHost;
    let firstHighNetWorthAccount;
    let web3;
    let testEthAccount;
    let keychainEntryValue;
    let connector;
    let addressInfo;
    let apiClient;
    let apiHost;
    let contractAddress;
    beforeAll(async () => {
        await (0, cactus_test_tooling_1.pruneDockerAllIfGithubAction)({ logLevel });
    });
    beforeAll(async () => {
        await besuTestLedger.start();
        rpcApiHttpHost = await besuTestLedger.getRpcApiHttpHost();
        rpcApiWsHost = await besuTestLedger.getRpcApiWsHost();
        firstHighNetWorthAccount = besuTestLedger.getGenesisAccountPubKey();
        web3 = new web3_1.default(rpcApiHttpHost);
        testEthAccount = web3.eth.accounts.create((0, uuid_1.v4)());
        keychainEntryValue = testEthAccount.privateKey;
        keychainPlugin.set(keychainEntryKey, keychainEntryValue);
        addressInfo = await cactus_common_1.Servers.listen(listenOptions);
        connector = await factory.create({
            rpcApiHttpHost,
            rpcApiWsHost,
            logLevel,
            instanceId: (0, uuid_1.v4)(),
            pluginRegistry,
        });
        const { address, port } = addressInfo;
        apiHost = `http://${address}:${port}`;
        const besuApiClientOptions = new besu_api_client_1.BesuApiClientOptions({
            basePath: apiHost,
        });
        apiClient = new public_api_1.BesuApiClient(besuApiClientOptions);
        await connector.getOrCreateWebServices();
        await connector.registerWebServices(expressApp, wsApi);
    });
    afterAll(async () => {
        await cactus_common_1.Servers.shutdown(server);
    });
    afterAll(async () => {
        await besuTestLedger.stop();
        await besuTestLedger.destroy();
    });
    afterAll(async () => {
        await (0, cactus_test_tooling_1.pruneDockerAllIfGithubAction)({ logLevel });
    });
    test(testCase, async () => {
        await connector.transact({
            web3SigningCredential: {
                ethAccount: firstHighNetWorthAccount,
                secret: besuKeyPair.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            transactionConfig: {
                from: firstHighNetWorthAccount,
                to: testEthAccount.address,
                value: 10e9,
                gas: 1000000,
            },
            consistencyStrategy: {
                blockConfirmations: 0,
                receiptType: public_api_1.ReceiptType.NodeTxPoolAck,
                timeoutMs: 60000,
            },
        });
        const blocks = await apiClient.watchBlocksV1();
        const aBlockHeader = await new Promise((resolve, reject) => {
            let done = false;
            const timerId = setTimeout(() => {
                if (!done) {
                    reject("Waiting for block header notification to arrive timed out");
                }
            }, 10000);
            const subscription = blocks.subscribe((res) => {
                subscription.unsubscribe();
                done = true;
                clearTimeout(timerId);
                resolve(res.blockHeader);
            });
        });
        expect(aBlockHeader).toBeTruthy();
        expect(aBlockHeader).toBeObject();
        expect(aBlockHeader).not.toBeEmptyObject();
        const balance = await web3.eth.getBalance(testEthAccount.address);
        expect(balance).toBeTruthy();
        expect(parseInt(balance, 10)).toEqual(10e9);
    });
    test("deploys contract via .json file", async () => {
        const deployOut = await connector.deployContractNoKeychain({
            contractName: HelloWorld_json_1.default.contractName,
            contractAbi: HelloWorld_json_1.default.abi,
            constructorArgs: [],
            web3SigningCredential: {
                ethAccount: firstHighNetWorthAccount,
                secret: besuKeyPair.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            bytecode: HelloWorld_json_1.default.bytecode,
            gas: 1000000,
        });
        expect(deployOut).toBeTruthy();
        expect(deployOut).toBeObject();
        expect(deployOut.transactionReceipt).toBeTruthy();
        expect(deployOut.transactionReceipt).toBeObject();
        expect(deployOut.transactionReceipt.contractAddress).toBeTruthy();
        expect(deployOut.transactionReceipt.contractAddress).toBeString();
        contractAddress = deployOut.transactionReceipt.contractAddress;
        const { callOutput: helloMsg } = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            contractAbi: HelloWorld_json_1.default.abi,
            contractAddress,
            invocationType: public_api_1.EthContractInvocationType.Call,
            methodName: "sayHello",
            params: [],
            signingCredential: {
                ethAccount: firstHighNetWorthAccount,
                secret: besuKeyPair.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
        });
        expect(helloMsg).toBeTruthy();
        expect(helloMsg).toBeString();
        expect(helloMsg).not.toBeEmpty();
    });
    test("invoke Web3SigningCredentialType.NONE", async () => {
        const testEthAccount2 = web3.eth.accounts.create((0, uuid_1.v4)());
        const { rawTransaction } = await web3.eth.accounts.signTransaction({
            from: testEthAccount.address,
            to: testEthAccount2.address,
            value: 10e6,
            gas: 1000000,
        }, testEthAccount.privateKey);
        await connector.transact({
            web3SigningCredential: {
                type: public_api_1.Web3SigningCredentialType.None,
            },
            transactionConfig: {
                rawTransaction,
            },
            consistencyStrategy: {
                blockConfirmations: 0,
                receiptType: public_api_1.ReceiptType.NodeTxPoolAck,
                timeoutMs: 60000,
            },
        });
        const balance2 = await web3.eth.getBalance(testEthAccount2.address);
        expect(parseInt(balance2, 10)).toEqual(10e6);
    });
    test("invoke Web3SigningCredentialType.PrivateKeyHex", async () => {
        const newName = `DrCactus${(0, uuid_1.v4)()}`;
        const setNameOut = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            contractAbi: HelloWorld_json_1.default.abi,
            contractAddress,
            invocationType: public_api_1.EthContractInvocationType.Send,
            methodName: "setName",
            params: [newName],
            signingCredential: {
                ethAccount: testEthAccount.address,
                secret: testEthAccount.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            nonce: 1,
        });
        expect(setNameOut).toBeTruthy();
        const setNameOutPromise1 = connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            contractAbi: HelloWorld_json_1.default.abi,
            contractAddress,
            invocationType: public_api_1.EthContractInvocationType.Send,
            methodName: "setName",
            params: [newName],
            gas: 1000000,
            signingCredential: {
                ethAccount: testEthAccount.address,
                secret: testEthAccount.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            nonce: 1,
        });
        await expect(setNameOutPromise1).rejects.toMatchObject({
            message: expect.stringContaining("Nonce too low"),
        });
        const { callOutput: getNameOut } = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            contractAbi: HelloWorld_json_1.default.abi,
            contractAddress,
            invocationType: public_api_1.EthContractInvocationType.Call,
            methodName: "getName",
            params: [],
            gas: 1000000,
            signingCredential: {
                ethAccount: testEthAccount.address,
                secret: testEthAccount.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
        });
        expect(getNameOut).toEqual(newName);
        const getNameOut2 = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            contractAbi: HelloWorld_json_1.default.abi,
            contractAddress,
            invocationType: public_api_1.EthContractInvocationType.Send,
            methodName: "getName",
            params: [],
            gas: 1000000,
            signingCredential: {
                ethAccount: testEthAccount.address,
                secret: testEthAccount.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
        });
        expect(getNameOut2).toBeTruthy();
        const response = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            contractAbi: HelloWorld_json_1.default.abi,
            contractAddress,
            invocationType: public_api_1.EthContractInvocationType.Send,
            methodName: "deposit",
            params: [],
            gas: 1000000,
            signingCredential: {
                ethAccount: testEthAccount.address,
                secret: testEthAccount.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            value: 10,
        });
        expect(response).toBeTruthy();
        const { callOutput } = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            contractAbi: HelloWorld_json_1.default.abi,
            contractAddress,
            invocationType: public_api_1.EthContractInvocationType.Call,
            methodName: "getNameByIndex",
            params: [0],
            gas: 1000000,
            signingCredential: {
                ethAccount: testEthAccount.address,
                secret: testEthAccount.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
        });
        expect(callOutput).toEqual(newName);
    });
    test("invoke Web3SigningCredentialType.CactusKeychainRef", async () => {
        const newName = `DrCactus${(0, uuid_1.v4)()}`;
        const signingCredential = {
            ethAccount: testEthAccount.address,
            keychainEntryKey,
            keychainId: keychainPlugin.getKeychainId(),
            type: public_api_1.Web3SigningCredentialType.CactusKeychainRef,
        };
        const setNameOut = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            contractAbi: HelloWorld_json_1.default.abi,
            contractAddress,
            invocationType: public_api_1.EthContractInvocationType.Send,
            methodName: "setName",
            params: [newName],
            gas: 1000000,
            signingCredential,
            nonce: 4,
        });
        expect(setNameOut).toBeTruthy();
        const setNameOutPromise2 = connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            contractAbi: HelloWorld_json_1.default.abi,
            contractAddress,
            invocationType: public_api_1.EthContractInvocationType.Send,
            methodName: "setName",
            params: [newName],
            gas: 1000000,
            signingCredential,
            nonce: 4,
        });
        await expect(setNameOutPromise2).rejects.toMatchObject({
            message: expect.stringContaining("Nonce too low"),
        });
        const { callOutput: getNameOut } = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            contractAbi: HelloWorld_json_1.default.abi,
            contractAddress,
            invocationType: public_api_1.EthContractInvocationType.Call,
            methodName: "getName",
            params: [],
            gas: 1000000,
            signingCredential,
        });
        expect(getNameOut).toEqual(newName);
        const getNameOut2 = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            contractAbi: HelloWorld_json_1.default.abi,
            contractAddress,
            invocationType: public_api_1.EthContractInvocationType.Send,
            methodName: "getName",
            params: [],
            gas: 1000000,
            signingCredential,
        });
        expect(getNameOut2).toBeTruthy();
        const response = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            contractAbi: HelloWorld_json_1.default.abi,
            contractAddress,
            invocationType: public_api_1.EthContractInvocationType.Send,
            methodName: "deposit",
            params: [],
            gas: 1000000,
            signingCredential,
            value: 10,
        });
        expect(response).toBeTruthy();
        const { callOutput } = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            contractAbi: HelloWorld_json_1.default.abi,
            contractAddress,
            invocationType: public_api_1.EthContractInvocationType.Call,
            methodName: "getNameByIndex",
            params: [1],
            gas: 1000000,
            signingCredential,
        });
        expect(callOutput).toEqual(newName);
    });
    test("get prometheus exporter metrics", async () => {
        const res = await apiClient.getPrometheusMetricsV1();
        const promMetricsOutput = "# HELP " +
            metrics_1.K_CACTUS_BESU_TOTAL_TX_COUNT +
            " Total transactions executed\n" +
            "# TYPE " +
            metrics_1.K_CACTUS_BESU_TOTAL_TX_COUNT +
            " gauge\n" +
            metrics_1.K_CACTUS_BESU_TOTAL_TX_COUNT +
            '{type="' +
            metrics_1.K_CACTUS_BESU_TOTAL_TX_COUNT +
            '"} 9';
        expect(res).toBeTruthy();
        expect(res.data).toBeTruthy();
        expect(res.status).toEqual(200);
        expect(res.data.includes(promMetricsOutput)).toBeTrue();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidjIxLWRlcGxveS1jb250cmFjdC1mcm9tLWpzb24tbm8ta2V5Y2hhaW4udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy90ZXN0L3R5cGVzY3JpcHQvaW50ZWdyYXRpb24vcGx1Z2luLWxlZGdlci1jb25uZWN0b3ItYmVzdS9kZXBsb3ktY29udHJhY3QvdjIxLWRlcGxveS1jb250cmFjdC1mcm9tLWpzb24tbm8ta2V5Y2hhaW4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlCQUF1QjtBQUN2QiwrQkFBb0M7QUFDcEMseUNBQXFEO0FBQ3JELDBEQUEwRDtBQUMxRCwwRUFVbUQ7QUFDbkQsOEZBQWtGO0FBQ2xGLDBFQUcwQztBQUMxQyw4REFJb0M7QUFDcEMsZ0hBQStGO0FBQy9GLGdEQUF3QjtBQUN4QixrRUFBMkU7QUFDM0Usc0RBQThCO0FBQzlCLDhEQUFxQztBQUNyQyxnREFBd0I7QUFFeEIsd0ZBQTBHO0FBQzFHLCtGQUFpRztBQUdqRyxRQUFRLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLE1BQU0sUUFBUSxHQUFHLGlDQUFpQyxDQUFDO0lBQ25ELE1BQU0sUUFBUSxHQUFpQixNQUFNLENBQUM7SUFDdEMsTUFBTSxxQkFBcUIsR0FBRyx1QkFBdUIsQ0FBQztJQUN0RCxNQUFNLGtCQUFrQixHQUN0QixtREFBbUQsQ0FBQztJQUN0RCxNQUFNLFdBQVcsR0FBRyxFQUFFLGtCQUFrQixFQUFFLHFCQUFxQixFQUFFLENBQUM7SUFDbEUsTUFBTSxjQUFjLEdBQUcsSUFBSSxvQ0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sV0FBVyxHQUFHO1FBQ2xCLFVBQVUsRUFBRSxjQUFjLENBQUMsd0JBQXdCLEVBQUU7S0FDdEQsQ0FBQztJQUNGLE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxTQUFNLEdBQUUsQ0FBQztJQUVsQyxNQUFNLGNBQWMsR0FBRyxJ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