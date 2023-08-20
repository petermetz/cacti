import { ApiServer } from "npm:@hyperledger/cactus-cmd-api-server";
import { ConfigService } from "npm:@hyperledger/cactus-cmd-api-server";
import { LoggerProvider } from "npm:@hyperledger/cactus-common";

export async function launchApp(
  env?: NodeJS.ProcessEnv,
  args?: string[],
): Promise<void> {
  const logLevel: LogLevelDesc = "DEBUG";
  LoggerProvider.setLogLevel(logLevel);

  const log = LoggerProvider.getOrCreate({
    label: "cacti-example-deno-1",
    logLevel,
  });
  log.debug("ARGS: %o", args);

  const configService = new ConfigService();
  log.debug("ConfigService instantiated OK");
  const apiServerOptions = await configService.newExampleConfig();
  log.debug("apiServerOptions created OK");

  apiServerOptions.authorizationProtocol = AuthorizationProtocol.NONE;
  apiServerOptions.pluginManagerOptionsJson = pluginManagerOptionsJson;
  apiServerOptions.logLevel = loglevel;
  apiServerOptions.configFile = "";
  apiServerOptions.apiCorsDomainCsv = "*";
  apiServerOptions.apiPort = 0;
  apiServerOptions.cockpitPort = 0;
  apiServerOptions.grpcPort = 0;
  apiServerOptions.apiTlsEnabled = false;
  apiServerOptions.plugins = [
    {
      packageName: "@hyperledger/cactus-plugin-keychain-memory",
      type: PluginImportType.Local,
      action: PluginImportAction.Install,
      options: {
        instanceId: uuidv4(),
        keychainId: uuidv4(),
        logLevel,
      },
    },
  ];

  const config = await configService.newExampleConfigConvict(apiServerOptions);
  log.debug("newExampleConfigConvict created OK");

  const apiServer = new ApiServer({
    config: config.getProperties(),
  });
  log.debug("apiServer instance created OK");

  try {
    log.debug("Starting ApiServer...");
    await apiServer.start();
  } catch (ex) {
    console.error(`ApiServer.start() crashed. Existing...`, ex);
    await apiServer.stop();
    process.exit(-1);
  }
}

if (import.meta.main) {
  const env = Deno.env.toObject();
  const argv = Deno.args;
  launchApp(env, argv);
}
