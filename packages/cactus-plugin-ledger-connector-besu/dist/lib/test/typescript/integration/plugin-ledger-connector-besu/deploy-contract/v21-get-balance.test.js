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
    beforeAll(async () => {
        await besuTestLedger.start();
    });
    afterAll(async () => {
        await besuTestLedger.stop();
        await besuTestLedger.destroy();
    });
    test("can get balance of an ETH account", async () => {
        const rpcApiHttpHost = await besuTestLedger.getRpcApiHttpHost();
        const rpcApiWsHost = await besuTestLedger.getRpcApiWsHost();
        /**
         * Constant defining the standard 'dev' Besu genesis.json contents.
         *
         * @see https://github.com/hyperledger/besu/blob/21.1.6/config/src/main/resources/dev.json
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
        const req = { address: firstHighNetWorthAccount };
        const currentBalance = await connector.getBalance(req);
        expect(currentBalance).toBeTruthy();
        expect(currentBalance).toBeObject();
        expect(currentBalance).not.toBeEmptyObject();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidjIxLWdldC1iYWxhbmNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvdGVzdC90eXBlc2NyaXB0L2ludGVncmF0aW9uL3BsdWdpbi1sZWRnZXItY29ubmVjdG9yLWJlc3UvZGVwbG95LWNvbnRyYWN0L3YyMS1nZXQtYmFsYW5jZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseUJBQXVCO0FBQ3ZCLCtCQUFvQztBQUNwQywwREFBMEQ7QUFDMUQsMEVBSW1EO0FBQ25ELDhGQUFrRjtBQUNsRiwwRUFBa0U7QUFFbEUsZ0hBQStGO0FBQy9GLGdEQUF3QjtBQUN4QixrRUFBZ0U7QUFFaEUsUUFBUSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtJQUN6QyxNQUFNLFFBQVEsR0FBaUIsT0FBTyxDQUFDO0lBQ3ZDLE1BQU0scUJBQXFCLEdBQUcsdUJBQXVCLENBQUM7SUFDdEQsTUFBTSxrQkFBa0IsR0FDdEIsbURBQW1ELENBQUM7SUFDdEQsTUFBTSxXQUFXLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxxQkFBcUIsRUFBRSxDQUFDO0lBQ2xFLE1BQU0sY0FBYyxHQUFHLElBQUksb0NBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUV2RCxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDbkIsTUFBTSxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDL0IsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDbEIsTUFBTSxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDNUIsTUFBTSxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDakMsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsbUNBQW1DLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbkQsTUFBTSxjQUFjLEdBQUcsTUFBTSxjQUFjLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUNoRSxNQUFNLFlBQVksR0FBRyxNQUFNLGNBQWMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUU1RDs7OztXQUlHO1FBQ0gsTUFBTSx3QkFBd0IsR0FBRyxjQUFjLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUMxRSxNQUFNLElBQUksR0FBRyxJQUFJLGNBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN0QyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBQSxTQUFNLEdBQUUsQ0FBQyxDQUFDO1FBRTFELE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxTQUFNLEdBQUUsQ0FBQztRQUNsQyxNQUFNLGtCQUFrQixHQUFHLGNBQWMsQ0FBQyxVQUFVLENBQUM7UUFDckQsTUFBTSxjQUFjLEdBQUcsSUFBSSxvREFBb0IsQ0FBQztZQUM5QyxVQUFVLEVBQUUsSUFBQSxTQUFNLEdBQUU7WUFDcEIsVUFBVSxFQUFFLElBQUEsU0FBTSxHQUFFO1lBQ3BCLDBFQUEwRTtZQUMxRSxvRUFBb0U7WUFDcEUsc0RBQXNEO1lBQ3RELE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQzFELFFBQVE7U0FDVCxDQUFDLENBQUM7UUFDSCxjQUFjLENBQUMsR0FBRyxDQUNoQix5QkFBc0IsQ0FBQyxZQUFZLEVBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQXNCLENBQUMsQ0FDdkMsQ0FBQztRQUNGLE1BQU0sT0FBTyxHQUFHLElBQUkseUNBQTRCLENBQUM7WUFDL0MsZ0JBQWdCLEVBQUUsa0NBQWdCLENBQUMsS0FBSztTQUN6QyxDQUFDLENBQUM7UUFDSCxNQUFNLFNBQVMsR0FBOEIsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ2hFLGNBQWM7WUFDZCxZQUFZO1lBQ1osVUFBVSxFQUFFLElBQUEsU0FBTSxHQUFFO1lBQ3BCLGNBQWMsRUFBRSxJQUFJLDRCQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDO1NBQ2xFLENBQUMsQ0FBQztRQUVILE1BQU0sR0FBRyxHQUF3QixFQUFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxDQUFDO1FBQ3ZFLE1BQU0sY0FBYyxHQUFHLE1BQU0sU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2RCxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDcEMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9