import { ethers } from "ethers";

/**
 * The expected input and output pairs are shown below as taken from the Go code
 * of the Chainlink integration tests:
 *
 *```go
 * "0xf806dd1bf22c783fd1da7e8239d75e76dac6723d"
 *
 * [0] =
 * 248 = 0xf8
 * [1] =
 * 6 = 0x6
 * [2] =
 * 221 = 0xdd
 * [3] =
 * 27 = 0x1b
 * [4] =
 * 242 = 0xf2
 * [5] =
 * 44 = 0x2c
 * [6] =
 * 120 = 0x78
 * [7] =
 * 63 = 0x3f
 * [8] =
 * 209 = 0xd1
 * [9] =
 * 218 = 0xda
 * [10] =
 * 126 = 0x7e
 * [11] =
 * 130 = 0x82
 * [12] =
 * 57 = 0x39
 * [13] =
 * 215 = 0xd7
 * [14] =
 * 94 = 0x5e
 * [15] =
 * 118 = 0x76
 * [16] =
 * 218 = 0xda
 * [17] =
 * 198 = 0xc6
 *[18] =
 * 114 = 0x72
 * [19] =
 * 61 = 0x3d
 * ccipTH.Dest.Receivers[0].Receiver.address
 * common.Address [248,6,221,27,242,44,120,63,209,218,126,130,57,215,94,118,218,198,114,61]
 * ```
 *
 * ```go
 * msg.Receiver
 * []uint8 len: 32, cap: 60, [0,0,0,0,0,0,0,0,0,0,0,0,248,6,221,27,242,44,120,63,209,218,126,130,57,215,94,118,218,198,114,61]
 * ```
 */
export function mustEncodeAddress(address: string): Uint8Array {
  const encoder = ethers.AbiCoder.defaultAbiCoder();
  const encodedAsString = encoder.encode(["address"], [address]);

  return ethers.getBytes(encodedAsString);
}
