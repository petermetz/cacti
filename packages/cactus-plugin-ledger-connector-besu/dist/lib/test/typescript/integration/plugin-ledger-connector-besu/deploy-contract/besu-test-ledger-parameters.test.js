"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cactus_test_tooling_1 = require("@hyperledger/cactus-test-tooling");
require("jest-extended");
const testCase = "PluginLedgerConnectorBesu:deploy-contract";
describe(testCase, () => {
    test("constructor does not throw with the default config", async () => {
        // No options
        const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger();
        expect(besuTestLedger).toBeTruthy();
    });
    test("Besu environment variables passed correctly", async () => {
        const simpleEnvVars = [
            "BESU_MINER_ENABLED",
            "BESU_NETWORK=dev",
            "BESU_MIN_GAS_PRICE=0",
        ];
        const besuOptions = {
            envVars: simpleEnvVars,
        };
        const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger(besuOptions);
        expect(besuTestLedger.envVars).toEqual(simpleEnvVars);
        expect(besuTestLedger).toBeTruthy();
    });
    test("deploys a Besu Node on the Rinkeby network", async () => {
        const rinkebyNetworkEnvVars = [
            "BESU_MOUNT_TYPE=bind",
            "BESU_MINER_ENABLED",
            "BESU_MINER_COINBASE=fe3b557e8fb62b89f4916b721be55ceb828dbd73",
            "BESU_SOURCE=/<myvolume/besu/testnode>",
            "BESU_NETWORK=rinkeby",
            "BESU_MIN_GAS_PRICE=0",
            "BESU_TARGET=/var/lib/besu hyperledger/besu:latest",
        ];
        const besuOptions = {
            envVars: rinkebyNetworkEnvVars,
        };
        const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger(besuOptions);
        expect(besuTestLedger.envVars).toEqual(rinkebyNetworkEnvVars);
        expect(besuTestLedger).toBeTruthy();
    });
    test("deploys a Besu Node on the Ropsten network", async () => {
        // const rinkebyNetworkParameters = "--mount type=bind,source=/<myvolume/besu/testnode>,target=/var/lib/besu hyperledger/besu:latest --miner-enabled --miner-coinbase fe3b557e8fb62b89f4916b721be55ceb828dbd73--network=dev --min-gas-price=0";
        const rinkebyNetworkEnvVars = [
            "BESU_MOUNT_TYPE=bind",
            "BESU_MINER_ENABLED",
            "BESU_MINER_COINBASE=fe3b557e8fb62b89f4916b721be55ceb828dbd73",
            "BESU_SOURCE=/<myvolume/besu/testnode>",
            "BESU_NETWORK=ropsten",
            "BESU_MIN_GAS_PRICE=0",
            "BESU_TARGET=/var/lib/besu hyperledger/besu:latest",
        ];
        const besuOptions = {
            envVars: rinkebyNetworkEnvVars,
        };
        const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger(besuOptions);
        expect(besuTestLedger.envVars).toEqual(rinkebyNetworkEnvVars);
        expect(besuTestLedger).toBeTruthy();
    });
    test("deploys a Besu Node on the Goerli network", async () => {
        // const rinkebyNetworkParameters = "--mount type=bind,source=/<myvolume/besu/testnode>,target=/var/lib/besu hyperledger/besu:latest --miner-enabled --miner-coinbase fe3b557e8fb62b89f4916b721be55ceb828dbd73--network=dev --min-gas-price=0";
        const rinkebyNetworkEnvVars = [
            "BESU_MOUNT_TYPE=bind",
            "BESU_MINER_ENABLED",
            "BESU_MINER_COINBASE=fe3b557e8fb62b89f4916b721be55ceb828dbd73",
            "BESU_SOURCE=/<myvolume/besu/testnode>",
            "BESU_NETWORK=goerli",
            "BESU_MIN_GAS_PRICE=0",
            "BESU_TARGET=/var/lib/besu hyperledger/besu:latest",
        ];
        const besuOptions = {
            envVars: rinkebyNetworkEnvVars,
        };
        const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger(besuOptions);
        expect(besuTestLedger.envVars).toEqual(rinkebyNetworkEnvVars);
        expect(besuTestLedger).toBeTruthy();
    });
    test("deploys a Besu Node on the Ethereum main network", async () => {
        const ethereumEnvVars = [
            "BESU_TARGET=/var/lib/besu",
            "BESU_PORT=30303:30303",
            "BESU_RCP_HTTP_ENABLED",
        ];
        const besuOptions = {
            envVars: ethereumEnvVars,
        };
        const besuTestLedger = new cactus_test_tooling_1.BesuTestLedger(besuOptions);
        expect(besuTestLedger.envVars).toEqual(ethereumEnvVars);
        expect(besuTestLedger).toBeTruthy();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVzdS10ZXN0LWxlZGdlci1wYXJhbWV0ZXJzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvdGVzdC90eXBlc2NyaXB0L2ludGVncmF0aW9uL3BsdWdpbi1sZWRnZXItY29ubmVjdG9yLWJlc3UvZGVwbG95LWNvbnRyYWN0L2Jlc3UtdGVzdC1sZWRnZXItcGFyYW1ldGVycy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMEVBQWtFO0FBQ2xFLHlCQUF1QjtBQUV2QixNQUFNLFFBQVEsR0FBRywyQ0FBMkMsQ0FBQztBQUU3RCxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUN0QixJQUFJLENBQUMsb0RBQW9ELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDcEUsYUFBYTtRQUNiLE1BQU0sY0FBYyxHQUFHLElBQUksb0NBQWMsRUFBRSxDQUFDO1FBRTVDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM3RCxNQUFNLGFBQWEsR0FBRztZQUNwQixvQkFBb0I7WUFDcEIsa0JBQWtCO1lBQ2xCLHNCQUFzQjtTQUN2QixDQUFDO1FBRUYsTUFBTSxXQUFXLEdBQUc7WUFDbEIsT0FBTyxFQUFFLGFBQWE7U0FDdkIsQ0FBQztRQUNGLE1BQU0sY0FBYyxHQUFHLElBQUksb0NBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV2RCxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN0RCxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNENBQTRDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDNUQs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