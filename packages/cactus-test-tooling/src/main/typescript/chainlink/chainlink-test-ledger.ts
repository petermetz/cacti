import { EventEmitter } from "node:events";
import path from "node:path";

import DockerodeCompose from "dockerode-compose";
import Docker, { Container, ContainerInfo } from "dockerode";
import Joi from "joi";
import { None, Option, Some } from "ts-results";

import { ITestLedger } from "../i-test-ledger";
import { Containers } from "../common/containers";

import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
  Checks,
  Bools,
} from "@hyperledger/cactus-common";

export interface IChainlinkTestLedgerConstructorOptions {
  imageVersion?: string;
  imageName?: string;
  rpcPortNotary?: number;
  sshPort?: number;
  rpcPortA?: number;
  rpcPortB?: number;
  httpPort?: number;
  logLevel?: LogLevelDesc;
  envVars?: string[];
  emitContainerLogs?: boolean;
}

// const imageTag = "smartcontract/chainlink:2.15.0";

const DEFAULTS = Object.freeze({
  imageVersion: "2.15.0",
  imageName: "smartcontract/chainlink",
  httpPort: 8080,
  envVars: [],
});
export const CHAINLINK_TEST_LEDGER_DEFAULT_OPTIONS = DEFAULTS;

/*
 * Provides validations for the Chainlink AIO ledger container's options
 */
const JOI_SCHEMA: Joi.Schema = Joi.object().keys({
  imageVersion: Joi.string().min(5).required(),
  imageName: Joi.string().min(1).required(),
  httpPort: Joi.number().min(1).max(65535).required(),
});
export const CHAINLINK_TEST_LEDGER_OPTIONS_JOI_SCHEMA = JOI_SCHEMA;

/**
 * @see https://github.com/smartcontractkit/chainlink/blob/develop/core/chainlink.Dockerfile
 */
export class ChainlinkTestLedger implements ITestLedger {
  public static readonly CLASS_NAME = "ChainlinkTestLedger";

  private readonly log: Logger;
  private readonly envVars: string[];

  public get className(): string {
    return ChainlinkTestLedger.CLASS_NAME;
  }

  public readonly imageVersion: string;
  public readonly imageName: string;
  public readonly httpPort: number;
  public readonly emitContainerLogs: boolean;

  private container: Container | undefined;
  private containerId: string | undefined;

  constructor(
    public readonly opts: IChainlinkTestLedgerConstructorOptions = {},
  ) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(opts, `${fnTag} options`);

    this.imageVersion = opts.imageVersion || DEFAULTS.imageVersion;
    this.imageName = opts.imageName || DEFAULTS.imageName;

    this.httpPort = opts.httpPort || DEFAULTS.httpPort;

    this.emitContainerLogs = Bools.isBooleanStrict(opts.emitContainerLogs)
      ? (opts.emitContainerLogs as boolean)
      : true;

    this.envVars = opts.envVars ? opts.envVars : DEFAULTS.envVars;
    Checks.truthy(Array.isArray(this.envVars), `${fnTag}:envVars not an array`);

    this.validateConstructorOptions();
    const label = "chainlink-test-ledger";
    const level = opts.logLevel || "INFO";
    this.log = LoggerProvider.getOrCreate({ level, label });
  }

  public getContainerId(): string {
    const fnTag = `${this.className}.getContainerId()`;
    Checks.nonBlankString(this.containerId, `${fnTag}::containerId`);
    return this.containerId as string;
  }

  public async start(skipPull = false): Promise<Container> {
    const imageFqn = this.getContainerImageName();

    if (this.container) {
      await this.container.stop();
      await this.container.remove();
    }

    const composeFile = path.join(
      __dirname,
      "../../yaml/chainlink-aio.docker-compose.yaml",
    );
    this.log.debug("Chainlink AIO Docker Compose file: %s", composeFile);

    const docker = new Docker();
    const compose = new DockerodeCompose(
      docker as any,
      "./test/wordpress.yml",
      "wordpress",
    );

    (async () => {
      await compose.pull();
      const state = await compose.up();
      console.log(state);
    })();

    if (!skipPull) {
      await Containers.pullImage(imageFqn, {}, this.opts.logLevel);
    }

    return new Promise<Container>((resolve, reject) => {
      const eventEmitter: EventEmitter = docker.run(
        imageFqn,
        [],
        [],
        {
          ExposedPorts: {
            [`${this.httpPort}/tcp`]: {},
          },
          HostConfig: {
            PublishAllPorts: true,
          },
          // TODO: this can be removed once the new docker image is published and
          // specified as the default one to be used by the tests.
          // Healthcheck: {
          //   Test: [
          //     "CMD-SHELL",
          //     `curl -v 'http://127.0.0.1:7005/jolokia/exec/org.apache.activemq.artemis:address=%22rpc.server%22,broker=%22RPC%22,component=addresses,queue=%22rpc.server%22,routing-type=%22multicast%22,subcomponent=queues/countMessages()/'`,
          //   ],
          //   Interval: 1000000000, // 1 second
          //   Timeout: 3000000000, // 3 seconds
          //   Retries: 99,
          //   StartPeriod: 1000000000, // 1 second
          // },
          Env: this.envVars,
        },
        {},
        (err: unknown) => {
          if (err) {
            reject(err);
          }
        },
      );

      eventEmitter.once("start", async (container: Container) => {
        this.container = container;
        this.containerId = container.id;

        if (this.emitContainerLogs) {
          const fnTag = `[${this.getContainerImageName()}]`;
          await Containers.streamLogs({
            container: this.getContainer().expect("stream logs: no container"),
            tag: fnTag,
            log: this.log,
          });
        }

        try {
          let isHealthy = false;
          do {
            const containerInfo = await this.getContainerInfo();
            this.log.debug(`ContainerInfo.Status=%o`, containerInfo.Status);
            this.log.debug(`ContainerInfo.State=%o`, containerInfo.State);
            isHealthy = containerInfo.Status.endsWith("(healthy)");
            if (!isHealthy) {
              await new Promise((resolve2) => setTimeout(resolve2, 1000));
            }
          } while (!isHealthy);
          resolve(container);
        } catch (ex) {
          reject(ex);
        }
      });
    });
  }

  public async logDebugPorts(): Promise<void> {
    const httpPort = await this.getHttpPortPublic();
    this.log.info(`HTTP Port: ${httpPort}`);
  }

  public async stop(): Promise<unknown> {
    const container = this.getContainer();
    if (container.none) {
      return "Container was not present. Skipped stopping it.";
    }
    return Containers.stop(container.val);
  }

  public async destroy(): Promise<unknown> {
    const fnTag = `${this.className}.destroy()`;
    if (this.container) {
      return this.container.remove();
    } else {
      return Promise.reject(
        new Error(`${fnTag} Container was never created, nothing to destroy.`),
      );
    }
  }

  protected async getContainerInfo(): Promise<ContainerInfo> {
    const fnTag = `${this.className}.getContainerInfo()`;
    const docker = new Docker();
    const containerInfos = await docker.listContainers({});
    const id = this.getContainerId();

    const aContainerInfo = containerInfos.find((ci) => ci.Id === id);

    if (aContainerInfo) {
      return aContainerInfo;
    } else {
      throw new Error(`${fnTag} no container with ID "${id}"`);
    }
  }

  /**
   * @returns The port mapped to the host machine's network interface.
   */
  public async getHttpPortPublic(): Promise<number> {
    const aContainerInfo = await this.getContainerInfo();
    return Containers.getPublicPort(this.httpPort, aContainerInfo);
  }

  public getContainer(): Option<Container> {
    return this.container instanceof Container ? Some(this.container) : None;
  }

  public getContainerImageName(): string {
    return `${this.imageName}:${this.imageVersion}`;
  }

  private validateConstructorOptions(): void {
    const fnTag = `${this.className}#validateConstructorOptions()`;
    const validationResult = JOI_SCHEMA.validate({
      imageVersion: this.imageVersion,
      imageName: this.imageName,
      httpPort: this.httpPort,
    });

    if (validationResult.error) {
      throw new Error(`${fnTag} ${validationResult.error.annotate()}`);
    }
  }
}
