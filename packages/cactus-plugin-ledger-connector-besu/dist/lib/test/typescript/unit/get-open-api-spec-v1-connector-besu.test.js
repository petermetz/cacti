"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cactus_common_1 = require("@hyperledger/cactus-common");
const cactus_core_1 = require("@hyperledger/cactus-core");
const cactus_core_api_1 = require("@hyperledger/cactus-core-api");
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
require("jest-extended");
const socket_io_1 = require("socket.io");
const uuid_1 = require("uuid");
const public_api_1 = require("../../../main/typescript/public-api");
describe(__filename, () => {
    const logLevel = "TRACE";
    const log = cactus_common_1.LoggerProvider.getOrCreate({
        label: __filename,
        level: logLevel,
    });
    const rpcApiHttpHost = "http://127.0.0.1:8000";
    const rpcApiWsHost = "ws://127.0.0.1:9000";
    const expressApp = (0, express_1.default)();
    expressApp.use(body_parser_1.default.json({ limit: "250mb" }));
    const server = http_1.default.createServer(expressApp);
    let apiClient;
    afterAll(async () => {
        await cactus_common_1.Servers.shutdown(server);
    });
    beforeAll(async () => {
        const factory = new public_api_1.PluginFactoryLedgerConnector({
            pluginImportType: cactus_core_api_1.PluginImportType.Local,
        });
        const connector = await factory.create({
            rpcApiHttpHost,
            rpcApiWsHost,
            logLevel,
            instanceId: (0, uuid_1.v4)(),
            pluginRegistry: new cactus_core_1.PluginRegistry({ plugins: [] }),
        });
        const wsApi = new socket_io_1.Server(server, {
            path: cactus_core_api_1.Constants.SocketIoConnectionPathV1,
        });
        await connector.registerWebServices(expressApp, wsApi);
        const listenOptions = {
            hostname: "127.0.0.1",
            port: 0,
            server,
        };
        const addressInfo = (await cactus_common_1.Servers.listen(listenOptions));
        const { address, port } = addressInfo;
        const apiHost = `http://${address}:${port}`;
        const besuApiClientOptions = new public_api_1.BesuApiClientOptions({
            basePath: apiHost,
        });
        apiClient = new public_api_1.BesuApiClient(besuApiClientOptions);
        log.debug("Instantiated BesuApiClient OK");
    });
    it("Returns a JSON document containing the Open API specification of the plugin.", async () => {
        const res1Promise = apiClient.getOpenApiSpecV1();
        await expect(res1Promise).resolves.not.toThrow();
        const res1 = await res1Promise;
        expect(res1.status).toEqual(200);
        expect(res1.data).toBeTruthy();
        expect(res1.config).toBeTruthy();
        expect(res1.config.url).toBeString();
        log.debug("Fetched URL OK=%s", res1.config.url);
        expect(res1.data).toBeObject();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LW9wZW4tYXBpLXNwZWMtdjEtY29ubmVjdG9yLWJlc3UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy90ZXN0L3R5cGVzY3JpcHQvdW5pdC9nZXQtb3Blbi1hcGktc3BlYy12MS1jb25uZWN0b3ItYmVzdS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBS29DO0FBQ3BDLDBEQUEwRDtBQUMxRCxrRUFBMkU7QUFDM0UsOERBQXFDO0FBQ3JDLHNEQUE4QjtBQUM5QixnREFBd0I7QUFDeEIseUJBQXVCO0FBRXZCLHlDQUFxRDtBQUNyRCwrQkFBb0M7QUFDcEMsb0VBSzZDO0FBRTdDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLE1BQU0sUUFBUSxHQUFpQixPQUFPLENBQUM7SUFFdkMsTUFBTSxHQUFHLEdBQUcsOEJBQWMsQ0FBQyxXQUFXLENBQUM7UUFDckMsS0FBSyxFQUFFLFVBQVU7UUFDakIsS0FBSyxFQUFFLFFBQVE7S0FDaEIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxjQUFjLEdBQUcsdUJBQXVCLENBQUM7SUFDL0MsTUFBTSxZQUFZLEdBQUcscUJBQXFCLENBQUM7SUFFM0MsTUFBTSxVQUFVLEdBQUcsSUFBQSxpQkFBTyxHQUFFLENBQUM7SUFDN0IsVUFBVSxDQUFDLEdBQUcsQ0FBQyxxQkFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDcEQsTUFBTSxNQUFNLEdBQUcsY0FBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM3QyxJQUFJLFNBQXdCLENBQUM7SUFFN0IsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ2xCLE1BQU0sdUJBQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakMsQ0FBQyxDQUFDLENBQUM7SUFFSCxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDbkIsTUFBTSxPQUFPLEdBQUcsSUFBSSx5Q0FBNEIsQ0FBQztZQUMvQyxnQkFBZ0IsRUFBRSxrQ0FBZ0IsQ0FBQyxLQUFLO1NBQ3pDLENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUE4QixNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDaEUsY0FBYztZQUNkLFlBQVk7WUFDWixRQUFRO1lBQ1IsVUFBVSxFQUFFLElBQUEsU0FBTSxHQUFFO1lBQ3BCLGNBQWMsRUFBRSxJQUFJLDRCQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUM7U0FDcEQsQ0FBQyxDQUFDO1FBRUgsTUFBTSxLQUFLLEdBQUcsSUFBSSxrQkFBYyxDQUFDLE1BQU0sRUFBRTtZQUN2QyxJQUFJLEVBQUUsMkJBQVMsQ0FBQyx3QkFBd0I7U0FDekMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXZELE1BQU0sYUFBYSxHQUFtQjtZQUNwQyxRQUFRLEVBQUUsV0FBVztZQUNyQixJQUFJLEVBQUUsQ0FBQztZQUNQLE1BQU07U0FDUCxDQUFDO1FBQ0YsTUFBTSxXQUFXLEdBQUcsQ0FBQyxNQUFNLHVCQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFnQixDQUFDO1FBQ3pFLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsV0FBVyxDQUFDO1FBQ3RDLE1BQU0sT0FBTyxHQUFHLFVBQVUsT0FBTyxJQUFJLElBQUksRUFBRSxDQUFDO1FBRTVDLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxpQ0FBb0IsQ0FBQztZQUNwRCxRQUFRLEVBQUUsT0FBTztTQUNsQixDQUFDLENBQUM7UUFDSCxTQUFTLEdBQUcsSUFBSSwwQkFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDcEQsR0FBRyxDQUFDLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDhFQUE4RSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzVGLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ2pELE1BQU0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDakQsTUFBTSxJQUFJLEdBQUcsTUFBTSxXQUFXLENBQUM7UUFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==