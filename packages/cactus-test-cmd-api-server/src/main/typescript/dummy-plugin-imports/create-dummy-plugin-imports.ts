import type { IPluginHtlcEthBesuErc20Options } from "@hyperledger/cactus-plugin-htlc-eth-besu-erc20";
import path from "path";

import { v4 as uuidv4 } from "uuid";

import { LogLevelDesc, LoggerProvider } from "@hyperledger/cactus-common";
import { PluginRegistry } from "@hyperledger/cactus-core";
import {
  PluginImport,
  PluginImportAction,
  PluginImportType,
} from "@hyperledger/cactus-core-api";
import { createDummyPluginImportConsortiumManual } from "./create-dummy-plugin-import-consortium-manual";
import { createDummyPluginImportKeychainMemory } from "./create-dummy-plugin-import-keychain-memory";

export async function createDummyPluginImports(req: {
  readonly pluginRegistry: PluginRegistry;
  readonly logLevel?: LogLevelDesc;
}): Promise<PluginImport[]> {
  const fnTag = "cactus-test-cmd-api-server#createDummyPluginImports()";
  const pluginImports: PluginImport[] = [];
  const { logLevel = "DEBUG", pluginRegistry } = req;

  const log = LoggerProvider.getOrCreate({
    label: fnTag,
    level: req.logLevel || "DEBUG",
  });

  const __dirname = path.dirname(__filename);
  const SCRIPT_DIR = __dirname;

  log.debug(`SCRIPT_DIR: ${SCRIPT_DIR}`);

  const gitRootDir = path.join(SCRIPT_DIR, "../../../../../../");
  log.debug(`gitRootDir=${gitRootDir}`);

  {
    const anImport = await createDummyPluginImportKeychainMemory({
      pluginRegistry,
      logLevel,
      gitRootDir,
    });
    pluginImports.push(anImport);
  }

  {
    const anImport = await createPluginImportHtlcEthBesuErc20({
      pluginRegistry,
      logLevel,
      gitRootDir,
    });
    pluginImports.push(anImport);
  }

  {
    const anImport = await createDummyPluginImportConsortiumManual({
      pluginRegistry,
      gitRootDir,
      logLevel,
    });
    pluginImports.push(anImport);
  }

  return pluginImports;
}

export async function createPluginImportHtlcEthBesuErc20(req: {
  readonly pluginRegistry: PluginRegistry;
  readonly gitRootDir: string;
  readonly logLevel?: LogLevelDesc;
  readonly overrides?: Partial<PluginImport>;
}): Promise<PluginImport> {
  const packageName = "@hyperledger/cactus-plugin-htlc-eth-besu-erc20";
  const fnTag = "#createPluginImportHtlcEthBesuErc20()";
  const { logLevel = "DEBUG", pluginRegistry } = req;

  const pluginPkgInstallSource = path.join(
    req.gitRootDir,
    "./packages/cactus-plugin-htlc-eth-besu-erc20/",
  );

  const log = LoggerProvider.getOrCreate({
    label: fnTag,
    level: req.logLevel || "DEBUG",
  });

  log.debug(
    "%s pluginPkgInstallSource=%s",
    packageName,
    pluginPkgInstallSource,
  );

  const options: IPluginHtlcEthBesuErc20Options = {
    instanceId: uuidv4(),
    keychainId: uuidv4(),
    logLevel,
    pluginRegistry,
  };

  return {
    packageName,
    type: PluginImportType.Local,
    action: PluginImportAction.Install,
    pluginPkgInstallSource,
    options,
  };
}
