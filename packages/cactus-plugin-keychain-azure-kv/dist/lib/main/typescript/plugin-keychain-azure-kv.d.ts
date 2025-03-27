import type { Express } from "express";
import { SecretClient } from "@azure/keyvault-secrets";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import { ICactusPlugin, ICactusPluginOptions, IPluginKeychain, IPluginWebService, IWebServiceEndpoint } from "@hyperledger/cactus-core-api";
import { IAccessTokenCredentialOptions } from "./credentials/access-token-credential";
import { IRefreshTokenCredentialOptions } from "./credentials/refresh-token-credential";
export declare enum AzureCredentialType {
    LocalFile = "LOCAL_FILE",
    /**
     * Enables authentication to Microsoft Entra ID with a user's username and password.
     * This credential requires a high degree of trust so you should only use it
     * when other, more secure credential types can't be used.
     * @deprecated — UsernamePasswordCredential is deprecated.
     * Use a more secure credential. See https://aka.ms/azsdk/identity/mfa for details.
     */
    InMemory = "IN_MEMORY",
    /**
     * @see {@link AccessTokenCredential}
     */
    AccessToken = "ACCESS_TOKEN",
    /**
     * @see {@link RefreshTokenCredential}
     */
    RefreshToken = "REFRESH_TOKEN"
}
export interface IAzureInMemoryCredentials {
    azureTenantId: string;
    azureClientId: string;
    azureUsername: string;
    azurePassword: string;
}
export interface IPluginKeychainAzureKvOptions extends ICactusPluginOptions {
    logLevel?: LogLevelDesc;
    keychainId: string;
    instanceId: string;
    azureEndpoint: string;
    azureCredentialType?: AzureCredentialType;
    azureInMemoryCredentials?: IAzureInMemoryCredentials;
    refreshTokenCredentials?: IRefreshTokenCredentialOptions;
    accessTokenCredentials?: IAccessTokenCredentialOptions;
    backend?: SecretClient;
}
export declare class PluginKeychainAzureKv implements ICactusPlugin, IPluginWebService, IPluginKeychain {
    readonly opts: IPluginKeychainAzureKvOptions;
    static readonly CLASS_NAME = "PluginKeychainAzureKv";
    readonly vaultUrl: string;
    private readonly log;
    private readonly instanceId;
    private endpoints;
    private azureKvClient;
    get className(): string;
    constructor(opts: IPluginKeychainAzureKvOptions);
    getOpenApiSpec(): unknown;
    registerWebServices(app: Express): Promise<IWebServiceEndpoint[]>;
    getOrCreateWebServices(): Promise<IWebServiceEndpoint[]>;
    shutdown(): Promise<void>;
    getInstanceId(): string;
    getKeychainId(): string;
    onPluginInit(): Promise<unknown>;
    getPackageName(): string;
    getEncryptionAlgorithm(): string;
    getAzureKvClient(): SecretClient;
    get(key: string): Promise<string>;
    /**
     * Detects the presence of a key by trying to read it and then
     * observing whether an HTTP 404 NOT FOUND error is returned or
     * not and deciding whether the keychain has the entry ot not
     * based on this.
     */
    has(key: string): Promise<boolean>;
    set<T>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
}
