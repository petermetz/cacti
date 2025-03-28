import { IPluginFactoryOptions, PluginFactory } from "@hyperledger/cactus-core-api";
import { IPluginLedgerConnectorBesuOptions, PluginLedgerConnectorBesu } from "./plugin-ledger-connector-besu";
export declare class PluginFactoryLedgerConnector extends PluginFactory<PluginLedgerConnectorBesu, IPluginLedgerConnectorBesuOptions, IPluginFactoryOptions> {
    create(pluginOptions: IPluginLedgerConnectorBesuOptions): Promise<PluginLedgerConnectorBesu>;
}
