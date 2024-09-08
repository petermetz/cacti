// import http from "node:http";
// import { AddressInfo } from "node:net";
// import { randomUUID } from "node:crypto";

// import "jest-extended";
// import * as grpc from "@grpc/grpc-js";

// import {
//   LogLevelDesc,
//   Logger,
//   LoggerProvider,
//   Servers,
//   isGrpcStatusObjectWithCode,
// } from "@hyperledger/cactus-common";
// import {
//   ChainlinkTestLedger,
//   pruneDockerAllIfGithubAction,
// } from "@hyperledger/cactus-test-tooling";
// import {
//   PluginLedgerConnectorChainlink,
//   createGrpcInsecureChannelCredentials,
//   chainlink_grpc_svc_streams,
//   default_service,
//   get_block_v1_request_pb,
//   get_block_v1_response_pb,
//   google_protobuf_any,
//   watch_blocks_v1_progress_pb,
//   watch_blocks_v1_request_pb,
//   watch_blocks_v1_pb,
// } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";

// import { PluginRegistry } from "@hyperledger/cactus-core";
// import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";
// import {
//   ApiServer,
//   AuthorizationProtocol,
//   ConfigService,
//   createGrpcServer,
// } from "@hyperledger/cactus-cmd-api-server";

// type WatchBlocksV1ProgressPB =
//   watch_blocks_v1_progress_pb.org.hyperledger.cacti.plugin.ledger.connector.chainlink.WatchBlocksV1ProgressPB;

// describe("ChainlinkGrpcSvcOpenApi", () => {
//   const logLevel: LogLevelDesc = "INFO";
//   const log: Logger = LoggerProvider.getOrCreate({
//     label: "plugin-ledger-connector-chainlink-grpc-service-test",
//     level: logLevel,
//   });
//   const keychainId = randomUUID();
//   const keychainInstanceId = randomUUID();

//   let ledger: ChainlinkTestLedger;
//   let httpServer: http.Server;
//   let grpcServer: grpc.Server;
//   let connector: PluginLedgerConnectorChainlink;
//   let grpcClientDefaultSvc: default_service.org.hyperledger.cacti.plugin.ledger.connector.chainlink.services.defaultservice.DefaultServiceClient;
//   let grpcClientChainlinkSvc: chainlink_grpc_svc_streams.org.hyperledger.cacti.plugin.ledger.connector.chainlink.services.chainlinkservice.ChainlinkGrpcSvcStreamsClient;
//   let apiServer: ApiServer;
//   let addressInfo: AddressInfo;

//   beforeAll(async () => {
//     log.info("Prune Docker...");
//     await pruneDockerAllIfGithubAction({ logLevel });

//     log.info("Start ChainlinkTestLedger...");
//     ledger = new ChainlinkTestLedger({});
//     await ledger.start();

//     grpcServer = createGrpcServer();

//     httpServer = await Servers.startOnPreferredPort(4050);
//     addressInfo = httpServer.address() as AddressInfo;
//     const apiHttpHost = `http://${addressInfo.address}:${addressInfo.port}`;
//     log.debug("HTTP API host: %s", apiHttpHost);

//     const keychainEntryKey = randomUUID();
//     const keychainEntryValue = "privateKey--FIXME";
//     const keychainPlugin = new PluginKeychainMemory({
//       instanceId: keychainInstanceId,
//       keychainId,
//       // pre-provision keychain with mock backend holding the private key of the
//       // test account that we'll reference while sending requests with the
//       // signing credential pointing to this keychain entry.
//       backend: new Map([[keychainEntryKey, keychainEntryValue]]),
//       logLevel,
//     });

//     log.debug("Instantiating PluginLedgerConnectorChainlink...");

//     connector = new PluginLedgerConnectorChainlink({
//       logLevel,
//       instanceId: randomUUID(),
//       pluginRegistry: new PluginRegistry({ plugins: [keychainPlugin] }),
//     });

//     const pluginRegistry = new PluginRegistry({ plugins: [] });

//     const cfgSrv = new ConfigService();
//     const apiSrvOpts = await cfgSrv.newExampleConfig();
//     apiSrvOpts.authorizationProtocol = AuthorizationProtocol.NONE;
//     apiSrvOpts.logLevel = logLevel;
//     apiSrvOpts.configFile = "";
//     apiSrvOpts.apiCorsDomainCsv = "*";
//     apiSrvOpts.apiPort = addressInfo.port;
//     apiSrvOpts.cockpitPort = 0;
//     apiSrvOpts.grpcPort = 0;
//     apiSrvOpts.crpcPort = 0;
//     apiSrvOpts.grpcMtlsEnabled = false;
//     apiSrvOpts.apiTlsEnabled = false;
//     const cfg = await cfgSrv.newExampleConfigConvict(apiSrvOpts);

//     pluginRegistry.add(keychainPlugin);
//     pluginRegistry.add(connector);

//     apiServer = new ApiServer({
//       httpServerApi: httpServer,
//       grpcServer,
//       config: cfg.getProperties(),
//       pluginRegistry,
//     });

//     const { addressInfoGrpc } = await apiServer.start();
//     const grpcPort = addressInfoGrpc.port;
//     const grpcHost = addressInfoGrpc.address;
//     const grpcFamily = addressInfo.family;
//     log.info("gRPC family=%s host=%s port=%s", grpcFamily, grpcHost, grpcPort);

//     const grpcChannelCredentials = createGrpcInsecureChannelCredentials();
//     const grpcUrl = `${grpcHost}:${grpcPort}`;
//     grpcClientDefaultSvc =
//       new default_service.org.hyperledger.cacti.plugin.ledger.connector.chainlink.services.defaultservice.DefaultServiceClient(
//         grpcUrl,
//         grpcChannelCredentials,
//         {
//           "grpc-node.tls_enable_trace": 1,
//         },
//       );

//     grpcClientChainlinkSvc =
//       new chainlink_grpc_svc_streams.org.hyperledger.cacti.plugin.ledger.connector.chainlink.services.chainlinkservice.ChainlinkGrpcSvcStreamsClient(
//         grpcUrl,
//         grpcChannelCredentials,
//         {
//           "grpc-node.tls_enable_trace": 1,
//         },
//       );

//     log.debug("Created gRPC client OK.");
//   });

//   test("gRPC - getBlockV1() returns arbitrary ledger block", async () => {
//     const blockHashOrBlockNumberData = Buffer.from("latest", "utf-8");
//     const blockHashOrBlockNumber =
//       new google_protobuf_any.google.protobuf.Any();

//     blockHashOrBlockNumber.value = blockHashOrBlockNumberData;

//     const getBlockV1RequestPB =
//       new get_block_v1_request_pb.org.hyperledger.cacti.plugin.ledger.connector.chainlink.GetBlockV1RequestPB(
//         { blockHashOrBlockNumber },
//       );

//     const req1 =
//       new default_service.org.hyperledger.cacti.plugin.ledger.connector.chainlink.services.defaultservice.GetBlockV1Request(
//         { getBlockV1RequestPB },
//       );

//     const metadata1 = new grpc.Metadata();

//     const res1Promise =
//       new Promise<get_block_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.chainlink.GetBlockV1ResponsePB>(
//         (resolve, reject) => {
//           const call = grpcClientDefaultSvc.GetBlockV1(
//             req1,
//             metadata1,
//             (
//               err: grpc.ServiceError | null,
//               value?: get_block_v1_response_pb.org.hyperledger.cacti.plugin.ledger.connector.chainlink.GetBlockV1ResponsePB,
//             ) => {
//               log.debug("Received callback from gRPC service: ", err, value);
//               if (err) {
//                 reject(err);
//               } else if (value) {
//                 resolve(value);
//               } else {
//                 reject(new Error("Received no gRPC error nor response value."));
//               }
//             },
//           );
//           log.debug("gRPC call object: ", call);
//           expect(call).toBeTruthy();
//         },
//       );

//     expect(res1Promise).toResolve();
//     const res1 = await res1Promise;
//     expect(res1).toBeTruthy();
//     expect(res1).toBeObject();

//     const block = res1.block.toObject();
//     expect(block).toBeTruthy();
//     expect(block).toBeObject();
//     expect(block).not.toBeEmptyObject();
//     expect(block.number).toBeTruthy();
//     expect(block.hash).toBeTruthy();
//     expect(block.transactions).toBeArray();
//   });

//   test("gRPC - watchBlocksV1() streams ledger blocks as they are created", async () => {
//     const reqMetadata = new grpc.Metadata();
//     const stream = grpcClientChainlinkSvc.WatchBlocksV1(reqMetadata);

//     const msgs: Array<WatchBlocksV1ProgressPB> = [];
//     const MSG_COUNT_SUCCESS = 3;

//     const streamDoneAsync = new Promise<void>((resolve, reject) => {
//       stream.on("data", (chunk: WatchBlocksV1ProgressPB) => {
//         msgs.push(chunk);
//         log.debug("WatchBlocksV1::data=%o, msg.length=%o", chunk, msgs.length);
//         if (msgs.length >= MSG_COUNT_SUCCESS) {
//           const reqUnsubscribe =
//             new watch_blocks_v1_request_pb.org.hyperledger.cacti.plugin.ledger.connector.chainlink.WatchBlocksV1RequestPB();

//           reqUnsubscribe.event =
//             watch_blocks_v1_pb.org.hyperledger.cacti.plugin.ledger.connector.chainlink.WatchBlocksV1PB.WatchBlocksV1PB_Unsubscribe;

//           stream.write(reqUnsubscribe);
//         }
//       });

//       stream.on("status", (status: unknown) => {
//         log.debug("WatchBlocksV1::status=%o", status);
//         if (
//           isGrpcStatusObjectWithCode(status) &&
//           status.code === grpc.status.OK
//         ) {
//           resolve();
//         } else {
//           const statusJson = JSON.stringify(status);
//           reject(new Error(`Received non-OK grpc status code: ${statusJson}`));
//         }
//       });

//       stream.on("error", (error: unknown) => {
//         log.debug("WatchBlocksV1::error=%o", error);
//         reject(error);
//       });

//       stream.on("close", () => {
//         log.debug("WatchBlocksV1::close=");
//         resolve();
//       });
//     });

//     await expect(streamDoneAsync).toResolve();
//   }, 15000);

//   afterAll(async () => {
//     if (apiServer) {
//       await apiServer.shutdown();
//     }
//     await ledger.stop();
//     await ledger.destroy();
//     await pruneDockerAllIfGithubAction({ logLevel });
//   });
// });
