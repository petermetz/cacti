"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockV1Grpc = getBlockV1Grpc;
const cactus_common_1 = require("@hyperledger/cactus-common");
const get_block_v1_response_pb = __importStar(require("../../generated/proto/protoc-gen-ts/models/get_block_v1_response_pb"));
const public_api_1 = require("../../public-api");
const get_block_v1_impl_1 = require("./get-block-v1-impl");
async function getBlockV1Grpc(ctx, req) {
    const log = cactus_common_1.LoggerProvider.getOrCreate({
        label: "getBlockGrpc()",
        level: ctx.logLevel,
    });
    log.debug("req.getBlockV1RequestPB.blockHashOrBlockNumber=%o", req.getBlockV1RequestPB.blockHashOrBlockNumber);
    const blockHashOrBlockNumber = Buffer.from(req.getBlockV1RequestPB.blockHashOrBlockNumber.value).toString("utf-8");
    log.debug("blockHashOrBlockNumber=%s", blockHashOrBlockNumber);
    if (!(0, get_block_v1_impl_1.isBlockNumber)(blockHashOrBlockNumber)) {
        throw new Error("Input was not a block number: " + blockHashOrBlockNumber);
    }
    const block = await (0, get_block_v1_impl_1.getBlockV1Impl)(ctx, blockHashOrBlockNumber);
    log.debug("getBlockV1Impl() => block=%o", block);
    const getBlockV1ResponsePb = new get_block_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.GetBlockV1ResponsePB();
    const evmBlockPb = public_api_1.evm_block_pb.org.hyperledger.cacti.plugin.ledger.connector.besu.EvmBlockPB.fromObject(block);
    getBlockV1ResponsePb.block = evmBlockPb;
    return getBlockV1ResponsePb;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWJsb2NrLXYxLWdycGMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2ltcGwvZ2V0LWJsb2NrLXYxL2dldC1ibG9jay12MS1ncnBjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFTQSx3Q0FvQ0M7QUEzQ0QsOERBQTBFO0FBRTFFLDhIQUFnSDtBQUVoSCxpREFBMEQ7QUFDMUQsMkRBQW9FO0FBRTdELEtBQUssVUFBVSxjQUFjLENBQ2xDLEdBQTZELEVBQzdELEdBQWlIO0lBRWpILE1BQU0sR0FBRyxHQUFHLDhCQUFjLENBQUMsV0FBVyxDQUFDO1FBQ3JDLEtBQUssRUFBRSxnQkFBZ0I7UUFDdkIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxRQUFRO0tBQ3BCLENBQUMsQ0FBQztJQUNILEdBQUcsQ0FBQyxLQUFLLENBQ1AsbURBQW1ELEVBQ25ELEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxzQkFBc0IsQ0FDL0MsQ0FBQztJQUNGLE1BQU0sc0JBQXNCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FDeEMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FDckQsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFcEIsR0FBRyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0lBRS9ELElBQUksQ0FBQyxJQUFBLGlDQUFhLEVBQUMsc0JBQXNCLENBQUMsRUFBRSxDQUFDO1FBQzNDLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLEdBQUcsc0JBQXNCLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRUQsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFBLGtDQUFjLEVBQUMsR0FBRyxFQUFFLHNCQUFzQixDQUFDLENBQUM7SUFDaEUsR0FBRyxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUVqRCxNQUFNLG9CQUFvQixHQUN4QixJQUFJLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBRXpHLE1BQU0sVUFBVSxHQUNkLHlCQUFZLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQ25GLEtBQWlCLENBQ2xCLENBQUM7SUFFSixvQkFBb0IsQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDO0lBRXhDLE9BQU8sb0JBQW9CLENBQUM7QUFDOUIsQ0FBQyJ9