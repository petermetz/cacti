import type { TokenCredential } from "@azure/identity";
import type { AccessToken } from "@azure/core-auth";
import type { LogLevelDesc } from "@hyperledger/cactus-common";
export interface IRefreshTokenCredentialOptions {
    readonly logLevel?: Readonly<LogLevelDesc>;
    readonly clientId: Readonly<string>;
    readonly authority: Readonly<string>;
    readonly refreshToken: Readonly<string>;
    readonly resource: Readonly<string>;
}
export declare class RefreshTokenCredential implements TokenCredential {
    private readonly opts;
    static readonly CLASS_NAME = "RefreshTokenCredential";
    private readonly log;
    get className(): string;
    private readonly msalClient;
    constructor(opts: Readonly<IRefreshTokenCredentialOptions>);
    getToken(): Promise<AccessToken | null>;
}
