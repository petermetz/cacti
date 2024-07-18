import "jest-extended";
import { randomUUID } from "crypto";

import { ReplaySubject } from "rxjs";
import { createPromiseClient } from "@connectrpc/connect";
// import { createCallbackClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { StringValue } from "google-protobuf/google/protobuf/wrappers_pb";

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { P2pMsgService, P2pMsgV1 } from "@hyperledger/cactus-core-api";

import { ApiServer } from "../../../main/typescript/api-server";
import { ConfigService } from "../../../main/typescript/config/config-service";

import { PluginLedgerConnectorStub } from "../fixtures/plugin-ledger-connector-stub/plugin-ledger-connector-stub";
import { google } from "../../../main/typescript/generated/proto/protoc-gen-ts/google/protobuf/empty";
import { AuthorizationProtocol } from "../../../main/typescript/config/authorization-protocol";

const logLevel: LogLevelDesc = "DEBUG";

describe("ApiServer", () => {
  let apiServer1: ApiServer;

  afterAll(async () => {
    await apiServer1.shutdown();
  });

  it("can broadcast p2p messages to other API servers", async () => {
    const pluginRegistry = new PluginRegistry();
    const pluginInstanceId = randomUUID();
    const plugin = new PluginLedgerConnectorStub({
      logLevel,
      pluginRegistry,
      instanceId: pluginInstanceId,
    });
    pluginRegistry.add(plugin);

    const configService = new ConfigService();
    const apiSrvOpts = await configService.newExampleConfig();
    apiSrvOpts.authorizationProtocol = AuthorizationProtocol.NONE;
    apiSrvOpts.configFile = "";
    apiSrvOpts.apiCorsDomainCsv = "*";
    apiSrvOpts.apiPort = 0;
    apiSrvOpts.cockpitPort = 0;
    apiSrvOpts.grpcPort = 0;
    apiSrvOpts.crpcPort = 0;
    apiSrvOpts.apiTlsEnabled = false;
    apiSrvOpts.plugins = [];
    const config = await configService.newExampleConfigConvict(apiSrvOpts);

    apiServer1 = new ApiServer({
      config: config.getProperties(),
      pluginRegistry,
    });
    const startPromise1 = apiServer1.start();

    await expect(startPromise1).not.toReject();
    expect(startPromise1).toBeTruthy();

    const startInfo1 = await startPromise1;

    const addressInfoApi1 = startInfo1.addressInfoCrpc;
    const { address, port } = addressInfoApi1;
    const crpcUrl1 = `http://${address}:${port}`;
    const transport1 = createConnectTransport({
      baseUrl: crpcUrl1,
      httpVersion: "2",
    });
    const client1 = createPromiseClient(P2pMsgService, transport1);
    // const client1cb = createCallbackClient(P2pMsgService, transport1);

    const log1 = LoggerProvider.getOrCreate({
      label: "p2p-messaging-multiple-api-servers.test.ts-1",
      level: logLevel,
    });

    const outbox1 = new ReplaySubject<P2pMsgV1>(1);

    const outbox$ = outbox1.asObservable();
    const inbox$ = client1.sendReceive(outbox$);

    const data = new StringValue();
    data.setValue("Hello! The time is: " + new Date().toISOString());

    const newMsg1 = new P2pMsgV1({
      id: randomUUID(),
      msgType: "client-1",
      data: data as any,
      sender: "client-1",
      createdAt: new Date().toISOString(),
    });
    outbox1.next(newMsg1);

    for await (const inMsg of inbox$) {
      log1.debug("msg arrived in inbox: %o", inMsg);
    }

    await apiServer1.shutdown();
  });
});
