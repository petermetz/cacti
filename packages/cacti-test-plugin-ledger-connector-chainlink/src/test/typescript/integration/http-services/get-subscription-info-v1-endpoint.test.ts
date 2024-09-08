import { createServer } from "node:http";
import { AddressInfo } from "node:net";
import { randomUUID as uuidv4 } from "node:crypto";
import path from "node:path";

Error.stackTraceLimit = 100;

import "jest-extended";
import { StatusCodes } from "http-status-codes";

import {
  ApiServer,
  AuthorizationProtocol,
  ConfigService,
} from "@hyperledger/cactus-cmd-api-server";
import { LogLevelDesc, LoggerProvider } from "@hyperledger/cactus-common";
import {
  ChainlinkTestLedger,
  pruneDockerAllIfGithubAction,
} from "@hyperledger/cactus-test-tooling";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { PluginImportType } from "@hyperledger/cactus-core-api";
import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";
import {
  ChainlinkApiClientOptions,
  ChainlinkApiClient,
  IPluginLedgerConnectorChainlinkOptions,
  GetSubscriptionInfoV1Request,
  PluginFactoryLedgerConnector,
} from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { IComposeUpOutput } from "@hyperledger/cactus-test-tooling/src/main/typescript/chainlink/i-compose-up-output";

describe("PluginLedgerConnectorChainlink", () => {
  const logLevel: LogLevelDesc = "DEBUG";
  const label = path.basename(__filename);
  const log = LoggerProvider.getOrCreate({
    label,
    level: logLevel,
  });

  const keychainId = uuidv4();
  const keychain = new PluginKeychainMemory({
    backend: new Map([]),
    keychainId,
    logLevel,
    instanceId: uuidv4(),
  });
  const pluginRegistry = new PluginRegistry({ plugins: [keychain] });
  const httpServer1 = createServer();

  const expectedBalance = Math.ceil(Math.random() * Math.pow(10, 6));

  let ledger: ChainlinkTestLedger;
  let apiServer: ApiServer;
  let node1Host: string;
  let composeUpOutput: IComposeUpOutput;

  beforeAll(async () => {
    const pruning = pruneDockerAllIfGithubAction({ logLevel });
    await expect(pruning).toResolve();
  });

  beforeAll(async () => {
    ledger = new ChainlinkTestLedger({
      logLevel,
    });
  });

  afterAll(async () => {
    await ledger.stop();
    await ledger.destroy();
  });

  beforeAll(async () => {
    await ledger.pull({});
    await ledger.start();
  });

  beforeAll(async () => {
    await new Promise((resolve, reject) => {
      httpServer1.once("error", reject);
      httpServer1.once("listening", resolve);
      httpServer1.listen(0, "127.0.0.1");
    });

    const addressInfo1 = httpServer1.address() as AddressInfo;
    log.debug(`HttpServer1 AddressInfo: ${JSON.stringify(addressInfo1)}`);

    node1Host = `http://${addressInfo1.address}:${addressInfo1.port}`;
    log.debug(`Cactus Node 1 Host: ${node1Host}`);

    const ledgerHttpPort = await ledger.getHttpPortPublic({ composeUpOutput });
    const ledgerHttpHost = "127.0.0.1";

    const factory = new PluginFactoryLedgerConnector({
      pluginImportType: PluginImportType.Local,
    });

    // 3. Instantiate the web service consortium plugin
    const options: IPluginLedgerConnectorChainlinkOptions = {
      instanceId: uuidv4(),
      pluginRegistry,
      ledgerHttpPort,
      ledgerHttpHost,
      logLevel,
    };
    const connector = await factory.create(options);

    // 4. Create the API Server object that we embed in this test
    const cfgSvc = new ConfigService();
    const apiSrvOpts = await cfgSvc.newExampleConfig();
    apiSrvOpts.authorizationProtocol = AuthorizationProtocol.NONE;
    apiSrvOpts.configFile = "";
    apiSrvOpts.apiCorsDomainCsv = "*";
    apiSrvOpts.apiPort = addressInfo1.port;
    apiSrvOpts.cockpitPort = 0;
    apiSrvOpts.grpcPort = 0;
    apiSrvOpts.crpcPort = 0;
    apiSrvOpts.apiTlsEnabled = false;
    const config = await cfgSvc.newExampleConfigConvict(apiSrvOpts);

    pluginRegistry.add(connector);

    apiServer = new ApiServer({
      httpServerApi: httpServer1,
      config: config.getProperties(),
      pluginRegistry,
    });

    await apiServer.start();
    log.debug(`AddressInfo: ${JSON.stringify(addressInfo1)}`);
  });

  afterAll(async () => {
    const pruning = pruneDockerAllIfGithubAction({ logLevel });
    await expect(pruning).toResolve();
  });

  afterAll(async () => await apiServer.shutdown());

  it("getSubscriptionInfoV1() - retrieves subscription info", async () => {
    const request: GetSubscriptionInfoV1Request = {
      subscriptionId: "FIXME",
    };

    const configuration = new ChainlinkApiClientOptions({
      basePath: node1Host,
    });
    const api = new ChainlinkApiClient(configuration);

    // Test for 200 valid response test case
    const getBalanceExchange = api.getSubscriptionInfoV1(request);
    await expect(getBalanceExchange).resolves.toMatchObject({
      status: StatusCodes.OK,
      data: expect.objectContaining({
        balance: expect.stringMatching(expectedBalance.toFixed(0)),
      }),
    });
  });
});
