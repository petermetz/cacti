"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest-extended");
const uuid_1 = require("uuid");
const web3_1 = __importDefault(require("web3"));
const cactus_core_1 = require("@hyperledger/cactus-core");
const public_api_1 = require("../../../../../main/typescript/public-api");
const cactus_plugin_keychain_memory_1 = require("@hyperledger/cactus-plugin-keychain-memory");
const cactus_test_tooling_1 = require("@hyperledger/cactus-test-tooling");
const cactus_common_1 = require("@hyperledger/cactus-common");
const HelloWorld_json_1 = __importDefault(require("../../../../solidity/hello-world-contract/HelloWorld.json"));
const cactus_core_api_1 = require("@hyperledger/cactus-core-api");
describe("PluginLedgerConnectorBesu", () => {
    const logLevel = "INFO";
    const log = cactus_common_1.LoggerProvider.getOrCreate({
        label: "v21-get-past-logs.test.ts",
        level: logLevel,
    });
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
    test("can get past logs of an account", async () => {
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
        const pastLogs = await connector.getPastLogs(req);
        log.debug("Past logs fetched from the Besu ledger: %o", pastLogs);
        expect(pastLogs).toBeObject();
        expect(pastLogs).not.toBeEmptyObject();
        expect(pastLogs).toHaveProperty("logs", expect.toBeArrayOfSize(0));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidjIxLWdldC1wYXN0LWxvZ3MudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy90ZXN0L3R5cGVzY3JpcHQvaW50ZWdyYXRpb24vcGx1Z2luLWxlZGdlci1jb25uZWN0b3ItYmVzdS9kZXBsb3ktY29udHJhY3QvdjIxLWdldC1wYXN0LWxvZ3MudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHlCQUF1QjtBQUN2QiwrQkFBb0M7QUFDcEMsZ0RBQXdCO0FBQ3hCLDBEQUEwRDtBQUMxRCwwRUFJbUQ7QUFDbkQsOEZBQWtGO0FBQ2xGLDBFQUFrRTtBQUNsRSw4REFBMEU7QUFDMUUsZ0hBQStGO0FBQy9GLGtFQUFnRTtBQUVoRSxRQUFRLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLE1BQU0sUUFBUSxHQUFpQixNQUFNLENBQUM7SUFDdEMsTUFBTSxHQUFHLEdBQUcsOEJBQWMsQ0FBQyxXQUFXLENBQUM7UUFDckMsS0FBSyxFQUFFLDJCQUEyQjtRQUNsQyxLQUFLLEVBQUUsUUFBUTtLQUNoQixDQUFDLENBQUM7SUFDSCxNQUFNLHFCQUFxQixHQUFHLHVCQUF1QixDQUFDO0lBQ3RELE1BQU0sa0JBQWtCLEdBQ3RCLG1EQUFtRCxDQUFDO0lBQ3RELE1BQU0sV0FBVyxHQUFHLEVBQUUsa0JBQWtCLEVBQUUscUJBQXFCLEVBQUUsQ0FBQztJQUNsRSxNQUFNLGNBQWMsR0FBRyxJQUFJLG9DQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFdkQsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ25CLE1BQU0sY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQy9CLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ2xCLE1BQU0sY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVCLE1BQU0sY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2pELE1BQU0sY0FBYyxHQUFHLE1BQU0sY0FBYyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDaEUsTUFBTSxZQUFZLEdBQUcsTUFBTSxjQUFjLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFNUQ7Ozs7V0FJRztRQUNILE1BQU0sd0JBQXdCLEdBQUcsY0FBYyxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFFMUUsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdEMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUEsU0FBTSxHQUFFLENBQUMsQ0FBQztRQUUxRCxNQUFNLGdCQUFnQixHQUFHLElBQUEsU0FBTSxHQUFFLENBQUM7UUFDbEMsTUFBTSxrQkFBa0IsR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDO1FBQ3JELE1BQU0sY0FBYyxHQUFHLElBQUksb0RBQW9CLENBQUM7WUFDOUMsVUFBVSxFQUFFLElBQUEsU0FBTSxHQUFFO1lBQ3BCLFVBQVUsRUFBRSxJQUFBLFNBQU0sR0FBRTtZQUNwQiwwRUFBMEU7WUFDMUUsb0VBQW9FO1lBQ3BFLHNEQUFzRDtZQUN0RCxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUMxRCxRQUFRO1NBQ1QsQ0FBQyxDQUFDO1FBQ0gsY0FBYyxDQUFDLEdBQUcsQ0FDaEIseUJBQXNCLENBQUMsWUFBWSxFQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFzQixDQUFDLENBQ3ZDLENBQUM7UUFDRixNQUFNLE9BQU8sR0FBRyxJQUFJLHlDQUE0QixDQUFDO1lBQy9DLGdCQUFnQixFQUFFLGtDQUFnQixDQUFDLEtBQUs7U0FDekMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQThCLE1BQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUNoRSxjQUFjO1lBQ2QsWUFBWTtZQUNaLFVBQVUsRUFBRSxJQUFBLFNBQU0sR0FBRTtZQUNwQixjQUFjLEVBQUUsSUFBSSw0QkFBYyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQztTQUNsRSxDQUFDLENBQUM7UUFFSCxNQUFNLEdBQUcsR0FBeUIsRUFBRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsQ0FBQztRQUN4RSxNQUFNLFFBQVEsR0FBRyxNQUFNLFNBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEQsR0FBRyxDQUFDLEtBQUssQ0FBQyw0Q0FBNEMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNsRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDOUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9