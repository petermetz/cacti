import { exec } from "node:child_process";
import util from "node:util";

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";

/**
 * Sets the Fabric peer logging levels in a Cacti Fabric AIO container image.
 *
 * ## Steps:
 * 1. Locates the Hyperledger Cacti Fabric All-In-One container running on the host
 * machine by pulling a list of all running containers and then trying to find one with the
 * name specified in {opts.containerName}.
 * 2. It shells into that container and modifies the text files where the log levels are declared.
 *
 * ## Modifying the configuration files
 * An example of what the text file modification looks like is shown by the below bash command:
 * ```sh
 * # Set the log level of the peers and other containers to DEBUG instead of the default INFO
 * sed -i "s/FABRIC_LOGGING_SPEC=INFO/FABRIC_LOGGING_SPEC=DEBUG/g" /fabric-samples/test-network/compose/docker/docker-compose-test-net.yaml
 * ```
 *
 * ## Log levels accepted by Fabric peers:
 *
 * FATAL | PANIC | ERROR | WARNING | INFO | DEBUG
 *
 * Source: https://hyperledger-fabric.readthedocs.io/en/latest/logging-control.html
 *
 * @param opts
 */
export async function setFabricPeerLogLevel(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly containerName: Readonly<string>;
  readonly peerLogLevel:
    | "FATAL"
    | "PANIC"
    | "ERROR"
    | "WARNING"
    | "INFO"
    | "DEBUG";
}): Promise<void> {
  const fn = "set-fabric-peer-log-level.ts";
  const { containerName, peerLogLevel, logLevel = "WARN" } = opts;
  const log = LoggerProvider.getOrCreate({
    label: fn,
    level: logLevel,
  });
  if (!peerLogLevel) {
    throw new Error(`${fn} need truthy opts.peerLogLevel, got falsy value.`);
  }
  log.debug("ENTER");

  const execPromise = util.promisify(exec);

  try {
    // Step 1: Locate the container
    log.debug("Fetching the list of running containers...");
    const { stdout: containersList } = await execPromise(
      "docker ps --format '{{.Names}}'",
    );
    log.debug("Running containers:", containersList);

    if (!containersList.includes(containerName)) {
      throw new Error(
        `Container '${containerName}' is not running on the host machine.`,
      );
    }

    log.debug(`Container '${containerName}' located.`);

    // Step 2: Shell into the container and modify the config file
    const sedCommand = `sed -i "s/FABRIC_LOGGING_SPEC=INFO/FABRIC_LOGGING_SPEC=${peerLogLevel}/g" /fabric-samples/test-network/compose/docker/docker-compose-test-net.yaml`;
    const dockerExecCommand = `docker exec ${containerName} /bin/bash -c "${sedCommand}"`;

    log.debug("Executing command to modify the log level:", dockerExecCommand);
    const { stdout, stderr } = await execPromise(dockerExecCommand);

    if (stderr) {
      log.warn("stderr from command:", stderr);
    }

    log.debug("Command executed successfully.", { stdout });
    log.info(
      `Log level for Fabric peers in container '${containerName}' set to '${peerLogLevel}'.`,
    );
  } catch (error) {
    log.error(
      "An error occurred while setting the Fabric peer log level:",
      error,
    );
    throw error; // Re-throw the error to ensure the caller is notified
  } finally {
    log.debug("EXIT");
  }
}
