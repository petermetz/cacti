import { ethers } from "ethers";

export function mustEncodeAddress(address: string): Uint8Array {
  const encoder = ethers.AbiCoder.defaultAbiCoder();
  const encodedAsString = encoder.encode(["address"], [address]);

  return ethers.getBytes(encodedAsString);
}
