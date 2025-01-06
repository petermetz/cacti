import { ethers } from "ethers";

// bytes4(keccak256("CCIP EVMExtraArgsV1"));
export const EVM_V1_TAG_HEX = "97a657c9";

/**
 * File: `core/services/ocr2/plugins/ccip/testhelpers/ccip_contracts.go`
 *
 * ```go
 * func GetEVMExtraArgsV1(gasLimit *big.Int, strict bool) ([]byte, error) {
 *  EVMV1Tag := []byte{0x97, 0xa6, 0x57, 0xc9}
 *
 *  encodedArgs, err := utils.ABIEncode(`[{"type":"uint256"},{"type":"bool"}]`, gasLimit, strict)
 *  if err != nil {
 *   return nil, err
 *  }
 *
 *  return append(EVMV1Tag, encodedArgs...), nil
 * }
 * ```
 *
 * ```go
 * extraArgs, err := GetEVMExtraArgsV1(200003, false)
 * ```
 *
 * extraArgs
 * ```
 * []uint8 len: 68, cap: 80, [151,166,87,201,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,13,67,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
 * string(): "\x97\xa6W\xc9\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x03\rC\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
 * [0]: 151 = 0x97
 * [1]: 166 = 0xa6
 * [2]: 87 = 0x57
 * [3]: 201 = 0xc9
 * [4]: 0 = 0x0
 * [5]: 0 = 0x0
 * [6]: 0 = 0x0
 * [7]: 0 = 0x0
 * [8]: 0 = 0x0
 * [9]: 0 = 0x0
 * [10]: 0 = 0x0
 * [11]: 0 = 0x0
 * [12]: 0 = 0x0
 * [13]: 0 = 0x0
 * [14]: 0 = 0x0
 * [15]: 0 = 0x0
 * [16]: 0 = 0x0
 * [17]: 0 = 0x0
 * [18]: 0 = 0x0
 * [19]: 0 = 0x0
 * [20]: 0 = 0x0
 * [21]: 0 = 0x0
 * [22]: 0 = 0x0
 * [23]: 0 = 0x0
 * [24]: 0 = 0x0
 * [25]: 0 = 0x0
 * [26]: 0 = 0x0
 * [27]: 0 = 0x0
 * [28]: 0 = 0x0
 * [29]: 0 = 0x0
 * [30]: 0 = 0x0
 * [31]: 0 = 0x0
 * [32]: 0 = 0x0
 * [33]: 3 = 0x3
 * [34]: 13 = 0xd
 * [35]: 67 = 0x43
 * [36]: 0 = 0x0
 * [37]: 0 = 0x0
 * [38]: 0 = 0x0
 * [39]: 0 = 0x0
 * [40]: 0 = 0x0
 * [41]: 0 = 0x0
 * [42]: 0 = 0x0
 * [43]: 0 = 0x0
 * [44]: 0 = 0x0
 * [45]: 0 = 0x0
 * [46]: 0 = 0x0
 * [47]: 0 = 0x0
 * [48]: 0 = 0x0
 * [49]: 0 = 0x0
 * [50]: 0 = 0x0
 * [51]: 0 = 0x0
 * [52]: 0 = 0x0
 * [53]: 0 = 0x0
 * [54]: 0 = 0x0
 * [55]: 0 = 0x0
 * [56]: 0 = 0x0
 * [57]: 0 = 0x0
 * [58]: 0 = 0x0
 * [59]: 0 = 0x0
 * [60]: 0 = 0x0
 * [61]: 0 = 0x0
 * [62]: 0 = 0x0
 * [63]: 0 = 0x0
 * [64]: 0 = 0x0
 * [65]: 0 = 0x0
 * [66]: 0 = 0x0
 * [67]: 0 = 0x0
 * ```
 */
export function getEvmExtraArgsV1(opts: {
  readonly gasLimit: Readonly<bigint>;
  readonly strict: Readonly<boolean>;
}): Uint8Array {
  const encoder = ethers.AbiCoder.defaultAbiCoder();
  const evmV1TagBuffer = Buffer.from(EVM_V1_TAG_HEX, "hex");
  const evmV1TagBytes = Uint8Array.from(evmV1TagBuffer);

  const encodedExtraArgsAsString = encoder.encode(
    ["uint256", "bool"],
    [opts.gasLimit, opts.strict],
  );

  const extraArgsAsBytes = ethers.getBytes(encodedExtraArgsAsString);

  const combinedBytes = new Uint8Array([...evmV1TagBytes, ...extraArgsAsBytes]);

  return combinedBytes;
}
