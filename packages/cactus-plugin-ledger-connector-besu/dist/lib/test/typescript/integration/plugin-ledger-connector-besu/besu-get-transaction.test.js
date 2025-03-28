"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const cactus_core_1 = require("@hyperledger/cactus-core");
require("jest-extended");
const public_api_1 = require("../../../../main/typescript/public-api");
const cactus_plugin_keychain_memory_1 = require("@hyperledger/cactus-plugin-keychain-memory");
const cactus_test_tooling_1 = require("@hyperledger/cactus-test-tooling");
const HelloWorld_json_1 = __importDefault(require("../../../solidity/hello-world-contract/HelloWorld.json"));
const web3_1 = __importDefault(require("web3"));
const cactus_core_api_1 = require("@hyperledger/cactus-core-api");
const testCase = "PluginLedgerConnectorBesu";
describe(testCase, () => {
    const logLevel = "TRACE";
    const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger();
    afterAll(async () => {
        await besuTestLedger.stop();
        await besuTestLedger.destroy();
    });
    test("can get past logs of an account", async () => {
        await besuTestLedger.start();
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
        expect(response.transaction).toBeTruthy();
        expect(typeof response.transaction).toBe("object");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVzdS1nZXQtdHJhbnNhY3Rpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy90ZXN0L3R5cGVzY3JpcHQvaW50ZWdyYXRpb24vcGx1Z2luLWxlZGdlci1jb25uZWN0b3ItYmVzdS9iZXN1LWdldC10cmFuc2FjdGlvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsK0JBQW9DO0FBQ3BDLDBEQUEwRDtBQUMxRCx5QkFBdUI7QUFFdkIsdUVBS2dEO0FBQ2hELDhGQUFrRjtBQUNsRiwwRUFBa0U7QUFFbEUsNkdBQTRGO0FBQzVGLGdEQUF3QjtBQUN4QixrRUFBZ0U7QUFHaEUsTUFBTSxRQUFRLEdBQUcsMkJBQTJCLENBQUM7QUFDN0MsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDdEIsTUFBTSxRQUFRLEdBQWlCLE9BQU8sQ0FBQztJQUN2QyxNQUFNLGNBQWMsR0FBRyxJQUFJLG9DQUFjLEVBQUUsQ0FBQztJQUU1QyxRQUFRLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDbEIsTUFBTSxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDNUIsTUFBTSxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDakMsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsaUNBQWlDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDakQsTUFBTSxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFN0IsTUFBTSxjQUFjLEdBQUcsTUFBTSxjQUFjLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUNoRSxNQUFNLFlBQVksR0FBRyxNQUFNLGNBQWMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUU1RDs7OztXQUlHO1FBRUgsTUFBTSx3QkFBd0IsR0FBRyxjQUFjLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUUxRSxNQUFNLElBQUksR0FBRyxJQUFJLGNBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN0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