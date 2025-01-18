import { OffchainConfigProto } from "../../generated/proto/ts-proto/ccip/offchainreporting2_monitoring_offchain_config";
import { SharedSecretEncryptionsProto } from "../../generated/proto/ts-proto/ccip/offchainreporting2_monitoring_offchain_config";
import { SharedSecretEncryptions } from "./shared-secret.go";

export const MAX_SERIALIZED_OFFCHAIN_CONFIG_SIZE_IN_BYTES = 2_000_000;

export function checkSize(ocpBytes: Uint8Array): Error | null {
  if (ocpBytes.length <= MAX_SERIALIZED_OFFCHAIN_CONFIG_SIZE_IN_BYTES) {
    return null;
  } else {
    return new Error(
      `OffchainConfig length is ${ocpBytes.length} bytes which is greater than the max ${MAX_SERIALIZED_OFFCHAIN_CONFIG_SIZE_IN_BYTES}`,
    );
  }
}

export function serialize(oc: OffchainConfigProto): Uint8Array {
  const binaryWriter = OffchainConfigProto.encode(oc);
  const ocpBytes = binaryWriter.finish();
  const error = checkSize(ocpBytes);
  if (error) {
    throw error;
  }
  return ocpBytes;
}

// This function serializes the SharedSecretEncryptions object into the protobuf format
export function enprotoSharedSecretEncryptions(
  pojo: SharedSecretEncryptions,
): SharedSecretEncryptionsProto {
  return SharedSecretEncryptionsProto.create({
    diffieHellmanPoint: pojo.diffieHellmanPoint,
    encryptions: pojo.encryptions,
    sharedSecretHash: pojo.sharedSecretHash,
  });
}

export function enprotoOffchainConfig(
  pojo: OffchainConfigProto,
): OffchainConfigProto {
  return OffchainConfigProto.create(pojo);
}
