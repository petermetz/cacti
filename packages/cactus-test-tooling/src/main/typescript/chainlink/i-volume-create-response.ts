/**
 * Credits to the maintainers of
 * Source: https://www.npmjs.com/package/@types/dockerode
 */
export interface IVolumeCreateResponse {
  Name: string;
  Driver: string;
  Mountpoint: string;
  CreatedAt?: string | undefined;
  Status?: { [key: string]: string } | undefined;
  Labels: { [label: string]: string };
  Scope: string;
  Options: { [key: string]: string };
  // Field is sometimes present, and sometimes null
  UsageData?:
    | {
        Size: number;
        RefCount: number;
      }
    | null
    | undefined;
}

export function isIVolumeCreateResponse(
  x: unknown,
): x is IVolumeCreateResponse {
  if (typeof x !== "object" || x === null) {
    return false;
  }

  const maybeVolume = x as IVolumeCreateResponse;

  return (
    typeof maybeVolume.Name === "string" &&
    typeof maybeVolume.Driver === "string" &&
    typeof maybeVolume.Mountpoint === "string" &&
    (maybeVolume.CreatedAt === undefined ||
      typeof maybeVolume.CreatedAt === "string") &&
    (maybeVolume.Status === undefined ||
      (typeof maybeVolume.Status === "object" &&
        maybeVolume.Status !== null &&
        Object.values(maybeVolume.Status).every(
          (value) => typeof value === "string",
        ))) &&
    typeof maybeVolume.Labels === "object" &&
    maybeVolume.Labels !== null &&
    Object.entries(maybeVolume.Labels).every(
      ([key, value]) => typeof key === "string" && typeof value === "string",
    ) &&
    typeof maybeVolume.Scope === "string" &&
    typeof maybeVolume.Options === "object" &&
    maybeVolume.Options !== null &&
    Object.entries(maybeVolume.Options).every(
      ([key, value]) => typeof key === "string" && typeof value === "string",
    ) &&
    (maybeVolume.UsageData === undefined ||
      maybeVolume.UsageData === null ||
      (typeof maybeVolume.UsageData === "object" &&
        maybeVolume.UsageData !== null &&
        typeof maybeVolume.UsageData.Size === "number" &&
        typeof maybeVolume.UsageData.RefCount === "number"))
  );
}
