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
const cactus_common_1 = require("@hyperledger/cactus-common");
const HelloWorld_json_1 = __importDefault(require("../../../../solidity/hello-world-contract/HelloWorld.json"));
const web3_1 = __importDefault(require("web3"));
const cactus_core_api_1 = require("@hyperledger/cactus-core-api");
describe("PluginLedgerConnectorBesu", () => {
    const logLevel = "INFO";
    const log = cactus_common_1.LoggerProvider.getOrCreate({
        label: "besu-get-block-test.ts",
        level: logLevel,
    });
    const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger();
    let connector;
    beforeAll(async () => {
        const omitContainerImagePull = false;
        await besuTestLedger.start(omitContainerImagePull);
        const rpcApiHttpHost = await besuTestLedger.getRpcApiHttpHost();
        const rpcApiWsHost = await besuTestLedger.getRpcApiWsHost();
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
        connector = await factory.create({
            rpcApiHttpHost,
            rpcApiWsHost,
            instanceId: (0, uuid_1.v4)(),
            pluginRegistry: new cactus_core_1.PluginRegistry({ plugins: [keychainPlugin] }),
        });
        await connector.onPluginInit();
    });
    afterAll(async () => {
        await besuTestLedger.stop();
        await besuTestLedger.destroy();
    });
    it("can get block from blockchain", async () => {
        const request = { blockHashOrBlockNumber: 0 };
        const currentBlock = await connector.getBlock(request);
        log.debug("Current Block=%o", currentBlock);
        //makes the information in to string
        expect(currentBlock).toBeTruthy();
        expect(currentBlock).toBeObject();
        expect(currentBlock).not.toBeEmptyObject();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWJsb2NrLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvdGVzdC90eXBlc2NyaXB0L2ludGVncmF0aW9uL3BsdWdpbi1sZWRnZXItY29ubmVjdG9yLWJlc3UvZGVwbG95LWNvbnRyYWN0L2dldC1ibG9jay50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseUJBQXVCO0FBQ3ZCLCtCQUFvQztBQUNwQywwREFBMEQ7QUFDMUQsMEVBSW1EO0FBQ25ELDhGQUFrRjtBQUNsRiwwRUFBa0U7QUFDbEUsOERBQTBFO0FBQzFFLGdIQUErRjtBQUMvRixnREFBd0I7QUFDeEIsa0VBQWdFO0FBRWhFLFFBQVEsQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7SUFDekMsTUFBTSxRQUFRLEdBQWlCLE1BQU0sQ0FBQztJQUN0QyxNQUFNLEdBQUcsR0FBRyw4QkFBYyxDQUFDLFdBQVcsQ0FBQztRQUNyQyxLQUFLLEVBQUUsd0JBQXdCO1FBQy9CLEtBQUssRUFBRSxRQUFRO0tBQ2hCLENBQUMsQ0FBQztJQUNILE1BQU0sY0FBYyxHQUFHLElBQUksb0NBQWMsRUFBRSxDQUFDO0lBQzVDLElBQUksU0FBb0MsQ0FBQztJQUV6QyxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDbkIsTUFBTSxzQkFBc0IsR0FBRyxLQUFLLENBQUM7UUFDckMsTUFBTSxjQUFjLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFFbkQsTUFBTSxjQUFjLEdBQUcsTUFBTSxjQUFjLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUNoRSxNQUFNLFlBQVksR0FBRyxNQUFNLGNBQWMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUM1RCxNQUFNLElBQUksR0FBRyxJQUFJLGNBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN0QyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBQSxTQUFNLEdBQUUsQ0FBQyxDQUFDO1FBRTFELE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxTQUFNLEdBQUUsQ0FBQztRQUNsQyxNQUFNLGtCQUFrQixHQUFHLGNBQWMsQ0FBQyxVQUFVLENBQUM7UUFDckQsTUFBTSxjQUFjLEdBQUcsSUFBSSxvREFBb0IsQ0FBQztZQUM5QyxVQUFVLEVBQUUsSUFBQSxTQUFNLEdBQUU7WUFDcEIsVUFBVSxFQUFFLElBQUEsU0FBTSxHQUFFO1lBQ3BCLDBFQUEwRTtZQUMxRSxvRUFBb0U7WUFDcEUsc0RBQXNEO1lBQ3RELE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQzFELFFBQVE7U0FDVCxDQUFDLENBQUM7UUFDSCxjQUFjLENBQUMsR0FBRyxDQUNoQix5QkFBc0IsQ0FBQyxZQUFZLEVBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQXNCLENBQUMsQ0FDdkMsQ0FBQztRQUNGLE1BQU0sT0FBTyxHQUFHLElBQUkseUNBQTRCLENBQUM7WUFDL0MsZ0JBQWdCLEVBQUUsa0NBQWdCLENBQUMsS0FBSztTQUN6QyxDQUFDLENBQUM7UUFDSCxTQUFTLEdBQUcsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQy9CLGNBQWM7WUFDZCxZQUFZO1lBQ1osVUFBVSxFQUFFLElBQUEsU0FBTSxHQUFFO1lBQ3BCLGNBQWMsRUFBRSxJQUFJLDRCQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDO1NBQ2xFLENBQUMsQ0FBQztRQUNILE1BQU0sU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ2xCLE1BQU0sY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVCLE1BQU0sY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLCtCQUErQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzdDLE1BQU0sT0FBTyxHQUFzQixFQUFFLHNCQUFzQixFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ2pFLE1BQU0sWUFBWSxHQUFHLE1BQU0sU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2RCxHQUFHLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzVDLG9DQUFvQztRQUNwQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDN0MsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9