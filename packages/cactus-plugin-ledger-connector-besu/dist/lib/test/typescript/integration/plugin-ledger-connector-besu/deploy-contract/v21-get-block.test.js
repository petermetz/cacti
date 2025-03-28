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
    let keychainEntryValue;
    let connector;
    beforeAll(async () => {
        await besuTestLedger.start();
        rpcApiHttpHost = await besuTestLedger.getRpcApiHttpHost();
        rpcApiWsHost = await besuTestLedger.getRpcApiWsHost();
        web3 = new web3_1.default(rpcApiHttpHost);
        testEthAccount = web3.eth.accounts.create((0, uuid_1.v4)());
        keychainEntryValue = testEthAccount.privateKey;
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
        connector = await factory.create({
            rpcApiHttpHost,
            rpcApiWsHost,
            instanceId: (0, uuid_1.v4)(),
            pluginRegistry: new cactus_core_1.PluginRegistry({ plugins: [keychainPlugin] }),
        });
    });
    afterAll(async () => {
        await besuTestLedger.stop();
        await besuTestLedger.destroy();
    });
    it("can query the ledger for specific blocks", async () => {
        const request = { blockHashOrBlockNumber: 0 };
        const response = await connector.getBlock(request);
        expect(response).toBeTruthy();
        expect(response).toBeObject();
        expect(response.block).toBeObject();
        expect(response.block.number).not.toBeNull();
        expect(response.block.number).toBeNumber();
        expect(response.block.number).toBeFinite();
        expect(response.block.nonce).toBeTruthy();
        expect(response.block.nonce).toBeString();
        expect(response.block.nonce).not.toBeEmpty();
        expect(response.block.transactionsRoot).toBeString();
        expect(response.block.transactionsRoot).not.toBeEmpty();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidjIxLWdldC1ibG9jay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3Rlc3QvdHlwZXNjcmlwdC9pbnRlZ3JhdGlvbi9wbHVnaW4tbGVkZ2VyLWNvbm5lY3Rvci1iZXN1L2RlcGxveS1jb250cmFjdC92MjEtZ2V0LWJsb2NrLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5QkFBdUI7QUFDdkIsK0JBQW9DO0FBQ3BDLDBEQUEwRDtBQUMxRCwwRUFJbUQ7QUFDbkQsOEZBQWtGO0FBQ2xGLDBFQUFrRTtBQUVsRSxnSEFBK0Y7QUFDL0YsZ0RBQXdCO0FBQ3hCLGtFQUFnRTtBQUdoRSxRQUFRLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLE1BQU0sUUFBUSxHQUFpQixPQUFPLENBQUM7SUFDdkMsTUFBTSxxQkFBcUIsR0FBRyx1QkFBdUIsQ0FBQztJQUN0RCxNQUFNLGtCQUFrQixHQUN0QixtREFBbUQsQ0FBQztJQUN0RCxNQUFNLFdBQVcsR0FBRyxFQUFFLGtCQUFrQixFQUFFLHFCQUFxQixFQUFFLENBQUM7SUFDbEUsTUFBTSxjQUFjLEdBQUcsSUFBSSxvQ0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxTQUFNLEdBQUUsQ0FBQztJQUVsQyxJQUFJLGNBQXNCLENBQUM7SUFDM0IsSUFBSSxZQUFvQixDQUFDO0lBQ3pCLElBQUksSUFBVSxDQUFDO0lBQ2YsSUFBSSxjQUF1QixDQUFDO0lBQzVCLElBQUksa0JBQWtCLENBQUM7SUFDdkIsSUFBSSxTQUFvQyxDQUFDO0lBRXpDLFNBQVMsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNuQixNQUFNLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3QixjQUFjLEdBQUcsTUFBTSxjQUFjLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUMxRCxZQUFZLEdBQUcsTUFBTSxjQUFj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