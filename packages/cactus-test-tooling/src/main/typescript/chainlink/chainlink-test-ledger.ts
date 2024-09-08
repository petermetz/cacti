import { spawn, SpawnOptions } from "node:child_process";
import path from "node:path";

import DockerodeCompose from "dockerode-compose";
import Docker, { Container } from "dockerode";
import fse from "fs-extra";
import Joi from "joi";
import { load } from "js-yaml";

import {
  LogLevelDesc,
  Logger,
  LoggerProvider,
  Checks,
  Bools,
} from "@hyperledger/cactus-common";
import { IComposeUpOutput } from "./i-compose-up-output";

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
  cwd?: string;
}

/**
 * Executes a shell command and attaches the logs to the parent process.
 * @param command The command to run.
 * @param args Arguments for the command.
 * @returns A Promise that resolves when the command completes.
 */
function executeCommand(
  command: string,
  args: string[] = [],
  spawnOptionsOverride: SpawnOptions = {},
): Promise<void> {
  return new Promise((resolve, reject) => {
    const spawnOptions: SpawnOptions = {
      stdio: "inherit",
      shell: true,
      ...spawnOptionsOverride,
    };
    const child = spawn(command, args, spawnOptions);

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        const errorMessage = `Command "${command} ${args.join(" ")}" exited with code ${code}`;
        reject(new Error(errorMessage));
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
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
export class ChainlinkTestLedger {
  public static readonly CLASS_NAME = "ChainlinkTestLedger";

  private readonly log: Logger;
  private readonly cwd: string;
  private readonly envVars: string[];
  private readonly compose: DockerodeCompose;
  private readonly yamlFile: string;

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

    const scriptDir = __dirname;
    this.log.debug("Current file's directory path: %s", scriptDir);

    const dockerComposeYamlPath =
      "../../../resources/chainlink/chainlink-aio.docker-compose.yaml";

    this.log.debug("dockerComposeYamlPath: %s", dockerComposeYamlPath);

    this.yamlFile = path.join(scriptDir, dockerComposeYamlPath);
    this.log.debug("AIO Docker Compose file path: %s", this.yamlFile);

    if (typeof opts.cwd === "string" && opts.cwd.length > 0) {
      this.cwd = opts.cwd;
      this.log.debug("Effective CWD from constructor args: %s", opts.cwd);
    } else if (scriptDir.includes("src/main/typescript")) {
      this.cwd = path.join(scriptDir, "../../../../../../");
      this.log.debug("Guessed running from .ts file => CWD: %s", this.cwd);
    } else {
      // if the script is running from the dist lib then we need an extra ".."
      // because we are one level deeper in the directory structure relative
      // to the project root
      this.cwd = path.join(scriptDir, "../../../../../../../");
      this.log.debug("Guessed running from .js dist file => CWD: %s", this.cwd);
    }

    const docker = new Docker();

    this.compose = new DockerodeCompose(
      // TODO: Remove unsafe cast once we were able to synchronize the transitive
      // dependency versions (dockerode that we use vs. dockerode that dockerode-compose uses)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      docker as unknown as any,
      this.yamlFile,
      "chainlink-aio",
    );
  }

  public getContainerId(): string {
    const fnTag = `${this.className}.getContainerId()`;
    Checks.nonBlankString(this.containerId, `${fnTag}::containerId`);
    return this.containerId as string;
  }

  public async checkYamlFileExistence(): Promise<void> {
    const yamlFileExists = await fse.pathExists(this.yamlFile);
    if (!yamlFileExists) {
      throw new Error(`Non-existent AIO Docker Compose file: ${this.yamlFile}`);
    } else {
      this.log.debug("AIO Docker Compose file exists: %s", this.yamlFile);
    }
  }

  public async pull(opts: {
    readonly svcNames?: Readonly<Array<string>>;
  }): Promise<{ composePullOutputs: unknown[] }> {
    const composePullOutputs: unknown[] = [];
    const out = { composePullOutputs };
    const svcNames = opts.svcNames ?? [
      "cacti",
      "chainlink",
      "postgres",
      "besu",
    ];

    this.log.debug("Executing Docker Compose Pull svcNames=%o...", svcNames);

    for (const service of svcNames) {
      try {
        this.log.debug("Compose Pulling Image for Service %o ...", service);
        const composePullOutput = await this.compose.pull(service, {
          streams: false, // makes the library await internally for pull completion
          verbose: true,
        });
        this.log.debug("Compose Pull %o OK", service);
        composePullOutputs.push(composePullOutput);
      } catch (cause: unknown) {
        throw new Error(`docker compose pull failed: ${service}`, { cause });
      }
    }
    return out;
  }

  public async stop(): Promise<{ composeDownOutput: unknown }> {
    this.log.debug("Executing Docker Compose Down...");
    try {
      const composeDownOutput = await this.compose.down();
      this.log.debug("Executing Docker Compose Down OK: %o", composeDownOutput);
      return { composeDownOutput };
    } catch (cause: unknown) {
      throw new Error("docker compose down failed: ", { cause });
    }
  }

  /**
   * Emulates executing this command in your shell from the Cacti project root dir:
   * 
   * ```sh
   * docker compose \
    --project-directory packages/cactus-test-tooling/src/main/resources/chainlink/ \
    --file packages/cactus-test-tooling/src/main/resources/chainlink/chainlink-aio.docker-compose.yaml \
    up \
    --build
   * ```
   * @returns 
   */
  public async start(): Promise<void> {
    await this.checkYamlFileExistence();

    const yamlBuffer = await fse.readFile(this.yamlFile);
    const yamlString = yamlBuffer.toString("utf-8");
    const pojo = load(yamlString, { filename: this.yamlFile });
    this.log.debug("YAML pojo: %o", pojo);

    this.log.debug("Executing Docker Compose Up... cwd: %s", this.cwd);

    await executeCommand(
      "docker",
      [
        "compose",
        "--project-directory packages/cactus-test-tooling/src/main/resources/chainlink/",
        "--file packages/cactus-test-tooling/src/main/resources/chainlink/chainlink-aio.docker-compose.yaml",
        "up",
        "--build",
      ],
      { cwd: this.cwd },
    );
    this.log.debug("Compose Project Up OK: %o");

    // if (!isIComposeUpOutput(composeUpOutput)) {
    //   const composeUpOutputWrongShape =
    //     "isIComposeUpOutput() returned false for the output of dockerode-compose. " +
    //     "This is most likely due to a library upgrade which changed the output " +
    //     "structure of the compose up operation. Did you upgrade recently?";
    //   throw new Error(composeUpOutputWrongShape);
    // }
    // return { composeUpOutput };
  }

  public async destroy(): Promise<unknown> {
    this.log.debug("destroy is a no-op: the compose lib does not support it.");
    return;
  }

  /**
   * @returns The port mapped to the host machine's network interface.
   */
  public async getHttpPortPublic(opts: {
    readonly composeUpOutput: IComposeUpOutput;
  }): Promise<number> {
    this.log.debug("getHttpPortPublic() opts: %o", opts);
    return 6688;
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
