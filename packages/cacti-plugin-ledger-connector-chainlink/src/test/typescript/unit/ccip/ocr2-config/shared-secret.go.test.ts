import { Keccak } from "sha3";
import * as crypto from "crypto";

import { SharedSecretEncryptions } from "../../../../../main/typescript/ccip/ocr2-config/shared-secret.go";
import { E_MSG_DSS_WRONG_HASH } from "../../../../../main/typescript/ccip/ocr2-config/shared-secret.go";

// Mock implementation of OffchainKeyring
class MockOffchainKeyring {
  private secretKey: Uint8Array;

  constructor(secretKey: Uint8Array) {
    this.secretKey = secretKey;
  }

  configDiffieHellman(point: Uint8Array): Uint8Array {
    // Mock implementation of DH key exchange
    const sharedKey = point.map(
      (byte, index) => byte ^ this.secretKey[index % this.secretKey.length],
    );
    return new Uint8Array(sharedKey);
  }
}

// Helper to compute keccak256 hash
const keccak256 = (data: Uint8Array): Uint8Array => {
  const hash = new Keccak(256);
  hash.update(Buffer.from(data));
  return new Uint8Array(hash.digest());
};

describe("SharedSecretEncryptions", () => {
  it("should decrypt and verify the shared secret correctly", () => {
    const diffieHellmanPoint = new Uint8Array(32).fill(0x02); // Example DH point
    const sharedSecret = new Uint8Array(16).fill(0x42); // Example shared secret
    const secretKey = new Uint8Array(16).fill(0x12); // Mock oracle's secret key

    // Create a keyring
    const keyring = new MockOffchainKeyring(secretKey);

    // Derive encryption key
    const dhSharedKey = keyring.configDiffieHellman(diffieHellmanPoint);
    const encryptionKey = keccak256(dhSharedKey).slice(0, 16);

    // Encrypt the shared secret
    const cipher = crypto.createCipheriv("aes-128-ecb", encryptionKey, null);
    cipher.setAutoPadding(false);
    const encryptedSecret = new Uint8Array(
      Buffer.concat([cipher.update(sharedSecret), cipher.final()]),
    );

    // Hash the shared secret
    const sharedSecretHash = keccak256(sharedSecret);

    // Create the SharedSecretEncryptions instance
    const encryptions = [encryptedSecret];
    const sharedSecretEncryptions = new SharedSecretEncryptions(
      diffieHellmanPoint,
      sharedSecretHash,
      encryptions,
    );

    // Decrypt the shared secret
    const decryptedSharedSecret = sharedSecretEncryptions.decrypt(0, keyring);

    // Assertions
    expect(decryptedSharedSecret).not.toBeNull();
    if (!decryptedSharedSecret) {
      throw new Error("decryptedSharedSecret was falsy after decrypt() call");
    }
    expect(new Uint8Array(decryptedSharedSecret)).toEqual(sharedSecret);
  });

  it("should throw an error if the shared secret hash is incorrect", () => {
    const diffieHellmanPoint = new Uint8Array(32).fill(0x02); // Example DH point
    const sharedSecret = new Uint8Array(16).fill(0x42); // Example shared secret
    const secretKey = new Uint8Array(16).fill(0x12); // Mock oracle's secret key

    // Create a keyring
    const keyring = new MockOffchainKeyring(secretKey);

    // Derive encryption key
    const dhSharedKey = keyring.configDiffieHellman(diffieHellmanPoint);
    const encryptionKey = keccak256(dhSharedKey).slice(0, 16);

    // Encrypt the shared secret
    const cipher = crypto.createCipheriv("aes-128-ecb", encryptionKey, null);
    cipher.setAutoPadding(false);
    const encryptedSecret = new Uint8Array(
      Buffer.concat([cipher.update(sharedSecret), cipher.final()]),
    );

    // Tamper with the shared secret hash
    const tamperedHash = keccak256(
      new Uint8Array(sharedSecret.map((byte) => byte ^ 0x01)),
    );

    // Create the SharedSecretEncryptions instance with tampered hash
    const encryptions = [encryptedSecret];
    const sharedSecretEncryptions = new SharedSecretEncryptions(
      diffieHellmanPoint,
      tamperedHash,
      encryptions,
    );

    // Expect decryption to throw an error
    const tryDecryptingWithWrongHash = () =>
      sharedSecretEncryptions.decrypt(0, keyring);

    expect(tryDecryptingWithWrongHash).toThrow(E_MSG_DSS_WRONG_HASH);
  });
});
