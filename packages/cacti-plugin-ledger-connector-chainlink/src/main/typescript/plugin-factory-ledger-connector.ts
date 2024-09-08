import {
  IPluginFactoryOptions,
  PluginFactory,
} from "@hyperledger/cactus-core-api";
import {
  IPluginLedgerConnectorChainlinkOptions,
  PluginLedgerConnectorChainlink,
} from "./plugin-ledger-connector-chainlink";

export class PluginFactoryLedgerConnector extends PluginFactory<
  PluginLedgerConnectorChainlink,
  IPluginLedgerConnectorChainlinkOptions,
  IPluginFactoryOptions
> {
  async create(
    pluginOptions: IPluginLedgerConnectorChainlinkOptions,
  ): Promise<PluginLedgerConnectorChainlink> {
    return new PluginLedgerConnectorChainlink(pluginOptions);
  }
}
