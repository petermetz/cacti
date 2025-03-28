"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest-extended");
const uuid_1 = require("uuid");
const HelloWorld_json_1 = __importDefault(require("../../../../solidity/hello-world-contract/HelloWorld.json"));
const web3_1 = __importDefault(require("web3"));
const web3js_quorum_1 = __importDefault(require("web3js-quorum"));
const cactus_test_tooling_1 = require("@hyperledger/cactus-test-tooling");
const typescript_1 = require("../../../../../main/typescript");
const cactus_core_api_1 = require("@hyperledger/cactus-core-api");
const cactus_core_1 = require("@hyperledger/cactus-core");
const cactus_plugin_keychain_memory_1 = require("@hyperledger/cactus-plugin-keychain-memory");
describe("PluginLedgerConnectorBesu", () => {
    const containerImageName = "ghcr.io/hyperledger/cactus-besu-all-in-one-multi-party";
    const containerImageTag = "2023-08-08-pr-2596";
    const testCase = "Executes private transactions on Hyperledger Besu";
    const logLevel = "INFO";
    const doctorCactusHex = "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000d446f63746f722043616374757300000000000000000000000000000000000000";
    // WARNING: the keys here are demo purposes ONLY. Please use a tool like Orchestrate or EthSigner for production, rather than hard coding private keys
    const keysStatic = {
        tessera: {
            member1: {
                publicKey: "BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=",
            },
            member2: {
                publicKey: "QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=",
            },
            member3: {
                publicKey: "1iTZde/ndBHvzhcl7V68x44Vx7pl8nwx9LqnM/AfJUg=",
            },
        },
        besu: {
            member1: {
                url: "http://127.0.0.1:20000",
                wsUrl: "ws://127.0.0.1:20001",
                privateKey: "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
            },
            member2: {
                url: "http://127.0.0.1:20002",
                wsUrl: "ws://127.0.0.1:20003",
                privateKey: "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
            },
            member3: {
                url: "http://127.0.0.1:20004",
                wsUrl: "ws://127.0.0.1:20005",
                privateKey: "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
            },
            ethsignerProxy: {
                url: "http://127.0.0.1:18545",
                accountAddress: "9b790656b9ec0db1936ed84b3bea605873558198",
            },
        },
    };
    const infrastructureElements = [];
    afterAll(async () => {
        for (let index = 0; index < infrastructureElements.length; index++) {
            const aStoppable = infrastructureElements[index];
            await aStoppable.stop();
        }
    });
    test(testCase, async () => {
        // At development time one can specify this environment variable if there is
        // a multi-party network already running, which is doable with something like
        // this on the terminal:
        // docker run   --rm   --privileged   --publish 2222:22   --publish 3000:3000   --publish 8545:8545   --publish 8546:8546   --publish 9001:9001   --publish 9081:9081   --publish 9082:9082   --publish 9083:9083   --publish 9090:9090   --publish 18545:18545   --publish 20000:20000   --publish 20001:20001   --publish 20002:20002   --publish 20003:20003   --publish 20004:20004   --publish 20005:20005   --publish 25000:25000   petermetz/cactus-besu-multi-party-all-in-one:0.1.2
        //
        // The upside of this approach is that a new container is not launched from
        // scratch for every test execution which enables faster iteration.
        const preWarmedLedger = process.env.CACTUS_TEST_PRE_WARMED_LEDGER === "true";
        let keys;
        if (preWarmedLedger) {
            keys = keysStatic;
        }
        else {
            const ledger = new cactus_test_tooling_1.BesuMpTestLedger({
                logLevel,
                imageName: containerImageName,
                imageTag: containerImageTag,
                emitContainerLogs: false,
            });
            infrastructureElements.push(ledger);
            await ledger.start();
            keys = await ledger.getKeys();
        }
        const rpcApiHttpHostMember1 = keys.besu.member1.url;
        const rpcApiHttpHostMember2 = keys.besu.member2.url;
        const rpcApiHttpHostMember3 = keys.besu.member3.url;
        const rpcApiWsHostMember1 = keys.besu.member1.wsUrl;
        const rpcApiWsHostMember2 = keys.besu.member2.wsUrl;
        const rpcApiWsHostMember3 = keys.besu.member3.wsUrl;
        const web3Member1 = new web3_1.default(rpcApiHttpHostMember1);
        const web3Member2 = new web3_1.default(rpcApiHttpHostMember2);
        const web3Member3 = new web3_1.default(rpcApiHttpHostMember3);
        const pluginRegistry1 = new cactus_core_1.PluginRegistry();
        const pluginRegistry2 = new cactus_core_1.PluginRegistry();
        const pluginRegistry3 = new cactus_core_1.PluginRegistry();
        const pluginFactoryLedgerConnector = new typescript_1.PluginFactoryLedgerConnector({
            pluginImportType: cactus_core_api_1.PluginImportType.Local,
        });
        const connectorInstanceId1 = "besu1_" + (0, uuid_1.v4)();
        const connectorInstanceId2 = "besu2_" + (0, uuid_1.v4)();
        const connectorInstanceId3 = "besu3_" + (0, uuid_1.v4)();
        const keychainInstanceId1 = "keychain_instance1_" + (0, uuid_1.v4)();
        const keychainId1 = "keychain1_" + (0, uuid_1.v4)();
        const keychain1 = new cactus_plugin_keychain_memory_1.PluginKeychainMemory({
            instanceId: keychainInstanceId1,
            keychainId: keychainId1,
            logLevel,
        });
        expect(keychain1).toBeTruthy();
        keychain1.set(HelloWorld_json_1.default.contractName, JSON.stringify(HelloWorld_json_1.default));
        pluginRegistry1.add(keychain1);
        const keychainInstanceId2 = "keychain_instance2_" + (0, uuid_1.v4)();
        const keychainId2 = "keychain2_" + (0, uuid_1.v4)();
        const keychain2 = new cactus_plugin_keychain_memory_1.PluginKeychainMemory({
            instanceId: keychainInstanceId2,
            keychainId: keychainId2,
            logLevel,
        });
        expect(keychain2).toBeTruthy();
        keychain2.set(HelloWorld_json_1.default.contractName, JSON.stringify(HelloWorld_json_1.default));
        pluginRegistry2.add(keychain2);
        const keychainInstanceId3 = "keychain_instance3_" + (0, uuid_1.v4)();
        const keychainId3 = "keychain3_" + (0, uuid_1.v4)();
        const keychain3 = new cactus_plugin_keychain_memory_1.PluginKeychainMemory({
            instanceId: keychainInstanceId3,
            keychainId: keychainId3,
            logLevel,
        });
        expect(keychain3).toBeTruthy();
        keychain3.set(HelloWorld_json_1.default.contractName, JSON.stringify(HelloWorld_json_1.default));
        pluginRegistry3.add(keychain3);
        const connector1 = await pluginFactoryLedgerConnector.create({
            instanceId: connectorInstanceId1,
            pluginRegistry: pluginRegistry1,
            rpcApiHttpHost: rpcApiHttpHostMember1,
            rpcApiWsHost: rpcApiWsHostMember1,
            logLevel,
        });
        expect(connector1).toBeTruthy();
        infrastructureElements.push({ stop: () => connector1.shutdown() });
        pluginRegistry1.add(connector1);
        const connector2 = await pluginFactoryLedgerConnector.create({
            instanceId: connectorInstanceId2,
            pluginRegistry: pluginRegistry2,
            rpcApiHttpHost: rpcApiHttpHostMember2,
            rpcApiWsHost: rpcApiWsHostMember2,
            logLevel,
        });
        expect(connector2).toBeTruthy();
        infrastructureElements.push({ stop: () => connector2.shutdown() });
        pluginRegistry2.add(connector2);
        const connector3 = await pluginFactoryLedgerConnector.create({
            instanceId: connectorInstanceId3,
            pluginRegistry: pluginRegistry3,
            rpcApiHttpHost: rpcApiHttpHostMember3,
            rpcApiWsHost: rpcApiWsHostMember3,
            logLevel,
        });
        expect(connector3).toBeTruthy();
        infrastructureElements.push({ stop: () => connector3.shutdown() });
        pluginRegistry3.add(connector3);
        await connector1.onPluginInit();
        await connector2.onPluginInit();
        await connector3.onPluginInit();
        const web3QuorumMember1 = (0, web3js_quorum_1.default)(web3Member1);
        expect(web3QuorumMember1).toBeTruthy();
        const web3QuorumMember2 = (0, web3js_quorum_1.default)(web3Member2);
        expect(web3QuorumMember2).toBeTruthy();
        const web3QuorumMember3 = (0, web3js_quorum_1.default)(web3Member3);
        expect(web3QuorumMember3).toBeTruthy();
        const deployOut = await connector1.deployContract({
            bytecode: HelloWorld_json_1.default.bytecode,
            contractAbi: HelloWorld_json_1.default.abi,
            contractName: HelloWorld_json_1.default.contractName,
            constructorArgs: [],
            privateTransactionConfig: {
                privateFrom: keys.tessera.member1.publicKey,
                privateFor: [
                    keys.tessera.member1.publicKey,
                    keys.tessera.member2.publicKey,
                ],
            },
            web3SigningCredential: {
                secret: keys.besu.member1.privateKey,
                type: typescript_1.Web3SigningCredentialType.PrivateKeyHex,
            },
            keychainId: keychain1.getKeychainId(),
            gas: 3000000,
        });
        expect(deployOut).toBeTruthy();
        expect(deployOut).toBeObject();
        expect(deployOut.transactionReceipt).toBeTruthy();
        expect(deployOut.transactionReceipt).toBeObject();
        expect(deployOut.transactionReceipt.contractAddress).toBeTruthy();
        expect(deployOut.transactionReceipt.contractAddress).toBeString();
        expect(deployOut.transactionReceipt.commitmentHash).toBeTruthy();
        expect(deployOut.transactionReceipt.commitmentHash).toBeString();
        // t.ok(deployRes.status, "deployRes.status truthy OK");
        // t.equal(deployRes.status, 200, "deployRes.status === 200 OK");
        // t.ok(deployRes.data, "deployRes.data truthy OK");
        // t.ok(
        //   deployRes.data.transactionReceipt,
        //   "deployRes.data.transactionReceipt truthy OK",
        // );
        // t.ok(privacyMarkerTxHash, "privacyMarkerTxHash truthy OK");
        const contractDeployReceipt = (await web3QuorumMember1.priv.waitForTransactionReceipt(deployOut.transactionReceipt.commitmentHash));
        expect(contractDeployReceipt).toBeTruthy();
        const receipt = contractDeployReceipt;
        const { contractAddress } = receipt;
        expect(contractAddress).toBeTruthy();
        expect(contractAddress).toBeString();
        expect(contractAddress).not.toBeEmpty();
        // Check that the third node does not see the transaction of the contract
        // deployment that was sent to node 1 and 2 only, not 3.
        const txReceiptNever = await web3QuorumMember3.priv.waitForTransactionReceipt(deployOut.transactionReceipt.commitmentHash);
        expect(txReceiptNever).toBeFalsy();
        // Check that node 1 and 2 can indeed see the transaction for the contract
        // deployment that was sent to them and them only (node 3 was left out)
        // Note that changing this to use web3QuorumMember3 breaks it and I'm suspecting
        // that this is what's plaguing the tests that are based on the connector
        // which is instantiated with a single web3+web3 Quorum client.
        // What I will try next is to have 3 connectors each with a web3 Quorum client
        // that points to one of the 3 nodes and see if that makes it work.
        const txReceiptAlways1 = await web3QuorumMember1.priv.waitForTransactionReceipt(deployOut.transactionReceipt.commitmentHash);
        expect(txReceiptAlways1).toBeTruthy();
        const txReceiptAlways2 = await web3QuorumMember2.priv.waitForTransactionReceipt(deployOut.transactionReceipt.commitmentHash);
        expect(txReceiptAlways2).toBeTruthy();
        const contract = new web3Member1.eth.Contract(HelloWorld_json_1.default.abi);
        {
            const data = contract.methods.setName("ProfessorCactus - #1").encodeABI();
            const functionParams = {
                to: contractDeployReceipt.contractAddress,
                data,
                privateFrom: keys.tessera.member1.publicKey,
                privateFor: [keys.tessera.member2.publicKey],
                privateKey: keys.besu.member1.privateKey,
            };
            const transactionHash = await web3QuorumMember1.priv.generateAndSendRawTransaction(functionParams);
            expect(transactionHash).toBeTruthy();
            expect(transactionHash).not.toBeEmpty();
            expect(transactionHash).toBeString();
            const result = await web3QuorumMember1.priv.waitForTransactionReceipt(transactionHash);
            expect(result).toBeTruthy();
        }
        {
            const data = contract.methods.getName().encodeABI();
            const fnParams = {
                to: contractDeployReceipt.contractAddress,
                data,
                privateFrom: keys.tessera.member1.publicKey,
                privateFor: [keys.tessera.member2.publicKey],
                privateKey: keys.besu.member1.privateKey,
            };
            const privacyGroupId = web3QuorumMember1.utils.generatePrivacyGroup(fnParams);
            const callOutput = await web3QuorumMember1.priv.call(privacyGroupId, {
                to: contractDeployReceipt.contractAddress,
                data: contract.methods.getName().encodeABI(),
            });
            expect(callOutput).toBeTruthy();
            const name = web3Member1.eth.abi.decodeParameter("string", callOutput);
            expect(name).toEqual("ProfessorCactus - #1");
        }
        {
            // Member 3 cannot see into the privacy group of 1 and 2 so the getName
            // will not return the value that was set earlier in that privacy group.
            const data = contract.methods.getName().encodeABI();
            const fnParams = {
                to: contractDeployReceipt.contractAddress,
                data,
                privateFrom: keys.tessera.member1.publicKey,
                privateFor: [keys.tessera.member2.publicKey],
                privateKey: keys.besu.member3.privateKey,
            };
            const privacyGroupId = web3QuorumMember3.utils.generatePrivacyGroup(fnParams);
            const callOutput = await web3QuorumMember3.priv.call(privacyGroupId, {
                to: contractDeployReceipt.contractAddress,
                data,
            });
            expect(callOutput).toEqual("0x");
        }
        {
            const data = contract.methods.setName("ProfessorCactus - #2").encodeABI();
            const functionParams = {
                to: contractDeployReceipt.contractAddress,
                data,
                privateFrom: keys.tessera.member2.publicKey,
                privateFor: [keys.tessera.member2.publicKey],
                privateKey: keys.besu.member2.privateKey,
            };
            const transactionHash = await web3QuorumMember2.priv.generateAndSendRawTransaction(functionParams);
            expect(transactionHash).toBeTruthy();
            const result = await web3QuorumMember2.priv.waitForTransactionReceipt(transactionHash);
            expect(result).toBeTruthy();
        }
        {
            const data = contract.methods.setName("ProfessorCactus - #3").encodeABI();
            const functionParams = {
                to: contractDeployReceipt.contractAddress,
                data,
                privateFrom: keys.tessera.member3.publicKey,
                privateKey: keys.besu.member3.privateKey,
                privateFor: [keys.tessera.member2.publicKey],
            };
            const transactionHash = await web3QuorumMember3.priv.generateAndSendRawTransaction(functionParams);
            expect(transactionHash).toBeTruthy();
            const result = await web3QuorumMember3.priv.waitForTransactionReceipt(transactionHash);
            expect(result).toBeTruthy();
        }
        {
            const contractInvocationNoPrivTxConfig = connector1.invokeContract({
                contractName: HelloWorld_json_1.default.contractName,
                contractAbi: HelloWorld_json_1.default.abi,
                contractAddress: contractDeployReceipt.contractAddress,
                invocationType: typescript_1.EthContractInvocationType.Call,
                gas: 3000000,
                methodName: "getName",
                params: [],
                signingCredential: {
                    secret: "incorrect-secret",
                    type: typescript_1.Web3SigningCredentialType.PrivateKeyHex,
                },
            });
            // try {
            //   await contractInvocationNoPrivTxConfig;
            // } catch (ex) {
            //   console.log(ex);
            // }
            const wrongSecretErrorMsgPattern = /Returned values aren't valid, did it run Out of Gas\? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from, requesting data from a block number that does not exist, or querying a node which is not fully synced\./;
            await expect(contractInvocationNoPrivTxConfig).rejects.toHaveProperty("message", expect.stringMatching(wrongSecretErrorMsgPattern));
        }
        {
            const res = await connector1.invokeContract({
                contractName: HelloWorld_json_1.default.contractName,
                contractAbi: HelloWorld_json_1.default.abi,
                contractAddress: contractDeployReceipt.contractAddress,
                invocationType: typescript_1.EthContractInvocationType.Send,
                gas: 3000000,
                methodName: "setName",
                params: ["Doctor Cactus"],
                privateTransactionConfig: {
                    privateFrom: keys.tessera.member1.publicKey,
                    privateFor: [keys.tessera.member2.publicKey],
                },
                signingCredential: {
                    secret: keys.besu.member1.privateKey,
                    type: typescript_1.Web3SigningCredentialType.PrivateKeyHex,
                },
            });
            expect(res.success).toEqual("0x1");
        }
        {
            const res = await connector1.invokeContract({
                contractName: HelloWorld_json_1.default.contractName,
                contractAbi: HelloWorld_json_1.default.abi,
                contractAddress: contractDeployReceipt.contractAddress,
                invocationType: typescript_1.EthContractInvocationType.Call,
                gas: 3000000,
                methodName: "getName",
                params: [],
                privateTransactionConfig: {
                    privateFrom: keys.tessera.member1.publicKey,
                    privateFor: [keys.tessera.member2.publicKey],
                },
                signingCredential: {
                    secret: keys.besu.member1.privateKey,
                    type: typescript_1.Web3SigningCredentialType.PrivateKeyHex,
                },
            });
            expect(res.callOutput).toEqual(doctorCactusHex);
        }
        {
            const res = await connector2.invokeContract({
                contractName: HelloWorld_json_1.default.contractName,
                contractAbi: HelloWorld_json_1.default.abi,
                contractAddress: contractDeployReceipt.contractAddress,
                invocationType: typescript_1.EthContractInvocationType.Call,
                gas: 3000000,
                methodName: "getName",
                params: [],
                privateTransactionConfig: {
                    privateFrom: keys.tessera.member1.publicKey,
                    privateFor: [keys.tessera.member2.publicKey],
                },
                signingCredential: {
                    secret: keys.besu.member1.privateKey,
                    type: typescript_1.Web3SigningCredentialType.PrivateKeyHex,
                },
            });
            expect(res.callOutput).toEqual(doctorCactusHex);
        }
        {
            const res = await connector3.invokeContract({
                contractName: HelloWorld_json_1.default.contractName,
                contractAbi: HelloWorld_json_1.default.abi,
                contractAddress: contractDeployReceipt.contractAddress,
                invocationType: typescript_1.EthContractInvocationType.Call,
                gas: 3000000,
                methodName: "getName",
                params: [],
                privateTransactionConfig: {
                    privateFrom: keys.tessera.member1.publicKey,
                    privateFor: [keys.tessera.member2.publicKey],
                },
                signingCredential: {
                    secret: keys.besu.member3.privateKey,
                    type: typescript_1.Web3SigningCredentialType.PrivateKeyHex,
                },
            });
            expect(res.callOutput).toEqual("0x");
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpdmF0ZS1kZXBsb3ktY29udHJhY3QtZnJvbS1qc29uLWNhY3R1cy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3Rlc3QvdHlwZXNjcmlwdC9pbnRlZ3JhdGlvbi9wbHVnaW4tbGVkZ2VyLWNvbm5lY3Rvci1iZXN1L2RlcGxveS1jb250cmFjdC9wcml2YXRlLWRlcGxveS1jb250cmFjdC1mcm9tLWpzb24tY2FjdHVzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5QkFBdUI7QUFDdkIsK0JBQW9DO0FBQ3BDLGdIQUErRjtBQUMvRixnREFBd0I7QUFDeEIsa0VBQXlFO0FBQ3pFLDBFQUFvRTtBQUVwRSwrREFJd0M7QUFDeEMsa0VBQWdFO0FBQ2hFLDBEQUEwRDtBQUMxRCw4RkFBa0Y7QUFFbEYsUUFBUSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtJQUN6QyxNQUFNLGtCQUFrQixHQUN0Qix3REFBd0QsQ0FBQztJQUMzRCxNQUFNLGlCQUFpQixHQUFHLG9CQUFvQixDQUFDO0lBQy9DLE1BQU0sUUFBUSxHQUFHLG1EQUFtRCxDQUFDO0lBQ3JFLE1BQU0sUUFBUSxHQUFpQixNQUFNLENBQUM7SUFFdEMsTUFBTSxlQUFlLEdBQ25CLG9NQUFvTSxDQUFDO0lBRXZNLHNKQUFzSjtJQUN0SixNQUFNLFVBQVUsR0FBRztRQUNqQixPQUFPLEVBQUU7WUFDUCxPQUFPLEVBQUU7Z0JBQ1AsU0FBUyxFQUFFLDhDQUE4QzthQUMxRDtZQUNELE9BQU8sRUFBRTtnQkFDUCxTQUFTLEVBQUUsOENBQThDO2FBQzFEO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLFNBQVMsRUFBRSw4Q0FBOEM7YUFDMUQ7U0FDRjtRQUNELElBQUksRUFBRTtZQUNKLE9BQU8sRUFBRTtnQkFDUCxHQUFHLEVBQUUsd0JBQXdCO2dCQUM3QixLQUFLLEVBQUUsc0JBQXNCO2dCQUM3QixVQUFVLEVBQ1Isa0VBQWtF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