"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginKeychainAzureKv = exports.AzureCredentialType = void 0;
const identity_1 = require("@azure/identity");
const keyvault_secrets_1 = require("@azure/keyvault-secrets");
const openapi_json_1 = __importDefault(require("../json/openapi.json"));
const cactus_common_1 = require("@hyperledger/cactus-common");
const set_keychain_entry_endpoint_1 = require("./web-services/set-keychain-entry-endpoint");
const get_keychain_entry_endpoint_1 = require("./web-services/get-keychain-entry-endpoint");
const delete_keychain_entry_endpoint_1 = require("./web-services/delete-keychain-entry-endpoint");
const has_keychain_entry_endpoint_1 = require("./web-services/has-keychain-entry-endpoint");
const access_token_credential_1 = require("./credentials/access-token-credential");
const refresh_token_credential_1 = require("./credentials/refresh-token-credential");
// TODO: Writing the getExpressRequestHandler() method for
var AzureCredentialType;
(function (AzureCredentialType) {
    AzureCredentialType["LocalFile"] = "LOCAL_FILE";
    /**
     * Enables authentication to Microsoft Entra ID with a user's username and password.
     * This credential requires a high degree of trust so you should only use it
     * when other, more secure credential types can't be used.
     * @deprecated — UsernamePasswordCredential is deprecated.
     * Use a more secure credential. See https://aka.ms/azsdk/identity/mfa for details.
     */
    AzureCredentialType["InMemory"] = "IN_MEMORY";
    /**
     * @see {@link AccessTokenCredential}
     */
    AzureCredentialType["AccessToken"] = "ACCESS_TOKEN";
    /**
     * @see {@link RefreshTokenCredential}
     */
    AzureCredentialType["RefreshToken"] = "REFRESH_TOKEN";
})(AzureCredentialType || (exports.AzureCredentialType = AzureCredentialType = {}));
class PluginKeychainAzureKv {
    opts;
    static CLASS_NAME = "PluginKeychainAzureKv";
    vaultUrl;
    log;
    instanceId;
    endpoints;
    azureKvClient;
    get className() {
        return PluginKeychainAzureKv.CLASS_NAME;
    }
    constructor(opts) {
        this.opts = opts;
        const fnTag = `${this.className}#constructor()`;
        cactus_common_1.Checks.truthy(opts, `${fnTag} arg options`);
        cactus_common_1.Checks.truthy(opts.keychainId, `${fnTag} arg options.keychainId`);
        cactus_common_1.Checks.truthy(opts.instanceId, `${fnTag} options.instanceId`);
        cactus_common_1.Checks.nonBlankString(opts.keychainId, `${fnTag} options.keychainId`);
        cactus_common_1.Checks.nonBlankString(opts.azureEndpoint, `${fnTag} options.azureEndpoint`);
        if (opts.azureCredentialType &&
            opts.azureInMemoryCredentials &&
            opts.azureCredentialType == AzureCredentialType.InMemory) {
            cactus_common_1.Checks.nonBlankString(opts.azureInMemoryCredentials.azureTenantId, `${fnTag} opts.azureInMemoryCredentials.azureTenantId`);
            cactus_common_1.Checks.nonBlankString(opts.azureInMemoryCredentials.azureClientId, `${fnTag} opts.azureInMemoryCredentials.azureClientId`);
            cactus_common_1.Checks.nonBlankString(opts.azureInMemoryCredentials.azureUsername, `${fnTag} opts.azureInMemoryCredentials.azureUsername`);
            cactus_common_1.Checks.nonBlankString(opts.azureInMemoryCredentials.azurePassword, `${fnTag} opts.azureInMemoryCredentials.azurePassword`);
        }
        const level = this.opts.logLevel || "INFO";
        const label = this.className;
        this.log = cactus_common_1.LoggerProvider.getOrCreate({ level, label });
        this.instanceId = this.opts.instanceId;
        this.vaultUrl = this.opts.azureEndpoint;
        if (opts.backend) {
            this.azureKvClient = opts.backend;
        }
        else if (opts.azureCredentialType == AzureCredentialType.InMemory &&
            opts.azureInMemoryCredentials) {
            this.log.warn("Do not use AzureCredentialType.InMemory in production.");
            const azureCredentials = new identity_1.UsernamePasswordCredential(opts.azureInMemoryCredentials.azureTenantId, opts.azureInMemoryCredentials.azureClientId, opts.azureInMemoryCredentials.azureUsername, opts.azureInMemoryCredentials.azurePassword);
            this.azureKvClient = new keyvault_secrets_1.SecretClient(this.vaultUrl, azureCredentials);
        }
        else if (opts.azureCredentialType === AzureCredentialType.AccessToken &&
            opts.accessTokenCredentials) {
            this.log.debug("Using AccessTokenCredential type Azure KV SecretClient");
            const credential = new access_token_credential_1.AccessTokenCredential({
                ...opts.accessTokenCredentials,
                logLevel: opts.logLevel,
            });
            this.azureKvClient = new keyvault_secrets_1.SecretClient(this.vaultUrl, credential);
        }
        else if (opts.azureCredentialType === AzureCredentialType.RefreshToken &&
            opts.refreshTokenCredentials) {
            this.log.debug("Using RefreshTokenCredential type Azure KV SecretClient");
            const credential = new refresh_token_credential_1.RefreshTokenCredential({
                ...opts.refreshTokenCredentials,
                logLevel: opts.logLevel,
            });
            this.azureKvClient = new keyvault_secrets_1.SecretClient(this.vaultUrl, credential);
        }
        else {
            this.log.debug("Credentials: falling back to DefaultAzureCredential");
            const azureCredentials = new identity_1.DefaultAzureCredential();
            this.azureKvClient = new keyvault_secrets_1.SecretClient(this.vaultUrl, azureCredentials);
        }
        this.log.info(`Created ${this.className}. KeychainID=${opts.keychainId}`);
    }
    getOpenApiSpec() {
        return openapi_json_1.default;
    }
    async registerWebServices(app) {
        const webServices = await this.getOrCreateWebServices();
        await Promise.all(webServices.map((ws) => ws.registerExpress(app)));
        return webServices;
    }
    async getOrCreateWebServices() {
        if (Array.isArray(this.endpoints)) {
            return this.endpoints;
        }
        const endpoints = [
            new set_keychain_entry_endpoint_1.SetKeychainEntryEndpoint({
                connector: this,
                logLevel: this.opts.logLevel,
            }),
            new get_keychain_entry_endpoint_1.GetKeychainEntryEndpoint({
                connector: this,
                logLevel: this.opts.logLevel,
            }),
            new delete_keychain_entry_endpoint_1.DeleteKeychainEntryEndpoint({
                connector: this,
                logLevel: this.opts.logLevel,
            }),
            new has_keychain_entry_endpoint_1.HasKeychainEntryEndpoint({
                connector: this,
                logLevel: this.opts.logLevel,
            }),
        ];
        this.endpoints = endpoints;
        return endpoints;
    }
    async shutdown() {
        return;
    }
    getInstanceId() {
        return this.instanceId;
    }
    getKeychainId() {
        return this.opts.keychainId;
    }
    async onPluginInit() {
        return;
    }
    getPackageName() {
        return `@hyperledger/cactus-plugin-keychain-vault`;
    }
    getEncryptionAlgorithm() {
        return null;
    }
    getAzureKvClient() {
        return this.azureKvClient;
    }
    async get(key) {
        const keyVaultSecret = await this.azureKvClient.getSecret(key);
        if (keyVaultSecret) {
            const result = keyVaultSecret.value;
            return result;
        }
        else {
            throw new Error(`${key} secret not found`);
        }
    }
    /**
     * Detects the presence of a key by trying to read it and then
     * observing whether an HTTP 404 NOT FOUND error is returned or
     * not and deciding whether the keychain has the entry ot not
     * based on this.
     */
    async has(key) {
        const keyVaultSecret = await this.azureKvClient.getSecret(key);
        if (keyVaultSecret) {
            return true;
        }
        else {
            return false;
        }
    }
    async set(key, value) {
        await this.azureKvClient.setSecret(key, value);
    }
    async delete(key) {
        await this.azureKvClient.beginDeleteSecret(key);
    }
}
exports.PluginKeychainAzureKv = PluginKeychainAzureKv;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLWtleWNoYWluLWF6dXJlLWt2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21haW4vdHlwZXNjcmlwdC9wbHVnaW4ta2V5Y2hhaW4tYXp1cmUta3YudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsOENBR3lCO0FBQ3pCLDhEQUF1RTtBQUV2RSx3RUFBdUM7QUFFdkMsOERBS29DO0FBU3BDLDRGQUFzRjtBQUN0Riw0RkFBc0Y7QUFDdEYsa0dBQTRGO0FBQzVGLDRGQUFzRjtBQUN0RixtRkFHK0M7QUFDL0MscUZBR2dEO0FBRWhELDBEQUEwRDtBQUUxRCxJQUFZLG1CQWtCWDtBQWxCRCxXQUFZLG1CQUFtQjtJQUM3QiwrQ0FBd0IsQ0FBQTtJQUN4Qjs7Ozs7O09BTUc7SUFDSCw2Q0FBc0IsQ0FBQTtJQUN0Qjs7T0FFRztJQUNILG1EQUE0QixDQUFBO0lBQzVCOztPQUVHO0lBQ0gscURBQThCLENBQUE7QUFDaEMsQ0FBQyxFQWxCVyxtQkFBbUIsbUNBQW5CLG1CQUFtQixRQWtCOUI7QUFxQkQsTUFBYSxxQkFBcUI7SUFlSjtJQVpyQixNQUFNLENBQVUsVUFBVSxHQUFHLHVCQUF1QixDQUFDO0lBRW5ELFFBQVEsQ0FBUztJQUNULEdBQUcsQ0FBUztJQUNaLFVBQVUsQ0FBUztJQUM1QixTQUFTLENBQW9DO0lBQzdDLGFBQWEsQ0FBZTtJQUVwQyxJQUFXLFNBQVM7UUFDbEIsT0FBTyxxQkFBcUIsQ0FBQyxVQUFVLENBQUM7SUFDMUMsQ0FBQztJQUVELFlBQTRCLElBQW1DO1FBQW5DLFNBQUksR0FBSixJQUFJLENBQStCO1FBQzdELE1BQU0sS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsZ0JBQWdCLENBQUM7UUFDaEQsc0JBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxjQUFjLENBQUMsQ0FBQztRQUM1QyxzQkFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsS0FBSyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ2xFLHNCQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxLQUFLLHFCQUFxQixDQUFDLENBQUM7UUFDOUQsc0JBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEtBQUsscUJBQXFCLENBQUMsQ0FBQztRQUN0RSxzQkFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEdBQUcsS0FBSyx3QkFBd0IsQ0FBQyxDQUFDO1FBQzVFLElBQ0UsSUFBSSxDQUFDLG1CQUFtQjtZQUN4QixJQUFJLENBQUMsd0JBQXdCO1lBQzdCLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLEVBQ3hELENBQUM7WUFDRCxzQkFBTSxDQUFDLGNBQWMsQ0FDbkIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGFBQWEsRUFDM0MsR0FBRyxLQUFLLDhDQUE4QyxDQUN2RCxDQUFDO1lBQ0Ysc0JBQU0sQ0FBQyxjQUFjLENBQ25CLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxhQUFhLEVBQzNDLEdBQUcsS0FBSyw4Q0FBOEMsQ0FDdkQsQ0FBQztZQUNGLHNCQUFNLENBQUMsY0FBYyxDQUNuQixJQUFJLENBQUMsd0JBQXdCLENBQUMsYUFBYSxFQUMzQyxHQUFHLEtBQUssOENBQThDLENBQ3ZELENBQUM7WUFDRixzQkFBTSxDQUFDLGNBQWMsQ0FDbkIsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGFBQWEsRUFDM0MsR0FBRyxLQUFLLDhDQUE4QyxDQUN2RCxDQUFDO1FBQ0osQ0FBQztRQUVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQztRQUMzQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLEdBQUcsOEJBQWMsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUV4RCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7UUFFeEMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3BDLENBQUM7YUFBTSxJQUNMLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxtQkFBbUIsQ0FBQyxRQUFRO1lBQ3hELElBQUksQ0FBQyx3QkFBd0IsRUFDN0IsQ0FBQztZQUNELElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHdEQUF3RCxDQUFDLENBQUM7WUFDeEUsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLHFDQUEwQixDQUNyRCxJQUFJLENBQUMsd0JBQXdCLENBQUMsYUFBYSxFQUMzQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsYUFBYSxFQUMzQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsYUFBYSxFQUMzQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsYUFBYSxDQUM1QyxDQUFDO1lBQ0YsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLCtCQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3pFLENBQUM7YUFBTSxJQUNMLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxtQkFBbUIsQ0FBQyxXQUFXO1lBQzVELElBQUksQ0FBQyxzQkFBc0IsRUFDM0IsQ0FBQztZQUNELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHdEQUF3RCxDQUFDLENBQUM7WUFDekUsTUFBTSxVQUFVLEdBQUcsSUFBSSwrQ0FBcUIsQ0FBQztnQkFDM0MsR0FBRyxJQUFJLENBQUMsc0JBQXNCO2dCQUM5QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7YUFDeEIsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLCtCQUFZLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNuRSxDQUFDO2FBQU0sSUFDTCxJQUFJLENBQUMsbUJBQW1CLEtBQUssbUJBQW1CLENBQUMsWUFBWTtZQUM3RCxJQUFJLENBQUMsdUJBQXVCLEVBQzVCLENBQUM7WUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO1lBQzFFLE1BQU0sVUFBVSxHQUFHLElBQUksaURBQXNCLENBQUM7Z0JBQzVDLEdBQUcsSUFBSSxDQUFDLHVCQUF1QjtnQkFDL0IsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2FBQ3hCLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSwrQkFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbkUsQ0FBQzthQUFNLENBQUM7WUFDTixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxxREFBcUQsQ0FBQyxDQUFDO1lBQ3RFLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxpQ0FBc0IsRUFBRSxDQUFDO1lBQ3RELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSwrQkFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN6RSxDQUFDO1FBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsU0FBUyxnQkFBZ0IsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVNLGNBQWM7UUFDbkIsT0FBTyxzQkFBRyxDQUFDO0lBQ2IsQ0FBQztJQUVELEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxHQUFZO1FBQ3BDLE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDeEQsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFFTSxLQUFLLENBQUMsc0JBQXNCO1FBQ2pDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztZQUNsQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDeEIsQ0FBQztRQUNELE1BQU0sU0FBUyxHQUEwQjtZQUN2QyxJQUFJLHNEQUF3QixDQUFDO2dCQUMzQixTQUFTLEVBQUUsSUFBSTtnQkFDZixRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO2FBQzdCLENBQUM7WUFDRixJQUFJLHNEQUF3QixDQUFDO2dCQUMzQixTQUFTLEVBQUUsSUFBSTtnQkFDZixRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO2FBQzdCLENBQUM7WUFDRixJQUFJLDREQUEyQixDQUFDO2dCQUM5QixTQUFTLEVBQUUsSUFBSTtnQkFDZixRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO2FBQzdCLENBQUM7WUFDRixJQUFJLHNEQUF3QixDQUFDO2dCQUMzQixTQUFTLEVBQUUsSUFBSTtnQkFDZixRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO2FBQzdCLENBQUM7U0FDSCxDQUFDO1FBQ0YsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFFM0IsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVNLEtBQUssQ0FBQyxRQUFRO1FBQ25CLE9BQU87SUFDVCxDQUFDO0lBRU0sYUFBYTtRQUNsQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUVNLGFBQWE7UUFDbEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUM5QixDQUFDO0lBRU0sS0FBSyxDQUFDLFlBQVk7UUFDdkIsT0FBTztJQUNULENBQUM7SUFFTSxjQUFjO1FBQ25CLE9BQU8sMkNBQTJDLENBQUM7SUFDckQsQ0FBQztJQUVNLHNCQUFzQjtRQUMzQixPQUFPLElBQXlCLENBQUM7SUFDbkMsQ0FBQztJQUVNLGdCQUFnQjtRQUNyQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDNUIsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBVztRQUNuQixNQUFNLGNBQWMsR0FDbEIsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ25CLE1BQU0sTUFBTSxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUM7WUFDcEMsT0FBTyxNQUFnQixDQUFDO1FBQzFCLENBQUM7YUFBTSxDQUFDO1lBQ04sTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLEdBQUcsbUJBQW1CLENBQUMsQ0FBQztRQUM3QyxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7OztPQUtHO0lBRUgsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFXO1FBQ25CLE1BQU0sY0FBYyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0QsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUNuQixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7YUFBTSxDQUFDO1lBQ04sT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFHLENBQUksR0FBVyxFQUFFLEtBQVE7UUFDaEMsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsS0FBMEIsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQVc7UUFDdEIsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xELENBQUM7O0FBak1ILHNEQWtNQyJ9