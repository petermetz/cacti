"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactV1CactusKeychainRef = transactV1CactusKeychainRef;
const typescript_axios_1 = require("../../generated/openapi/typescript-axios");
const cactus_common_1 = require("@hyperledger/cactus-common");
const transact_v1_private_key_1 = require("./transact-v1-private-key");
async function transactV1CactusKeychainRef(ctx, req) {
    const fnTag = `transactCactusKeychainRef()`;
    const { transactionConfig, web3SigningCredential, privateTransactionConfig } = req;
    const { ethAccount, keychainEntryKey, keychainId } = web3SigningCredential;
    // locate the keychain plugin that has access to the keychain backend
    // denoted by the keychainID from the request.
    const keychainPlugin = ctx.pluginRegistry.findOneByKeychainId(keychainId);
    cactus_common_1.Checks.truthy(keychainPlugin, `${fnTag} keychain for ID:"${keychainId}"`);
    // Now use the found keychain plugin to actually perform the lookup of
    // the private key that we need to run the transaction.
    const privateKeyHex = await keychainPlugin?.get(keychainEntryKey);
    return (0, transact_v1_private_key_1.transactV1PrivateKey)(ctx, {
        privateTransactionConfig,
        transactionConfig,
        web3SigningCredential: {
            ethAccount,
            type: typescript_axios_1.Web3SigningCredentialType.PrivateKeyHex,
            secret: privateKeyHex,
        },
        consistencyStrategy: {
            blockConfirmations: 0,
            receiptType: typescript_axios_1.ReceiptType.NodeTxPoolAck,
            timeoutMs: 60000,
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3QtdjEtY2FjdHVzLWtleWNoYWluLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvaW1wbC90cmFuc2FjdC12MS90cmFuc2FjdC12MS1jYWN0dXMta2V5Y2hhaW4tcmVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBYUEsa0VBdUNDO0FBbkRELCtFQU1rRDtBQUNsRCw4REFBa0U7QUFFbEUsdUVBQWlFO0FBRzFELEtBQUssVUFBVSwyQkFBMkIsQ0FDL0MsR0FLQyxFQUNELEdBQTBCO0lBRTFCLE1BQU0sS0FBSyxHQUFHLDZCQUE2QixDQUFDO0lBQzVDLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxxQkFBcUIsRUFBRSx3QkFBd0IsRUFBRSxHQUMxRSxHQUFHLENBQUM7SUFDTixNQUFNLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxHQUNoRCxxQkFBK0QsQ0FBQztJQUVsRSxxRUFBcUU7SUFDckUsOENBQThDO0lBQzlDLE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFMUUsc0JBQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLEdBQUcsS0FBSyxxQkFBcUIsVUFBVSxHQUFHLENBQUMsQ0FBQztJQUUxRSxzRUFBc0U7SUFDdEUsdURBQXVEO0lBQ3ZELE1BQU0sYUFBYSxHQUFHLE1BQU0sY0FBYyxFQUFFLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBRWxFLE9BQU8sSUFBQSw4Q0FBb0IsRUFBQyxHQUFHLEVBQUU7UUFDL0Isd0JBQXdCO1FBQ3hCLGlCQUFpQjtRQUNqQixxQkFBcUIsRUFBRTtZQUNyQixVQUFVO1lBQ1YsSUFBSSxFQUFFLDRDQUF5QixDQUFDLGFBQWE7WUFDN0MsTUFBTSxFQUFFLGFBQWE7U0FDdEI7UUFDRCxtQkFBbUIsRUFBRTtZQUNuQixrQkFBa0IsRUFBRSxDQUFDO1lBQ3JCLFdBQVcsRUFBRSw4QkFBVyxDQUFDLGFBQWE7WUFDdEMsU0FBUyxFQUFFLEtBQUs7U0FDakI7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDIn0=