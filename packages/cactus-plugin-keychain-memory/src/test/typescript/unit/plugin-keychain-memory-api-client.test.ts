import test, { Test } from "tape-promise/tape";

import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { AddressInfo } from "net";

import { Bools, IListenOptions, Servers } from "@hyperledger/cactus-common";

import { v4 as uuidv4 } from "uuid";
import { Configuration } from "@hyperledger/cactus-core-api";

import {
  IPluginKeychainMemoryOptions,
  DefaultApi as KeychainMemoryApi,
  PluginKeychainMemory,
} from "../../../main/typescript/public-api";

test("PluginKeychainMemory", (t1: Test) => {
  t1.doesNotThrow(
    () =>
      new PluginKeychainMemory({
        instanceId: "a",
        keychainId: "a",
      }),
  );

  test("Validates constructor arg instanceId", (t: Test) => {
    t.throws(
      () =>
        new PluginKeychainMemory({
          instanceId: null as unknown as string,
          keychainId: "valid-value",
        }),
    );
    t.throws(
      () =>
        new PluginKeychainMemory({
          instanceId: "",
          keychainId: "valid-value",
        }),
    );
    t.end();
  });

  test("Validates constructor arg keychainId", (t: Test) => {
    t.throws(
      () =>
        new PluginKeychainMemory({
          instanceId: "valid-value",
          keychainId: null as unknown as string,
        }),
    );
    t.throws(
      () =>
        new PluginKeychainMemory({
          instanceId: "valid-value",
          keychainId: "",
        }),
    );
    t.end();
  });

  test("get,set,has,delete alters state as expected", async (t: Test) => {
    const instanceId = uuidv4();
    const keychainId = uuidv4();

    const options: IPluginKeychainMemoryOptions = {
      instanceId,
      keychainId,
    };
    const plugin = new PluginKeychainMemory(options);

    const expressApp = express();
    expressApp.use(bodyParser.json({ limit: "250mb" }));
    const server = http.createServer(expressApp);
    const listenOptions: IListenOptions = {
      hostname: "127.0.0.1",
      port: 0,
      server,
    };
    const addressInfo = (await Servers.listen(listenOptions)) as AddressInfo;
    test.onFinish(async () => await Servers.shutdown(server));
    const { address, port } = addressInfo;
    const apiHost = `http://${address}:${port}`;

    const config = new Configuration({ basePath: apiHost });
    const apiClient = new KeychainMemoryApi(config);

    await plugin.registerWebServices(expressApp);

    t.equal(plugin.getKeychainId(), options.keychainId, "Keychain ID set OK");
    t.equal(plugin.getInstanceId(), options.instanceId, "Instance ID set OK");

    const key1 = uuidv4();
    const value1 = uuidv4();

    const hasPriorRes = await apiClient.hasKeychainEntryV1({ key: key1 });
    t.ok(hasPriorRes, "hasPriorRes truthy OK");
    t.ok(hasPriorRes.data, "hasPriorRes.data truthy OK");
    t.true(
      Bools.isBooleanStrict(hasPriorRes.data.isPresent),
      "hasPriorRes.data.isPresent strictly boolean OK",
    );

    const hasPrior = hasPriorRes.data.isPresent;
    t.false(hasPrior, "hasPrior === false OK");

    await plugin.set(key1, value1);

    const hasAfter1 = await plugin.has(key1);
    t.true(hasAfter1, "hasAfter === true OK");

    const valueAfter1 = await plugin.get(key1);
    t.ok(valueAfter1, "valueAfter truthy OK");
    t.equal(valueAfter1, value1, "valueAfter === value OK");

    await plugin.delete(key1);

    const hasAfterDelete1 = await plugin.has(key1);
    t.false(hasAfterDelete1, "hasAfterDelete === false OK");

    const key2 = uuidv4();
    const value2 = uuidv4();

    await plugin.set(key2, value2);

    const hasAfter = await plugin.has(key2);
    t.true(hasAfter, "hasAfter === true OK");

    const valueAfter2 = await plugin.get(key2);
    t.ok(valueAfter2, "valueAfter truthy OK");
    t.equal(valueAfter2, value2, "valueAfter === value OK");
    t.end();
  });

  t1.end();
});
