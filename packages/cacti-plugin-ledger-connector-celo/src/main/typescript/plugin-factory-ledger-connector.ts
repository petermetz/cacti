import {
  IPluginFactoryOptions,
  PluginFactory,
} from "@hyperledger/cactus-core-api";
import {
  IPluginLedgerConnectorCeloOptions,
  PluginLedgerConnectorCelo,
} from "./plugin-ledger-connector-celo";

export class PluginFactoryLedgerConnector extends PluginFactory<
  PluginLedgerConnectorCelo,
  IPluginLedgerConnectorCeloOptions,
  IPluginFactoryOptions
> {
  async create(
    pluginOptions: IPluginLedgerConnectorCeloOptions,
  ): Promise<PluginLedgerConnectorCelo> {
    return new PluginLedgerConnectorCelo(pluginOptions);
  }
}
