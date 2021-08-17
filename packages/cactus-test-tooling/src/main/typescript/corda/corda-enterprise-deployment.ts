import { Logger, Checks, LogLevelDesc } from "@hyperledger/cactus-common";
import { LoggerProvider } from "@hyperledger/cactus-common";

export interface ICordaEnterpriseDeploymentOptions {
  logLevel?: LogLevelDesc;
}

export const K_CORDA_ENTERPRISE_NODE_IMAGE_FQN =
  "corda/corda-enterprise-alpine-zulu-java1.8-4.7:RELEASE";

export class CordaEnterpriseDeployment {
  public static readonly CLASS_NAME = "CordaEnterpriseDeployment";

  private readonly log: Logger;

  public get className(): string {
    return CordaEnterpriseDeployment.CLASS_NAME;
  }

  constructor(public readonly options: ICordaEnterpriseDeploymentOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(options, `${fnTag} arg options`);

    const level = this.options.logLevel || "INFO";
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public async start(): Promise<unknown> {
    return;
  }
}
