"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchBlocksV1Endpoint = void 0;
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_common_2 = require("@hyperledger/cactus-common");
const typescript_axios_1 = require("../generated/openapi/typescript-axios");
class WatchBlocksV1Endpoint {
    options;
    static CLASS_NAME = "WatchBlocksV1Endpoint";
    log;
    socket;
    web3;
    get className() {
        return WatchBlocksV1Endpoint.CLASS_NAME;
    }
    constructor(options) {
        this.options = options;
        const fnTag = `${this.className}#constructor()`;
        cactus_common_1.Checks.truthy(options, `${fnTag} arg options`);
        cactus_common_1.Checks.truthy(options.web3, `${fnTag} arg options.web3`);
        cactus_common_1.Checks.truthy(options.socket, `${fnTag} arg options.socket`);
        this.web3 = options.web3;
        this.socket = options.socket;
        const level = this.options.logLevel || "INFO";
        const label = this.className;
        this.log = cactus_common_2.LoggerProvider.getOrCreate({ level, label });
    }
    async subscribe() {
        const { socket, log, web3 } = this;
        log.debug(`${typescript_axios_1.WatchBlocksV1.Subscribe} => ${socket.id}`);
        const sub = web3.eth.subscribe("newBlockHeaders", (ex, blockHeader) => {
            log.debug("newBlockHeaders: Error=%o BlockHeader=%o", ex, blockHeader);
            if (blockHeader) {
                const next = {
                    // Cast needed because somewhere between Web3 v1.5.2 and v1.6.1 they
                    // made the receiptRoot property of the BlockHeader type optional.
                    // This could be accompanied by a breaking change in their code or
                    // it could've been just a mistake in their typings that they corrected.
                    // Either way, with the next major release, we need to make it optional
                    // in our API specs as well so that they match up.
                    blockHeader: blockHeader,
                };
                socket.emit(typescript_axios_1.WatchBlocksV1.Next, next);
            }
            if (ex) {
                socket.emit(typescript_axios_1.WatchBlocksV1.Error, ex);
                sub.unsubscribe();
            }
        });
        log.debug("Subscribing to Web3 new block headers event...");
        socket.on("disconnect", async (reason) => {
            log.debug("WebSocket:disconnect reason=%o", reason);
            sub.unsubscribe((ex, success) => {
                log.debug("Web3 unsubscribe success=%o, ex=%", success, ex);
            });
        });
        socket.on(typescript_axios_1.WatchBlocksV1.Unsubscribe, () => {
            log.debug(`${typescript_axios_1.WatchBlocksV1.Unsubscribe}: unsubscribing Web3...`);
            sub.unsubscribe((ex, success) => {
                log.debug("Web3 unsubscribe error=%o, success=%", ex, success);
            });
        });
    }
}
exports.WatchBlocksV1Endpoint = WatchBlocksV1Endpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2gtYmxvY2tzLXYxLWVuZHBvaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC93ZWItc2VydmljZXMvd2F0Y2gtYmxvY2tzLXYxLWVuZHBvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLDhEQUE0RDtBQUM1RCw4REFBMEU7QUFFMUUsNEVBQXNFO0FBU3RFLE1BQWEscUJBQXFCO0lBY0o7SUFickIsTUFBTSxDQUFVLFVBQVUsR0FBRyx1QkFBdUIsQ0FBQztJQUUzQyxHQUFHLENBQVM7SUFDWixNQUFNLENBR3JCO0lBQ2UsSUFBSSxDQUFPO0lBRTVCLElBQVcsU0FBUztRQUNsQixPQUFPLHFCQUFxQixDQUFDLFVBQVUsQ0FBQztJQUMxQyxDQUFDO0lBRUQsWUFBNEIsT0FBc0M7UUFBdEMsWUFBTyxHQUFQLE9BQU8sQ0FBK0I7UUFDaEUsTUFBTSxLQUFLLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxnQkFBZ0IsQ0FBQztRQUNoRCxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsR0FBRyxLQUFLLGNBQWMsQ0FBQyxDQUFDO1FBQy9DLHNCQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLG1CQUFtQixDQUFDLENBQUM7UUFDekQsc0JBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUsscUJBQXFCLENBQUMsQ0FBQztRQUU3RCxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBRTdCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQztRQUM5QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLEdBQUcsOEJBQWMsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRU0sS0FBSyxDQUFDLFNBQVM7UUFDcEIsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ25DLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxnQ0FBYSxDQUFDLFNBQVMsT0FBTyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN4RCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRTtZQUNwRSxHQUFHLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxFQUFFLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUN2RSxJQUFJLFdBQVcsRUFBRSxDQUFDO2dCQUNoQixNQUFNLElBQUksR0FBMEI7b0JBQ2xDLG9FQUFvRTtvQkFDcEUsa0VBQWtFO29CQUNsRSxrRUFBa0U7b0JBQ2xFLHdFQUF3RTtvQkFDeEUsdUVBQXVFO29CQUN2RSxrREFBa0Q7b0JBQ2xELFdBQVcsRUFBRSxXQUF5QztpQkFDdkQsQ0FBQztnQkFDRixNQUFNLENBQUMsSUFBSSxDQUFDLGdDQUFhLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hDLENBQUM7WUFDRCxJQUFJLEVBQUUsRUFBRSxDQUFDO2dCQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0NBQWEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3JDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNwQixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsS0FBSyxDQUFDLGdEQUFnRCxDQUFDLENBQUM7UUFFNUQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQWMsRUFBRSxFQUFFO1lBQy9DLEdBQUcsQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDcEQsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQVMsRUFBRSxPQUFnQixFQUFFLEVBQUU7Z0JBQzlDLEdBQUcsQ0FBQyxLQUFLLENBQUMsbUNBQW1DLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzlELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsRUFBRSxDQUFDLGdDQUFhLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtZQUN4QyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsZ0NBQWEsQ0FBQyxXQUFXLHlCQUF5QixDQUFDLENBQUM7WUFDakUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQVMsRUFBRSxPQUFnQixFQUFFLEVBQUU7Z0JBQzlDLEdBQUcsQ0FBQyxLQUFLLENBQUMsc0NBQXNDLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2pFLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOztBQWxFSCxzREFtRUMifQ==