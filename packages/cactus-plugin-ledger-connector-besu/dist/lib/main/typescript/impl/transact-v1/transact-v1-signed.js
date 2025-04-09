"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactV1Signed = transactV1Signed;
exports.getTxReceipt = getTxReceipt;
exports.pollForTxReceipt = pollForTxReceipt;
const cactus_common_1 = require("@hyperledger/cactus-common");
const typescript_axios_1 = require("../../generated/openapi/typescript-axios");
const promises_1 = require("timers/promises");
async function transactV1Signed(ctx, req) {
    const fnTag = `transactSigned()`;
    cactus_common_1.Checks.truthy(req.consistencyStrategy, `${fnTag}:req.consistencyStrategy`);
    cactus_common_1.Checks.truthy(req.transactionConfig.rawTransaction, `${fnTag}:req.transactionConfig.rawTransaction`);
    const log = cactus_common_1.LoggerProvider.getOrCreate({
        label: "transactV1Signed()",
        level: ctx.logLevel,
    });
    const rawTx = req.transactionConfig.rawTransaction;
    log.debug("Starting web3.eth.sendSignedTransaction(rawTransaction) ");
    const txPoolReceipt = await ctx.web3.eth.sendSignedTransaction(rawTx);
    return getTxReceipt(ctx, req, txPoolReceipt);
}
async function getTxReceipt(ctx, request, txPoolReceipt) {
    const fnTag = `getTxReceipt()`;
    const log = cactus_common_1.LoggerProvider.getOrCreate({
        label: "getTxReceipt",
        level: ctx.logLevel,
    });
    log.debug("Received preliminary receipt from Besu node.");
    if (txPoolReceipt instanceof Error) {
        log.debug(`${fnTag} sendSignedTransaction failed`, txPoolReceipt);
        throw txPoolReceipt;
    }
    ctx.prometheusExporter.addCurrentTransaction();
    if (request.consistencyStrategy.receiptType === typescript_axios_1.ReceiptType.NodeTxPoolAck &&
        request.consistencyStrategy.blockConfirmations > 0) {
        throw new Error(`${fnTag} Conflicting parameters for consistency` +
            ` strategy: Cannot wait for >0 block confirmations AND only wait ` +
            ` for the tx pool ACK at the same time.`);
    }
    switch (request.consistencyStrategy.receiptType) {
        case typescript_axios_1.ReceiptType.NodeTxPoolAck:
            return { transactionReceipt: txPoolReceipt };
        case typescript_axios_1.ReceiptType.LedgerBlockAck:
            log.debug("Starting poll for ledger TX receipt ...");
            const txHash = txPoolReceipt.transactionHash;
            const { consistencyStrategy } = request;
            const ledgerReceipt = await pollForTxReceipt(ctx, txHash, consistencyStrategy);
            log.debug("Finished poll for ledger TX receipt: %o", ledgerReceipt);
            return { transactionReceipt: ledgerReceipt };
        default:
            throw new Error(`${fnTag} Unrecognized ReceiptType: ${request.consistencyStrategy.receiptType}`);
    }
}
async function pollForTxReceipt(ctx, txHash, consistencyStrategy) {
    const fnTag = `pollForTxReceipt()`;
    const log = cactus_common_1.LoggerProvider.getOrCreate({
        label: "pollForTxReceipt()",
        level: ctx.logLevel,
    });
    let txReceipt;
    let timedOut = false;
    let tries = 0;
    let confirmationCount = 0;
    const timeoutMs = consistencyStrategy.timeoutMs || Number.MAX_SAFE_INTEGER;
    const startedAt = new Date();
    do {
        const now = Date.now();
        const elapsedTime = now - startedAt.getTime();
        timedOut = now >= startedAt.getTime() + timeoutMs;
        log.debug("%s tries=%n elapsedMs=%n", fnTag, tries, elapsedTime);
        if (tries > 0) {
            await (0, promises_1.setTimeout)(1000);
        }
        tries++;
        if (timedOut) {
            break;
        }
        txReceipt = await ctx.web3.eth.getTransactionReceipt(txHash);
        if (!txReceipt) {
            continue;
        }
        const latestBlockNo = await ctx.web3.eth.getBlockNumber();
        confirmationCount = latestBlockNo - txReceipt.blockNumber;
    } while (confirmationCount >= consistencyStrategy.blockConfirmations);
    if (!txReceipt) {
        throw new Error(`${fnTag} Timed out ${timeoutMs}ms, polls=${tries}`);
    }
    return txReceipt;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3QtdjEtc2lnbmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9pbXBsL3RyYW5zYWN0LXYxL3RyYW5zYWN0LXYxLXNpZ25lZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWdCQSw0Q0F5QkM7QUFFRCxvQ0FxREM7QUFFRCw0Q0EyQ0M7QUE3SUQsOERBSW9DO0FBQ3BDLCtFQUtrRDtBQUlsRCw4Q0FBNkM7QUFFdEMsS0FBSyxVQUFVLGdCQUFnQixDQUNwQyxHQUlDLEVBQ0QsR0FBMEI7SUFFMUIsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUM7SUFDakMsc0JBQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLEdBQUcsS0FBSywwQkFBMEIsQ0FBQyxDQUFDO0lBQzNFLHNCQUFNLENBQUMsTUFBTSxDQUNYLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQ3BDLEdBQUcsS0FBSyx1Q0FBdUMsQ0FDaEQsQ0FBQztJQUNGLE1BQU0sR0FBRyxHQUFHLDhCQUFjLENBQUMsV0FBVyxDQUFDO1FBQ3JDLEtBQUssRUFBRSxvQkFBb0I7UUFDM0IsS0FBSyxFQUFFLEdBQUcsQ0FBQyxRQUFRO0tBQ3BCLENBQUMsQ0FBQztJQUNILE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxjQUF3QixDQUFDO0lBRTdELEdBQUcsQ0FBQyxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztJQUV0RSxNQUFNLGFBQWEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXRFLE9BQU8sWUFBWSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUVNLEtBQUssVUFBVSxZQUFZLENBQ2hDLEdBSUMsRUFDRCxPQUE4QixFQUM5Qixh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