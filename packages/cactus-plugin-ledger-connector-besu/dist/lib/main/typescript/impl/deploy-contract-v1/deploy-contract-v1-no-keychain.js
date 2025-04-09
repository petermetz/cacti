"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployContractV1NoKeychain = deployContractV1NoKeychain;
const cactus_common_1 = require("@hyperledger/cactus-common");
const typescript_axios_1 = require("../../generated/openapi/typescript-axios");
const model_type_guards_1 = require("../../model-type-guards");
const transact_v1_impl_1 = require("../transact-v1/transact-v1-impl");
async function deployContractV1NoKeychain(ctx, req) {
    const fnTag = `deployContractNoKeychain()`;
    cactus_common_1.Checks.truthy(req, `${fnTag} req`);
    const log = cactus_common_1.LoggerProvider.getOrCreate({
        label: "deployContractV1NoKeychain()",
        level: ctx.logLevel,
    });
    if ((0, model_type_guards_1.isWeb3SigningCredentialNone)(req.web3SigningCredential)) {
        throw new Error(`${fnTag} Cannot deploy contract with pre-signed TX`);
    }
    const tmpContract = new ctx.web3.eth.Contract(req.contractAbi);
    const deployment = tmpContract.deploy({
        data: req.bytecode,
        arguments: req.constructorArgs,
    });
    const abi = deployment.encodeABI();
    const data = abi.startsWith("0x") ? abi : `0x${abi}`;
    log.debug(`Deploying "${req.contractName}" with data %o`, data);
    const web3SigningCredential = req.web3SigningCredential;
    const transactV1ImplCtx = {
        prometheusExporter: ctx.prometheusExporter,
        pluginRegistry: ctx.pluginRegistry,
        logLevel: ctx.logLevel,
        web3: ctx.web3,
    };
    const transactV1ImplReq = {
        transactionConfig: {
            data,
            from: web3SigningCredential.ethAccount,
            gas: req.gas,
            gasPrice: req.gasPrice,
        },
        consistencyStrategy: {
            blockConfirmations: 0,
            receiptType: typescript_axios_1.ReceiptType.NodeTxPoolAck,
            timeoutMs: req.timeoutMs || 60000,
        },
        web3SigningCredential,
        privateTransactionConfig: req.privateTransactionConfig,
    };
    const runTxResponse = await (0, transact_v1_impl_1.transactV1Impl)(transactV1ImplCtx, transactV1ImplReq);
    const { transactionReceipt: receipt } = runTxResponse;
    const { status, contractAddress } = receipt;
    cactus_common_1.Checks.truthy(status, `deployContractNoKeychain():status`);
    cactus_common_1.Checks.truthy(contractAddress, `deployContractNoKeychain():contractAddress`);
    const res = {
        transactionReceipt: runTxResponse.transactionReceipt,
    };
    return res;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95LWNvbnRyYWN0LXYxLW5vLWtleWNoYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9pbXBsL2RlcGxveS1jb250cmFjdC12MS9kZXBsb3ktY29udHJhY3QtdjEtbm8ta2V5Y2hhaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFrQkEsZ0VBd0VDO0FBMUZELDhEQUlvQztBQUNwQywrRUFNa0Q7QUFDbEQsK0RBQXNFO0FBSXRFLHNFQUFpRTtBQUUxRCxLQUFLLFVBQVUsMEJBQTBCLENBQzlDLEdBS0MsRUFDRCxHQUFzRDtJQUV0RCxNQUFNLEtBQUssR0FBRyw0QkFBNEIsQ0FBQztJQUMzQyxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLE1BQU0sQ0FBQyxDQUFDO0lBRW5DLE1BQU0sR0FBRyxHQUFHLDhCQUFjLENBQUMsV0FBVyxDQUFDO1FBQ3JDLEtBQUssRUFBRSw4QkFBOEI7UUFDckMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxRQUFRO0tBQ3BCLENBQUMsQ0FBQztJQUVILElBQUksSUFBQSwrQ0FBMkIsRUFBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsRUFBRSxDQUFDO1FBQzNELE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLDRDQUE0QyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVELE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMvRCxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQ3BDLElBQUksRUFBRSxHQUFHLENBQUMsUUFBUTtRQUNsQixTQUFTLEVBQUUsR0FBRyxDQUFDLGVBQWU7S0FDL0IsQ0FBQyxDQUFDO0lBRUgsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25DLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNyRCxHQUFHLENBQUMsS0FBSyxDQUFDLGNBQWMsR0FBRyxDQUFDLFlBQVksZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFaEUsTUFBTSxxQkFBcUIsR0FBRyxHQUFHLENBQUMscUJBRVEsQ0FBQztJQUUzQyxNQUFNLGlCQUFpQixHQUFHO1FBQ3hCLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxrQkFBa0I7UUFDMUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxjQUFjO1FBQ2xDLFFBQVEsRUFBRSxHQUFHLENBQUMsUUFBUTtRQUN0QixJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUk7S0FDZixDQUFDO0lBQ0YsTUFBTSxpQkFBaUIsR0FBRztRQUN4QixpQkFBaUIsRUFBRTtZQUNqQixJQUFJO1lBQ0osSUFBSSxFQUFFLHFCQUFxQixDQUFDLFVBQVU7WUFDdEMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHO1lBQ1osUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRO1NBQ3ZCO1FBQ0QsbUJBQW1CLEVBQUU7WUFDbkIsa0JBQWtCLEVBQUUsQ0FBQztZQUNyQixXQUFXLEVBQUUsOEJBQVcsQ0FBQyxhQUFhO1lBQ3RDLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUyxJQUFJLEtBQUs7U0FDbEM7UUFDRCxxQkFBcUI7UUFDckIsd0JBQXdCLEVBQUUsR0FBRyxDQUFDLHdCQUF3QjtLQUN2RCxDQUFDO0lBQ0YsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFBLGlDQUFjLEVBQ3hDLGlCQUFpQixFQUNqQixpQkFBaUIsQ0FDbEIsQ0FBQztJQUVGLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxPQUFPLEVBQUUsR0FBRyxhQUFhLENBQUM7SUFDdEQsTUFBTSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsR0FBRyxPQUFPLENBQUM7SUFFNUMsc0JBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLG1DQUFtQyxDQUFDLENBQUM7SUFFM0Qsc0JBQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLDRDQUE0QyxDQUFDLENBQUM7SUFFN0UsTUFBTSxHQUFHLEdBQTZDO1FBQ3BELGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxrQkFBa0I7S0FDckQsQ0FBQztJQUNGLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyJ9