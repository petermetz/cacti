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
const testCase = "deploys contract via .json file";
describe(testCase, () => {
    afterAll(async () => {
        await besuTestLedger.stop();
        await besuTestLedger.destroy();
    });
    const logLevel = "TRACE";
    const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger();
    test(testCase, async () => {
        await besuTestLedger.start();
        const rpcApiHttpHost = await besuTestLedger.getRpcApiHttpHost();
        const rpcApiWsHost = await besuTestLedger.getRpcApiWsHost();
        /**
         * Constant defining the standard 'dev' Besu genesis.json contents.
         *
         * @see https://github.com/hyperledger/besu/blob/1.5.1/config/src/main/resources/dev.json
         */
        const firstHighNetWorthAccount = besuTestLedger.getGenesisAccountPubKey();
        const besuKeyPair = {
            privateKey: besuTestLedger.getGenesisAccountPrivKey(),
        };
        const contractName = "HelloWorld";
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
        let contractAddress;
        {
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
            expect(typeof contractAddress === "string").toBeTrue();
            const { callOutput: helloMsg } = await connector.invokeContract({
                contractName,
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
            expect(typeof helloMsg === "string").toBeTrue();
        }
        {
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
        }
        {
            const newName = `DrCactus${(0, uuid_1.v4)()}`;
            const setNameOut = await connector.invokeContract({
                contractName,
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
            await expect(connector.invokeContract({
                contractName,
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
            })).rejects.toThrowError(expect.objectContaining({
                message: expect.stringContaining("Nonce too low"),
            }));
            const { callOutput: getNameOut } = await connector.invokeContract({
                contractName,
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
                contractName,
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
                contractName,
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
                contractName,
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
        }
        {
            const newName = `DrCactus${(0, uuid_1.v4)()}`;
            const signingCredential = {
                ethAccount: testEthAccount.address,
                keychainEntryKey,
                keychainId: keychainPlugin.getKeychainId(),
                type: public_api_1.Web3SigningCredentialType.CactusKeychainRef,
            };
            const setNameOut = await connector.invokeContract({
                contractName,
                keychainId: keychainPlugin.getKeychainId(),
                invocationType: public_api_1.EthContractInvocationType.Send,
                methodName: "setName",
                params: [newName],
                gas: 1000000,
                signingCredential,
                nonce: 4,
            });
            expect(setNameOut).toBeTruthy();
            await expect(connector.invokeContract({
                contractName,
                keychainId: keychainPlugin.getKeychainId(),
                invocationType: public_api_1.EthContractInvocationType.Send,
                methodName: "setName",
                params: [newName],
                gas: 1000000,
                signingCredential,
                nonce: 4,
            })).rejects.toThrow("Nonce too low");
            const { callOutput: getNameOut } = await connector.invokeContract({
                contractName,
                keychainId: keychainPlugin.getKeychainId(),
                invocationType: public_api_1.EthContractInvocationType.Call,
                methodName: "getName",
                params: [],
                gas: 1000000,
                signingCredential,
            });
            expect(getNameOut).toEqual(newName);
            const getNameOut2 = await connector.invokeContract({
                contractName,
                keychainId: keychainPlugin.getKeychainId(),
                invocationType: public_api_1.EthContractInvocationType.Send,
                methodName: "getName",
                params: [],
                gas: 1000000,
                signingCredential,
            });
            expect(getNameOut2).toBeTruthy();
            const response = await connector.invokeContract({
                contractName,
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
                contractName,
                keychainId: keychainPlugin.getKeychainId(),
                invocationType: public_api_1.EthContractInvocationType.Call,
                methodName: "getNameByIndex",
                params: [1],
                gas: 1000000,
                signingCredential,
            });
            expect(callOut).toEqual(newName);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52b2tlLWNvbnRyYWN0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvdGVzdC90eXBlc2NyaXB0L2ludGVncmF0aW9uL3BsdWdpbi1sZWRnZXItY29ubmVjdG9yLWJlc3UvZGVwbG95LWNvbnRyYWN0L2ludm9rZS1jb250cmFjdC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseUJBQXVCO0FBQ3ZCLCtCQUFvQztBQUNwQywwREFBMEQ7QUFDMUQsMEVBT21EO0FBQ25ELDhGQUFrRjtBQUNsRiwwRUFBa0U7QUFFbEUsZ0hBQStGO0FBQy9GLGdEQUF3QjtBQUN4QixrRUFBZ0U7QUFFaEUsTUFBTSxRQUFRLEdBQUcsaUNBQWlDLENBQUM7QUFFbkQsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDdEIsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ2xCLE1BQU0sY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVCLE1BQU0sY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxRQUFRLEdBQWlCLE9BQU8sQ0FBQztJQUN2QyxNQUFNLGNBQWMsR0FBRyxJQUFJLG9DQUFjLEVBQUUsQ0FBQztJQUU1QyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3hCLE1BQU0sY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTdCLE1BQU0sY0FBYyxHQUFHLE1BQU0sY0FBYyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDaEUsTUFBTSxZQUFZLEdBQUcsTUFBTSxjQUFjLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFNUQ7Ozs7V0FJRztRQUNILE1BQU0sd0JBQXdCLEdBQUcsY0FBYyxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDMUUsTUFBTSxXQUFXLEdBQUc7WUFDbEIsVUFBVSxFQUFFLGNBQWMsQ0FBQyx3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