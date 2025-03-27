"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const tape_1 = __importDefault(require("tape-promise/tape"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const uuid_1 = require("uuid");
const cactus_common_1 = require("@hyperledger/cactus-common");
const public_api_1 = require("../../../main/typescript/public-api");
const plugin_keychain_azure_kv_mock_1 = require("../mock/plugin-keychain-azure-kv-mock");
const logLevel = "TRACE";
(0, tape_1.default)("get,set,has,delete alters state as expected for AzureCredentialType.InMemory", async (t) => {
    const options = {
        instanceId: (0, uuid_1.v4)(),
        keychainId: (0, uuid_1.v4)(),
        logLevel: logLevel,
        azureEndpoint: "testEndpoint",
        backend: new plugin_keychain_azure_kv_mock_1.SecretClientMock({
            azureKvUrl: "testUrl",
            logLevel: logLevel,
        }),
    };
    const plugin = new public_api_1.PluginKeychainAzureKv(options);
    t.equal(plugin.getKeychainId(), options.keychainId, "Keychain ID set OK");
    t.equal(plugin.getInstanceId(), options.instanceId, "Instance ID set OK");
    const expressApp = (0, express_1.default)();
    expressApp.use(body_parser_1.default.json({ limit: "250mb" }));
    const server = http_1.default.createServer(expressApp);
    const listenOptions = {
        hostname: "127.0.0.1",
        port: 0,
        server,
    };
    const addressInfo = (await cactus_common_1.Servers.listen(listenOptions));
    tape_1.default.onFinish(async () => await cactus_common_1.Servers.shutdown(server));
    const { address, port } = addressInfo;
    const apiHost = `http://${address}:${port}`;
    const configuration = new public_api_1.Configuration({ basePath: apiHost });
    const apiClient = new public_api_1.DefaultApi(configuration);
    await plugin.registerWebServices(expressApp);
    const key = (0, uuid_1.v4)();
    const value = (0, uuid_1.v4)();
    const res1 = await apiClient.hasKeychainEntryV1({ key });
    t.true(res1.status >= 200, "res1.status >= 200 OK");
    t.true(res1.status < 300, "res1.status < 300 OK");
    // FIXME: make it so that the hasKeychainEntryV1 endpoint returns the
    // response object as defined by the openapi.json in core-api
    // (remember that we have a pending pull request for applying those changes
    // in the main line so there's a dependency between pull requests here at play)
    t.ok(res1.data, "res1.data truthy OK");
    t.false(res1.data.isPresent, "res1.data.isPresent === false OK");
    t.ok(res1.data.checkedAt, "res1.data.checkedAt truthy OK");
    t.equal(res1.data.key, key, "res1.data.key === key OK");
    const res2 = await apiClient.setKeychainEntryV1({ key, value });
    t.true(res2.status >= 200, "res2.status >= 200 OK");
    t.true(res2.status < 300, "res2.status < 300 OK");
    t.notOk(res2.data, "res2.data truthy OK");
    // const hasAfter = await plugin.has(key);
    // t.true(hasAfter, "hasAfter === true OK");
    const res3 = await apiClient.hasKeychainEntryV1({ key });
    t.true(res3.status >= 200, "res3.status >= 200 OK");
    t.true(res3.status < 300, "res3.status < 300 OK");
    // FIXME: make it so that the hasKeychainEntryV1 endpoint returns the
    // response object as defined by the openapi.json in core-api
    // (remember that we have a pending pull request for applying those changes
    // in the main line so there's a dependency between pull requests here at play)
    t.ok(res3.data, "res3.data truthy OK");
    t.true(res3.data.isPresent, "res3.data.isPresent === true OK");
    t.ok(res3.data.checkedAt, "res3.data.checkedAt truthy OK");
    t.equal(res3.data.key, key, "res3.data.key === key OK");
    const res4 = await apiClient.getKeychainEntryV1({ key });
    t.true(res4.status >= 200, "res4.status >= 200 OK");
    t.true(res4.status < 300, "res4.status < 300 OK");
    t.ok(res4.data, "res4.data truthy OK");
    t.equal(res4.data.value, value, "res4.data.value === value OK");
    // await plugin.delete(key);
    const res5 = await apiClient.deleteKeychainEntryV1({ key });
    t.true(res5.status >= 200, "res5.status >= 200 OK");
    t.true(res5.status < 300, "res5.status < 300 OK");
    t.notOk(res5.data, "res5.data falsy OK");
    const res6 = await apiClient.hasKeychainEntryV1({ key });
    t.true(res6.status >= 200, "res6.status >= 200 OK");
    t.true(res6.status < 300, "res6.status < 300 OK");
    // FIXME: make it so that the hasKeychainEntryV1 endpoint returns the
    // response object as defined by the openapi.json in core-api
    // (remember that we have a pending pull request for applying those changes
    // in the main line so there's a dependency between pull requests here at play)
    t.ok(res6.data, "res6.data truthy OK");
    t.false(res6.data.isPresent, "res6.data.isPresent === false OK");
    t.ok(res6.data.checkedAt, "res6.data.checkedAt truthy OK");
    t.equal(res6.data.key, key, "res6.data.key === key OK");
    // const valueAfterDelete = plugin.get(key);
    // const regExp = new RegExp(/secret not found*/);
    // const rejectMsg = "valueAfterDelete === throws OK";
    // await t.rejects(valueAfterDelete, regExp, rejectMsg);
    try {
        await apiClient.getKeychainEntryV1({ key });
        t.fail("Failing because getKeychainEntryV1 did not throw when called with non-existent key.");
    }
    catch (ex) {
        t.ok(ex, "res7 -> ex truthy");
        const res7 = ex.response;
        t.equal(res7.status, 404, "res7.status === 404 OK");
        t.ok(res7.data, "res7.data truthy OK");
        t.ok(res7.data.error, "res7.data.error truthy OK");
        t.equal(typeof res7.data.error, "string", "res7.data.error truthy OK");
        t.true(res7.data.error.includes(`${key} secret not found`), "res7.data.error contains legible error message about missing key OK");
    }
    t.end();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLWtleWNoYWluLWF6dXJlLWt2LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvdGVzdC90eXBlc2NyaXB0L2ludGVncmF0aW9uL3BsdWdpbi1rZXljaGFpbi1henVyZS1rdi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0RBQXdCO0FBR3hCLDZEQUErQztBQUUvQyxzREFBOEI7QUFDOUIsOERBQXFDO0FBQ3JDLCtCQUFvQztBQUdwQyw4REFBbUU7QUFFbkUsb0VBSzZDO0FBRTdDLHlGQUF5RTtBQUV6RSxNQUFNLFFBQVEsR0FBaUIsT0FBTyxDQUFDO0FBRXZDLElBQUEsY0FBSSxFQUFDLDhFQUE4RSxFQUFFLEtBQUssRUFBRSxDQUFPLEVBQUUsRUFBRTtJQUNyRyxNQUFNLE9BQU8sR0FBa0M7UUFDN0MsVUFBVSxFQUFFLElBQUEsU0FBTSxHQUFFO1FBQ3BCLFVBQVUsRUFBRSxJQUFBLFNBQU0sR0FBRTtRQUNwQixRQUFRLEVBQUUsUUFBUTtRQUNsQixhQUFhLEVBQUUsY0FBYztRQUM3QixPQUFPLEVBQUUsSUFBSSxnREFBZ0IsQ0FBQztZQUM1QixVQUFVLEVBQUUsU0FBUztZQUNyQixRQUFRLEVBQUUsUUFBUTtTQUNuQixDQUFDO0tBQ0gsQ0FBQztJQUNGLE1BQU0sTUFBTSxHQUFHLElBQUksa0NBQXFCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFbEQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLEVBQUUsT0FBTyxDQUFDLFVBQVUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQzFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxFQUFFLE9BQU8sQ0FBQyxVQUFVLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztJQUUxRSxNQUFNLFVBQVUsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQztJQUM3QixVQUFVLENBQUMsR0FBRyxD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