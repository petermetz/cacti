"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchEventsV1Endpoint = void 0;
const safe_stable_stringify_1 = require("safe-stable-stringify");
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_common_2 = require("@hyperledger/cactus-common");
const typescript_axios_1 = require("../generated/openapi/typescript-axios");
const watch_events_v1_impl_1 = require("../impl/watch-events-v1/watch-events-v1-impl");
const ensure_0x_prefix_1 = require("../common/ensure-0x-prefix");
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
                    const nextJson = (0, safe_stable_stringify_1.stringify)(nextUnsafe, cactus_common_1.bigIntToDecimalStringReplacer);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2gtZXZlbnRzLXYxLWVuZHBvaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC93ZWItc2VydmljZXMvd2F0Y2gtZXZlbnRzLXYxLWVuZHBvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlFQUFrRDtBQVFsRCw4REFJb0M7QUFDcEMsOERBQTBFO0FBSzFFLDRFQUFzRTtBQUN0RSx1RkFBaUY7QUFDakYsaUVBQTREO0FBUTVELE1BQWEscUJBQXFCO0lBa0JKO0lBakJyQixNQUFNLENBQVUsVUFBVSxHQUFHLHVCQUF1QixDQUFDO0lBRTNDLEdBQUcsQ0FBUztJQUNaLFFBQVEsQ0FBZTtJQUN2QixNQUFNLENBTXJCO0lBQ2UsVUFBVSxDQUFtQjtJQUU5QyxJQUFXLFNBQVM7UUFDbEIsT0FBTyxxQkFBcUIsQ0FBQyxVQUFVLENBQUM7SUFDMUMsQ0FBQztJQUVELFlBQTRCLE9BQXNDO1FBQXRDLFlBQU8sR0FBUCxPQUFPLENBQStCO1FBQ2hFLE1BQU0sS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsZ0JBQWdCLENBQUM7UUFDaEQsc0JBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsS0FBSyxjQUFjLENBQUMsQ0FBQztRQUMvQyxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEdBQUcsS0FBSyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3JFLHNCQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLHFCQUFxQixDQUFDLENBQUM7UUFFN0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUU3QixNQUFNLEVBQUUsUUFBUSxHQUFHLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUN0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