"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginFactoryKeychain = void 0;
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_core_api_1 = require("@hyperledger/cactus-core-api");
const plugin_keychain_azure_kv_1 = require("./plugin-keychain-azure-kv");
class PluginFactoryKeychain extends cactus_core_api_1.PluginFactory {
    async create(options) {
        const fnTag = "PluginFactoryKeychain#create()";
        const { pluginImportType } = this.options;
        cactus_common_1.Checks.truthy(options, `${fnTag}:options`);
        if (pluginImportType === cactus_core_api_1.PluginImportType.Local) {
            return new plugin_keychain_azure_kv_1.PluginKeychainAzureKv(options);
        }
        else {
            throw new Error(`${fnTag} No PluginImportType: ${pluginImportType}`);
        }
    }
}
exports.PluginFactoryKeychain = PluginFactoryKeychain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLWZhY3Rvcnkta2V5Y2hhaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbWFpbi90eXBlc2NyaXB0L3BsdWdpbi1mYWN0b3J5LWtleWNoYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDhEQUFvRDtBQUNwRCxrRUFLc0M7QUFDdEMseUVBR29DO0FBRXBDLE1BQWEscUJBQXNCLFNBQVEsK0JBSTFDO0lBQ0MsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFZO1FBQ3ZCLE1BQU0sS0FBSyxHQUFHLGdDQUFnQyxDQUFDO1FBRS9DLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDMUMsc0JBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsS0FBSyxVQUFVLENBQUMsQ0FBQztRQUMzQyxJQUFJLGdCQUFnQixLQUFLLGtDQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2hELE9BQU8sSUFBSSxnREFBcUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QyxDQUFDO2FBQU0sQ0FBQztZQUNOLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxLQUFLLHlCQUF5QixnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFDdkUsQ0FBQztJQUNILENBQUM7Q0FDRjtBQWhCRCxzREFnQkMifQ==