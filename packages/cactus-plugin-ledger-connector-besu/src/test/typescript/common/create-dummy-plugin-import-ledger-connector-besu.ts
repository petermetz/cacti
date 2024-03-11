import { LogLevelDesc, LoggerProvider } from "@hyperledger/cactus-common";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { PluginImport } from "@hyperledger/cactus-core-api";
import { createDummyPluginImport } from "@hyperledger/cactus-test-tooling";
import { v4 as uuidv4 } from "uuid";
import { IPluginLedgerConnectorBesuOptions } from "../../../main/typescript/public-api";

export async function createDummyOptionsLedgerConnectorBesu(req: {
  readonly pluginRegistry: PluginRegistry;
  readonly logLevel?: LogLevelDesc;
}): Promise<IPluginLedgerConnectorBesuOptions> {
  const fnTag = "#createDummyOptionsLedgerConnectorBesu()" as const;
  const { logLevel = "DEBUG", pluginRegistry } = req;

  const log = LoggerProvider.getOrCreate({
    label: fnTag,
    level: logLevel,
  });

  const options: IPluginLedgerConnectorBesuOptions = {
    pluginRegistry,
    instanceId: uuidv4(),
    rpcApiHttpHost: "http://127.0.0.1:8000",
    rpcApiWsHost: "ws://127.0.0.1:9000",
    logLevel,
  };

  log.debug("created IPluginKeychainMemoryOptions=%o", options);

  return options;
}

export async function createDummyPluginImportLedgerConnectorBesu(req: {
  readonly pluginRegistry: PluginRegistry;
  readonly gitRootDir: string;
  readonly logLevel?: LogLevelDesc;
  readonly overrides?: Partial<PluginImport>;
}): Promise<PluginImport> {
  const pkgName = "@hyperledger/cactus-plugin-ledger-connector-besu" as const;
  const pkgSubDir = "./packages/cactus-plugin-ledger-connector-besu/" as const;
  const fnTag = "#createDummyPluginImportLedgerConnectorBesu()" as const;
  const { logLevel = "DEBUG", pluginRegistry, gitRootDir, overrides } = req;

  const log = LoggerProvider.getOrCreate({
    label: fnTag,
    level: req.logLevel || "DEBUG",
  });

  const options = await createDummyOptionsLedgerConnectorBesu({
    pluginRegistry,
    logLevel,
  });

  const pluginImport =
    createDummyPluginImport<IPluginLedgerConnectorBesuOptions>({
      gitRootDir,
      pkgName,
      pkgSubDir,
      logLevel,
      overrides,
      options,
    });

  log.debug("Created plugin import %s OK - %o", pkgName, pluginImport);

  return pluginImport;
}
