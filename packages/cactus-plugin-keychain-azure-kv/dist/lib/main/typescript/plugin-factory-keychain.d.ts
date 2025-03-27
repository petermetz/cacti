import { IPluginFactoryOptions, IPluginKeychain, PluginFactory } from "@hyperledger/cactus-core-api";
import { IPluginKeychainAzureKvOptions } from "./plugin-keychain-azure-kv";
export declare class PluginFactoryKeychain extends PluginFactory<IPluginKeychain, IPluginKeychainAzureKvOptions, IPluginFactoryOptions> {
    create(options: any): Promise<IPluginKeychain>;
}
