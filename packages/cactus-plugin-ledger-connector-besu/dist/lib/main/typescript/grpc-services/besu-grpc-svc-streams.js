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
exports.BesuGrpcSvcStreams = void 0;
const cactus_common_1 = require("@hyperledger/cactus-common");
const watch_blocks_v1_progress_pb = __importStar(require("../generated/proto/protoc-gen-ts/models/watch_blocks_v1_progress_pb"));
const besu_grpc_svc_streams = __importStar(require("../generated/proto/protoc-gen-ts/services/besu-grpc-svc-streams"));
const public_api_1 = require("../public-api");
const WatchBlocksV1ProgressPB = watch_blocks_v1_progress_pb.org.hyperledger.cacti.plugin.ledger.connector.besu
    .WatchBlocksV1ProgressPB;
class BesuGrpcSvcStreams extends besu_grpc_svc_streams.org.hyperledger
    .cacti.plugin.ledger.connector.besu.services.besuservice
    .UnimplementedBesuGrpcSvcStreamsService {
    opts;
    static CLASS_NAME = "BesuGrpcSvcStreams";
    get className() {
        return BesuGrpcSvcStreams.CLASS_NAME;
    }
    log;
    web3;
    /**
     * The log level that will be used throughout all the methods of this class.
     */
    logLevel;
    constructor(opts) {
        super();
        this.opts = opts;
        this.logLevel = opts.logLevel || "INFO";
        const label = this.className;
        this.log = cactus_common_1.LoggerProvider.getOrCreate({ level: this.logLevel, label });
        this.web3 = opts.web3;
        this.log.debug(`Created instance of ${this.className} OK`);
    }
    WatchBlocksV1(call) {
        this.log.debug("WatchBlocksV1::MAIN_FN=");
        const EVENT = "newBlockHeaders";
        const sub = this.web3.eth.subscribe(EVENT, (ex, bh) => {
            this.log.debug("subscribe_newBlockHeaders::error=%o, bh=%o", ex, bh);
            const chunk = new WatchBlocksV1ProgressPB();
            call.write(chunk);
        });
        const WatchBlocksV1PB = public_api_1.watch_blocks_v1_pb.org.hyperledger.cacti.plugin.ledger.connector.besu
            .WatchBlocksV1PB;
        call.on("data", (chunk) => {
            this.log.debug("WatchBlocksV1::data=%o", chunk);
            if (chunk.event === WatchBlocksV1PB.WatchBlocksV1PB_Unsubscribe) {
                this.log.debug("WatchBlocksV1::data=WatchBlocksV1PB_Unsubscribe");
                call.end();
            }
        });
        call.once("close", () => {
            this.log.debug("subscribe_newBlockHeaders::event=CLOSE");
            sub.unsubscribe();
        });
    }
}
exports.BesuGrpcSvcStreams = BesuGrpcSvcStreams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVzdS1ncnBjLXN2Yy1zdHJlYW1zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9ncnBjLXNlcnZpY2VzL2Jlc3UtZ3JwYy1zdmMtc3RyZWFtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBLDhEQUlvQztBQUVwQyxpSUFBbUg7QUFFbkgsdUhBQXlHO0FBQ3pHLDhDQUFtRDtBQUVuRCxNQUFNLHVCQUF1QixHQUMzQiwyQkFBMkIsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJO0tBQzNFLHVCQUF1QixDQUFDO0FBTzdCLE1BQWEsa0JBQW1CLFNBQVEscUJBQXFCLENBQUMsR0FBRyxDQUFDLFdBQVc7S0FDMUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVztLQUN2RCxzQ0FBc0M7SUFzQlg7SUFmckIsTUFBTSxDQUFVLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQztJQUV6RCxJQUFXLFNBQVM7UUFDbEIsT0FBTyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7SUFDdkMsQ0FBQztJQUVnQixHQUFHLENBQVM7SUFFWixJQUFJLENBQU87SUFFNUI7O09BRUc7SUFDYyxRQUFRLENBQWU7SUFFeEMsWUFBNEIsSUFBZ0M7UUFDMUQsS0FBSyxFQUFFLENBQUM7UUFEa0IsU0FBSSxHQUFKLElBQUksQ0FBNEI7UUFFMUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQztRQUN4QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLEdBQUcsOEJBQWMsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsSUFBSSxDQUFDLFNBQVMsS0FBSyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELGFBQWEsQ0FDWCxJQUdDO1FBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUUxQyxNQUFNLEtBQUssR0FBRyxpQkFBMEIsQ0FBQztRQUV6QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBUyxFQUFFLEVBQWUsRUFBRSxFQUFFO1lBQ3hFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLDRDQUE0QyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNyRSxNQUFNLEtBQUssR0FBRyxJQUFJLHVCQUF1QixFQUFFLENBQUM7WUFDNUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sZUFBZSxHQUNuQiwrQkFBa0IsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJO2FBQ2xFLGVBQWUsQ0FBQztRQUtyQixJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQTZCLEVBQUUsRUFBRTtZQUNoRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNoRCxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssZUFBZSxDQUFDLDJCQUEyQixFQUFFLENBQUM7Z0JBQ2hFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7Z0JBQ2xFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNiLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1lBQ3pELEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7O0FBcEVILGdEQXFFQyJ9