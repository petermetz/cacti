import { Observable } from "rxjs";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import { ISocketApiClient } from "@hyperledger/cactus-core-api";
import { DefaultApi, ViemV2242WatchEventsV1Progress, WatchBlocksV1Progress, WatchEventsV1Request } from "../generated/openapi/typescript-axios";
import { Configuration } from "../generated/openapi/typescript-axios/configuration";
export declare class BesuApiClientOptions extends Configuration {
    readonly logLevel?: LogLevelDesc;
    readonly wsApiHost?: string;
    readonly wsApiPath?: string;
}
export declare class BesuApiClient extends DefaultApi implements ISocketApiClient<WatchBlocksV1Progress> {
    readonly options: BesuApiClientOptions;
    static readonly CLASS_NAME = "BesuApiClient";
    private readonly log;
    private readonly wsApiHost;
    private readonly wsApiPath;
    get className(): string;
    constructor(options: BesuApiClientOptions);
    watchBlocksV1(): Observable<WatchBlocksV1Progress>;
    watchEventsV1(req: WatchEventsV1Request): Observable<ViemV2242WatchEventsV1Progress>;
}
