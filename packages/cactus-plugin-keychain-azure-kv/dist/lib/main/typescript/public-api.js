"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessTokenCredential = exports.RefreshTokenCredential = exports.AzureCredentialType = exports.PluginKeychainAzureKv = exports.PluginFactoryKeychain = void 0;
exports.createPluginFactory = createPluginFactory;
__exportStar(require("./generated/openapi/typescript-axios/index"), exports);
const plugin_factory_keychain_1 = require("./plugin-factory-keychain");
var plugin_factory_keychain_2 = require("./plugin-factory-keychain");
Object.defineProperty(exports, "PluginFactoryKeychain", { enumerable: true, get: function () { return plugin_factory_keychain_2.PluginFactoryKeychain; } });
var plugin_keychain_azure_kv_1 = require("./plugin-keychain-azure-kv");
Object.defineProperty(exports, "PluginKeychainAzureKv", { enumerable: true, get: function () { return plugin_keychain_azure_kv_1.PluginKeychainAzureKv; } });
Object.defineProperty(exports, "AzureCredentialType", { enumerable: true, get: function () { return plugin_keychain_azure_kv_1.AzureCredentialType; } });
async function createPluginFactory(pluginFactoryOptions) {
    return new plugin_factory_keychain_1.PluginFactoryKeychain(pluginFactoryOptions);
}
var refresh_token_credential_1 = require("./credentials/refresh-token-credential");
Object.defineProperty(exports, "RefreshTokenCredential", { enumerable: true, get: function () { return refresh_token_credential_1.RefreshTokenCredential; } });
var access_token_credential_1 = require("./credentials/access-token-credential");
Object.defineProperty(exports, "AccessTokenCredential", { enumerable: true, get: function () { return access_token_credential_1.AccessTokenCredential; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvcHVibGljLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQWFBLGtEQUlDO0FBakJELDZFQUEyRDtBQUkzRCx1RUFBa0U7QUFDbEUscUVBQWtFO0FBQXpELGdJQUFBLHFCQUFxQixPQUFBO0FBRTlCLHVFQUlvQztBQUZsQyxpSUFBQSxxQkFBcUIsT0FBQTtBQUNyQiwrSEFBQSxtQkFBbUIsT0FBQTtBQUdkLEtBQUssVUFBVSxtQkFBbUIsQ0FDdkMsb0JBQTJDO0lBRTNDLE9BQU8sSUFBSSwrQ0FBcUIsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3pELENBQUM7QUFHRCxtRkFBZ0Y7QUFBdkUsa0lBQUEsc0JBQXNCLE9BQUE7QUFFL0IsaUZBQThFO0FBQXJFLGdJQUFBLHFCQUFxQixPQUFBIn0=