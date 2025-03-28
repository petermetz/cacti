import type { Socket as SocketIoSocket } from "socket.io";
import Web3 from "web3";
import { LogLevelDesc } from "@hyperledger/cactus-common";
export interface IWatchBlocksV1EndpointOptions {
    logLevel?: LogLevelDesc;
    socket: SocketIoSocket;
    web3: Web3;
}
export declare class WatchBlocksV1Endpoint {
    readonly options: IWatchBlocksV1EndpointOptions;
    static readonly CLASS_NAME = "WatchBlocksV1Endpoint";
    private readonly log;
    private readonly socket;
    private readonly web3;
    get className(): string;
    constructor(options: IWatchBlocksV1EndpointOptions);
    subscribe(): Promise<void>;
}
