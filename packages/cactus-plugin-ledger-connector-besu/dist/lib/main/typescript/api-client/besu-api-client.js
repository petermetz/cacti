"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BesuApiClient = exports.BesuApiClientOptions = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const socket_io_client_fixed_types_1 = require("socket.io-client-fixed-types");
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_common_2 = require("@hyperledger/cactus-common");
const cactus_core_api_1 = require("@hyperledger/cactus-core-api");
const typescript_axios_1 = require("../generated/openapi/typescript-axios");
const configuration_1 = require("../generated/openapi/typescript-axios/configuration");
class BesuApiClientOptions extends configuration_1.Configuration {
    logLevel;
    wsApiHost;
    wsApiPath;
}
exports.BesuApiClientOptions = BesuApiClientOptions;
class BesuApiClient extends typescript_axios_1.DefaultApi {
    options;
    static CLASS_NAME = "BesuApiClient";
    log;
    wsApiHost;
    wsApiPath;
    get className() {
        return BesuApiClient.CLASS_NAME;
    }
    constructor(options) {
        super(options);
        this.options = options;
        const fnTag = `${this.className}#constructor()`;
        cactus_common_1.Checks.truthy(options, `${fnTag} arg options`);
        const level = this.options.logLevel || "INFO";
        const label = this.className;
        this.log = cactus_common_2.LoggerProvider.getOrCreate({ level, label });
        this.wsApiHost = options.wsApiHost || options.basePath || location.host;
        this.wsApiPath = options.wsApiPath || cactus_core_api_1.Constants.SocketIoConnectionPathV1;
        this.log.debug(`Created ${this.className} OK.`);
        this.log.debug(`wsApiHost=${this.wsApiHost}`);
        this.log.debug(`wsApiPath=${this.wsApiPath}`);
        this.log.debug(`basePath=${this.options.basePath}`);
    }
    watchBlocksV1() {
        const socket = (0, socket_io_client_fixed_types_1.io)(this.wsApiHost, { path: this.wsApiPath });
        const subject = new rxjs_1.ReplaySubject(0);
        socket.on(typescript_axios_1.WatchBlocksV1.Next, (data) => {
            subject.next(data);
        });
        socket.on("connect", () => {
            this.log.debug("connected OK...");
            socket.emit(typescript_axios_1.WatchBlocksV1.Subscribe);
        });
        socket.connect();
        return subject.pipe((0, operators_1.finalize)(() => {
            this.log.debug("FINALIZE - unsubscribing from the stream...");
            socket.emit(typescript_axios_1.WatchBlocksV1.Unsubscribe);
            socket.disconnect();
        }));
    }
    watchEventsV1(req) {
        const socket = (0, socket_io_client_fixed_types_1.io)(this.wsApiHost, { path: this.wsApiPath });
        const subject = new rxjs_1.ReplaySubject(0);
        socket.on(typescript_axios_1.WatchEventsV1.Next, (data) => {
            subject.next(data);
        });
        socket.on("connect", () => {
            this.log.info("socket connected OK emitting subscribe");
            socket.emit(typescript_axios_1.WatchEventsV1.Subscribe, req);
        });
        socket.connect();
        return subject.pipe((0, operators_1.finalize)(() => {
            this.log.info("FINALIZE - unsubscribing from the stream...");
            socket.emit(typescript_axios_1.WatchEventsV1.Unsubscribe);
            socket.disconnect();
        }));
    }
}
exports.BesuApiClient = BesuApiClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVzdS1hcGktY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9hcGktY2xpZW50L2Jlc3UtYXBpLWNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBaUQ7QUFDakQsOENBQTBDO0FBQzFDLCtFQUEwRDtBQUMxRCw4REFBNEQ7QUFDNUQsOERBQTBFO0FBQzFFLGtFQUEyRTtBQUMzRSw0RUFPK0M7QUFDL0MsdUZBQW9GO0FBRXBGLE1BQWEsb0JBQXFCLFNBQVEsNkJBQWE7SUFDNUMsUUFBUSxDQUFnQjtJQUN4QixTQUFTLENBQVU7SUFDbkIsU0FBUyxDQUFVO0NBQzdCO0FBSkQsb0RBSUM7QUFFRCxNQUFhLGFBQ1gsU0FBUSw2QkFBVTtJQWFVO0lBVnJCLE1BQU0sQ0FBVSxVQUFVLEdBQUcsZUFBZSxDQUFDO0lBRW5DLEdBQUcsQ0FBUztJQUNaLFNBQVMsQ0FBUztJQUNsQixTQUFTLENBQVM7SUFFbkMsSUFBVyxTQUFTO1FBQ2xCLE9BQU8sYUFBYSxDQUFDLFVBQVUsQ0FBQztJQUNsQyxDQUFDO0lBRUQsWUFBNEIsT0FBNkI7UUFDdkQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRFcsWUFBTyxHQUFQLE9BQU8sQ0FBc0I7UUFFdkQsTUFBTSxLQUFLLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxnQkFBZ0IsQ0FBQztRQUNoRCxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsR0FBRyxLQUFLLGNBQWMsQ0FBQyxDQUFDO1FBRS9DLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQztRQUM5QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLEdBQUcsOEJBQWMsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMs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