import "jest-extended";

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import { PluginImportType } from "@hyperledger/cactus-core-api";
import { PluginRegistry } from "@hyperledger/cactus-core";
import { PluginFactoryLedgerConnector as PluginFactoryLedgerConnectorChainlink } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import { awaitOffRampTxV1Impl } from "@hyperledger/cacti-plugin-ledger-connector-chainlink";
import {
  BesuApiClient,
  Web3SigningCredential,
  Web3SigningCredentialType,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import { BesuApiClientOptions } from "@hyperledger/cactus-plugin-ledger-connector-besu";

import { deployBesuCcipContracts } from "../../../main/typescript/infra/besu/deploy-besu-ccip-contracts";

describe("PluginLedgerConnectorChainlink", () => {
  const logLevel: LogLevelDesc = "DEBUG";

  const log = LoggerProvider.getOrCreate({
    label: "chainlink-fabric-relay.test.ts",
    level: logLevel,
  });

  const srcCactiHost = "http://127.0.0.1:4000";
  const besuApiClientOptions = new BesuApiClientOptions({
    basePath: srcCactiHost,
  });

  const dstCactiHost = "http://127.0.0.1:5000";
  const proxyApiClientOptions = new BesuApiClientOptions({
    basePath: dstCactiHost,
  });

  const dstApiClient = new BesuApiClient(proxyApiClientOptions);
  const srcApiClient = new BesuApiClient(besuApiClientOptions);
  let deploymentResult: any;

  beforeAll(async () => {
    const web3SigningCredential: Web3SigningCredential = {
      ethAccount: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
      secret:
        "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
      type: Web3SigningCredentialType.PrivateKeyHex,
    };

    deploymentResult = await deployBesuCcipContracts({
      srcApiClient,
      dstApiClient,
      web3SigningCredential,
      logLevel,
    });

    log.info("CCIP Contract Addresses on Besu: %o", deploymentResult);
  });

  it("Can observe on/off ramp events", async () => {
    const factory = new PluginFactoryLedgerConnectorChainlink({
      pluginImportType: PluginImportType.Local,
    });

    const pluginRegistry = new PluginRegistry();

    const plugin = await factory.create({
      instanceId: "chainlink-connector-1",
      ledgerHttpHost: "https://localhost:8080",
      ledgerHttpPort: 1234,
      pluginRegistry,
      logLevel,
    });

    await plugin.onPluginInit();

    await awaitOffRampTxV1Impl({
      ccipMessageId: "FIXME",
      logLevel: "DEBUG",
      offRampAddress: deploymentResult.dstOffRampAddr,
    });
  });
});
