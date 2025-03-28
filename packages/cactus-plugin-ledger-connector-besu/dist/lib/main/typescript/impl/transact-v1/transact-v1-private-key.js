"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactV1PrivateKey = transactV1PrivateKey;
exports.transactPrivate = transactPrivate;
exports.getPrivateTxReceipt = getPrivateTxReceipt;
const transact_v1_signed_1 = require("./transact-v1-signed");
const web3js_quorum_1 = __importDefault(require("web3js-quorum"));
const run_time_error_cjs_1 = require("run-time-error-cjs");
async function transactV1PrivateKey(ctx, req) {
    const fnTag = `transactPrivateKey()`;
    const { transactionConfig, web3SigningCredential } = req;
    const { secret } = web3SigningCredential;
    // Run transaction to EEA client here if private transaction
    if (req.privateTransactionConfig) {
        const options = {
            nonce: transactionConfig.nonce,
            gasPrice: transactionConfig.gasPrice,
            gasLimit: transactionConfig.gas,
            to: transactionConfig.to,
            value: transactionConfig.value,
            data: transactionConfig.data,
            privateKey: secret,
            privateFrom: req.privateTransactionConfig.privateFrom,
            privateFor: req.privateTransactionConfig.privateFor,
            restriction: "restricted",
        };
        return transactPrivate(ctx, options);
    }
    const signedTx = await ctx.web3.eth.accounts.signTransaction(transactionConfig, secret);
    if (signedTx.rawTransaction) {
        req.transactionConfig.rawTransaction = signedTx.rawTransaction;
        return (0, transact_v1_signed_1.transactV1Signed)(ctx, req);
    }
    else {
        throw new Error(`${fnTag} Failed to sign eth transaction. ` +
            `signedTransaction.rawTransaction is blank after .signTransaction().`);
    }
}
async function transactPrivate(ctx, options) {
    const fnTag = `transactPrivate()`;
    const web3Quorum = (0, web3js_quorum_1.default)(ctx.web3);
    if (!web3Quorum) {
        throw new Error(`${fnTag} Web3 EEA client not initialized.`);
    }
    const txHash = await web3Quorum.priv.generateAndSendRawTransaction(options);
    if (!txHash) {
        throw new Error(`${fnTag} eea.sendRawTransaction provided no tx hash.`);
    }
    return getPrivateTxReceipt(ctx, options.privateFrom, txHash);
}
async function getPrivateTxReceipt(ctx, privateFrom, txHash) {
    const fnTag = `getPrivateTxReceipt()`;
    const web3Quorum = (0, web3js_quorum_1.default)(ctx.web3);
    if (!web3Quorum) {
        throw new Error(`${fnTag} Web3 Quorum client not initialized.`);
    }
    const txPoolReceipt = await web3Quorum.priv.waitForTransactionReceipt(txHash);
    if (!txPoolReceipt) {
        throw new run_time_error_cjs_1.RuntimeError(`priv.getTransactionReceipt provided no receipt.`);
    }
    return {
        transactionReceipt: txPoolReceipt,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3QtdjEtcHJpdmF0ZS1rZXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2ltcGwvdHJhbnNhY3QtdjEvdHJhbnNhY3QtdjEtcHJpdmF0ZS1rZXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFjQSxvREErQ0M7QUFFRCwwQ0FpQkM7QUFFRCxrREFvQkM7QUE5RkQsNkRBQXdEO0FBRXhELGtFQUF5QztBQUN6QywyREFBa0Q7QUFHM0MsS0FBSyxVQUFVLG9CQUFvQixDQUN4QyxHQUtDLEVBQ0QsR0FBMEI7SUFFMUIsTUFBTSxLQUFLLEdBQUcsc0JBQXNCLENBQUM7SUFDckMsTUFBTSxFQUFFLGlCQUFpQixFQUFFLHFCQUFxQixFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQ3pELE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FDZCxxQkFBMkQsQ0FBQztJQUU5RCw0REFBNEQ7SUFFNUQsSUFBSSxHQUFHLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUNqQyxNQUFNLE9BQU8sR0FBRztZQUNkLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxLQUFLO1lBQzlCLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxRQUFRO1lBQ3BDLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxHQUFHO1lBQy9CLEVBQUUsRUFBRSxpQkFBaUIsQ0FBQyxFQUFFO1lBQ3hCLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxLQUFLO1lBQzlCLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO1lBQzVCLFVBQVUsRUFBRSxNQUFNO1lBQ2xCLFdBQVcsRUFBRSxHQUFHLENBQUMsd0JBQXdCLENBQUMsV0FBVztZQUNyRCxVQUFVLEVBQUUsR0FBRyxDQUFDLHdCQUF3QixDQUFDLFVBQVU7WUFDbkQsV0FBVyxFQUFFLFlBQVk7U0FDMUIsQ0FBQztRQUVGLE9BQU8sZUFBZSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUMxRCxpQkFBaUIsRUFDakIsTUFBTSxDQUNQLENBQUM7SUFFRixJQUFJLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUM1QixHQUFHLENBQUMsaUJBQWlCLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUM7UUFDL0QsT0FBTyxJQUFBLHFDQUFnQixFQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNwQyxDQUFDO1NBQU0sQ0FBQztRQUNOLE1BQU0sSUFBSSxLQUFLLENBQ2IsR0FBRyxLQUFLLG1DQUFtQztZQUN6QyxxRUFBcUUsQ0FDeEUsQ0FBQztJQUNKLENBQUM7QUFDSCxDQUFDO0FBRU0sS0FBSyxVQUFVLGVBQWUsQ0FDbkMsR0FBNEIsRUFDNUIsT0FBWTtJQUVaLE1BQU0sS0FBSyxHQUFHLG1CQUFtQixDQUFDO0lBRWxDLE1BQU0sVUFBVSxHQUFHLElBQUEsdUJBQVksRUFBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLG1DQUFtQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUU1RSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDWixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyw4Q0FBOEMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFDRCxPQUFPLG1CQUFtQixDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQy9ELENBQUM7QUFFTSxLQUFLLFVBQVUsbUJBQW1CLENBQ3ZDLEdBQTRCLEVBQzVCLFdBQW1CLEVBQ25CLE1BQWM7SUFFZCxNQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBQztJQUV0QyxNQUFNLFVBQVUsR0FBRyxJQUFBLHVCQUFZLEVBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxzQ0FBc0MsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRCxNQUFNLGFBQWEsR0FBRyxNQUFNLFVBQVUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ25CLE1BQU0sSUFBSSxpQ0FBWSxDQUFDLGlEQUFpRCxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVELE9BQU87UUFDTCxrQkFBa0IsRUFBRSxhQUFrRDtLQUN2RSxDQUFDO0FBQ0osQ0FBQyJ9