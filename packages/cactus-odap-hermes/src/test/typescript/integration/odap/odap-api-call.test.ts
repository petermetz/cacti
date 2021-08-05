import http from "http";
import { AddressInfo } from "net";
import secp256k1 from "secp256k1";
import test, { Test } from "tape-promise/tape";
import { v4 as uuidv4 } from "uuid";
import { randomBytes } from "crypto";

import bodyParser from "body-parser";
import express from "express";

//import { PluginRegistry } from "@hyperledger/cactus-core";
import { SendClientRequestMessage } from "../../../../main/typescript/generated/openapi/typescript-axios";
import {
  IListenOptions,
  // LogLevelDesc,
  Servers,
} from "@hyperledger/cactus-common";

//import { PluginKeychainMemory } from "@hyperledger/cactus-plugin-keychain-memory";

import {
  DefaultApi as OdapApi,
  InitializationRequestMessage,
} from "../../../../main/typescript/public-api";

import { Configuration } from "@hyperledger/cactus-core-api";
import {
  OdapGateway,
  OdapGatewayConstructorOptions,
} from "../../../../main/typescript/gateway/odap-gateway";

/**
 * Use this to debug issues with the fabric node SDK
 * ```sh
 * export HFC_LOGGING='{"debug":"console","info":"console"}'
 * ```
 */

const testCase = "runs odap gateway tests via openApi";

test(testCase, async (t: Test) => {
  //const logLevel: LogLevelDesc = "TRACE";

  //const pluginRegistry = new PluginRegistry();
  const expressApp = express();
  expressApp.use(bodyParser.json({ limit: "250mb" }));
  const server = http.createServer(expressApp);
  const listenOptions: IListenOptions = {
    hostname: "localhost",
    port: 0,
    server,
  };
  const addressInfo = (await Servers.listen(listenOptions)) as AddressInfo;
  test.onFinish(async () => await Servers.shutdown(server));
  const { address, port } = addressInfo;
  const apiHost = `http://${address}:${port}`;
  t.comment(
    `Metrics URL: ${apiHost}/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-fabric/get-prometheus-exporter-metrics`,
  );
  const apiConfig = new Configuration({ basePath: apiHost });
  const apiClient = new OdapApi(apiConfig);
  const odapClientGateWayPluginID = uuidv4();
  const odapPluginOptions: OdapGatewayConstructorOptions = {
    name: "cactus-plugin#odapGateway",
    dltIDs: ["dummy"],
    instanceId: odapClientGateWayPluginID,
  };

  const plugin = new OdapGateway(odapPluginOptions);
  await plugin.getOrCreateWebServices();
  await plugin.registerWebServices(expressApp);
  //pluginRegistry.add(plugin);
  {
    let dummyPrivKeyBytes = randomBytes(32);
    while (!secp256k1.privateKeyVerify(dummyPrivKeyBytes)) {
      dummyPrivKeyBytes = randomBytes(32);
    }
    const dummyPubKeyBytes = secp256k1.publicKeyCreate(dummyPrivKeyBytes);

    const dummyPubKey = plugin.bufArray2HexStr(dummyPubKeyBytes);

    const initializationRequestMessage: InitializationRequestMessage = {
      version: "0.0.0",
      loggingProfile: "dummy",
      accessControlProfile: "dummy",
      applicationProfile: "dummy",
      payloadProfile: {
        assetProfile: "dummy",
        capabilities: "",
      },
      initializationRequestMessageSignature: "",
      sourceGatewayPubkey: dummyPubKey,
      sourceGateWayDltSystem: "dummy",
      recipientGateWayPubkey: dummyPubKey,
      recipientGateWayDltSystem: "dummy",
    };
    const dummyPrivKeyStr = plugin.bufArray2HexStr(dummyPrivKeyBytes);
    initializationRequestMessage.initializationRequestMessageSignature = await plugin.sign(
      JSON.stringify(initializationRequestMessage),
      dummyPrivKeyStr,
    );
    /*const odapConnector = pluginRegistry.plugins.find(
      (plugin) => plugin.getInstanceId() == odapClientGateWayPluginID,
    ) as ;*/
    const res = await apiClient.apiV1Phase1TransferInitiation(
      initializationRequestMessage,
    );
    t.ok(res);
    //t.equal(res.status, 200);
  }
  t.end();
});
test("run send client request via openapi", async (t: Test) => {
  //const logLevel: LogLevelDesc = "TRACE";

  const odapClientGateWayPluginID = uuidv4();
  const odapPluginOptions: OdapGatewayConstructorOptions = {
    name: "cactus-plugin#odapGateway",
    dltIDs: ["dummy"],
    instanceId: odapClientGateWayPluginID,
  };

  const clientOdapGateway = new OdapGateway(odapPluginOptions);

  const odapServerGatewayInstanceID = uuidv4();
  // the block below adds the server odap gateway to the plugin registry
  let odapServerGatewayPubKey: string;
  let odapServerGatewayApiHost: string;
  {
    const expressApp = express();
    expressApp.use(bodyParser.json({ limit: "250mb" }));
    const server = http.createServer(expressApp);
    const listenOptions: IListenOptions = {
      hostname: "localhost",
      port: 0,
      server,
    };
    const addressInfo = (await Servers.listen(listenOptions)) as AddressInfo;
    test.onFinish(async () => await Servers.shutdown(server));
    const { address, port } = addressInfo;
    odapServerGatewayApiHost = `http://${address}:${port}`;
    /*t.comment(
      `Metrics URL: ${odapServerGatewayApiHost}/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-fabric/get-prometheus-exporter-metrics`,
    );*/
    const odapPluginOptions: OdapGatewayConstructorOptions = {
      name: "cactus-plugin#odapGateway",
      dltIDs: ["dummy"],
      instanceId: odapServerGatewayInstanceID,
    };

    const plugin = new OdapGateway(odapPluginOptions);
    odapServerGatewayPubKey = plugin.pubKey;
    await plugin.getOrCreateWebServices();
    await plugin.registerWebServices(expressApp);
  }
  {
    const expressApp = express();
    expressApp.use(bodyParser.json({ limit: "250mb" }));
    const server = http.createServer(expressApp);
    const listenOptions: IListenOptions = {
      hostname: "localhost",
      port: 0,
      server,
    };
    const addressInfo = (await Servers.listen(listenOptions)) as AddressInfo;
    test.onFinish(async () => await Servers.shutdown(server));
    const { address, port } = addressInfo;
    const apiHost = `http://${address}:${port}`;
    const apiConfig = new Configuration({ basePath: apiHost });
    const apiClient = new OdapApi(apiConfig);
    /*t.comment(
      `Metrics URL: ${apiHost}/api/v1/plugins/@hyperledger/cactus-plugin-ledger-connector-fabric/get-prometheus-exporter-metrics`,
    );*/
    await clientOdapGateway.getOrCreateWebServices();
    await clientOdapGateway.registerWebServices(expressApp);
    let dummyPrivKeyBytes = randomBytes(32);
    while (!secp256k1.privateKeyVerify(dummyPrivKeyBytes)) {
      dummyPrivKeyBytes = randomBytes(32);
    }
    const dummyPubKeyBytes = secp256k1.publicKeyCreate(dummyPrivKeyBytes);
    const dummyPubKey = clientOdapGateway.bufArray2HexStr(dummyPubKeyBytes);
    const odapClientRequest: SendClientRequestMessage = {
      serverGatewayConfiguration: {
        apiHost: odapServerGatewayApiHost,
      },
      version: "0.0.0",
      loggingProfile: "dummy",
      accessControlProfile: "dummy",
      applicationProfile: "dummy",
      payLoadProfile: {
        assetProfile: "dummy",
        capabilities: "",
      },
      assetProfile: "dummy",
      assetControlProfile: "dummy",
      beneficiaryPubkey: dummyPubKey,
      clientDltSystem: "dummy",
      clientIdentityPubkey: clientOdapGateway.pubKey,
      originatorPubkey: dummyPubKey,
      recipientGateWayDltSystem: "dummy",
      recipientGateWayPubkey: odapServerGatewayPubKey,
      serverDltSystem: "dummy",
      serverIdentityPubkey: dummyPubKey,
      sourceGateWayDltSystem: "dummy",
    };
    const res = await apiClient.apiV1SendClientRequest(odapClientRequest);
    /*const odapConnector = pluginRegistry.plugins.find(
      (plugin) => plugin.getInstanceId() == odapClientGateWayPluginID,
    ) as ;*/
    t.ok(res);
    //t.equal(res.status, 200);
  }
  t.end();
});
