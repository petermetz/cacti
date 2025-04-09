"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockV1Http = getBlockV1Http;
const get_block_v1_impl_1 = require("./get-block-v1-impl");
async function getBlockV1Http(ctx, request) {
    const block = await (0, get_block_v1_impl_1.getBlockV1Impl)(ctx, request.blockHashOrBlockNumber);
    return { block };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWJsb2NrLXYxLWh0dHAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L2ltcGwvZ2V0LWJsb2NrLXYxL2dldC1ibG9jay12MS1odHRwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBUUEsd0NBTUM7QUFSRCwyREFBcUQ7QUFFOUMsS0FBSyxVQUFVLGNBQWMsQ0FDbEMsR0FBNkQsRUFDN0QsT0FBMEI7SUFFMUIsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFBLGtDQUFjLEVBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ3hFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUNuQixDQUFDIn0=