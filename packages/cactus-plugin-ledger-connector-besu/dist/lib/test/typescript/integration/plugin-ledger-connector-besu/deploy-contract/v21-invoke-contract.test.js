"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest-extended");
const uuid_1 = require("uuid");
const cactus_core_1 = require("@hyperledger/cactus-core");
const public_api_1 = require("../../../../../main/typescript/public-api");
const cactus_plugin_keychain_memory_1 = require("@hyperledger/cactus-plugin-keychain-memory");
const cactus_test_tooling_1 = require("@hyperledger/cactus-test-tooling");
const HelloWorld_json_1 = __importDefault(require("../../../../solidity/hello-world-contract/HelloWorld.json"));
const web3_1 = __importDefault(require("web3"));
const cactus_core_api_1 = require("@hyperledger/cactus-core-api");
describe("PluginLedgerConnectorBesu", () => {
    const logLevel = "TRACE";
    const containerImageVersion = "2021-08-24--feat-1244";
    const containerImageName = "ghcr.io/hyperledger/cactus-besu-21-1-6-all-in-one";
    const besuOptions = { containerImageName, containerImageVersion };
    const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger(besuOptions);
    const keychainEntryKey = (0, uuid_1.v4)();
    let rpcApiHttpHost;
    let rpcApiWsHost;
    let web3;
    let testEthAccount;
    let contractAddress;
    let firstHighNetWorthAccount;
    let connector;
    let keychainPlugin;
    let besuKeyPair;
    beforeAll(async () => {
        await besuTestLedger.start();
    });
    beforeAll(async () => {
        rpcApiHttpHost = await besuTestLedger.getRpcApiHttpHost();
        rpcApiWsHost = await besuTestLedger.getRpcApiWsHost();
        web3 = new web3_1.default(rpcApiHttpHost);
        testEthAccount = web3.eth.accounts.create((0, uuid_1.v4)());
        /**
         * Constant defining the standard 'dev' Besu genesis.json contents.
         *
         * @see https://github.com/hyperledger/besu/blob/21.1.6/config/src/main/resources/dev.json
         */
        firstHighNetWorthAccount = besuTestLedger.getGenesisAccountPubKey();
        besuKeyPair = {
            privateKey: besuTestLedger.getGenesisAccountPrivKey(),
        };
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
            instanceId: (0, uuid_1.v4)(),
            pluginRegistry: new cactus_core_1.PluginRegistry({ plugins: [keychainPlugin] }),
        });
        await connector.transact({
            web3SigningCredential: {
                ethAccount: firstHighNetWorthAccount,
                secret: besuKeyPair.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            consistencyStrategy: {
                blockConfirmations: 0,
                receiptType: public_api_1.ReceiptType.NodeTxPoolAck,
            },
            transactionConfig: {
                from: firstHighNetWorthAccount,
                to: testEthAccount.address,
                value: 10e9,
                gas: 1000000,
            },
        });
        const balance = await web3.eth.getBalance(testEthAccount.address);
        expect(balance).toBeTruthy();
        expect(parseInt(balance, 10)).toEqual(10e9);
    });
    afterAll(async () => {
        await besuTestLedger.stop();
        await besuTestLedger.destroy();
    });
    it("deploys contract via .json file", async () => {
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
            keychainId: keychainPlugin.getKeychainId(),
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
    it("invokes contracts with Web3SigningCredentialType.NONE", async () => {
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
            consistencyStrategy: {
                blockConfirmations: 0,
                receiptType: public_api_1.ReceiptType.NodeTxPoolAck,
            },
            transactionConfig: {
                rawTransaction,
            },
        });
        const balance2 = await web3.eth.getBalance(testEthAccount2.address);
        expect(balance2).toBeTruthy();
        expect(parseInt(balance2, 10)).toEqual(10e6);
    });
    it("invokes contracts with Web3SigningCredentialType.PrivateKeyHex", async () => {
        const newName = `DrCactus${(0, uuid_1.v4)()}`;
        const setNameOut = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            keychainId: keychainPlugin.getKeychainId(),
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
        expect(setNameOut).toBeObject();
        const setNameOutInvalidTask = connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            keychainId: keychainPlugin.getKeychainId(),
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
        expect(setNameOutInvalidTask).rejects.toThrowWithMessage(Error, "Returned error: Nonce too low");
        const { callOutput: getNameOut } = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            keychainId: keychainPlugin.getKeychainId(),
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
            keychainId: keychainPlugin.getKeychainId(),
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
            keychainId: keychainPlugin.getKeychainId(),
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
            keychainId: keychainPlugin.getKeychainId(),
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
    it("invokes contracts with Web3SigningCredentialType.CactusKeychainRef", async () => {
        const newName = `DrCactus${(0, uuid_1.v4)()}`;
        const signingCredential = {
            ethAccount: testEthAccount.address,
            keychainEntryKey,
            keychainId: keychainPlugin.getKeychainId(),
            type: public_api_1.Web3SigningCredentialType.CactusKeychainRef,
        };
        const setNameOut = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            keychainId: keychainPlugin.getKeychainId(),
            invocationType: public_api_1.EthContractInvocationType.Send,
            methodName: "setName",
            params: [newName],
            gas: 1000000,
            signingCredential,
            nonce: 4,
        });
        expect(setNameOut).toBeTruthy();
        const setNameOutInvalidTask = connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            keychainId: keychainPlugin.getKeychainId(),
            invocationType: public_api_1.EthContractInvocationType.Send,
            methodName: "setName",
            params: [newName],
            gas: 1000000,
            signingCredential,
            nonce: 4,
        });
        await expect(setNameOutInvalidTask).rejects.toThrowWithMessage(Error, "Returned error: Nonce too low");
        const { callOutput: getNameOut } = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            keychainId: keychainPlugin.getKeychainId(),
            invocationType: public_api_1.EthContractInvocationType.Call,
            methodName: "getName",
            params: [],
            gas: 1000000,
            signingCredential,
        });
        expect(getNameOut).toEqual(newName);
        const getNameOut2 = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            keychainId: keychainPlugin.getKeychainId(),
            invocationType: public_api_1.EthContractInvocationType.Send,
            methodName: "getName",
            params: [],
            gas: 1000000,
            signingCredential,
        });
        expect(getNameOut2).toBeTruthy();
        const response = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            keychainId: keychainPlugin.getKeychainId(),
            invocationType: public_api_1.EthContractInvocationType.Send,
            methodName: "deposit",
            params: [],
            gas: 1000000,
            signingCredential,
            value: 10,
        });
        expect(response).toBeTruthy();
        const { callOutput: callOut } = await connector.invokeContract({
            contractName: HelloWorld_json_1.default.contractName,
            keychainId: keychainPlugin.getKeychainId(),
            invocationType: public_api_1.EthContractInvocationType.Call,
            methodName: "getNameByIndex",
            params: [1],
            gas: 1000000,
            signingCredential,
        });
        expect(callOut).toEqual(newName);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidjIxLWludm9rZS1jb250cmFjdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3Rlc3QvdHlwZXNjcmlwdC9pbnRlZ3JhdGlvbi9wbHVnaW4tbGVkZ2VyLWNvbm5lY3Rvci1iZXN1L2RlcGxveS1jb250cmFjdC92MjEtaW52b2tlLWNvbnRyYWN0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5QkFBdUI7QUFFdkIsK0JBQW9DO0FBQ3BDLDBEQUEwRDtBQUMxRCwwRUFPbUQ7QUFDbkQsOEZBQWtGO0FBQ2xGLDBFQUFrRTtBQUVsRSxnSEFBK0Y7QUFDL0YsZ0RBQXdCO0FBQ3hCLGtFQUFnRTtBQUdoRSxRQUFRLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLE1BQU0sUUFBUSxHQUFpQixPQUFPLENBQUM7SUFDdkMsTUFBTSxxQkFBcUIsR0FBRyx1QkFBdUIsQ0FBQztJQUN0RCxNQUFNLGtCQUFrQixHQUN0QixtREFBbUQsQ0FBQztJQUN0RCxNQUFNLFdBQVcsR0FBRyxFQUFFLGtCQUFrQixFQUFFLHFCQUFxQixFQUFFLENBQUM7SUFDbEUsTUFBTSxjQUFjLEdBQUcsSUFBSSxvQ0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxTQUFNLEdBQUUsQ0FBQztJQUVsQyxJQUFJLGNBQXNCLENBQUM7SUFDM0IsSUFBSSxZQUFvQixDQUFDO0lBQ3pCLElBQUksSUFBVSxDQUFDO0lBQ2YsSUFBSSxjQUF1QixDQUFDO0lBQzVCLElBQUksZUFBdUIsQ0FBQztJQUM1QixJQUFJLHdCQUFnQyxDQUFDO0lBQ3JDLElBQUksU0FBb0MsQ0FBQztJQUN6QyxJQUFJLGNBQW9DLENBQUM7SUFDekMsSUFBSSxXQUFtQyxDQUFDO0lBRXhDLFNBQVMsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNuQixNQUFNLGNBQWMsQ0FBQyxLQUFLLEVBQUUs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