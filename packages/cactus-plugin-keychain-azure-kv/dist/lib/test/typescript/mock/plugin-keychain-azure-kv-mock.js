"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretClientMock = void 0;
const identity_1 = require("@azure/identity");
/**
 * This class mocks the SecretClient class of "@azure/keyvault-secrets" library
 * by overriding the SecretClient class methods and storing the secrets In-Memory
 * TO DO: This class shall be replaced with actual usage of SecretClient class in
 * the main class located at packages/cactus-plugin-keychain-azure-kv/src/main/typescript/plugin-keychain-azure-kv.ts
 */
const cactus_common_1 = require("@hyperledger/cactus-common");
const keyvault_secrets_1 = require("@azure/keyvault-secrets");
class SecretClientMock extends keyvault_secrets_1.SecretClient {
    options;
    static CLASS_NAME = "SecretClientMock";
    log;
    vaultUrl;
    secrets;
    get className() {
        return SecretClientMock.CLASS_NAME;
    }
    constructor(options) {
        super(options.azureKvUrl, new identity_1.DefaultAzureCredential());
        this.options = options;
        const fnTag = `${this.className}#constructor()`;
        cactus_common_1.Checks.truthy(options, `${fnTag} arg options`);
        const level = this.options.logLevel || "INFO";
        const label = this.className;
        this.vaultUrl = this.options.azureKvUrl;
        this.secrets = new Map();
        this.log = cactus_common_1.LoggerProvider.getOrCreate({ level, label });
    }
    async setSecret(secretName, value) {
        this.log.debug("Setting secret: name=%s, value=%s", secretName, value);
        this.secrets.set(secretName, value);
        const secretProperties = {
            vaultUrl: this.vaultUrl,
            name: secretName,
        };
        const keyVaultSecret = {
            properties: secretProperties,
            name: secretName,
        };
        this.log.debug("Set secret as: %s", JSON.stringify(keyVaultSecret));
        return keyVaultSecret;
    }
    async beginDeleteSecret(name) {
        this.secrets.delete(name);
        const secretProperties = {
            vaultUrl: this.vaultUrl,
            name: name,
        };
        const deletedSecret = {
            properties: secretProperties,
        };
        const pollOperationsState = deletedSecret;
        const pollerLike = pollOperationsState;
        return pollerLike;
    }
    async updateSecretProperties() {
        throw new Error("Method not implemented.");
    }
    async getSecret(secretName) {
        const result = this.secrets.get(secretName)?.toString();
        if (result == undefined) {
            return null;
        }
        else {
            const secretProperties = {
                vaultUrl: this.vaultUrl,
                name: secretName,
            };
            const keyVaultSecret = {
                properties: secretProperties,
                name: secretName,
                value: result,
            };
            return keyVaultSecret;
        }
    }
    async hasSecret(secretName) {
        const result = this.secrets.has(secretName);
        return result;
    }
    async getDeletedSecret() {
        throw new Error("Method not implemented");
    }
    async purgeDeletedSecret() {
        throw new Error("Method not implemented");
    }
    async beginRecoverDeletedSecret() {
        throw new Error("Method not implemented");
    }
    async backupSecret() {
        throw new Error("Method not implemented");
    }
    async restoreSecretBackup() {
        throw new Error("Method not implemented");
    }
    listPropertiesOfSecretVersions() {
        throw new Error("Method not implemented");
    }
    listPropertiesOfSecrets() {
        throw new Error("Method not implemented");
    }
    listDeletedSecrets() {
        throw new Error("Method not implemented");
    }
}
exports.SecretClientMock = SecretClientMock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLWtleWNoYWluLWF6dXJlLWt2LW1vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvdGVzdC90eXBlc2NyaXB0L21vY2svcGx1Z2luLWtleWNoYWluLWF6dXJlLWt2LW1vY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOENBQXlEO0FBRXpEOzs7OztHQUtHO0FBQ0gsOERBS29DO0FBRXBDLDhEQVFpQztBQU9qQyxNQUFhLGdCQUFpQixTQUFRLCtCQUFZO0lBVXBCO0lBVHJCLE1BQU0sQ0FBVSxVQUFVLEdBQUcsa0JBQWtCLENBQUM7SUFDdEMsR0FBRyxDQUFTO0lBQ3BCLFFBQVEsQ0FBUztJQUNULE9BQU8sQ0FBc0I7SUFFOUMsSUFBVyxTQUFTO1FBQ2xCLE9BQU8sZ0JBQWdCLENBQUMsVUFBVSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxZQUE0QixPQUEwQjtRQUNwRCxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLGlDQUFzQixFQUFFLENBQUMsQ0FBQztRQUQ5QixZQUFPLEdBQVAsT0FBTyxDQUFtQjtRQUVwRCxNQUFNLEtBQUssR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLGdCQUFnQixDQUFDO1FBQ2hELHNCQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLEtBQUssY0FBYyxDQUFDLENBQUM7UUFFL0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksTUFBTSxDQUFDO1FBQzlDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUN4QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO1FBQ3pDLElBQUksQ0FBQyxHQUFHLEdBQUcsOEJBQWMsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFL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