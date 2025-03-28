"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest-extended");
const uuid_1 = require("uuid");
const cactus_core_1 = require("@hyperledger/cactus-core");
const public_api_1 = require("../../../../main/typescript/public-api");
const cactus_plugin_keychain_memory_1 = require("@hyperledger/cactus-plugin-keychain-memory");
const cactus_test_tooling_1 = require("@hyperledger/cactus-test-tooling");
const cactus_common_1 = require("@hyperledger/cactus-common");
const HelloWorld_json_1 = __importDefault(require("../../../solidity/hello-world-contract/HelloWorld.json"));
const web3_1 = __importDefault(require("web3"));
const cactus_core_api_1 = require("@hyperledger/cactus-core-api");
describe("PluginLedgerConnectorBesu", () => {
    const logLevel = "TRACE";
    const containerImageVersion = "2021-08-24--feat-1244";
    const containerImageName = "ghcr.io/hyperledger/cactus-besu-21-1-6-all-in-one";
    const besuOptions = { containerImageName, containerImageVersion };
    const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger(besuOptions);
    const log = cactus_common_1.LoggerProvider.getOrCreate({
        label: "v21-besu-get-transaction.test.ts",
        level: logLevel,
    });
    let rpcApiHttpHost;
    let rpcApiWsHost;
    let firstHighNetWorthAccount;
    beforeAll(async () => {
        await besuTestLedger.start();
        rpcApiHttpHost = await besuTestLedger.getRpcApiHttpHost();
        rpcApiWsHost = await besuTestLedger.getRpcApiWsHost();
        firstHighNetWorthAccount = besuTestLedger.getGenesisAccountPubKey();
    });
    afterAll(async () => {
        await besuTestLedger.stop();
        await besuTestLedger.destroy();
    });
    test("can get past logs of an account", async () => {
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
        const privateKey = await besuTestLedger.getGenesisAccountPrivKey();
        const { transactionReceipt } = await connector.transact({
            web3SigningCredential: {
                ethAccount: firstHighNetWorthAccount,
                secret: privateKey,
                type: public_api_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            consistencyStrategy: {
                blockConfirmations: 0,
                receiptType: public_api_1.ReceiptType.LedgerBlockAck,
                timeoutMs: 60000,
            },
            transactionConfig: {
                from: firstHighNetWorthAccount,
                to: testEthAccount.address,
                value: 10e9,
                gas: 1000000,
            },
        });
        const req = {
            transactionHash: transactionReceipt.transactionHash,
        };
        const response = await connector.getTransaction(req);
        log.debug("Transaction in HTTP response: %o", response.transaction);
        expect(response).toBeTruthy();
        expect(response.transaction).toBeTruthy();
        expect(response.transaction).toBeObject();
        expect(response.transaction).not.toBeEmptyObject();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidjIxLWJlc3UtZ2V0LXRyYW5zYWN0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvdGVzdC90eXBlc2NyaXB0L2ludGVncmF0aW9uL3BsdWdpbi1sZWRnZXItY29ubmVjdG9yLWJlc3UvdjIxLWJlc3UtZ2V0LXRyYW5zYWN0aW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5QkFBdUI7QUFDdkIsK0JBQW9DO0FBQ3BDLDBEQUEwRDtBQUMxRCx1RUFLZ0Q7QUFDaEQsOEZBQWtGO0FBQ2xGLDBFQUFrRTtBQUNsRSw4REFBMEU7QUFDMUUsNkdBQTRGO0FBQzVGLGdEQUF3QjtBQUN4QixrRUFBZ0U7QUFHaEUsUUFBUSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtJQUN6QyxNQUFNLFFBQVEsR0FBaUIsT0FBTyxDQUFDO0lBQ3ZDLE1BQU0scUJBQXFCLEdBQUcsdUJBQXVCLENBQUM7SUFDdEQsTUFBTSxrQkFBa0IsR0FDdEIsbURBQW1ELENBQUM7SUFFdEQsTUFBTSxXQUFXLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxxQkFBcUIsRUFBRSxDQUFDO0lBQ2xFLE1BQU0sY0FBYyxHQUFHLElBQUksb0NBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN2RCxNQUFNLEdBQUcsR0FBRyw4QkFBYyxDQUFDLFdBQVcsQ0FBQztRQUNyQyxLQUFLLEVBQUUsa0NBQWtDO1FBQ3pDLEtBQUssRUFBRSxRQUFRO0tBQ2hCLENBQUMsQ0FBQztJQUVILElBQUksY0FBc0IsQ0FBQztJQUMzQixJQUFJLFlBQW9CLENBQUM7SUFDekIsSUFBSSx3QkFBZ0MsQ0FBQztJQUVyQyxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDbkIsTUFBTSxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsY0FBYyxHQUFHLE1BQU0sY0FBYyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDMUQsWUFBWSxHQUFH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