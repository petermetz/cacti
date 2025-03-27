/**
 * This class mocks the SecretClient class of "@azure/keyvault-secrets" library
 * by overriding the SecretClient class methods and storing the secrets In-Memory
 * TO DO: This class shall be replaced with actual usage of SecretClient class in
 * the main class located at packages/cactus-plugin-keychain-azure-kv/src/main/typescript/plugin-keychain-azure-kv.ts
 */
import { LogLevelDesc } from "@hyperledger/cactus-common";
import { SecretClient, KeyVaultSecret, SecretProperties, PollerLike, PollOperationState, DeletedSecret, PagedAsyncIterableIterator } from "@azure/keyvault-secrets";
export interface ISecretClientMock {
    azureKvUrl: string;
    logLevel?: LogLevelDesc;
}
export declare class SecretClientMock extends SecretClient {
    readonly options: ISecretClientMock;
    static readonly CLASS_NAME = "SecretClientMock";
    private readonly log;
    readonly vaultUrl: string;
    private readonly secrets;
    get className(): string;
    constructor(options: ISecretClientMock);
    setSecret(secretName: string, value: string): Promise<KeyVaultSecret>;
    beginDeleteSecret(name: string): Promise<PollerLike<PollOperationState<DeletedSecret>, DeletedSecret>>;
    updateSecretProperties(): Promise<SecretProperties>;
    getSecret(secretName: string): Promise<KeyVaultSecret>;
    hasSecret(secretName: string): Promise<boolean>;
    getDeletedSecret(): Promise<DeletedSecret>;
    purgeDeletedSecret(): Promise<void>;
    beginRecoverDeletedSecret(): Promise<PollerLike<PollOperationState<SecretProperties>, SecretProperties>>;
    backupSecret(): Promise<Uint8Array | undefined>;
    restoreSecretBackup(): Promise<SecretProperties>;
    listPropertiesOfSecretVersions(): PagedAsyncIterableIterator<SecretProperties>;
    listPropertiesOfSecrets(): PagedAsyncIterableIterator<SecretProperties>;
    listDeletedSecrets(): PagedAsyncIterableIterator<DeletedSecret>;
}
