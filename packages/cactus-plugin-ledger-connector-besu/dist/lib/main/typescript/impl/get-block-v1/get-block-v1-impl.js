"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockV1Impl = getBlockV1Impl;
exports.isBlockNumber = isBlockNumber;
const cactus_common_1 = require("@hyperledger/cactus-common");
async function getBlockV1Impl(ctx, blockHashOrBlockNumber) {
    const log = cactus_common_1.LoggerProvider.getOrCreate({
        label: "getBlockV1Impl()",
        level: ctx.logLevel,
    });
    log.debug("blockHashOrBlockNumber=%s", blockHashOrBlockNumber);
    if (!isBlockNumber(blockHashOrBlockNumber)) {
        throw new Error("Input was not a block number: " + blockHashOrBlockNumber);
    }
    const block = await ctx.web3.eth.getBlock(blockHashOrBlockNumber, true);
    log.debug("block=%o", block);
    return block;
}
//string | number | BN | BigNumber | 'latest' | 'pending' | 'earliest' | 'genesis'
function isBlockNumber(x) {
    return (cactus_common_1.Strings.isString(x) ||
        (typeof x === "number" && isFinite(x)) ||
        typeof x === "bigint");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWJsb2NrLXYxLWltcGwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2ltcGwvZ2V0LWJsb2NrLXYxL2dldC1ibG9jay12MS1pbXBsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBV0Esd0NBa0JDO0FBR0Qsc0NBTUM7QUFuQ0QsOERBSW9DO0FBSTdCLEtBQUssVUFBVSxjQUFjLENBQ2xDLEdBQTZELEVBQzdELHNCQUFtQztJQUVuQyxNQUFNLEdBQUcsR0FBRyw4QkFBYyxDQUFDLFdBQVcsQ0FBQztRQUNyQyxLQUFLLEVBQUUsa0JBQWtCO1FBQ3pCLEtBQUssRUFBRSxHQUFHLENBQUMsUUFBUTtLQUNwQixDQUFDLENBQUM7SUFDSCxHQUFHLENBQUMsS0FBSyxDQUFDLDJCQUEyQixFQUFFLHNCQUFzQixDQUFDLENBQUM7SUFFL0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLENBQUM7UUFDM0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsR0FBRyxzQkFBc0IsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCxNQUFNLEtBQUssR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4RSxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUU3QixPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFFRCxrRkFBa0Y7QUFDbEYsU0FBZ0IsYUFBYSxDQUFDLENBQVU7SUFDdEMsT0FBTyxDQUNMLHVCQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNuQixDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsT0FBTyxDQUFDLEtBQUssUUFBUSxDQUN0QixDQUFDO0FBQ0osQ0FBQyJ9