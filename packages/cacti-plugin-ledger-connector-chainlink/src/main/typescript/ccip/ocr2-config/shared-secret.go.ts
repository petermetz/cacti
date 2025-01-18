import * as crypto from "crypto";
import { keccak256 } from "js-sha3";

const SHARED_SECRET_SIZE = 16; // A 128-bit symmetric key
type EncryptedSharedSecret = Uint8Array;

export const E_MSG_DSS_WRONG_HASH = "Decrypted sharedSecret has wrong hash";

// Source: `/home/user/.gvm/pkgsets/go1.23.3/global/pkg/mod/github.com/smartcontractkit/libocr@v0.0.0-20241007185508-adbe57025f12/offchainreporting2plus/internal/config/shared_secret.go`
//
// SharedSecretEncryptions is the encryptions of SharedConfig.SharedSecret,
// using each oracle's SharedSecretEncryptionPublicKey.
//
// We use a custom encryption scheme to be more space-efficient (compared to
// standard AEAD schemes, nacl crypto_box, etc...), which saves gas in
// transmission to the OCR2Aggregator.
export class SharedSecretEncryptions {
  // (secret key chosen by dealer) * g, X25519 point
  diffieHellmanPoint: Uint8Array;

  // keccak256 of plaintext sharedSecret.
  //
  // Since SharedSecretEncryptions are shared through a smart contract, each
  // oracle will see the same sharedSecretHash. After decryption, oracles can
  // check their sharedSecret against sharedSecretHash to prevent the dealer
  // from equivocating
  sharedSecretHash: Uint8Array;

  // Encryptions of the shared secret with one entry for each oracle.
  encryptions: EncryptedSharedSecret[];

  constructor(
    diffieHellmanPoint: Uint8Array,
    sharedSecretHash: Uint8Array,
    encryptions: EncryptedSharedSecret[],
  ) {
    this.diffieHellmanPoint = diffieHellmanPoint;
    this.sharedSecretHash = sharedSecretHash;
    this.encryptions = encryptions;
  }

  // Check equality of SharedSecretEncryptions objects
  equals(other: SharedSecretEncryptions): boolean {
    if (this.encryptions.length !== other.encryptions.length) {
      return false;
    }
    for (let i = 0; i < this.encryptions.length; i++) {
      if (
        !this.encryptions[i].every(
          (val, index) => val === other.encryptions[i][index],
        )
      ) {
        return false;
      }
    }
    return (
      this.diffieHellmanPoint.every(
        (val, index) => val === other.diffieHellmanPoint[index],
      ) &&
      this.sharedSecretHash.every(
        (val, index) => val === other.sharedSecretHash[index],
      )
    );
  }

  // Decrypt one block with AES-128
  static aesDecryptBlock(key: Uint8Array, ciphertext: Uint8Array): Uint8Array {
    if (key.length !== SHARED_SECRET_SIZE) {
      throw new Error("Key has wrong length");
    }
    if (ciphertext.length !== SHARED_SECRET_SIZE) {
      throw new Error("Ciphertext has wrong length");
    }

    const decipher = crypto.createDecipheriv("aes-128-ecb", key, null);
    decipher.setAutoPadding(false);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  }

  // Decrypt returns the sharedSecret
  decrypt(oracleId: number, keyring: OffchainKeyring): Uint8Array | null {
    if (this.encryptions.length <= oracleId) {
      throw new Error(
        "Oracle ID out of range of SharedSecretEncryptions.encryptions",
      );
    }

    const dhPoint = keyring.configDiffieHellman(this.diffieHellmanPoint);
    const key = new Uint8Array(
      Buffer.from(keccak256.arrayBuffer(dhPoint)).subarray(0, 16),
    );

    const sharedSecret = SharedSecretEncryptions.aesDecryptBlock(
      key,
      this.encryptions[oracleId],
    );

    const sharedSecretHash = new Uint8Array(
      Buffer.from(keccak256.arrayBuffer(sharedSecret)),
    );
    if (
      !sharedSecretHash.every(
        (val, index) => val === this.sharedSecretHash[index],
      )
    ) {
      throw new Error(E_MSG_DSS_WRONG_HASH);
    }

    return sharedSecret;
  }
}

interface OffchainKeyring {
  configDiffieHellman(point: Uint8Array): Uint8Array;
}
