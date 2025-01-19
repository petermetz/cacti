import { createCipheriv } from "node:crypto";

import { Keccak } from "sha3";
import { x25519 } from "@noble/curves/ed25519";

import { SharedSecretEncryptions } from "./shared-secret.go";

export const CURVE25519_POINT_SIZE = 32; // Size of X25519 public key
const SHARED_SECRET_SIZE = 16; // A 128-bit symmetric key

/**
 * Deterministically encrypt a shared secret for multiple recipients.
 *
 * **Input**
 * publicKeys => []types.ConfigEncryptionPublicKey len: 4, cap: 4,
 * [
 *   [220,21,105,115,248,131,175,1,62,7,253,34,17,221,4,211,166,188,64,86,212,218,150,23,110,3,191,164,143,37,231,55],
 *   [147,119,150,184,123,151,221,169,196,133,223,5,111,123,5,152,188,234,199,200,214,142,110,34,235,235,206,212,26,213,147,37],
 *   [62,158,215,41,40,70,134,209,10,202,234,190,99,123,95,5,127,59,154,226,179,144,165,192,105,141,144,230,19,20,26,55],
 *   [145,93,118,36,44,60,56,28,68,60,234,246,97,163,124,71,20,230,146,215,191,154,119,117,247,142,103,190,149,235,108,112]
 * ]
 * sharedSecret => *[16]uint8 [22,194,158,177,183,26,106,141,238,243,49,234,189,109,161,125]
 * ephemeralSk => *[32]uint8 [68,15,65,5,172,94,208,56,234,217,163,114,52,117,145,187,87,134,92,222,109,18,183,168,172,183,150,176,243,1,39,201]
 *
 * **Output**
 * config.SharedSecretEncryptions {
 * DiffieHellmanPoint: [32]uint8 [236,47,74,107,127,211,18,84,127,250,154,129,213,79,4,237,37,224,121,178,149,161,125,146,235,154,83,242,184,238,67,12],
 * SharedSecretHash: github.com/ethereum/go-ethereum/common.Hash [8,170,180,177,6,195,115,203,185,74,25,1,165,155,107,212,236,30,254,107,203,223,249,47,45,6,53,198,8,123,179,11],
 * Encryptions: []config.EncryptedSharedSecret len: 4, cap: 4, [
 *   [29,9,143,63,147,122,108,210,224,240,108,195,111,115,36,36],
 *   [47,176,47,99,132,16,138,126,52,229,155,72,111,223,68,150],
 *   [48,17,20,246,169,4,32,239,30,62,42,151,55,168,244,127],
 *   [214,44,64,111,195,69,148,15,67,40,240,48,126,161,139,253]
 * ]
 * }
 *
 * @param publicKeys Array of X25519 public keys (32 bytes each)
 * @param sharedSecret A 128-bit shared secret (16 bytes)
 * @param ephemeralSk A 256-bit ephemeral secret key (32 bytes)
 * @returns An object containing the DiffieHellmanPoint, sharedSecretHash, and encrypted secrets
 */
export async function encryptSharedSecretDeterministic(
  publicKeys: Readonly<Array<Uint8Array>>,
  sharedSecret: Uint8Array,
  ephemeralSk: Uint8Array,
): Promise<SharedSecretEncryptions> {
  if (ephemeralSk.length !== 32) {
    throw new Error("ephemeralSk must be 32 bytes");
  }
  if (sharedSecret.length !== SHARED_SECRET_SIZE) {
    throw new Error(`sharedSecret must be ${SHARED_SECRET_SIZE} bytes`);
  }
  if (!Array.isArray(publicKeys)) {
    throw new Error("publicKeys must be an array");
  }
  if (publicKeys.length < 1) {
    throw new Error("publicKeys cannot be an empty array");
  }
  if (!publicKeys.every((pk) => pk.length === CURVE25519_POINT_SIZE)) {
    throw new Error(`Each public key must be ${CURVE25519_POINT_SIZE} bytes`);
  }
  const basepoint = new Uint8Array(32);
  basepoint[0] = 9;

  const ephemeralPk = await x25519SharedSecret(ephemeralSk, basepoint);

  const sharedSecretBuffer = Buffer.from(sharedSecret);
  // Compute sharedSecretHash
  const sharedSecretHashBuffer = new Keccak(256)
    .update(sharedSecretBuffer)
    .digest();

  const sharedSecretHashBytes = Uint8Array.from(sharedSecretHashBuffer);

  // Encrypt sharedSecret for each public key
  const encryptionsPromises: Array<Promise<Uint8Array>> = publicKeys.map(
    async (aPublicKey) => {
      const dhPoint = await x25519SharedSecret(ephemeralSk, aPublicKey); // Diffie-Hellman key exchange
      const dhpBuffer = Buffer.from(dhPoint);
      const key = new Keccak(256).update(dhpBuffer).digest().subarray(0, 16); // Keccak256, truncated to 16 bytes

      return aesEncryptBlock(key, sharedSecret); // Encrypt sharedSecret with the derived key
    },
  );

  const encryptions = await Promise.all(encryptionsPromises);

  return new SharedSecretEncryptions(
    ephemeralPk,
    sharedSecretHashBytes,
    encryptions,
  );
}

export async function x25519SharedSecret(
  scalar: Uint8Array,
  point: Uint8Array,
): Promise<Uint8Array> {
  return x25519.getSharedSecret(scalar, point);
}

/**
 * Encrypt a shared secret using a random ephemeral key.
 */
export async function encryptSharedSecret(
  keys: Readonly<Array<Uint8Array>>,
  sharedSecret: Uint8Array,
): Promise<SharedSecretEncryptions> {
  const ephemeralSk = crypto.getRandomValues(new Uint8Array(32));
  return encryptSharedSecretDeterministic(keys, sharedSecret, ephemeralSk);
}

/**
 * Encrypt a single block with AES-128 in ECB mode.
 *
 * Input:
 * key => []uint8 len: 16, cap: 32, [68,157,134,77,152,64,41,152,241,82,38,178,117,120,52,203]
 * plaintext => []uint8 len: 16, cap: 16, [12,45,16,244,145,194,102,147,121,57,35,222,235,69,54,98]
 * Expected output:
 * ciphertext => [16]uint8 [103,52,204,28,98,192,29,104,94,32,236,251,216,240,95,224]
 */
export async function aesEncryptBlock(
  key: Uint8Array,
  plaintext: Uint8Array,
): Promise<Uint8Array> {
  if (key.length !== 16) {
    throw new Error("Key must be 16 bytes long");
  }
  if (plaintext.length !== 16) {
    throw new Error("Plaintext must be 16 bytes long");
  }

  const cipher = createCipheriv("aes-128-ecb", key, null); // AES-128-ECB does not use an IV
  const encrypted = cipher.update(plaintext);
  return new Uint8Array(encrypted);
}
