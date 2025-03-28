"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest-extended");
const uuid_1 = require("uuid");
const web3_1 = __importDefault(require("web3"));
const cactus_core_1 = require("@hyperledger/cactus-core");
const cactus_plugin_keychain_memory_1 = require("@hyperledger/cactus-plugin-keychain-memory");
const cactus_test_tooling_1 = require("@hyperledger/cactus-test-tooling");
const cactus_core_api_1 = require("@hyperledger/cactus-core-api");
const LockAsset_json_1 = __importDefault(require("../../../solidity/hello-world-contract/LockAsset.json"));
const public_api_1 = require("../../../../main/typescript/public-api");
const logLevel = "INFO";
describe("PluginLedgerConnectorBesu", () => {
    const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger();
    let besuKeyPair;
    let firstHighNetWorthAccount;
    let keychainPlugin;
    let testEthAccount;
    let connector;
    beforeAll(async () => {
        await besuTestLedger.start();
        /**
         * Constant defining the standard 'dev' Besu genesis.json contents.
         *
         * @see https://github.com/hyperledger/besu/blob/1.5.1/config/src/main/resources/dev.json
         */
        firstHighNetWorthAccount = besuTestLedger.getGenesisAccountPubKey();
        besuKeyPair = {
            privateKey: besuTestLedger.getGenesisAccountPrivKey(),
        };
    });
    afterAll(async () => {
        await besuTestLedger.stop();
        await besuTestLedger.destroy();
    });
    afterAll(async () => {
        await connector.shutdown();
    });
    it("creates test account from scratch with seed money", async () => {
        const rpcApiHttpHost = await besuTestLedger.getRpcApiHttpHost();
        const rpcApiWsHost = await besuTestLedger.getRpcApiWsHost();
        const web3 = new web3_1.default(rpcApiHttpHost);
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
        keychainPlugin.set(LockAsset_json_1.default.contractName, JSON.stringify(LockAsset_json_1.default));
        const factory = new public_api_1.PluginFactoryLedgerConnector({
            pluginImportType: cactus_core_api_1.PluginImportType.Local,
        });
        connector = await factory.create({
            rpcApiHttpHost,
            rpcApiWsHost,
            instanceId: (0, uuid_1.v4)(),
            logLevel,
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
    it("deploys contract via .json file, verifies lock/unlock ops", async () => {
        const deployOut = await connector.deployContract({
            keychainId: keychainPlugin.getKeychainId(),
            contractName: LockAsset_json_1.default.contractName,
            contractAbi: LockAsset_json_1.default.abi,
            constructorArgs: [],
            web3SigningCredential: {
                ethAccount: firstHighNetWorthAccount,
                secret: besuKeyPair.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            bytecode: LockAsset_json_1.default.bytecode,
            gas: 1000000,
        });
        expect(deployOut).toBeTruthy();
        expect(deployOut.transactionReceipt).toBeTruthy();
        expect(deployOut.transactionReceipt.contractAddress).toBeTruthy();
        const contractAddress = deployOut.transactionReceipt.contractAddress;
        expect(contractAddress).toBeString();
        expect(contractAddress).not.toBeEmpty();
        const { success: createRes } = await connector.invokeContract({
            contractName: LockAsset_json_1.default.contractName,
            keychainId: keychainPlugin.getKeychainId(),
            invocationType: public_api_1.EthContractInvocationType.Send,
            methodName: "createAsset",
            params: ["asset1", 5],
            signingCredential: {
                ethAccount: testEthAccount.address,
                secret: besuKeyPair.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            gas: 1000000,
        });
        expect(createRes).toBeTruthy();
        expect(createRes).toBeTrue();
        const { success: lockRes } = await connector.invokeContract({
            contractName: LockAsset_json_1.default.contractName,
            keychainId: keychainPlugin.getKeychainId(),
            invocationType: public_api_1.EthContractInvocationType.Send,
            methodName: "lockAsset",
            params: ["asset1"],
            signingCredential: {
                ethAccount: testEthAccount.address,
                secret: besuKeyPair.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            gas: 1000000,
        });
        expect(lockRes).toBeTruthy();
        expect(lockRes).toEqual(true);
        const { success: unLockRes } = await connector.invokeContract({
            contractName: LockAsset_json_1.default.contractName,
            keychainId: keychainPlugin.getKeychainId(),
            invocationType: public_api_1.EthContractInvocationType.Send,
            methodName: "unLockAsset",
            params: ["asset1"],
            signingCredential: {
                ethAccount: testEthAccount.address,
                secret: besuKeyPair.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            gas: 1000000,
        });
        expect(unLockRes).toBeTruthy();
        expect(unLockRes).toBeTrue();
        const { success: lockRes2 } = await connector.invokeContract({
            contractName: LockAsset_json_1.default.contractName,
            keychainId: keychainPlugin.getKeychainId(),
            invocationType: public_api_1.EthContractInvocationType.Send,
            methodName: "lockAsset",
            params: ["asset1"],
            signingCredential: {
                ethAccount: testEthAccount.address,
                secret: besuKeyPair.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            gas: 1000000,
        });
        expect(lockRes2).toBeTruthy();
        expect(lockRes2).toBeTrue();
        const { success: deleteRes } = await connector.invokeContract({
            contractName: LockAsset_json_1.default.contractName,
            keychainId: keychainPlugin.getKeychainId(),
            invocationType: public_api_1.EthContractInvocationType.Send,
            methodName: "deleteAsset",
            params: ["asset1"],
            signingCredential: {
                ethAccount: testEthAccount.address,
                secret: besuKeyPair.privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            gas: 1000000,
        });
        expect(deleteRes).toBeTruthy();
        expect(deleteRes).toBeTrue();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jay1jb250cmFjdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3Rlc3QvdHlwZXNjcmlwdC9pbnRlZ3JhdGlvbi9wbHVnaW4tbGVkZ2VyLWNvbm5lY3Rvci1iZXN1L2xvY2stY29udHJhY3QudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlCQUF1QjtBQUN2QiwrQkFBb0M7QUFDcEMsZ0RBQXdCO0FBR3hCLDBEQUEwRDtBQUMxRCw4RkFBa0Y7QUFDbEYsMEVBQWtFO0FBRWxFLGtFQUFnRTtBQUVoRSwyR0FBMEY7QUFFMUYsdUVBTWdEO0FBRWhELE1BQU0sUUFBUSxHQUFpQixNQUFNLENBQUM7QUFFdEMsUUFBUSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtJQUN6QyxNQUFNLGNBQWMsR0FBRyxJQUFJLG9DQUFjLEVBQUUsQ0FBQztJQUM1QyxJQUFJLFdBQW1DLENBQUM7SUFDeEMsSUFBSSx3QkFBZ0MsQ0FBQztJQUNyQyxJQUFJLGNBQW9DLENBQUM7SUFDekMsSUFBSSxjQUF1QixDQUFDO0lBQzVCLElBQUksU0FBb0MsQ0FBQztJQUV6QyxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDbkIsTUFBTSxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFN0I7Ozs7V0FJRztRQUNILHdCQUF3QixHQUFHLGNBQWMsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQ3BFLFdBQVcsR0FBRztZQUNaLFVBQVUsRUFBRSxjQUFjLENBQUMsd0JBQXdCLEVBQUU7U0FDdEQsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ2xCLE1BQU0sY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVCLE1BQU0sY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLEtBQUssSUFBSSxF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