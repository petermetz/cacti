import test, { Test } from "tape-promise/tape";
import { LogLevelDesc } from "@hyperledger/cactus-common";
import { pruneDockerAllIfGithubAction } from "@hyperledger/cactus-test-tooling";
import { AuthorizationProtocol } from "@hyperledger/cactus-cmd-api-server";
import { IAuthorizationConfig } from "@hyperledger/cactus-cmd-api-server";
import { ConfigService } from "@hyperledger/cactus-cmd-api-server";

import * as publicApi from "../../../main/typescript/public-api";
import { ISupplyChainAppOptions } from "../../../main/typescript/public-api";
import { App } from "../../../main/typescript/public-api";

const testCase =
  "can launch via CLI with generated API server .config.json file";
const logLevel: LogLevelDesc = "TRACE";

test.skip("BEFORE " + testCase, async (t: Test) => {
  const pruning = pruneDockerAllIfGithubAction({ logLevel });
  await t.doesNotReject(pruning, "Pruning did not throw OK");
  t.end();
});

// FIXME: https://github.com/hyperledger/cactus/issues/1521
// Skipping until test can be stabilized.
test.skip("Supply chain backend API calls can be executed", async (t: Test) => {
  t.ok(publicApi, "Public API of the package imported OK");

  const configService = new ConfigService();
  t.ok(configService, "Instantiated ConfigService truthy OK");

  const exampleConfig = await configService.newExampleConfig();
  t.ok(exampleConfig, "configService.newExampleConfig() truthy OK");

  // TODO: Investigate the explanation for this when we have more time, for
  // now I just hacked it so that it does not look for a .config file on the FS.
  // @see: https://github.com/hyperledger/cactus/issues/1516
  // FIXME: This was not necessary prior the Jest migration but now it is.
  // Investigate the explanation for this when we have more time, for now I just
  // overrode it so that it does not look for a .config file on the local FS.
  exampleConfig.configFile = "";

  // FIXME - this hack should not be necessary, we need to re-think how we
  // do configuration parsing. The convict library may not be the path forward.
  exampleConfig.authorizationConfigJson = JSON.stringify(
    exampleConfig.authorizationConfigJson,
  ) as unknown as IAuthorizationConfig;
  exampleConfig.authorizationProtocol = AuthorizationProtocol.NONE;

  const convictConfig =
    await configService.newExampleConfigConvict(exampleConfig);
  t.ok(convictConfig, "configService.newExampleConfigConvict() truthy OK");

  const env = await configService.newExampleConfigEnv(
    convictConfig.getProperties(),
  );

  const config = await configService.getOrCreate({ env });
  const apiSrvOpts = config.getProperties();
  const { logLevel } = apiSrvOpts;

  const appOptions: ISupplyChainAppOptions = {
    logLevel,
    disableSignalHandlers: true,
  };
  const app = new App(appOptions);
  test.onFinish(async () => {
    await app.stop();
    await pruneDockerAllIfGithubAction({ logLevel });
  });

  const startResult = await app.start();
  const { apiServerA } = startResult;
  t.ok(apiServerA, "ApiServerA truthy OK");

  const httpSrvApiA = apiServerA.getHttpServerApi();
  t.ok(httpSrvApiA, "httpSrvApiA truthy OK");

  t.true(httpSrvApiA.listening, "httpSrvApiA.listening true OK");

  const { besuApiClient } = startResult;

  const metricsResB = await besuApiClient.getPrometheusMetricsV1();
  t.ok(metricsResB, "besu metrics res truthy OK");
  t.true(metricsResB.status > 199, "metricsResB.status > 199 true OK");
  t.true(metricsResB.status < 300, "metricsResB.status < 300 true OK");

  t.end();
});
