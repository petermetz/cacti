import { LogLevelDesc, LoggerProvider } from "@hyperledger/cactus-common";
import { OpenApiFuzzerContainer } from "@hyperledger/cactus-test-tooling";
import "jest-extended";
import OAS from "../../../main/json/openapi.json";
import { createDummyPluginImportLedgerConnectorBesu } from "../common/create-dummy-plugin-import-ledger-connector-besu";
import { PluginImport } from "@hyperledger/cactus-core-api";
import path from "path";
import { PluginRegistry } from "@hyperledger/cactus-core";

const PKG_NAME = "@hyperledger/cactus-plugin-ledger-connector-besu" as const;
const logLevel: LogLevelDesc = "DEBUG" as const;

describe(PKG_NAME, async () => {
  let fuzzer: OpenApiFuzzerContainer;
  let apiUrl: string;
  let pluginRegistry: PluginRegistry;

  const log = LoggerProvider.getOrCreate({
    label: __filename,
    level: logLevel || "DEBUG",
  });

  beforeAll(async () => {
    fuzzer = new OpenApiFuzzerContainer({
      emitContainerLogs: true,
      logLevel,
    });

    const fuzzerStartRes = await fuzzer.start();
    expect(fuzzerStartRes).toBeTruthy();
  });

  beforeAll(() => {
    pluginRegistry = new PluginRegistry();
  });

  beforeAll(async () => {
    const pluginImports: PluginImport[] = [];

    const __dirname = path.dirname(__filename);
    const SCRIPT_DIR = __dirname;

    log.debug(`SCRIPT_DIR: ${SCRIPT_DIR}`);

    const gitRootDir = path.join(SCRIPT_DIR, "../../../../../../");
    log.debug(`gitRootDir=${gitRootDir}`);

    const anImport = await createDummyPluginImportLedgerConnectorBesu({
      pluginRegistry,
      logLevel,
      gitRootDir,
    });
    pluginImports.push(anImport);

    apiUrl = "FIXME TODO etc";
  });

  afterAll(async () => {
    await expect(fuzzer.stop()).toResolve();
    await expect(fuzzer.destroy()).toResolve();
  });

  it("Passes the OpenAPI fuzzer tests", async () => {
    await fuzzer.run({
      apiUrl,
      spec: OAS,
    });
  });
});
