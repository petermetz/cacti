// import { createServer } from "node:http";
// import { AddressInfo } from "node:net";

// Error.stackTraceLimit = 100;

// import "jest-extended";

// import { StatusCodes } from "http-status-codes";
// import { v4 as uuidv4 } from "uuid";
// import KeyEncoder from "key-encoder";
// import { Account } from "web3-core";

// import {
//   ApiServer,
//   AuthorizationProtocol,
//   ConfigService,
// } from "@hyperledger/cactus-cmd-api-server";
// import {
//   Secp256k1Keys,
//   KeyFormat,
//   LogLevelDesc,
//   LoggerProvider,
// } from "@hyperledger/cactus-common";
// import {
//   ChainlinkTestLedger,
//   buildImageChainlinkAllInOneLatest,
//   pruneDockerAllIfGithubAction,
// } from "@hyperledger/cactus-test-tooling";
// import {
//   ChainlinkApiClientOptions,
//   ChainlinkApiClient,
//   IPluginLedgerConnectorChainlinkOptions,
//   PluginLedgerConnectorChainlink,
//   GetBalanceV1Request,
// } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
// import { PluginRegistry } from "@hyperledger/cactus-core";
// import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";

// describe("PluginLedgerConnectorChainlink", () => {
//   const logLevel: LogLevelDesc = "INFO";
//   const log = LoggerProvider.getOrCreate({
//     label: "get-balance-endpoint.test.ts",
//     level: logLevel,
//   });

//   const keyEncoder: KeyEncoder = new KeyEncoder("secp256k1");
//   const keychainId = uuidv4();
//   const keychainRef = uuidv4();
//   const { privateKey } = Secp256k1Keys.generateKeyPairsBuffer();
//   const keyHex = privateKey.toString("hex");
//   const pem = keyEncoder.encodePrivate(keyHex, KeyFormat.Raw, KeyFormat.PEM);
//   const keychain = new PluginKeychainMemory({
//     backend: new Map([[keychainRef, pem]]),
//     keychainId,
//     logLevel,
//     instanceId: uuidv4(),
//   });
//   const pluginRegistry = new PluginRegistry({ plugins: [keychain] });
//   const httpServer1 = createServer();

//   const expectedBalance = Math.ceil(Math.random() * Math.pow(10, 6));

//   let ledger: ChainlinkTestLedger;
//   let apiServer: ApiServer;
//   let testAccount: Account;
//   let node1Host: string;

//   beforeAll(async () => {
//     const pruning = pruneDockerAllIfGithubAction({ logLevel });
//     await expect(pruning).toResolve();
//   });

//   beforeAll(async () => {
//     const ledgerImg = await buildImageChainlinkAllInOneLatest({ logLevel });
//     const { imageName, imageVersion } = ledgerImg;
//     ledger = new ChainlinkTestLedger({
//       containerImageName: imageName,
//       containerImageVersion: imageVersion,
//       logLevel,
//     });
//     // we've built the image locally so trying to pull it would fail
//     const omitImagePullFromNetwork = true;
//     await ledger.start(omitImagePullFromNetwork);
//   });

//   beforeAll(async () => {
//     await new Promise((resolve, reject) => {
//       httpServer1.once("error", reject);
//       httpServer1.once("listening", resolve);
//       httpServer1.listen(0, "127.0.0.1");
//     });

//     const addressInfo1 = httpServer1.address() as AddressInfo;
//     log.debug(`HttpServer1 AddressInfo: ${JSON.stringify(addressInfo1)}`);

//     node1Host = `http://${addressInfo1.address}:${addressInfo1.port}`;
//     log.debug(`Cactus Node 1 Host: ${node1Host}`);

//     testAccount = await ledger.createEthTestAccount(expectedBalance);
//     const rpcApiHttpHost = await ledger.getRpcApiHttpHost();
//     const rpcApiWsHost = await ledger.getRpcApiWsHost();

//     // 3. Instantiate the web service consortium plugin
//     const options: IPluginLedgerConnectorChainlinkOptions = {
//       instanceId: uuidv4(),
//       rpcApiHttpHost,
//       rpcApiWsHost,
//       pluginRegistry,
//       logLevel,
//     };
//     const pluginValidatorChainlink = new PluginLedgerConnectorChainlink(options);

//     // 4. Create the API Server object that we embed in this test
//     const cfgSvc = new ConfigService();
//     const apiSrvOpts = await cfgSvc.newExampleConfig();
//     apiSrvOpts.authorizationProtocol = AuthorizationProtocol.NONE;
//     apiSrvOpts.configFile = "";
//     apiSrvOpts.apiCorsDomainCsv = "*";
//     apiSrvOpts.apiPort = addressInfo1.port;
//     apiSrvOpts.cockpitPort = 0;
//     apiSrvOpts.grpcPort = 0;
//     apiSrvOpts.crpcPort = 0;
//     apiSrvOpts.apiTlsEnabled = false;
//     const config = await cfgSvc.newExampleConfigConvict(apiSrvOpts);

//     pluginRegistry.add(pluginValidatorChainlink);

//     apiServer = new ApiServer({
//       httpServerApi: httpServer1,
//       config: config.getProperties(),
//       pluginRegistry,
//     });

//     await apiServer.start();
//     log.debug(`AddressInfo: ${JSON.stringify(addressInfo1)}`);
//   });

//   afterAll(async () => {
//     const pruning = pruneDockerAllIfGithubAction({ logLevel });
//     await expect(pruning).toResolve();
//   });

//   afterAll(async () => {
//     await ledger.stop();
//     await ledger.destroy();
//   });

//   afterAll(async () => await apiServer.shutdown());

//   it("getBalanceV1() - retrieves ETH account balance", async () => {
//     const request: GetBalanceV1Request = {
//       address: testAccount.address,
//     };

//     const configuration = new ChainlinkApiClientOptions({ basePath: node1Host });
//     const api = new ChainlinkApiClient(configuration);

//     // Test for 200 valid response test case
//     const getBalanceExchange = api.getBalanceV1(request);
//     await expect(getBalanceExchange).resolves.toMatchObject({
//       status: StatusCodes.OK,
//       data: expect.objectContaining({
//         balance: expect.stringMatching(expectedBalance.toFixed(0)),
//       }),
//     });
//   });
// });