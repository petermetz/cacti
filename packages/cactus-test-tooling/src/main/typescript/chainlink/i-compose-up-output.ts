import Dockerode, { Network } from "dockerode";

import {
  isIVolumeCreateResponse,
  IVolumeCreateResponse,
} from "./i-volume-create-response";

/**
 * Credits to the maintainers of
 * Source: https://www.npmjs.com/package/@types/dockerode-compose
 */
export interface IComposeUpOutput {
  file: string;
  secrets: unknown[];
  volumes: IVolumeCreateResponse[];
  configs: unknown[];
  networks: Network[];
  services: Dockerode.Container[];
}

export function isIComposeUpOutput(x: unknown): x is IComposeUpOutput {
  if (typeof x !== "object" || x === null) {
    return false;
  }

  const maybeOutput = x as IComposeUpOutput;

  return (
    typeof maybeOutput.file === "string" &&
    Array.isArray(maybeOutput.secrets) &&
    Array.isArray(maybeOutput.volumes) &&
    maybeOutput.volumes.every(
      (volume) => isIVolumeCreateResponse(volume), // Ensure you define this type guard
    ) &&
    Array.isArray(maybeOutput.configs) &&
    Array.isArray(maybeOutput.networks) &&
    maybeOutput.networks.every((network) => network instanceof Network) &&
    Array.isArray(maybeOutput.services) &&
    maybeOutput.services.every(
      (service) => service instanceof Dockerode.Container,
    )
  );
}
