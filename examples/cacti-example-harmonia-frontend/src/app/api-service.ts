import { Injectable } from "@angular/core";
import { AxiosResponse } from "axios";

import {
  BesuApiClient,
  BesuApiClientOptions,
} from "@hyperledger/cactus-plugin-ledger-connector-besu";
import {
  CordaApiClient,
  CordaApiClientOptions,
  DeployContractJarsSuccessV1Response,
  InvokeContractV1Response,
  ListFlowsV1Response,
} from "@hyperledger/cactus-plugin-ledger-connector-corda";

import {
  Harmonia_R3_Swap_common_BASE64,
  Harmonia_R3_Swap_contracts_BASE64,
  Harmonia_R3_Swap_workflows_BASE64,
} from "../resources/large-constants";
import { Logger, LoggerProvider } from "@hyperledger/cactus-common";

@Injectable({ providedIn: "root" })
export class ApiService {
  public cordaApiClientOptions: CordaApiClientOptions;
  public corda: CordaApiClient;

  public besu: BesuApiClient;
  public besuApiClientOptions: BesuApiClientOptions;

  private readonly log: Logger;

  constructor() {
    this.log = LoggerProvider.getOrCreate({ label: "ApiService" });

    this.cordaApiClientOptions = new CordaApiClientOptions({
      basePath: "http://localhost:7000",
    });

    this.corda = this.createCordaApiClient();

    this.besuApiClientOptions = new BesuApiClientOptions({
      basePath: "http://localhost:7000",
    });

    this.besu = this.createBesuApiClient();
  }

  public createCordaApiClient(): CordaApiClient {
    return new CordaApiClient(this.cordaApiClientOptions);
  }

  public createBesuApiClient(): BesuApiClient {
    return new BesuApiClient(this.besuApiClientOptions);
  }

  public async doStep1(): Promise<AxiosResponse<ListFlowsV1Response, any>> {
    return this.corda.listFlowsV1();
  }

  public async doStep2(): Promise<
    AxiosResponse<DeployContractJarsSuccessV1Response, any>
  > {
    return this.corda.deployContractJarsV1({
      jarFiles: [
        {
          contentBase64: Harmonia_R3_Swap_common_BASE64,
          filename: "Harmonia_R3_Swap_common-1.0.jar",
          hasDbMigrations: true,
        },
        {
          contentBase64: Harmonia_R3_Swap_contracts_BASE64,
          filename: "Harmonia_R3_Swap_contracts-1.0.jar",
          hasDbMigrations: true,
        },
        {
          contentBase64: Harmonia_R3_Swap_workflows_BASE64,
          filename: "Harmonia_R3_Swap_workflows-1.0.jar",
          hasDbMigrations: true,
        },
      ],
      cordappDeploymentConfigs: [
        {
          cordappDir:
            "/samples-kotlin/Advanced/obligation-cordapp/build/nodes/ParticipantA/cordapps",
          cordaNodeStartCmd: "supervisorctl start corda-a",
          cordaJarPath:
            "/samples-kotlin/Advanced/obligation-cordapp/build/nodes/ParticipantA/corda.jar",
          nodeBaseDirPath:
            "/samples-kotlin/Advanced/obligation-cordapp/build/nodes/ParticipantA/",
          rpcCredentials: {
            hostname: "127.0.0.1",
            port: 10008,
            username: "user1",
            password: "password",
          },
          sshCredentials: {
            hostKeyEntry: "not-used-right-now-so-this-does-not-matter... ;-(",
            hostname: "127.0.0.1",
            password: "root",
            port: 22,
            username: "root",
          },
        },
        {
          cordappDir:
            "/samples-kotlin/Advanced/obligation-cordapp/build/nodes/ParticipantB/cordapps",
          cordaNodeStartCmd: "supervisorctl start corda-b",
          cordaJarPath:
            "/samples-kotlin/Advanced/obligation-cordapp/build/nodes/ParticipantB/corda.jar",
          nodeBaseDirPath:
            "/samples-kotlin/Advanced/obligation-cordapp/build/nodes/ParticipantB/",
          rpcCredentials: {
            hostname: "127.0.0.1",
            port: 10011,
            username: "user1",
            password: "password",
          },
          sshCredentials: {
            hostKeyEntry: "not-used-right-now-so-this-does-not-matter... ;-(",
            hostname: "127.0.0.1",
            password: "root",
            port: 22,
            username: "root",
          },
        },
      ],
    });
  }

  public async doStep3(): Promise<AxiosResponse<ListFlowsV1Response, any>> {
    return this.corda.listFlowsV1();
  }

  public async doStep4(): Promise<
    AxiosResponse<InvokeContractV1Response, any>
  > {
    return this.corda.invokeContractV1({
      timeoutMs: 60000,
      flowFullClassName:
        "com.r3.corda.evminterop.workflows.IssueGenericAssetFlow",
      flowInvocationType: "FLOW_DYNAMIC",
      params: [
        {
          jvmTypeKind: "PRIMITIVE",
          jvmType: {
            fqClassName: "java.lang.String",
          },
          primitiveValue: "Cacti_Asset_1",
        },
      ],
    });
  }

  // TODO this is unfinished
  public async doStep5(): Promise<
    AxiosResponse<InvokeContractV1Response, any>
  > {
    return this.corda.invokeContractV1({
      timeoutMs: 60000,
      flowFullClassName:
        "com.r3.corda.evminterop.workflows.IssueGenericAssetFlow",
      flowInvocationType: "FLOW_DYNAMIC",
      params: [
        {
          jvmTypeKind: "PRIMITIVE",
          jvmType: {
            fqClassName: "java.lang.String",
          },
          primitiveValue: "Cacti_Asset_2",
        },
      ],
    });
  }
}
