import type { IPluginConsortiumManualOptions } from "@hyperledger/cactus-plugin-consortium-manual";

import { v4 as uuidv4 } from "uuid";
import { generateKeyPair, exportPKCS8 } from "jose";

import { ConsortiumDatabase, PluginImport } from "@hyperledger/cactus-core-api";
import { LogLevelDesc, LoggerProvider } from "@hyperledger/cactus-common";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { createDummyPluginImport } from "@hyperledger/cactus-test-tooling";

export async function createDummyOptionsConsortiumManual(req: {
  readonly pluginRegistry: PluginRegistry;
  readonly logLevel?: LogLevelDesc;
}): Promise<IPluginConsortiumManualOptions> {
  const fnTag = "#createDummyOptionsConsortiumManual()" as const;
  const { logLevel = "DEBUG", pluginRegistry } = req;

  const log = LoggerProvider.getOrCreate({
    label: fnTag,
    level: logLevel,
  });

  const keyPair = await generateKeyPair("ES256K");
  const keyPairPem = await exportPKCS8(keyPair.privateKey);

  // TODO: Make it configurable so that we can generate here a consortium of
  // arbitrary size (orgs, nodes, etc.)
  const consortiumDatabase: ConsortiumDatabase = {
    cactusNode: [],
    consortium: [],
    consortiumMember: [],
    ledger: [],
    pluginInstance: [],
  };

  const options: IPluginConsortiumManualOptions = {
    pluginRegistry,
    instanceId: uuidv4(),
    keyPairPem,
    consortiumDatabase,
    logLevel,
  };

  log.debug("created IPluginConsortiumManualOptions=%o", options);

  return options;
}

export async function createDummyPluginImportConsortiumManual(req: {
  readonly pluginRegistry: PluginRegistry;
  readonly gitRootDir: string;
  readonly logLevel?: LogLevelDesc;
  readonly overrides?: Partial<PluginImport>;
}): Promise<PluginImport> {
  const pkgName = "@hyperledger/cactus-plugin-consortium-manual" as const;
  const pkgSubDir = "./packages/cactus-plugin-consortium-manual/" as const;
  const fnTag = "#createDummyPluginImportConsortiumManual()" as const;

  const { logLevel = "DEBUG", pluginRegistry, gitRootDir, overrides } = req;

  const log = LoggerProvider.getOrCreate({
    label: fnTag,
    level: req.logLevel || "DEBUG",
  });

  const opts = await createDummyOptionsConsortiumManual({
    pluginRegistry,
    logLevel,
  });

  const pluginImport = createDummyPluginImport<IPluginConsortiumManualOptions>({
    gitRootDir,
    pkgName,
    pkgSubDir,
    logLevel,
    overrides,
    options: opts,
  });

  log.debug("Created plugin import %s OK - %o", pkgName, pluginImport);

  return pluginImport;
}
