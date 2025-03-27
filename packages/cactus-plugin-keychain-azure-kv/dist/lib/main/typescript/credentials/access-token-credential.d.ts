import type { LogLevelDesc } from "@hyperledger/cactus-common";
import type { AccessToken, TokenCredential } from "@azure/identity";
export interface IAccessTokenCredentialOptions {
    readonly logLevel?: Readonly<LogLevelDesc>;
    readonly accessToken: Readonly<AccessToken>;
}
/**
 * An overly simplistic credential implementation that is compatible with the
 * Azure Javascript SDK.
 * It doesn't handle refreshing the token, the caller is responsible for updating
 * the state of it to ensure that the token that it returns hasn't expired.
 *
 * Should be useful for local development scenarios for the most part since in
 * production you would most likely want to go with {@link RefreshTokenCredential}
 *
 * @see {@link RefreshTokenCredential}
 */
export declare class AccessTokenCredential implements TokenCredential {
    private opts;
    static readonly CLASS_NAME = "AccessTokenCredential";
    private readonly log;
    get className(): string;
    constructor(opts: Readonly<IAccessTokenCredentialOptions>);
    getToken(): Promise<AccessToken | null>;
}
