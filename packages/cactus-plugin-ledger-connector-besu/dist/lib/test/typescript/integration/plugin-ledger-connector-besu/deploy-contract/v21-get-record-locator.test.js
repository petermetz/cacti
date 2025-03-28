"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tape_1 = __importDefault(require("tape-promise/tape"));
const uuid_1 = require("uuid");
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
const socket_io_1 = require("socket.io");
const testCase = "get record locator";
const logLevel = "TRACE";
(0, tape_1.default)("BEFORE " + testCase, async (t) => {
    const pruning = (0, cactus_test_tooling_1.pruneDockerAllIfGithubAction)({ logLevel });
    await t.doesNotReject(pruning, "Pruning didn't throw OK");
    t.end();
});
(0, tape_1.default)(testCase, async (t) => {
    const containerImageVersion = "2021-08-24--feat-1244";
    const containerImageName = "ghcr.io/hyperledger/cactus-besu-21-1-6-all-in-one";
    const besuOptions = { containerImageName, containerImageVersion };
    const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger(besuOptions);
    await besuTestLedger.start();
    tape_1.default.onFinish(async () => {
        await besuTestLedger.stop();
        await besuTestLedger.destroy();
    });
    const rpcApiHttpHost = await besuTestLedger.getRpcApiHttpHost();
    const rpcApiWsHost = await besuTestLedger.getRpcApiWsHost();
    /**
     * Constant defining the standard 'dev' Besu genesis.json contents.
     *
     * @see https://github.com/hyperledger/besu/blob/21.1.6/config/src/main/resources/dev.json
     */
    const firstHighNetWorthAccount = besuTestLedger.getGenesisAccountPubKey();
    const besuKeyPair = {
        privateKey: besuTestLedger.getGenesisAccountPrivKey(),
    };
    const web3 = new web3_1.default(rpcApiHttpHost);
    const testEthAccount = web3.eth.accounts.create((0, uuid_1.v4)());
    const keychainEntryKey = (0, uuid_1.v4)();
    const keychainEntryValue = testEthAccount.privateKey;
    const keychainPlugin = new cactus_plugin_keychain_memory_1.PluginKeychainMemory({
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
    const connector = await factory.create({
        rpcApiHttpHost,
        rpcApiWsHost,
        logLevel,
        instanceId: (0, uuid_1.v4)(),
        pluginRegistry: new cactus_core_1.PluginRegistry({ plugins: [keychainPlugin] }),
    });
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
    tape_1.default.onFinish(async () => await cactus_common_1.Servers.shutdown(server));
    const { address, port } = addressInfo;
    const apiHost = `http://${address}:${port}`;
    t.comment(`Metrics URL: ${apiHost}/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-besu/get-prometheus-exporter-metrics`);
    const wsBasePath = apiHost + cactus_core_api_1.Constants.SocketIoConnectionPathV1;
    t.comment("WS base path: " + wsBasePath);
    const besuApiClientOptions = new public_api_1.BesuApiClientOptions({ basePath: apiHost });
    const api = new public_api_1.BesuApiClient(besuApiClientOptions);
    await connector.getOrCreateWebServices();
    await connector.registerWebServices(expressApp, wsApi);
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
    t.ok(balance, "Retrieved balance of test account OK");
    t.equals(parseInt(balance, 10), 10e9, "Balance of test account is OK");
    let contractAddress;
    (0, tape_1.default)("deploys contract", async (t2) => {
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
        t2.ok(deployOut, "deployContract() output is truthy OK");
        t2.ok(deployOut.transactionReceipt, "deployContract() output.transactionReceipt is truthy OK");
        t2.ok(deployOut.transactionReceipt.contractAddress, "deployContract() output.transactionReceipt.contractAddress is truthy OK");
        contractAddress = deployOut.transactionReceipt.contractAddress;
        t2.ok(typeof contractAddress === "string", "contractAddress typeof string OK");
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
        t2.ok(helloMsg, "sayHello() output is truthy");
        t2.true(typeof helloMsg === "string", "sayHello() output is type of string");
    });
    (0, tape_1.default)("getBesuRecord test 1", async (t2) => {
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
        t2.ok(getInputData, "API response object is truthy");
        t2.end();
    });
    (0, tape_1.default)("getBesuRecord test 2", async (t2) => {
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
        t2.ok(setNameOut, "setName() invocation #1 output is truthy OK");
        try {
            const setNameOutInvalid = await connector.invokeContract({
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
            t2.ifError(setNameOutInvalid);
        }
        catch (error) {
            t2.notStrictEqual(error, "Nonce too low", "setName() invocation with invalid nonce");
        }
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
        t2.equal(getNameOut, newName, `getName() output reflects the update OK`);
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
        t2.ok(response, "deposit() payable invocation output is truthy OK");
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
        const { callOutput } = await connector.getBesuRecord({ invokeCall: req2 });
        t2.equal(callOutput, newName, `getNameByIndex() output reflects the update OK`);
        t2.end();
    });
    t.end();
});
(0, tape_1.default)("AFTER " + testCase, async (t) => {
    const pruning = (0, cactus_test_tooling_1.pruneDockerAllIfGithubAction)({ logLevel });
    await t.doesNotReject(pruning, "Pruning didn't throw OK");
    t.end();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidjIxLWdldC1yZWNvcmQtbG9jYXRvci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3Rlc3QvdHlwZXNjcmlwdC9pbnRlZ3JhdGlvbi9wbHVnaW4tbGVkZ2VyLWNvbm5lY3Rvci1iZXN1L2RlcGxveS1jb250cmFjdC92MjEtZ2V0LXJlY29yZC1sb2NhdG9yLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw2REFBK0M7QUFDL0MsK0JBQW9DO0FBQ3BDLDBEQUEwRDtBQUMxRCwwRUFVbUQ7QUFDbkQsOEZBQWtGO0FBQ2xGLDBFQUcwQztBQUMxQyw4REFJb0M7QUFDcEMsZ0hBQStGO0FBQy9GLGdEQUF3QjtBQUN4QixrRUFBMkU7QUFFM0Usc0RBQThCO0FBQzlCLDhEQUFxQztBQUNyQyxnREFBd0I7QUFDeEIseUNBQXFEO0FBRXJELE1BQU0sUUFBUSxHQUFHLG9CQUFvQixDQUFDO0FBQ3RDLE1BQU0sUUFBUSxHQUFpQixPQUFPLENBQUM7QUFFdkMsSUFBQSxjQUFJLEVBQUMsU0FBUyxHQUFHLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBTyxFQUFFLEVBQUU7SUFDM0MsTUFBTSxPQUFPLEdBQUcsSUFBQSxrREFBNEIsRUFBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFDM0QsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0lBQzFELENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNWLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBQSxjQUFJLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFPLEVBQUUsRUFBRTtJQUMvQixNQUFNLHFCQUFxQixHQUFHLHVCQUF1QixDQUFDO0lBQ3RELE1BQU0sa0JBQWtCLEdBQ3RCLG1EQUFtRCxDQUFDO0lBQ3RELE1BQU0sV0FBVyxHQUFHLEVBQUUsa0JBQWtCLEVBQUUscUJBQXFCLEVBQUUs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