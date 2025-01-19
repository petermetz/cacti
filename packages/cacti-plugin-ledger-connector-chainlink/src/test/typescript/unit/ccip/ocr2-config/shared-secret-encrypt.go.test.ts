import * as crypto from "crypto";

// import { SharedSecretEncryptions } from "../../../../../main/typescript/ccip/ocr2-config/shared-secret.go";
import {
  aesEncryptBlock,
  encryptSharedSecretDeterministic,
  encryptSharedSecret,
  x25519SharedSecret,
  CURVE25519_POINT_SIZE,
} from "../../../../../main/typescript/ccip/ocr2-config/shared-secret-encrypt.go";
import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";

describe("encryptSharedSecret Functions", () => {
  const ScalarSize = 32;
  const logLevel: LogLevelDesc = "INFO";
  const log = LoggerProvider.getOrCreate({
    label: "shared-secret-encrypt.go.test.ts",
    level: logLevel,
  });
  const curves = crypto.getCurves();
  log.info("The supported curves on this NodeJS: %s", JSON.stringify(curves));

  describe("x25519", () => {
    it("generates correct Diffie–Hellman shared secret - basepoint", async () => {
      const ephemeralSk = new Uint8Array([
        68, 15, 65, 5, 172, 94, 208, 56, 234, 217, 163, 114, 52, 117, 145, 187,
        87, 134, 92, 222, 109, 18, 183, 168, 172, 183, 150, 176, 243, 1, 39,
        201,
      ]);

      const expectedEphemeralPk = Uint8Array.from([
        236, 47, 74, 107, 127, 211, 18, 84, 127, 250, 154, 129, 213, 79, 4, 237,
        37, 224, 121, 178, 149, 161, 125, 146, 235, 154, 83, 242, 184, 238, 67,
        12,
      ]);

      const basepoint = new Uint8Array(32);
      basepoint[0] = 9;

      const ephemeralPk = await x25519SharedSecret(ephemeralSk, basepoint);

      expect(ephemeralPk).toEqual(expectedEphemeralPk);
    });
  });

  describe("encryptSharedSecretDeterministic", () => {
    it("encrypts the shared secret deterministically", async () => {
      // Constants for the test case
      const publicKeys: Uint8Array[] = [
        new Uint8Array([
          220, 21, 105, 115, 248, 131, 175, 1, 62, 7, 253, 34, 17, 221, 4, 211,
          166, 188, 64, 86, 212, 218, 150, 23, 110, 3, 191, 164, 143, 37, 231,
          55,
        ]),
        new Uint8Array([
          147, 119, 150, 184, 123, 151, 221, 169, 196, 133, 223, 5, 111, 123, 5,
          152, 188, 234, 199, 200, 214, 142, 110, 34, 235, 235, 206, 212, 26,
          213, 147, 37,
        ]),
        new Uint8Array([
          62, 158, 215, 41, 40, 70, 134, 209, 10, 202, 234, 190, 99, 123, 95, 5,
          127, 59, 154, 226, 179, 144, 165, 192, 105, 141, 144, 230, 19, 20, 26,
          55,
        ]),
        new Uint8Array([
          145, 93, 118, 36, 44, 60, 56, 28, 68, 60, 234, 246, 97, 163, 124, 71,
          20, 230, 146, 215, 191, 154, 119, 117, 247, 142, 103, 190, 149, 235,
          108, 112,
        ]),
      ];
      const sharedSecret = new Uint8Array([
        22, 194, 158, 177, 183, 26, 106, 141, 238, 243, 49, 234, 189, 109, 161,
        125,
      ]);
      const ephemeralSk = new Uint8Array([
        68, 15, 65, 5, 172, 94, 208, 56, 234, 217, 163, 114, 52, 117, 145, 187,
        87, 134, 92, 222, 109, 18, 183, 168, 172, 183, 150, 176, 243, 1, 39,
        201,
      ]);

      // Expected outputs
      const expectedDiffieHellmanPoint = new Uint8Array([
        236, 47, 74, 107, 127, 211, 18, 84, 127, 250, 154, 129, 213, 79, 4, 237,
        37, 224, 121, 178, 149, 161, 125, 146, 235, 154, 83, 242, 184, 238, 67,
        12,
      ]);

      const expectedSharedSecretHash = Uint8Array.from([
        8, 170, 180, 177, 6, 195, 115, 203, 185, 74, 25, 1, 165, 155, 107, 212,
        236, 30, 254, 107, 203, 223, 249, 47, 45, 6, 53, 198, 8, 123, 179, 11,
      ]);

      const expectedEncryptions = [
        new Uint8Array([
          29, 9, 143, 63, 147, 122, 108, 210, 224, 240, 108, 195, 111, 115, 36,
          36,
        ]),
        new Uint8Array([
          47, 176, 47, 99, 132, 16, 138, 126, 52, 229, 155, 72, 111, 223, 68,
          150,
        ]),
        new Uint8Array([
          48, 17, 20, 246, 169, 4, 32, 239, 30, 62, 42, 151, 55, 168, 244, 127,
        ]),
        new Uint8Array([
          214, 44, 64, 111, 195, 69, 148, 15, 67, 40, 240, 48, 126, 161, 139,
          253,
        ]),
      ];

      const result = await encryptSharedSecretDeterministic(
        publicKeys,
        sharedSecret,
        ephemeralSk,
      );

      // Assertions
      expect(result.diffieHellmanPoint).toEqual(expectedDiffieHellmanPoint);
      expect(result.encryptions[0]).toEqual(expectedEncryptions[0]);
      expect(result.encryptions[1]).toEqual(expectedEncryptions[1]);
      expect(result.encryptions[2]).toEqual(expectedEncryptions[2]);
      expect(result.encryptions[3]).toEqual(expectedEncryptions[3]);
      expect(result.sharedSecretHash).toEqual(expectedSharedSecretHash);
    });

    it("should throw an error for invalid public key size", async () => {
      const ephemeralSk = crypto.randomBytes(ScalarSize);
      const sharedSecret = crypto.randomBytes(16);
      const publicKeys = [crypto.randomBytes(31)]; // Invalid public key size

      const invalidPkProvided = encryptSharedSecretDeterministic(
        publicKeys,
        sharedSecret,
        ephemeralSk,
      );
      const expectedErrorMessage = `Each public key must be ${CURVE25519_POINT_SIZE} bytes`;
      await expect(invalidPkProvided).rejects.toMatchObject({
        message: expect.stringContaining(expectedErrorMessage),
      });
    });
  });

  describe("encryptSharedSecret", () => {
    it("should throw an error if no public keys are provided", async () => {
      const sharedSecret = crypto.randomBytes(16);
      const publicKeys: Uint8Array[] = [];

      const emptyPublicKeyProvided = encryptSharedSecret(
        publicKeys,
        sharedSecret,
      );
      await expect(emptyPublicKeyProvided).rejects.toMatchObject({
        message: expect.stringContaining("publicKeys cannot be an empty array"),
      });
    });
  });

  describe("aesEncryptBlock", () => {
    it("should encrypt a block of plaintext correctly", async () => {
      const key = new Uint8Array([
        68, 157, 134, 77, 152, 64, 41, 152, 241, 82, 38, 178, 117, 120, 52, 203,
      ]);
      const plaintext = new Uint8Array([
        12, 45, 16, 244, 145, 194, 102, 147, 121, 57, 35, 222, 235, 69, 54, 98,
      ]);
      const expectedCiphertext = new Uint8Array([
        103, 52, 204, 28, 98, 192, 29, 104, 94, 32, 236, 251, 216, 240, 95, 224,
      ]);

      const ciphertext = await aesEncryptBlock(key, plaintext);

      expect(ciphertext).toEqual(expectedCiphertext);
    });
  });
});
