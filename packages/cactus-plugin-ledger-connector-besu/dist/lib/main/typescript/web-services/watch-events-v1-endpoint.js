"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchEventsV1Endpoint = void 0;
const safe_stable_stringify_1 = require("safe-stable-stringify");
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_common_2 = require("@hyperledger/cactus-common");
const typescript_axios_1 = require("../generated/openapi/typescript-axios");
const watch_events_v1_impl_1 = require("../impl/watch-events-v1/watch-events-v1-impl");
const ensure_0x_prefix_1 = require("../common/ensure-0x-prefix");
function bigIntToDecimalStringReplacer(_key, value) {
    if (typeof value === "bigint") {
        return value.toString();
    }
    return value;
}
class WatchEventsV1Endpoint {
    options;
    static CLASS_NAME = "WatchEventsV1Endpoint";
    log;
    logLevel;
    socket;
    viemClient;
    get className() {
        return WatchEventsV1Endpoint.CLASS_NAME;
    }
    constructor(options) {
        this.options = options;
        const fnTag = `${this.className}#constructor()`;
        cactus_common_1.Checks.truthy(options, `${fnTag} arg options`);
        cactus_common_1.Checks.truthy(options.viemClient, `${fnTag} arg options.viemClient`);
        cactus_common_1.Checks.truthy(options.socket, `${fnTag} arg options.socket`);
        this.viemClient = options.viemClient;
        this.socket = options.socket;
        const { logLevel = "INFO" } = options;
        this.logLevel = logLevel;
        const label = this.className;
        this.log = cactus_common_2.LoggerProvider.getOrCreate({ level: logLevel, label });
    }
    async subscribe(req) {
        const fn = `${this.className}#subscribe()`;
        const { socket, log, viemClient } = this;
        const { Subscribe } = typescript_axios_1.WatchEventsV1;
        try {
            const { address, fromBlock, eventName, abi, requestId } = req;
            const { socketAckTimeoutMs = 30_000 } = req;
            const filters = { address, fromBlock, eventName };
            const ctxPojo = { socketId: socket.id, reqId: requestId, filters };
            const ctx = (0, safe_stable_stringify_1.stringify)(ctxPojo);
            log.debug(`%s context=%s`, Subscribe, ctx);
            const watchArgs = {
                abi: abi,
                onError: (error) => {
                    log.error(`%s onError() error=%o`, Subscribe, error);
                },
                onLogs: async (logs) => {
                    log.debug("onLogs() Raw JSON %s", (0, safe_stable_stringify_1.stringify)(logs));
                    // Contains raw `BigInt` values which cannot be safely sent over the wire
                    // and will cause SocketIO serialization errors. We need to replace them with strings.
                    const nextUnsafe = { logs, requestId };
                    // SocketIO can't serialize BigInt so we have to convert it to a string.
                    // Doing this back-and-forth serialization is wasteful but necessary.
                    // Other options include modifying the prototype of BigInt which is
                    // a risky enough move that we chose to pay the performance penalty instead.
                    // SocketIO does not have a way to inject the custom serializer so we
                    // are forced to do it here manually like this.
                    const nextJson = (0, safe_stable_stringify_1.stringify)(nextUnsafe, bigIntToDecimalStringReplacer);
                    log.debug("onLogs() BigInt Replaced JSON %s", nextJson);
                    if (!nextJson) {
                        throw new Error(`${fn} JSON stringify of logs returned falsy.`);
                    }
                    const nextSafe = JSON.parse(nextJson);
                    socket.timeout(socketAckTimeoutMs).emit(typescript_axios_1.WatchEventsV1.Next, nextSafe);
                },
            };
            if (fromBlock) {
                watchArgs.fromBlock = BigInt(fromBlock);
            }
            if (address) {
                watchArgs.address = (0, ensure_0x_prefix_1.ensure0xPrefix)(address);
            }
            if (eventName) {
                watchArgs.eventName = eventName;
            }
            log.debug("Effective viem watchArgs: %s", (0, safe_stable_stringify_1.stringify)(watchArgs));
            const { unwatch } = await (0, watch_events_v1_impl_1.watchEventsV1Impl)({
                logLevel: this.logLevel,
                viemClient,
                watchArgs,
            });
            log.debug("Subscribed to Viem solidity contract events OK");
            socket.on("disconnect", async (reason) => {
                log.debug("WebSocket:disconnect reason=%o", reason);
                unwatch();
                log.debug("unsubscribed from viem event stream");
            });
            socket.on(typescript_axios_1.WatchEventsV1.Unsubscribe, () => {
                log.debug(`${typescript_axios_1.WatchEventsV1.Unsubscribe}: unsubscribing Viem...`);
                unwatch();
                log.debug("unsubscribed from viem event stream");
            });
        }
        catch (ex) {
            const errorMessage = "Viem event subscripton crashed with exception";
            log.debug("%s=%o", errorMessage, ex);
            socket.emit(typescript_axios_1.WatchEventsV1.Error, new Error(errorMessage, { cause: ex }));
        }
    }
}
exports.WatchEventsV1Endpoint = WatchEventsV1Endpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2gtZXZlbnRzLXYxLWVuZHBvaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC93ZWItc2VydmljZXMvd2F0Y2gtZXZlbnRzLXYxLWVuZHBvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlFQUFrRDtBQVFsRCw4REFBNEQ7QUFDNUQsOERBQTBFO0FBSzFFLDRFQUFzRTtBQUN0RSx1RkFBaUY7QUFDakYsaUVBQTREO0FBRTVELFNBQVMsNkJBQTZCLENBQUMsSUFBWSxFQUFFLEtBQWM7SUFDakUsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUUsQ0FBQztRQUM5QixPQUFPLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBUUQsTUFBYSxxQkFBcUI7SUFrQko7SUFqQnJCLE1BQU0sQ0FBVSxVQUFVLEdBQUcsdUJBQXVCLENBQUM7SUFFM0MsR0FBRyxDQUFTO0lBQ1osUUFBUSxDQUFlO0lBQ3ZCLE1BQU0sQ0FNckI7SUFDZSxVQUFVLENBQW1CO0lBRTlDLElBQVcsU0FBUztRQUNsQixPQUFPLHFCQUFxQixDQUFDLFVBQVUsQ0FBQztJQUMxQyxDQUFDO0lBRUQsWUFBNEIsT0FBc0M7UUFBdEMsWUFBTyxHQUFQLE9BQU8sQ0FBK0I7UUFDaEUsTUFBTSxLQUFLLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxnQkFBZ0IsQ0FBQztRQUNoRCxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsR0FBRyxLQUFLLGNBQWMsQ0FBQyxDQUFDO1FBQy9DLHNCQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsR0FBRyxLQUFLLHlCQUF5QixDQUFDLENBQUM7UUFDckUsc0JBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUsscUJBQXFCLENB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