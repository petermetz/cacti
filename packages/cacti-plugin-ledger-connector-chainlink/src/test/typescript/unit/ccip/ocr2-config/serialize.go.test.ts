import {
  checkSize,
  serialize,
  enprotoSharedSecretEncryptions,
  enprotoOffchainConfig,
  MAX_SERIALIZED_OFFCHAIN_CONFIG_SIZE_IN_BYTES,
} from "../../../../../main/typescript/ccip/ocr2-config/serialize.go";
import { SharedSecretEncryptions } from "../../../../../main/typescript/ccip/ocr2-config/shared-secret.go";
import { OffchainConfigProto } from "../../../../../main/typescript/generated/proto/ts-proto/ccip/offchainreporting2_monitoring_offchain_config";

describe("Utility Functions", () => {
  describe("checkSize", () => {
    it("should return null if size is within the limit", () => {
      const validBytes = new Uint8Array(
        MAX_SERIALIZED_OFFCHAIN_CONFIG_SIZE_IN_BYTES - 1,
      );
      expect(checkSize(validBytes)).toBeNull();
    });

    it("should return an error if size exceeds the limit", () => {
      const oversizedBytes = new Uint8Array(
        MAX_SERIALIZED_OFFCHAIN_CONFIG_SIZE_IN_BYTES + 1,
      );
      const error = checkSize(oversizedBytes);
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toContain("OffchainConfig length is");
    });
  });

  describe("serialize", () => {
    it("should serialize valid OffchainConfigProto objects", () => {
      const validProto: OffchainConfigProto = {
        deltaProgressNanoseconds: 100n,
        deltaResendNanoseconds: 100n,
        deltaRoundNanoseconds: 100n,
        deltaGraceNanoseconds: 100n,
        deltaStageNanoseconds: 100n,
        rMax: 5,
        s: [1, 2, 3],
        offchainPublicKeys: [new Uint8Array([1, 2])],
        peerIds: ["peer1"],
        reportingPluginConfig: new Uint8Array([0]),
        maxDurationQueryNanoseconds: 100n,
        maxDurationObservationNanoseconds: 100n,
        maxDurationReportNanoseconds: 100n,
        maxDurationShouldAcceptFinalizedReportNanoseconds: 100n,
        maxDurationShouldTransmitAcceptedReportNanoseconds: 100n,
        sharedSecretEncryptions: undefined,
        maxDurationInitializationNanoseconds: undefined,
      };

      const serialized = serialize(validProto);
      expect(serialized).toBeInstanceOf(Uint8Array);
    });

    it("should throw an error for oversized serialized OffchainConfigProto", () => {
      const oversizedProto: OffchainConfigProto = {
        ...OffchainConfigProto.create(),
        reportingPluginConfig: new Uint8Array(
          MAX_SERIALIZED_OFFCHAIN_CONFIG_SIZE_IN_BYTES + 1,
        ),
      };

      expect(() => serialize(oversizedProto)).toThrow(
        "OffchainConfig length is",
      );
    });
  });

  describe("enprotoSharedSecretEncryptions", () => {
    it("should create a valid SharedSecretEncryptionsProto object", () => {
      const pojo = new SharedSecretEncryptions(
        new Uint8Array([1]),
        new Uint8Array([2]),
        [new Uint8Array([3])],
      );

      const result = enprotoSharedSecretEncryptions(pojo);
      expect(result).toEqual(pojo);
    });
  });

  describe("enprotoOffchainConfig", () => {
    it("should create a valid OffchainConfigProto object", () => {
      const pojo = OffchainConfigProto.create();

      const result = enprotoOffchainConfig(pojo);
      expect(result).toEqual(pojo);
    });
  });
});
