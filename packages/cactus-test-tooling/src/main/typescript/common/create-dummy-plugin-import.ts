import path from "path";

import { PluginImport } from "@hyperledger/cactus-core-api";
import { PluginImportAction } from "@hyperledger/cactus-core-api";
import { PluginImportType } from "@hyperledger/cactus-core-api";
import { LogLevelDesc, LoggerProvider } from "@hyperledger/cactus-common";

export function createDummyPluginImport<T>(req: {
  readonly gitRootDir: string;
  readonly pkgName: string;
  readonly pkgSubDir: string;
  readonly options: T;
  readonly logLevel?: LogLevelDesc;
  readonly overrides?: Partial<PluginImport>;
}): PluginImport {
  const fnTag = "#createDummyPluginImport()";
  const { logLevel = "DEBUG", gitRootDir, pkgSubDir, options, pkgName } = req;

  const log = LoggerProvider.getOrCreate({
    label: fnTag,
    level: logLevel || "DEBUG",
  });

  const pluginPkgInstallSource = path.join(gitRootDir, pkgSubDir);

  log.debug("%s pluginPkgInstallSource=%s", pkgName, pluginPkgInstallSource);

  const pluginImportDefaults: PluginImport = {
    packageName: pkgName,
    type: PluginImportType.Local,
    action: PluginImportAction.Install,
    pluginPkgInstallSource,
    options,
  };

  log.debug("pluginImportDefaults=%o", pluginImportDefaults);
  log.debug("req.overrides=%o", req.overrides);

  const pluginImportFinal = { ...pluginImportDefaults, ...req.overrides };

  log.debug("pluginImportFinal=%o", pluginImportFinal);

  return pluginImportFinal;
}
