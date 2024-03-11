import { LogLevelDesc, LoggerProvider } from "@hyperledger/cactus-common";
import { PluginRegistry } from "@hyperledger/cactus-core";
import type { IPluginKeychainMemoryOptions } from "@hyperledger/cactus-plugin-keychain-memory";
import { v4 as uuidv4 } from "uuid";
import { createDummyPluginImport } from "@hyperledger/cactus-test-tooling";
import { PluginImport } from "@hyperledger/cactus-core-api";

export async function createDummyOptionsKeychainMemory(req: {
  readonly pluginRegistry: PluginRegistry;
  readonly logLevel?: LogLevelDesc;
}): Promise<IPluginKeychainMemoryOptions> {
  const fnTag = "#createDummyOptionsKeychainMemory()" as const;
  const { logLevel = "DEBUG" } = req;

  const log = LoggerProvider.getOrCreate({
    label: fnTag,
    level: logLevel,
  });

  const options: IPluginKeychainMemoryOptions = {
    instanceId: uuidv4(),
    keychainId: uuidv4(),
    logLevel,
  };

  log.debug("created IPluginKeychainMemoryOptions=%o", options);

  return options;
}

export async function createDummyPluginImportKeychainMemory(req: {
  readonly pluginRegistry: PluginRegistry;
  readonly gitRootDir: string;
  readonly logLevel?: LogLevelDesc;
  readonly overrides?: Partial<PluginImport>;
}): Promise<PluginImport> {
  const pkgName = "@hyperledger/cactus-plugin-keychain-memory" as const;
  const pkgSubDir = "./packages/cactus-plugin-keychain-memory/" as const;
  const fnTag = "#createDummyPluginImportKeychainMemory()" as const;
  const { logLevel = "DEBUG", pluginRegistry, gitRootDir, overrides } = req;

  const log = LoggerProvider.getOrCreate({
    label: fnTag,
    level: req.logLevel || "DEBUG",
  });

  const options = await createDummyOptionsKeychainMemory({
    pluginRegistry,
    logLevel,
  });

  const pluginImport = createDummyPluginImport<IPluginKeychainMemoryOptions>({
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
