import type { EventEmitter } from "events";
import fs from "fs-extra";
import { Optional } from "typescript-optional";
import { RuntimeError } from "run-time-error-cjs";
import type { Container } from "dockerode";
import Docker from "dockerode";
import { v4 as uuidV4 } from "uuid";
import { stringify } from "safe-stable-stringify";
import { Logger, Checks, Bools, newRex } from "@hyperledger/cactus-common";
import type { LogLevelDesc } from "@hyperledger/cactus-common";
import { LoggerProvider } from "@hyperledger/cactus-common";
import { Containers } from "../common/containers";
import path from "path";

export const K_DEFAULT_OPENAPI_FUZZER_CONTAINER_WORKDIR =
  "/usr/src/host-sources-dir/";

export const K_DEFAULT_OPENAPI_FUZZER_IMAGE_NAME =
  "ghcr.io/matusf/openapi-fuzzer" as const;

export const K_DEFAULT_OPENAPI_FUZZER_IMAGE_VERSION = "v0.2.0" as const;

export interface IOpenApiFuzzerContainerOptions {
  readonly logLevel?: LogLevelDesc;
  readonly imageName?: string;
  readonly imageTag?: string;
  /**
   * The path on the host machine's file-system where the carbo build should
   * occur. Note that host machine in this context means the machine that runs
   * the test using this class, the one launching the containers.
   */
  readonly hostSourceDir?: string;
  readonly emitContainerLogs?: boolean;
  readonly envVars?: Map<string, string>;
  readonly workDir?: string;
}

/**
 * Helper class designed to enable test cases running the OpenAPI Fuzzer tool
 * without having to manage it's installation & dependencies. This class uses
 * a container image under the hood to launch the tool (which was written in
 * Rust)
 *
 * At it's core, it is meant to be a programamatic substitute for doing something
 * like this on your local machine:
 *
 * ```sh
 * $ docker run \
 *   --user "$(id -u)":"$(id -g)" \
 *   --volume "$PWD":/usr/src/myapp \
 *   --workdir /usr/src/myapp \
 *   --network=host \
 *   ghcr.io/matusf/openapi-fuzzer:v0.2.0 \
 *   run \
 *   --spec /usr/src/myapp/packages/cactus-plugin-ledger-connector-besu/src/main/json/openapi.json \
 *   --url http://localhost:4000/ \
 *   --ignore-status-code 400 \
 *   --ignore-status-code 404
 * ```
 *
 * @see https://github.com/matusf/openapi-fuzzer
 */
export class OpenApiFuzzerContainer {
  public static readonly CLASS_NAME = "OpenApiFuzzerContainer";

  public readonly logLevel: LogLevelDesc;
  public readonly imageName: string;
  public readonly imageTag: string;
  public readonly imageFqn: string;
  public readonly log: Logger;
  public readonly emitContainerLogs: boolean;
  public readonly hostSourceDir: Optional<string>;
  public readonly workDir: string;
  public readonly envVars: Map<string, string>;

  private _containerId: Optional<string>;

  public get containerId(): Optional<string> {
    return this._containerId;
  }

  public get cwd(): string {
    return this.workDir;
  }

  public get container(): Optional<Container> {
    const docker = new Docker();
    return this.containerId.isPresent()
      ? Optional.ofNonNull(docker.getContainer(this.containerId.get()))
      : Optional.empty();
  }

  public get className(): string {
    return OpenApiFuzzerContainer.CLASS_NAME;
  }

  constructor(public readonly opts: IOpenApiFuzzerContainerOptions) {
    const fnTag = `${this.className}#constructor()`;
    Checks.truthy(opts, `${fnTag} arg options`);

    if (opts.hostSourceDir) {
      Checks.nonBlankString(opts.hostSourceDir, `${fnTag} opts.hostSourceDir`);
    }

    this._containerId = Optional.empty();
    this.hostSourceDir = Optional.ofNullable(opts.hostSourceDir);
    this.imageName = opts.imageName || K_DEFAULT_OPENAPI_FUZZER_IMAGE_NAME;
    this.imageTag = opts.imageTag || K_DEFAULT_OPENAPI_FUZZER_IMAGE_VERSION;
    this.imageFqn = `${this.imageName}:${this.imageTag}`;

    this.envVars = opts.envVars || new Map();

    this.emitContainerLogs = Bools.isBooleanStrict(opts.emitContainerLogs)
      ? (opts.emitContainerLogs as boolean)
      : true;

    this.workDir = opts.workDir
      ? opts.workDir
      : K_DEFAULT_OPENAPI_FUZZER_CONTAINER_WORKDIR;

    Checks.nonBlankString(this.workDir, `${fnTag} non-blank str this.workDir`);

    this.logLevel = opts.logLevel || "INFO";

    const level = this.logLevel;
    const label = this.className;
    this.log = LoggerProvider.getOrCreate({ level, label });

    this.log.debug(`Created instance of ${this.className} OK`);
  }

  public async start(opts?: {
    readonly omitPull: boolean;
  }): Promise<Container> {
    if (this.hostSourceDir.isPresent()) {
      await this.checkHostSourceDirExists();
    }

    const docker = new Docker();
    if (this.containerId.isPresent()) {
      this.log.warn(`Container ID provided. Will not start new one.`);
      const container = docker.getContainer(this.containerId.get());
      return container;
    }
    if (opts!.omitPull !== true) {
      this.log.debug(`Pulling image ${this.imageFqn}...`);
      await Containers.pullImage(this.imageFqn, {}, this.opts.logLevel);
      this.log.debug(`Pulled image ${this.imageFqn} OK`);
    }

    const dockerEnvVars: string[] = new Array(...this.envVars).map(
      (pairs) => `${pairs[0]}=${pairs[1]}`,
    );

    const Binds = this.hostSourceDir.isPresent()
      ? [`${this.hostSourceDir.get()}:${this.cwd}`]
      : [];

    const createOptions = {
      WorkingDir: this.workDir,
      Env: dockerEnvVars,
      Healthcheck: {
        Test: ["CMD-SHELL", `openapi-fuzzer --help run`],
        Interval: 1000000000, // 1 second
        Timeout: 3000000000, // 3 seconds
        Retries: 10,
        StartPeriod: 1000000000, // 1 second
      },
      HostConfig: {
        AutoRemove: true,
        Binds,
      },
    };

    this.log.debug(`Starting ${this.imageFqn} with options: `, createOptions);

    return new Promise<Container>((resolve, reject) => {
      const eventEmitter: EventEmitter = docker.run(
        this.imageFqn,
        [],
        [],
        createOptions,
        {},
        (err: Error) => {
          if (err) {
            const errorMessage = `Failed to start container ${this.imageFqn}`;
            const exception = new RuntimeError(errorMessage, err);
            this.log.error(exception);
            reject(exception);
          }
        },
      );

      eventEmitter.once("start", async (container: Container) => {
        const { id } = container;
        this.log.debug(`Started ${this.imageFqn} successfully. ID=${id}`);
        this._containerId = Optional.ofNonNull(id);

        if (this.emitContainerLogs) {
          const fnTag = `[${this.imageFqn}]`;
          await Containers.streamLogs({
            container: this.container.get(),
            tag: fnTag,
            log: this.log,
          });
        }

        this.log.debug(`Registered container log stream callbacks OK`);

        try {
          this.log.debug(`Starting to wait for healthcheck... `);
          await Containers.waitForHealthCheck(this.containerId.get());
          this.log.debug(`Healthcheck passed OK`);
          resolve(container);
        } catch (ex: unknown) {
          const eMsg =
            `${this.className} Tried to wait for the ${this.imageFqn}` +
            ` container healthcheck to pass but it failed. Check the inner` +
            ` exception and the container logs for further information.`;
          this.log.debug(eMsg, ex);
          reject(newRex(eMsg, ex));
        }
      });
    });
  }

  public async stop(): Promise<unknown> {
    return Containers.stop(this.container.get());
  }

  public async destroy(): Promise<unknown> {
    return this.container.get().remove();
  }

  public async checkHostSourceDirExists(): Promise<void> {
    const pathExists = await fs.pathExists(this.hostSourceDir.get());
    if (!pathExists) {
      const errorMessage = `hostSourceDir ${this.hostSourceDir.get()} does not exist (or not accessible) on file-system. Cannot continue with Rust compilation`;
      throw new RuntimeError(errorMessage);
    }
  }

  public async run(req: {
    readonly spec: Record<string, unknown>;
    readonly apiUrl: string;
  }): Promise<{ readonly results: Array<unknown> }> {
    const fnTag = `${this.className}#run()`;
    if (!req) {
      throw new RuntimeError(`${fnTag} arg "req" was falsy.`);
    }
    if (!req.apiUrl) {
      throw new RuntimeError(`${fnTag} arg req.apiUrl was falsy.`);
    }
    if (typeof req.apiUrl !== "string") {
      throw new RuntimeError(`${fnTag} arg req.apiUrl was non-string.`);
    }
    if (req.apiUrl.length <= 0) {
      throw new RuntimeError(`${fnTag} arg req.apiUrl was blank-string.`);
    }
    if (!req.spec) {
      throw new RuntimeError(`${fnTag} arg req.spec was falsy.`);
    }
    if (typeof req.spec !== "object") {
      throw new RuntimeError(`${fnTag} arg req.spec was non-object type.`);
    }

    const theContainer = this.container.get();

    const dstFileName = uuidV4() + ".openapi.json";
    const srcFileAsString = stringify(req.spec, null, 2);
    const dstFileDir = "/tmp/";
    const specAbsPathInContainer = path.join(dstFileDir, dstFileName);

    this.log.debug("specAbsPathInContainer=%s", specAbsPathInContainer);

    await Containers.putFile({
      containerOrId: theContainer,
      dstFileDir,
      dstFileName,
      srcFileAsString,
    });

    const fuzzerCliRunOutput = await Containers.exec(theContainer, [
      "openapi-fuzzer",
      "run",
      "--spec",
      specAbsPathInContainer,
      "--url",
      req.apiUrl,
      "--ignore-status-code",
      "400",
      "--ignore-status-code",
      "404",
    ]);

    this.log.debug("fuzzerCliRunOutput=%s", fuzzerCliRunOutput);

    return { results: [] };
  }
}
