import "jest-extended";

import { v4 as internalIpV4 } from "internal-ip";

import { Configuration } from "@hyperledger/cactus-core-api";
import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";
import {
  buildImageConnectorCordaServer,
  buildImageCordaAllInOneV412,
  Containers,
  CordaTestLedger,
  ICordappJarFile,
  pruneDockerAllIfGithubAction,
} from "@hyperledger/cactus-test-tooling";
import {
  SampleCordappEnum,
  CordaConnectorContainer,
} from "@hyperledger/cactus-test-tooling";

import {
  CordappDeploymentConfig,
  DefaultApi as CordaApi,
  DeployContractJarsV1Request,
  FlowInvocationType,
  InvokeContractV1Request,
} from "../../../main/typescript/generated/openapi/typescript-axios/index";

import { createJvmBoolean } from "../../../main/typescript/public-api";
import { createJvmLong } from "../../../main/typescript/jvm/serde/factory/create-jvm-long";
import { createJvmCordaIdentityParty } from "../../../main/typescript/jvm/serde/factory/create-jvm-corda-identity-party";

const testCase = "Tests are passing on the JVM side";
const logLevel: LogLevelDesc = "TRACE";

describe("Corda V4 Connector", () => {
  const log = LoggerProvider.getOrCreate({
    label: "jvm-kotlin-spring-server-v4.12.test.ts",
    level: logLevel,
  });

  let apiClient: CordaApi;
  let jarFiles: ICordappJarFile[];
  let ledger: CordaTestLedger;
  let connector: CordaConnectorContainer;
  let testAppearsSuccessful = false;

  afterAll(async () => {
    if (testAppearsSuccessful !== true) {
      log.error("Test appears to have failed. Logging container diagnostics");
      await Containers.logDiagnostics({ logLevel });
    }
  });

  beforeAll(async () => {
    await pruneDockerAllIfGithubAction({ logLevel });
  });

  beforeAll(async () => {
    const imgConnectorJvm = await buildImageConnectorCordaServer({
      logLevel,
    });
    const imgLedger = await buildImageCordaAllInOneV412({ logLevel });

    ledger = new CordaTestLedger({
      imageName: imgLedger.imageName,
      imageVersion: imgLedger.imageVersion,
      logLevel,
      rpcPortNotary: 10003,
      rpcPortA: 10006,
      rpcPortB: 10009,
    });
    expect(ledger).toBeTruthy();

    const ledgerContainer = await ledger.start(true);
    expect(ledgerContainer).toBeTruthy();

    await ledger.logDebugPorts();
    const partyARpcPort = await ledger.getRpcAPublicPort();

    jarFiles = await ledger.pullCordappJars(
      SampleCordappEnum.ADVANCED_NEGOTIATION,
    );

    const internalIpOrUndefined = await internalIpV4();
    expect(internalIpOrUndefined).toBeTruthy();
    const internalIp = internalIpOrUndefined as string;
    log.info(`Internal IP (based on default gateway): ${internalIp}`);

    const springAppConfig = {
      logging: {
        level: {
          root: "INFO",
          "org.hyperledger.cactus": "DEBUG",
        },
      },
      cactus: {
        corda: {
          node: { host: internalIp },
          // TODO: parse the gradle build files to extract the credentials?
          rpc: { port: partyARpcPort, username: "user1", password: "test" },
        },
      },
    };
    const springApplicationJson = JSON.stringify(springAppConfig);
    const envVarSpringAppJson = `SPRING_APPLICATION_JSON=${springApplicationJson}`;
    log.debug("Spring App Config Env Var: ", envVarSpringAppJson);

    connector = new CordaConnectorContainer({
      logLevel,
      imageName: imgConnectorJvm.imageName,
      imageVersion: imgConnectorJvm.imageVersion,
      envVars: [envVarSpringAppJson],
    });
    // Set to true if you are testing an image that you've built locally and have not
    // yet uploaded to the container registry where it would be publicly available.
    // Do not forget to set it back to `false` afterwards!
    const skipContainerImagePull = true;
    expect(CordaConnectorContainer).toBeTruthy();

    const connectorContainer = await connector.start(skipContainerImagePull);
    expect(connectorContainer).toBeTruthy();

    await connector.logDebugPorts();
    const apiUrl = await connector.getApiLocalhostUrl();
    const config = new Configuration({ basePath: apiUrl });
    apiClient = new CordaApi(config);
  });

  afterAll(async () => {
    if (!ledger) {
      log.info("Ledger container falsy, skipping stop & destroy.");
      return;
    }
    try {
      await ledger.stop();
    } finally {
      await ledger.destroy();
    }
    await pruneDockerAllIfGithubAction({ logLevel });
  });

  afterAll(async () => {
    if (!connector) {
      log.info("Connector container falsy, skipping stop & destroy.");
      return;
    }
    try {
      await connector.stop();
    } finally {
      await connector.destroy();
    }
  });

  it(testCase, async () => {
    const flowsRes = await apiClient.listFlowsV1();
    expect(flowsRes.status).toEqual(200);
    expect(flowsRes.data).toBeTruthy();
    expect(flowsRes.data.flowNames).toBeTruthy();
    log.debug(`apiClient.listFlowsV1() => ${JSON.stringify(flowsRes.data)}`);

    const diagRes = await apiClient.diagnoseNodeV1();
    expect(diagRes.status).toEqual(200);
    expect(diagRes.data).toBeTruthy();
    expect(diagRes.data.nodeDiagnosticInfo).toBeTruthy();

    const ndi = diagRes.data.nodeDiagnosticInfo;
    expect(ndi.cordapps).toBeTruthy();
    expect(ndi.cordapps).toBeArray();
    expect(ndi.cordapps).not.toBeEmpty();
    expect(Array.isArray(ndi.cordapps)).toBeTrue();
    expect(ndi.cordapps.length > 0).toBeTrue();

    expect(ndi.vendor).toBeTruthy();
    expect(ndi.version).toBeTruthy();
    expect(ndi.revision).toBeTruthy();
    expect(ndi.platformVersion).toBeTruthy();

    log.debug(`apiClient.diagnoseNodeV1() => ${JSON.stringify(diagRes.data)}`);

    const cordappDeploymentConfigs: CordappDeploymentConfig[] = [];
    const depReq: DeployContractJarsV1Request = {
      jarFiles,
      cordappDeploymentConfigs,
    };
    const depRes = await apiClient.deployContractJarsV1(depReq);
    expect(depRes).toBeTruthy();
    expect(depRes.status).toEqual(200);
    expect(depRes.data).toBeTruthy();
    expect(depRes.data.deployedJarFiles).toBeTruthy();
    expect(depRes.data.deployedJarFiles.length).toEqual(jarFiles.length);

    const networkMapRes = await apiClient.networkMapV1();

    const partyB = networkMapRes.data.find((it) =>
      it.legalIdentities.some((it2) => it2.name.organisation === "PartyB"),
    );

    if (process.env.VERBOSE === "true") {
      const networkMapJson = JSON.stringify(networkMapRes.data, null, 4);
      console.log("Corda Network Map Snapshot JSON:", networkMapJson);
    }

    if (!partyB) {
      throw new Error("PartyB was falsy. Cannot continue the test.");
    }

    if (!partyB.legalIdentities[0]) {
      throw new Error(
        "PartyB had no legalIdentities. Cannot continue the test.",
      );
    }

    createJvmCordaIdentityParty({ party: partyB.legalIdentities[0] });

    const req: InvokeContractV1Request = {
      flowFullClassName:
        "net.corda.samples.negotiation.flows.ProposalFlow$Initiator",
      flowInvocationType: FlowInvocationType.TrackedFlowDynamic,
      params: [
        createJvmBoolean(true),
        createJvmLong(42),
        createJvmCordaIdentityParty({ party: partyB.legalIdentities[0] }),
      ],
      timeoutMs: 60000,
    };

    const res = await apiClient.invokeContractV1(req);
    expect(res).toBeTruthy();
    expect(res).toBeObject();
    expect(res).not.toBeEmptyObject();
    expect(res.status).toEqual(200);
    testAppearsSuccessful = true;
  });
});
