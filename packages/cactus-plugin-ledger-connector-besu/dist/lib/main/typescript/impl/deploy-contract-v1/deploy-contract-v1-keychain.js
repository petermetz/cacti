"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployContractV1Keychain = deployContractV1Keychain;
const cactus_common_1 = require("@hyperledger/cactus-common");
const typescript_axios_1 = require("../../generated/openapi/typescript-axios");
const model_type_guards_1 = require("../../model-type-guards");
const http_errors_1 = __importDefault(require("http-errors"));
const transact_v1_impl_1 = require("../transact-v1/transact-v1-impl");
async function deployContractV1Keychain(ctx, req) {
    const fnTag = `deployContractV1Keychain()`;
    cactus_common_1.Checks.truthy(req, `${fnTag} req`);
    const log = cactus_common_1.LoggerProvider.getOrCreate({
        label: fnTag,
        level: ctx.logLevel,
    });
    if ((0, model_type_guards_1.isWeb3SigningCredentialNone)(req.web3SigningCredential)) {
        throw http_errors_1.default[400](`${fnTag} Cannot deploy contract with pre-signed TX`);
    }
    const { keychainId, contractName } = req;
    if (!keychainId || !req.contractName) {
        const errorMessage = `${fnTag} Cannot deploy contract without keychainId and the contractName.`;
        throw http_errors_1.default[400](errorMessage);
    }
    const keychainPlugin = ctx.pluginRegistry.findOneByKeychainId(keychainId);
    if (!keychainPlugin) {
        const errorMessage = `${fnTag} The plugin registry does not contain` +
            ` a keychain plugin for ID:"${req.keychainId}"`;
        throw http_errors_1.default[400](errorMessage);
    }
    if (!keychainPlugin.has(contractName)) {
        const errorMessage = `${fnTag} Cannot create an instance of the contract instance because` +
            `the contractName in the request does not exist on the keychain`;
        throw new http_errors_1.default[400](errorMessage);
    }
    const networkId = await ctx.web3.eth.net.getId();
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
    const runTransactionResponse = await (0, transact_v1_impl_1.transactV1Impl)(transactV1ImplCtx, transactV1ImplReq);
    const keychainHasContract = await keychainPlugin.has(contractName);
    if (!keychainHasContract) {
        const errorMessage = `${fnTag} Cannot create an instance of the contract instance because` +
            `the contractName in the request does not exist on the keychain`;
        throw new http_errors_1.default[400](errorMessage);
    }
    log.debug(`Keychain has the contract, updating networks...`);
    const { transactionReceipt: receipt } = runTransactionResponse;
    const { status, contractAddress } = receipt;
    if (status && contractAddress) {
        const networkInfo = { address: contractAddress };
        const contractStr = await keychainPlugin.get(contractName);
        const contractJSON = JSON.parse(contractStr);
        log.debug("Contract JSON: \n%o", JSON.stringify(contractJSON));
        const contract = new ctx.web3.eth.Contract(contractJSON.abi, contractAddress);
        const network = { [networkId]: networkInfo };
        contractJSON.networks = network;
        await keychainPlugin.set(contractName, JSON.stringify(contractJSON));
        const deployResponse = {
            transactionReceipt: runTransactionResponse.transactionReceipt,
        };
        const deployContractV1KeychainResponse = {
            status: status,
            contractAddress: contractAddress,
            contractName: contractName,
            contract: contract,
            deployResponse: deployResponse,
        };
        return deployContractV1KeychainResponse;
    }
    else {
        const deployResponse = {
            transactionReceipt: runTransactionResponse.transactionReceipt,
        };
        const deployContractV1KeychainResponse = {
            status: status,
            contractAddress: "",
            contractName: contractName,
            deployResponse: deployResponse,
        };
        return deployContractV1KeychainResponse;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95LWNvbnRyYWN0LXYxLWtleWNoYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9pbXBsL2RlcGxveS1jb250cmFjdC12MS9kZXBsb3ktY29udHJhY3QtdjEta2V5Y2hhaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUE0QkEsNERBMklDO0FBdktELDhEQUlvQztBQUNwQywrRUFNa0Q7QUFDbEQsK0RBQXNFO0FBQ3RFLDhEQUEwQztBQUkxQyxzRUFBaUU7QUFXMUQsS0FBSyxVQUFVLHdCQUF3QixDQUM1QyxHQUtDLEVBQ0QsR0FBNEM7SUFFNUMsTUFBTSxLQUFLLEdBQUcsNEJBQTRCLENBQUM7SUFDM0Msc0JBQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxNQUFNLENBQUMsQ0FBQztJQUVuQyxNQUFNLEdBQUcsR0FBRyw4QkFBYyxDQUFDLFdBQVcsQ0FBQztRQUNyQyxLQUFLLEVBQUUsS0FBSztRQUNaLEtBQUssRUFBRSxHQUFHLENBQUMsUUFBUTtLQUNwQixDQUFDLENBQUM7SUFFSCxJQUFJLElBQUEsK0NBQTJCLEVBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLEVBQUUsQ0FBQztRQUMzRCxNQUFNLHFCQUFlLENBQUMsR0FBRyxDQUFDLENBQ3hCLEdBQUcsS0FBSyw0Q0FBNEMsQ0FDckQsQ0FBQztJQUNKLENBQUM7SUFDRCxNQUFNLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxHQUFHLEdBQUcsQ0FBQztJQUN6QyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3JDLE1BQU0sWUFBWSxHQUFHLEdBQUcsS0FBSyxrRUFBa0UsQ0FBQztRQUNoRyxNQUFNLHFCQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFMUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3BCLE1BQU0sWUFBWSxHQUNoQixHQUFHLEtBQUssdUNBQXVDO1lBQy9DLDhCQUE4QixHQUFHLENBQUMsVUFBVSxHQUFHLENBQUM7UUFDbEQsTUFBTSxxQkFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO1FBQ3RDLE1BQU0sWUFBWSxHQUNoQixHQUFHLEtBQUssNkRBQTZEO1lBQ3JFLGdFQUFnRSxDQUFDO1FBQ25FLE1BQU0sSUFBSSxxQkFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxNQUFNLFNBQVMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUVqRCxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDL0QsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUNwQyxJQUFJLEVBQUUsR0FBRyxDQUFDLFFBQVE7UUFDbEIsU0FBUyxFQUFFLEdBQUcsQ0FBQyxlQUFlO0tBQy9CLENBQUMsQ0FBQztJQUVILE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDckQsR0FBRyxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsQ0FBQyxZQUFZLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBRWhFLE1BQU0scUJBQXFCLEdBQUcsR0FBRyxDQUFDLHFCQUVRLENBQUM7SUFFM0MsTUFBTSxpQkFBaUIsR0FBRztRQUN4QixrQkFBa0IsRUFBRSxHQUFHLENBQUMsa0JBQWtCO1FBQzFDLGNBQWMsRUFBRSxHQUFHLENBQUMsY0FBYztRQUNsQyxRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVE7UUFDdEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJO0tBQ2YsQ0FBQztJQUNGLE1BQU0saUJBQWlCLEdBQUc7UUFDeEIsaUJBQWlCLEVBQUU7WUFDakIsSUFBSTtZQUNKLElBQUksRUFBRSxxQkFBcUIsQ0FBQyxVQUFVO1lBQ3RDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRztZQUNaLFFBQVEsRUFBRSxHQUFHLENBQUMsUUFBUTtTQUN2QjtRQUNELG1CQUFtQixFQUFFO1lBQ25CLGtCQUFrQixFQUFFLENBQUM7WUFDckIsV0FBVyxFQUFFLDhCQUFXLENBQUMsYUFBYTtZQUN0QyxTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVMsSUFBSSxLQUFLO1NBQ2xDO1FBQ0QscUJBQXFCO1FBQ3JCLHdCQUF3QixFQUFFLEdBQUcsQ0FBQyx3QkFBd0I7S0FDdkQsQ0FBQztJQUNGLE1BQU0sc0JBQXNCLEdBQUcsTUFBTSxJQUFBLGlDQUFjLEVBQ2pELGlCQUFpQixFQUNqQixpQkFBaUIsQ0FDbEIsQ0FBQztJQUVGLE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxjQUFjLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRW5FLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQ3pCLE1BQU0sWUFBWSxHQUNoQixHQUFHLEtBQUssNkRBQTZEO1lBQ3JFLGdFQUFnRSxDQUFDO1FBQ25FLE1BQU0sSUFBSSxxQkFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxHQUFHLENBQUMsS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7SUFFN0QsTUFBTSxFQUFFLGtCQUFrQixFQUFFLE9BQU8sRUFBRSxHQUFHLHNCQUFzQixDQUFDO0lBQy9ELE1BQU0sRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBRTVDLElBQUksTUFBTSxJQUFJLGVBQWUsRUFBRSxDQUFDO1FBQzlCLE1BQU0sV0FBVyxHQUFHLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxDQUFDO1FBQ2pELE1BQU0sV0FBVyxHQUFHLE1BQU0sY0FBYyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMzRCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzdDLEdBQUcsQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUN4QyxZQUFZLENBQUMsR0FBRyxFQUNoQixlQUFlLENBQ2hCLENBQUM7UUFFRixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUM7UUFDN0MsWUFBWSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFFaEMsTUFBTSxjQUFjLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDckUsTUFBTSxjQUFjLEdBQTZDO1lBQy9ELGtCQUFrQixFQUFFLHNCQUFzQixDQUFDLGtCQUFrQjtTQUM5RCxDQUFDO1FBQ0YsTUFBTSxnQ0FBZ0MsR0FDcEM7WUFDRSxNQUFNLEVBQUUsTUFBTTtZQUNkLGVBQWUsRUFBRSxlQUFlO1lBQ2hDLFlBQVksRUFBRSxZQUFZO1lBQzFCLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLGNBQWMsRUFBRSxjQUFjO1NBQy9CLENBQUM7UUFDSixPQUFPLGdDQUFnQyxDQUFDO0lBQzFDLENBQUM7U0FBTSxDQUFDO1FBQ04sTUFBTSxjQUFjLEdBQTZDO1lBQy9ELGtCQUFrQixFQUFFLHNCQUFzQixDQUFDLGtCQUFrQjtTQUM5RCxDQUFDO1FBQ0YsTUFBTSxnQ0FBZ0MsR0FDcEM7WUFDRSxNQUFNLEVBQUUsTUFBTTtZQUNkLGVBQWUsRUFBRSxFQUFFO1lBQ25CLFlBQVksRUFBRSxZQUFZO1lBQzFCLGNBQWMsRUFBRSxjQUFjO1NBQy9CLENBQUM7UUFDSixPQUFPLGdDQUFnQyxDQUFDO0lBQzFDLENBQUM7QUFDSCxDQUFDIn0=