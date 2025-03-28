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
const logLevel = "INFO";
describe("PluginLedgerConnectorBesu", () => {
    const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger();
    beforeAll(async () => {
        await besuTestLedger.start();
    });
    afterAll(async () => {
        await besuTestLedger.stop();
        await besuTestLedger.destroy();
    });
    test("can get past logs of an account", async () => {
        const rpcApiHttpHost = await besuTestLedger.getRpcApiHttpHost();
        const rpcApiWsHost = await besuTestLedger.getRpcApiWsHost();
        /**
         * Constant defining the standard 'dev' Besu genesis.json contents.
         *
         * @see https://github.com/hyperledger/besu/blob/1.5.1/config/src/main/resources/dev.json
         */
        const firstHighNetWorthAccount = besuTestLedger.getGenesisAccountPubKey();
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
            instanceId: (0, uuid_1.v4)(),
            pluginRegistry: new cactus_core_1.PluginRegistry({ plugins: [keychainPlugin] }),
        });
        await connector.onPluginInit();
        const req = { address: firstHighNetWorthAccount };
        const pastLogs = await connector.getPastLogs(req);
        expect(pastLogs).toBeTruthy();
        expect(pastLogs).toBeObject();
        expect(pastLogs.logs).toBeTruthy();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXBhc3QtbG9ncy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3Rlc3QvdHlwZXNjcmlwdC9pbnRlZ3JhdGlvbi9wbHVnaW4tbGVkZ2VyLWNvbm5lY3Rvci1iZXN1L2RlcGxveS1jb250cmFjdC9nZXQtcGFzdC1sb2dzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5QkFBdUI7QUFDdkIsK0JBQW9DO0FBQ3BDLDBEQUEwRDtBQUMxRCwwRUFJbUQ7QUFDbkQsOEZBQWtGO0FBQ2xGLDBFQUFrRTtBQUVsRSxnSEFBK0Y7QUFDL0YsZ0RBQXdCO0FBQ3hCLGtFQUFnRTtBQUVoRSxNQUFNLFFBQVEsR0FBaUIsTUFBTSxDQUFDO0FBRXRDLFFBQVEsQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7SUFDekMsTUFBTSxjQUFjLEdBQUcsSUFBSSxvQ0FBYyxFQUFFLENBQUM7SUFFNUMsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ25CLE1BQU0sY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQy9CLENBQUMsQ0FBQyxDQUFDO0lBQ0gsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ2xCLE1BQU0sY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVCLE1BQU0sY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2pELE1BQU0sY0FBYyxHQUFHLE1BQU0sY0FBYyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDaEUsTUFBTSxZQUFZLEdBQUcsTUFBTSxjQUFjLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFNUQ7Ozs7V0FJRztRQUNILE1BQU0sd0JBQXdCLEdBQUcsY0FBYyxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFFMUUsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdEMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUEsU0FBTSxHQUFFLENBQUMsQ0FBQztRQUUxRCxNQUFNLGdCQUFnQixHQUFHLElBQUEsU0FBTSxHQUFFLENBQUM7UUFDbEMsTUFBTSxrQkFBa0IsR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDO1FBQ3JELE1BQU0sY0FBYyxHQUFHLElBQUksb0RBQW9CLENBQUM7WUFDOUMsVUFBVSxFQUFFLElBQUEsU0FBTSxHQUFFO1lBQ3BCLFVBQVUsRUFBRSxJQUFBLFNBQU0sR0FBRTtZQUNwQiwwRUFBMEU7WUFDMUUsb0VBQW9FO1lBQ3BFLHNEQUFzRDtZQUN0RCxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUMxRCxRQUFRO1NBQ1QsQ0FBQyxDQUFDO1FBQ0gsY0FBYyxDQUFDLEdBQUcsQ0FDaEIseUJBQXNCLENBQUMsWUFBWSxFQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFzQixDQUFDLENBQ3ZDLENBQUM7UUFDRixNQUFNLE9BQU8sR0FBRyxJQUFJLHlDQUE0QixDQUFDO1lBQy9DLGdCQUFnQixFQUFFLGtDQUFnQixDQUFDLEtBQUs7U0FDekMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQThCLE1BQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUNoRSxjQUFjO1lBQ2QsWUFBWTtZQUNaLFVBQVUsRUFBRSxJQUFBLFNBQU0sR0FBRTtZQUNwQixjQUFjLEVBQUUsSUFBSSw0QkFBYyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztTQUNsRSxDQUFDLENBQUM7UUFDSCxNQUFNLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUUvQixNQUFNLEdBQUcsR0FBeUIsRUFBRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsQ0FBQztRQUN4RSxNQUFNLFFBQVEsR0FBRyxNQUFNLFNBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM5QixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==