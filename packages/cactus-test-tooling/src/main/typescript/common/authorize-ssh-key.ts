import path from "node:path";
import Docker from "dockerode";
import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";

export interface IAuthorizeSshKeyOptions {
  readonly containerName: Readonly<string>;
  readonly publicKey: Readonly<string>;
  readonly logLevel: Readonly<LogLevelDesc>; // Optional log level
}

/**
 * Authorizes an SSH public key for a specified Docker container by adding it to the container's authorized_keys file.
 *
 * This function performs the following operations:
 * 1. Locates the specified container by name
 * 2. Creates the SSH directory structure if it doesn't exist
 * 3. Appends the provided public key to the authorized_keys file
 * 4. Sets appropriate security permissions on the SSH directory and authorized_keys file
 *
 * @param opts - Configuration options for SSH key authorization
 * @param opts.containerName - The name of the target Docker container
 * @param opts.publicKey - The SSH public key to be authorized
 * @param opts.logLevel - Optional logging level (defaults to "WARN")
 *
 * @throws {Error}
 * - If the specified container cannot be found
 * - If any step in the authorization process fails
 *
 * @example
 * ```typescript
 * await authorizeSshKey({
 *   containerName: "my-container",
 *   publicKey: "ssh-rsa AAAA...",
 *   logLevel: "DEBUG"
 * });
 * ```
 *
 * @remarks
 * - The function requires Docker API access
 * - The SSH key will be added to the root user's authorized_keys file
 * - Directory permissions are set to 700 for .ssh and 600 for authorized_keys
 * - All operations are performed as root within the container
 *
 * @returns Promise<void> Resolves when the SSH key has been successfully authorized
 */
export async function authorizeSshKey(
  opts: IAuthorizeSshKeyOptions,
): Promise<void> {
  const { containerName, publicKey, logLevel = "WARN" } = opts;

  const fn = "authorizeSshKey()";
  const log = LoggerProvider.getOrCreate({
    label: fn,
    level: logLevel,
  });

  log.debug(`Starting SSH key registration for container: "%s"`, containerName);

  const docker = new Docker();

  try {
    // Locate the container by exact match on its name
    const containers = await docker.listContainers({ all: true });
    const containerInfo = containers.find((container) =>
      container.Names.some((name) => name === `/${opts.containerName}`),
    );

    if (!containerInfo) {
      throw new Error(`Container with name "${opts.containerName}" not found.`);
    }

    const container = docker.getContainer(containerInfo.Id);

    // Create necessary paths for SSH keys
    const sshDirPath = "/root/.ssh";
    const authorizedKeysPath = path.join(sshDirPath, "authorized_keys");

    // Append the public key to the container's authorized_keys file
    await container
      .exec({
        Cmd: ["mkdir", "-p", sshDirPath],
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
      })
      .then((exec) => exec.start({}))
      .then((stream) => {
        log.debug(`SSH directory created at ${sshDirPath}`);
        stream.resume();
      });

    await container
      .exec({
        Cmd: ["sh", "-c", `echo "${publicKey}" >> ${authorizedKeysPath}`],
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
      })
      .then((exec) => exec.start({}))
      .then((stream) => {
        log.debug(`Public key added to ${authorizedKeysPath}`);
        stream.resume();
      });

    // Set appropriate permissions
    await container
      .exec({
        Cmd: ["chmod", "600", authorizedKeysPath],
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
      })
      .then((exec) => exec.start({}))
      .then((stream) => {
        log.debug(`Permissions set on ${authorizedKeysPath}`);
        stream.resume();
      });

    await container
      .exec({
        Cmd: ["chmod", "700", sshDirPath],
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
      })
      .then((exec) => exec.start({}))
      .then((stream) => {
        log.debug(`Permissions set on ${sshDirPath}`);
        stream.resume();
      });

    log.debug(`SSH key authorized for "%s" OK.`, containerName);
  } catch (cause: unknown) {
    const errorMsg = `SSH key authorization fail for container: ${containerName}`;
    log.debug(errorMsg, cause);
    throw new Error(errorMsg, { cause });
  }
}
