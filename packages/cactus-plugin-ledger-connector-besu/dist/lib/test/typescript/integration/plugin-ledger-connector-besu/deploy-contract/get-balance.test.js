"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
require("jest-extended");
const cactus_core_1 = require("@hyperledger/cactus-core");
const public_api_1 = require("../../../../../main/typescript/public-api");
const cactus_plugin_keychain_memory_1 = require("@hyperledger/cactus-plugin-keychain-memory");
const cactus_test_tooling_1 = require("@hyperledger/cactus-test-tooling");
const HelloWorld_json_1 = __importDefault(require("../../../../solidity/hello-world-contract/HelloWorld.json"));
const web3_1 = __importDefault(require("web3"));
const cactus_core_api_1 = require("@hyperledger/cactus-core-api");
const testcase = "can get balance of an account";
describe(testcase, () => {
    const logLevel = "TRACE";
    const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger();
    let rpcApiHttpHost, rpcApiWsHost, web3, keychainPlugin, firstHighNetWorthAccount, testEthAccount, keychainEntryKey, keychainEntryValue;
    afterAll(async () => {
        await besuTestLedger.stop();
        await besuTestLedger.destroy();
    });
    beforeAll(async () => {
        await besuTestLedger.start();
        web3 = new web3_1.default(rpcApiHttpHost);
        firstHighNetWorthAccount = besuTestLedger.getGenesisAccountPubKey();
        testEthAccount = web3.eth.accounts.create((0, uuid_1.v4)());
        keychainEntryKey = (0, uuid_1.v4)();
        keychainEntryValue = testEthAccount.privateKey;
        keychainPlugin = new cactus_plugin_keychain_memory_1.PluginKeychainMemory({
            instanceId: (0, uuid_1.v4)(),
            keychainId: (0, uuid_1.v4)(),
            // pre-provision keychain with mock backend holding the private key of the
            // test account that we'll reference while sending requests with the
            // signing credential pointing to this keychain entry.
            backend: new Map([[keychainEntryKey, keychainEntryValue]]),
            logLevel,
        });
        rpcApiHttpHost = await besuTestLedger.getRpcApiHttpHost();
        rpcApiWsHost = await besuTestLedger.getRpcApiWsHost();
    });
    /**
     * Constant defining the standard 'dev' Besu genesis.json contents.
     *
     * @see https://github.com/hyperledger/besu/blob/1.5.1/config/src/main/resources/dev.json
     */
    test(testcase, async () => {
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
        const currentBalance = await connector.getBalance(req);
        //makes the information in to string
        expect(currentBalance).toBeTruthy();
        expect(typeof currentBalance).toBe("object");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWJhbGFuY2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy90ZXN0L3R5cGVzY3JpcHQvaW50ZWdyYXRpb24vcGx1Z2luLWxlZGdlci1jb25uZWN0b3ItYmVzdS9kZXBsb3ktY29udHJhY3QvZ2V0LWJhbGFuY2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLCtCQUFvQztBQUNwQyx5QkFBdUI7QUFFdkIsMERBQTBEO0FBQzFELDBFQUltRDtBQUNuRCw4RkFBa0Y7QUFDbEYsMEVBQWtFO0FBRWxFLGdIQUErRjtBQUMvRixnREFBd0I7QUFDeEIsa0VBQWdFO0FBRWhFLE1BQU0sUUFBUSxHQUFHLCtCQUErQixDQUFDO0FBQ2pELFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ3RCLE1BQU0sUUFBUSxHQUFpQixPQUFPLENBQUM7SUFDdkMsTUFBTSxjQUFjLEdBQUcsSUFBSSxvQ0FBYyxFQUFFLENBQUM7SUFFNUMsSUFBSSxjQUFzQixFQUN4QixZQUFvQixFQUNwQixJQUFVLEVBQ1YsY0FBb0MsRUFDcEMsd0JBQWdDLEVBQ2hDLGNBQXVCLEVBQ3ZCLGdCQUF3QixFQUN4QixrQkFBMEIsQ0FBQztJQUU3QixRQUFRLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDbEIsTUFBTSxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDNUIsTUFBTSxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDakMsQ0FBQyxDQUFDLENBQUM7SUFDSCxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDbkIsTUFBTSxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2hDLHdCQUF3QixHQUFHLGNBQWMsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQ3BFLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBQSxTQUFNLEdBQUUsQ0FBQyxDQUFDO1FBRXBELGdCQUFnQixHQUFHLElBQUEsU0FBTSxHQUFFLENBQUM7UUFDNUIsa0JBQWtCLEdBQUcsY0FBYyxDQUFDLFVBQVUsQ0FBQztRQUMvQyxjQUFjLEdBQUcsSUFBSSxvREFBb0IsQ0FBQztZQUN4QyxVQUFVLEVBQUUsSUFBQSxTQUFNLEdBQUU7WUFDcEIsVUFBVSxFQUFFLElBQUEsU0FBTSxHQUFFO1lBQ3BCLDBFQUEwRTtZQUMxRSxvRUFBb0U7WUFDcEUsc0RBQXNEO1lBQ3RELE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQzFELFFBQVE7U0FDVCxDQUFDLENBQUM7UUFDSCxjQUFjLEdBQUcsTUFBTSxjQUFjLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUMxRCxZQUFZLEdBQUcsTUFBTSxjQUFjLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDeEQsQ0FBQyxDQUFDLENBQUM7SUFDSDs7OztPQUlHO0lBRUgsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN4QixjQUFjLENBQUMsR0FBRyxDQUNoQix5QkFBc0IsQ0FBQyxZQUFZLEVBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQXNCLENBQUMsQ0FDdkMsQ0FBQztRQUNGLE1BQU0sT0FBTyxHQUFHLElBQUkseUNBQTRCLENBQUM7WUFDL0MsZ0JBQWdCLEVBQUUsa0NBQWdCLENBQUMsS0FBSztTQUN6QyxDQUFDLENBQUM7UUFDSCxNQUFNLFNBQVMsR0FBOEIsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ2hFLGNBQWM7WUFDZCxZQUFZO1lBQ1osVUFBVSxFQUFFLElBQUEsU0FBTSxHQUFFO1lBQ3BCLGNBQWMsRUFBRSxJQUFJLDRCQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDO1NBQ2xFLENBQUMsQ0FBQztRQUNILE1BQU0sU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRS9CLE1BQU0sR0FBRyxHQUF3QixFQUFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxDQUFDO1FBQ3ZFLE1BQU0sY0FBYyxHQUFHLE1BQU0sU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2RCxvQ0FBb0M7UUFDcEMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxPQUFPLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMvQyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=