import type { Socket as SocketIoSocket } from "socket.io";
import { PublicClient as ViemPublicClient } from "viem";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import { WatchEventsV1Request } from "../generated/openapi/typescript-axios";
export interface IWatchEventsV1EndpointOptions {
    readonly logLevel?: LogLevelDesc;
    readonly socket: SocketIoSocket;
    readonly viemClient: ViemPublicClient;
}
export declare class WatchEventsV1Endpoint {
    readonly options: IWatchEventsV1EndpointOptions;
    static readonly CLASS_NAME = "WatchEventsV1Endpoint";
    private readonly log;
    private readonly logLevel;
    private readonly socket;
    private readonly viemClient;
    get className(): string;
    constructor(options: IWatchEventsV1EndpointOptions);
    subscribe(req: WatchEventsV1Request): Promise<void>;
}
