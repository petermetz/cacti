"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tape_1 = __importDefault(require("tape-promise/tape"));
const HelloWorld_json_1 = __importDefault(require("../../../../solidity/hello-world-contract/HelloWorld.json"));
const web3_1 = __importDefault(require("web3"));
const web3js_quorum_1 = __importDefault(require("web3js-quorum"));
const cactus_test_tooling_1 = require("@hyperledger/cactus-test-tooling");
const containerImageName = "ghcr.io/hyperledger/cactus-besu-all-in-one-multi-party";
const containerImageTag = "2023-08-08-pr-2596";
const testCase = "Executes private transactions on Hyperledger Besu";
const logLevel = "TRACE";
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
(0, tape_1.default)(testCase, async (t) => {
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
        tape_1.default.onFinish(() => ledger.stop());
        await ledger.start();
        keys = await ledger.getKeys();
    }
    const rpcApiHttpHostMember1 = keys.besu.member1.url;
    const rpcApiHttpHostMember2 = keys.besu.member2.url;
    const rpcApiHttpHostMember3 = keys.besu.member3.url;
    const web3Member1 = new web3_1.default(rpcApiHttpHostMember1);
    const web3Member2 = new web3_1.default(rpcApiHttpHostMember2);
    const web3Member3 = new web3_1.default(rpcApiHttpHostMember3);
    const chainIdMember1 = await web3Member1.eth.getChainId();
    t.comment(`chainIdMember1=${chainIdMember1}`);
    const chainIdMember2 = await web3Member2.eth.getChainId();
    t.comment(`chainIdMember2=${chainIdMember2}`);
    const chainIdMember3 = await web3Member3.eth.getChainId();
    t.comment(`chainIdMember3=${chainIdMember3}`);
    const web3QuorumMember1 = (0, web3js_quorum_1.default)(web3Member1);
    t.ok(web3QuorumMember1, "web3QuorumMember1 truthy OK");
    const web3QuorumMember2 = (0, web3js_quorum_1.default)(web3Member2);
    t.ok(web3QuorumMember2, "web3QuorumMember2 truthy OK");
    const web3QuorumMember3 = (0, web3js_quorum_1.default)(web3Member3);
    t.ok(web3QuorumMember3, "web3QuorumMember3 truthy OK");
    const commitmentHash = await web3QuorumMember1.priv.generateAndSendRawTransaction({
        data: "0x" + HelloWorld_json_1.default.bytecode,
        privateFrom: keys.tessera.member1.publicKey,
        privateFor: [
            keys.tessera.member1.publicKey,
            keys.tessera.member2.publicKey,
        ],
        privateKey: keys.besu.member1.privateKey,
        gasLimit: "0x2DC6C0",
    });
    t.ok(commitmentHash, "commitmentHash truthy OK");
    const contractDeployReceipt = (await web3QuorumMember1.priv.waitForTransactionReceipt(commitmentHash));
    t.ok(contractDeployReceipt, "contractDeployReceipt truthy OK");
    const receipt = contractDeployReceipt;
    const { contractAddress } = receipt;
    t.comment(`Private contract address: ${contractAddress}`);
    t.ok(contractAddress, "contractAddress truthy OK");
    // Check that the third node does not see the transaction of the contract
    // deployment that was sent to node 1 and 2 only, not 3.
    const txReceiptNever = await web3QuorumMember3.priv.waitForTransactionReceipt(commitmentHash);
    t.notok(txReceiptNever, "txReceiptNever falsy OK");
    // Check that node 1 and 2 can indeed see the transaction for the contract
    // deployment that was sent to them and them only (node 3 was left out)
    // Note that changing this to use web3QuorumMember3 breaks it and I'm suspecting
    // that this is what's plaguing the tests that are based on the connector
    // which is instantiated with a single web3+web3 Quorum client.
    // What I will try next is to have 3 connectors each with a web3 Quorum client
    // that points to one of the 3 nodes and see if that makes it work.
    const txReceiptAlways1 = await web3QuorumMember1.priv.waitForTransactionReceipt(commitmentHash);
    t.ok(txReceiptAlways1, "txReceiptAlways1 truthy OK");
    const txReceiptAlways2 = await web3QuorumMember2.priv.waitForTransactionReceipt(commitmentHash);
    t.ok(txReceiptAlways2, "txReceiptAlways2 truthy OK");
    const contract = new web3Member1.eth.Contract(HelloWorld_json_1.default.abi);
    const setNameAbi = contract["_jsonInterface"].find((e) => e.name === "setName");
    t.ok(setNameAbi, "setNameAbi truthy OK");
    t.ok(setNameAbi.inputs, "setNameAbi.inputs truthy OK");
    t.ok(setNameAbi.signature, "setNameAbi.signature truthy OK");
    const getNameAbi = contract["_jsonInterface"].find((e) => e.name === "getName");
    t.ok(getNameAbi, "getNameAbi truthy OK");
    t.ok(getNameAbi.inputs, "getNameAbi.inputs truthy OK");
    t.ok(getNameAbi.signature, "getNameAbi.signature truthy OK");
    {
        t.comment("Checking if member1 can call setName()");
        const functionArgs = web3Member1.eth.abi
            .encodeParameters(setNameAbi.inputs, ["ProfessorCactus - #1"])
            .slice(2);
        const functionParams = {
            to: contractDeployReceipt.contractAddress,
            data: setNameAbi.signature + functionArgs,
            privateFrom: keys.tessera.member1.publicKey,
            privateFor: [keys.tessera.member2.publicKey],
            privateKey: keys.besu.member1.privateKey,
        };
        const transactionHash = await web3QuorumMember1.priv.generateAndSendRawTransaction(functionParams);
        t.comment(`Transaction hash: ${transactionHash}`);
        t.ok(transactionHash, "transactionHash truthy OK");
        const result = await web3QuorumMember1.priv.waitForTransactionReceipt(transactionHash);
        t.comment(`Transaction receipt for set() call: ${JSON.stringify(result)}`);
        t.ok(result, "set() result member 1 truthy OK");
    }
    {
        t.comment("Checking if member1 can see new name via getName()");
        const functionArgs = web3Member1.eth.abi
            .encodeParameters(getNameAbi.inputs, [])
            .slice(2);
        const fnParams = {
            to: contractDeployReceipt.contractAddress,
            data: getNameAbi.signature + functionArgs,
            privateFrom: keys.tessera.member1.publicKey,
            privateFor: [keys.tessera.member2.publicKey],
            privateKey: keys.besu.member1.privateKey,
        };
        const privacyGroupId = web3QuorumMember1.utils.generatePrivacyGroup(fnParams);
        const callOutput = await web3QuorumMember1.priv.call(privacyGroupId, {
            to: contractDeployReceipt.contractAddress,
            data: contract.methods.getName().encodeABI(),
        });
        t.comment(`getName Call output: ${JSON.stringify(callOutput)}`);
        t.ok(callOutput, "callOutput truthy OK");
        const name = web3Member1.eth.abi.decodeParameter("string", callOutput);
        t.equal(name, "ProfessorCactus - #1", "getName() member 1 equals #1");
    }
    {
        // Member 3 cannot see into the privacy group of 1 and 2 so the getName
        // will not return the value that was set earlier in that privacy group.
        t.comment("Checking if member3 can see new name via getName()");
        const fnParams = {
            to: contractDeployReceipt.contractAddress,
            data: contract.methods.getName().encodeABI(),
            privateFrom: keys.tessera.member1.publicKey,
            privateFor: [keys.tessera.member2.publicKey],
            privateKey: keys.besu.member3.privateKey,
        };
        const privacyGroupId = web3QuorumMember3.utils.generatePrivacyGroup(fnParams);
        const callOutput = await web3QuorumMember3.priv.call(privacyGroupId, {
            to: contractDeployReceipt.contractAddress,
            data: getNameAbi.signature,
        });
        t.comment(`getName member3 output: ${JSON.stringify(callOutput)}`);
        t.equal(callOutput, "0x", "member3 getName callOutput === 0x OK");
    }
    {
        t.comment("Checking if member2 can call setName()");
        const functionArgs = web3Member2.eth.abi
            .encodeParameters(setNameAbi.inputs, ["ProfessorCactus - #2"])
            .slice(2);
        const functionParams = {
            to: contractDeployReceipt.contractAddress,
            data: setNameAbi.signature + functionArgs,
            privateFrom: keys.tessera.member2.publicKey,
            privateFor: [keys.tessera.member2.publicKey],
            privateKey: keys.besu.member2.privateKey,
        };
        const transactionHash = await web3QuorumMember2.priv.generateAndSendRawTransaction(functionParams);
        t.comment(`Transaction hash: ${transactionHash}`);
        t.ok(transactionHash, "transactionHash truthy OK");
        const result = await web3QuorumMember2.priv.waitForTransactionReceipt(transactionHash);
        t.comment(`Transaction receipt for set() call: ${JSON.stringify(result)}`);
        t.ok(result, "set() result member 2 truthy OK");
    }
    {
        t.comment("Checking if member3 can call setName()");
        const functionArgs = web3Member3.eth.abi
            .encodeParameters(setNameAbi.inputs, ["ProfessorCactus - #3"])
            .slice(2);
        const functionParams = {
            to: contractDeployReceipt.contractAddress,
            data: setNameAbi.signature + functionArgs,
            privateFrom: keys.tessera.member3.publicKey,
            privateKey: keys.besu.member3.privateKey,
            privateFor: [keys.tessera.member2.publicKey],
        };
        const transactionHash = await web3QuorumMember3.priv.generateAndSendRawTransaction(functionParams);
        t.comment(`setName tx hash for member 3: ${transactionHash}`);
        t.ok(transactionHash, "setName tx hash for member 3 truthy OK");
        const result = await web3QuorumMember3.priv.waitForTransactionReceipt(transactionHash);
        t.comment(`Transaction receipt for set() call: ${JSON.stringify(result)}`);
        t.ok(result, "set() result for member 3 truthy OK");
    }
    t.end();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpdmF0ZS1kZXBsb3ktY29udHJhY3QtZnJvbS1qc29uLXdlYjMtZWVhLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvdGVzdC90eXBlc2NyaXB0L2ludGVncmF0aW9uL3BsdWdpbi1sZWRnZXItY29ubmVjdG9yLWJlc3UvZGVwbG95LWNvbnRyYWN0L3ByaXZhdGUtZGVwbG95LWNvbnRyYWN0LWZyb20tanNvbi13ZWIzLWVlYS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkRBQStDO0FBQy9DLGdIQUErRjtBQUMvRixnREFBd0I7QUFDeEIsa0VBQXlFO0FBQ3pFLDBFQUFvRTtBQUlwRSxNQUFNLGtCQUFrQixHQUN0Qix3REFBd0QsQ0FBQztBQUMzRCxNQUFNLGlCQUFpQixHQUFHLG9CQUFvQixDQUFDO0FBQy9DLE1BQU0sUUFBUSxHQUFHLG1EQUFtRCxDQUFDO0FBQ3JFLE1BQU0sUUFBUSxHQUFpQixPQUFPLENBQUM7QUFFdkMsc0pBQXNKO0FBQ3RKLE1BQU0sVUFBVSxHQUFHO0lBQ2pCLE9BQU8sRUFBRTtRQUNQLE9BQU8sRUFBRTtZQUNQLFNBQVMsRUFBRSw4Q0FBOEM7U0FDMUQ7UUFDRCxPQUFPLEVBQUU7WUFDUCxTQUFTLEVBQUUsOENBQThDO1NBQzFEO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsU0FBUyxFQUFFLDhDQUE4QztTQUMxRDtLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osT0FBTyxFQUFFO1lBQ1AsR0FBRyxFQUFFLHdCQUF3QjtZQUM3QixLQUFLLEVBQUUsc0JBQXNCO1lBQzdCLFVBQVUsRUFDUixrRUFBa0U7U0FDckU7UUFDRCxPQUFPLEVBQUU7WUFDUCxHQUFHLEVBQUUsd0JBQXdCO1lBQzdCLEtBQUssRUFBRSxzQkFBc0I7WUFDN0IsVUFBVSxFQUNSLGtFQUFrRTtTQUNyRTtRQUNELE9BQU8sRUFBRTtZQUNQLEdBQUcsRUFBRSx3QkFBd0I7WUFDN0Is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