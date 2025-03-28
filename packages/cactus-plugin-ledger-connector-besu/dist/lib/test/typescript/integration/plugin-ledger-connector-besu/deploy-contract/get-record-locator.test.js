"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest-extended");
const uuid_1 = require("uuid");
const web3_1 = __importDefault(require("web3"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cactus_core_1 = require("@hyperledger/cactus-core");
const public_api_1 = require("../../../../../main/typescript/public-api");
const cactus_plugin_keychain_memory_1 = require("@hyperledger/cactus-plugin-keychain-memory");
const cactus_test_tooling_1 = require("@hyperledger/cactus-test-tooling");
const cactus_common_1 = require("@hyperledger/cactus-common");
const HelloWorld_json_1 = __importDefault(require("../../../../solidity/hello-world-contract/HelloWorld.json"));
const cactus_core_api_1 = require("@hyperledger/cactus-core-api");
const logLevel = "INFO";
describe("PluginLedgerConnectorBesu", () => {
    const log = cactus_common_1.LoggerProvider.getOrCreate({
        label: "besu-get-record-locator.test.ts",
        level: logLevel,
    });
    const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger();
    let api;
    let firstHighNetWorthAccount;
    let besuKeyPair;
    let server;
    let connector;
    let testEthAccount;
    let web3;
    let keychainPlugin;
    let contractAddress;
    beforeAll(async () => {
        const pruning = (0, cactus_test_tooling_1.pruneDockerAllIfGithubAction)({ logLevel });
        await expect(pruning).not.toReject();
    });
    afterAll(async () => {
        const pruning = (0, cactus_test_tooling_1.pruneDockerAllIfGithubAction)({ logLevel });
        await expect(pruning).toResolve();
    });
    beforeAll(async () => {
        await besuTestLedger.start();
    });
    afterAll(async () => {
        await besuTestLedger.stop();
        await besuTestLedger.destroy();
    });
    afterAll(async () => {
        if (server) {
            await cactus_common_1.Servers.shutdown(server);
        }
    });
    beforeAll(async () => {
        const rpcApiHttpHost = await besuTestLedger.getRpcApiHttpHost();
        const rpcApiWsHost = await besuTestLedger.getRpcApiWsHost();
        firstHighNetWorthAccount = besuTestLedger.getGenesisAccountPubKey();
        besuKeyPair = {
            privateKey: besuTestLedger.getGenesisAccountPrivKey(),
        };
        web3 = new web3_1.default(rpcApiHttpHost);
        testEthAccount = web3.eth.accounts.create((0, uuid_1.v4)());
        const keychainEntryKey = (0, uuid_1.v4)();
        const keychainEntryValue = testEthAccount.privateKey;
        keychainPlugin = new cactus_plugin_keychain_memory_1.PluginKeychainMemory({
            instanceId: (0, uuid_1.v4)(),
            keychainId: (0, uuid_1.v4)(),
            // pre-provision keychain with mock backend holding the private key of the
            // test account that we'll reference while sending requests with the
            // signing credential pointing to this keychain entry.
            backend: new Map([[keychainEntryKey, keychainEntryValue]]),
            logLevel,
        });
        keychainPlugin.set(HelloWorld_json_1.default.contractName, JSON.stringify(HelloWorld_json_1.default));
        const factory = new public_api_1.PluginFactoryLedgerConnector({
            pluginImportType: cactus_core_api_1.PluginImportType.Local,
        });
        connector = await factory.create({
            rpcApiHttpHost,
            rpcApiWsHost,
            logLevel,
            instanceId: (0, uuid_1.v4)(),
            pluginRegistry: new cactus_core_1.PluginRegistry({ plugins: [keychainPlugin] }),
        });
        await connector.onPluginInit();
        const expressApp = (0, express_1.default)();
        expressApp.use(body_parser_1.default.json({ limit: "250mb" }));
        server = http_1.default.createServer(expressApp);
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
        log.debug(`Metrics URL: ${apiHost}/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/get-prometheus-exporter-metrics`);
        const wsBasePath = apiHost + cactus_core_api_1.Constants.SocketIoConnectionPathV1;
        log.debug("WS base path: " + wsBasePath);
        const besuApiClientOptions = new public_api_1.BesuApiClientOptions({
            basePath: apiHost,
        });
        api = new public_api_1.BesuApiClient(besuApiClientOptions);
        await connector.getOrCreateWebServices();
        await connector.registerWebServices(expressApp, wsApi);
    });
    it("can get record locator from Besu ledger", async () => {
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
            },
        });
        const balance = await web3.eth.getBalance(testEthAccount.address);
        expect(balance).toBeTruthy();
        expect(parseInt(balance, 10)).toEqual(10e9);
    });
    it("deploys contract", async () => {
        const deployOut = await connector.deployContract({
            keychainId: keychainPlugin.getKeychainId(),
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
        expect(deployOut.transactionReceipt).toBeTruthy();
        expect(deployOut.transactionReceipt.contractAddress).toBeTruthy();
        contractAddress = deployOut.transactionReceipt.contractAddress;
        expect(contractAddress).toBeString();
        expect(contractAddress).not.toBeEmpty();
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
    test("getBesuRecord test 1", async () => {
        const testEthAccount2 = web3.eth.accounts.create((0, uuid_1.v4)());
        const { rawTransaction } = await web3.eth.accounts.signTransaction({
            from: testEthAccount.address,
            to: testEthAccount2.address,
            value: 10e6,
            gas: 1000000,
        }, testEthAccount.privateKey);
        const transactionReceipt = await connector.transact({
            web3SigningCredential: {
                type: public_api_1.Web3SigningCredentialType.None,
            },
            consistencyStrategy: {
                blockConfirmations: 0,
                receiptType: public_api_1.ReceiptType.NodeTxPoolAck,
            },
            transactionConfig: {
                rawTransaction,
            },
        });
        const request = {
            transactionHash: transactionReceipt.transactionReceipt.transactionHash,
        };
        const getInputData = await api.getBesuRecordV1(request);
        expect(getInputData).toBeTruthy();
    });
    test("getBesuRecord test 2", async () => {
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
        await expect(connector.invokeContract({
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
        })).rejects.toThrowError(expect.objectContaining({
            message: expect.stringContaining("Nonce too low"),
            stack: expect.stringContaining("Nonce too low"),
        }));
        const req = {
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
        };
        const { callOutput: getNameOut } = await connector.getBesuRecord({
            invokeCall: req,
        });
        expect(getNameOut).toEqual(newName);
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
        const req2 = {
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
        };
        const { callOutput } = await connector.getBesuRecord({
            invokeCall: req2,
        });
        expect(callOutput).toEqual(newName);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXJlY29yZC1sb2NhdG9yLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvdGVzdC90eXBlc2NyaXB0L2ludGVncmF0aW9uL3BsdWdpbi1sZWRnZXItY29ubmVjdG9yLWJlc3UvZGVwbG95LWNvbnRyYWN0L2dldC1yZWNvcmQtbG9jYXRvci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseUJBQXVCO0FBQ3ZCLCtCQUFvQztBQUNwQyxnREFBd0I7QUFFeEIsc0RBQThCO0FBQzlCLDhEQUFxQztBQUNyQyxnREFBd0I7QUFDeEIseUNBQXFEO0FBR3JELDBEQUEwRDtBQUMxRCwwRUFVbUQ7QUFDbkQsOEZBQWtGO0FBQ2xGLDBFQUcwQztBQUMxQyw4REFLb0M7QUFDcEMsZ0hBQStGO0FBQy9GLGtFQUEyRTtBQUUzRSxNQUFNLFFBQVEsR0FBaUIsTUFBTSxDQUFDO0FBRXRDLFFBQVEsQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7SUFDekMsTUFBTSxHQUFHLEdBQUcsOEJBQWMsQ0FBQyxXQUFXLENBQUM7UUFDckMsS0FBSyxFQUFFLGlDQUFpQztRQUN4QyxLQUFLLEVBQUUsUUFBUTtLQUNoQixDQUFDLENBQUM7SUFDSCxNQUFNLGNBQWMsR0FBRyxJQUFJLG9DQUFjLEVBQUUsQ0FBQztJQUM1QyxJQUFJLEdBQWtCLENBQUM7SUFDdkIsSUFBSSx3QkFBZ0MsQ0FBQztJQUNyQyxJQUFJLFdBRUgsQ0FBQztJQUNGLElBQUksTUFBbUIsQ0FBQztJQUN4QixJQUFJLFNBQW9DLENBQUM7SUFDekMsSUFBSSxjQUF1QixDQUFDO0lBQzVCLElBQUksSUFBVSxDQUFDO0lBQ2YsSUFBSSxjQUFvQyxDQUFDO0lBQ3pDLElBQUksZUFBdUIsQ0FBQztJQUU1QixTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDbkIsTUFBTSxPQUFPLEdBQUcsSUFBQSxrREFBNEIsRUFBQyxFQUFFLFFBQVEs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