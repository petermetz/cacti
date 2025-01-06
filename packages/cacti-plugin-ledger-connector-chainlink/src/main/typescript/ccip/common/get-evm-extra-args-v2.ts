import { ethers } from "ethers";

// bytes4(keccak256("CCIP EVMExtraArgsV2"));
export const EVM_V2_TAG_HEX = "181dcf10";

/**
 * File: `core/services/ocr2/plugins/ccip/testhelpers/ccip_contracts.go`
 *
 * ```go
 * func GetEVMExtraArgsV2(gasLimit *big.Int, allowOutOfOrder bool) ([]byte, error) {
 *   // see Client.sol.
 *   EVMV2Tag := hexutil.MustDecode("0x181dcf10")
 *
 *   encodedArgs, err := utils.ABIEncode(`[{"type":"uint256"},{"type":"bool"}]`, gasLimit, allowOutOfOrder)
 *   if err != nil {
 *     return nil, err
 *   }
 *
 *   return append(EVMV2Tag, encodedArgs...), nil
 * }
 * ```
 *
 * Debug Captures from an invocation of `GetEVMExtraArgsV2(200003, true)`
 *
 * `200003 = 0x30d43`
 *
 * encodedArgs
 *```
 * []uint8 len: 64, cap: 76, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,13,67,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
 * string(): "\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x03\rC\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01"
 * [0]: 0 = 0x0
 * [1]: 0 = 0x0
 * [2]: 0 = 0x0
 * [3]: 0 = 0x0
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
 * [29]: 3 = 0x3
 * [30]: 13 = 0xd
 * [31]: 67 = 0x43
 * [32]: 0 = 0x0
 * [33]: 0 = 0x0
 * [34]: 0 = 0x0
 * [35]: 0 = 0x0
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
 * [63]: 1 = 0x1
 *```
 *
 * EVMV2Tag
 * ```
 * []uint8 len: 4, cap: 4, [24,29,207,16]
 * string() =
 * "\x18\x1d\xcf\x10"
 * [0] =
 * 24 = 0x18
 * [1] =
 * 29 = 0x1d
 * [2] =
 * 207 = 0xcf
 * [3] =
 * 16 = 0x10
 * ```
 *
 * returnValue
 * ```
 * []uint8 len: 68, cap: 80, [24,29,207,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,13,67,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
 * string(): "\x18\x1d\xcf\x10\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x03\rC\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01"
 * [0]: 24 = 0x18
 * [1]: 29 = 0x1d
 * [2]: 207 = 0xcf
 * [3]: 16 = 0x10
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
 * [67]: 1 = 0x1
 * ```
 */
export function getEvmExtraArgsV2(opts: {
  readonly gasLimit: Readonly<bigint>;
  readonly allowOutOfOrder: Readonly<boolean>;
}): Uint8Array {
  const encoder = ethers.AbiCoder.defaultAbiCoder();
  const evmV2TagBuffer = Buffer.from(EVM_V2_TAG_HEX, "hex");
  const evmV2TagBytes = Uint8Array.from(evmV2TagBuffer);

  const encodedExtraArgsAsString = encoder.encode(
    ["uint256", "bool"],
    [opts.gasLimit, opts.allowOutOfOrder],
  );

  const extraArgsAsBytes = ethers.getBytes(encodedExtraArgsAsString);

  const combinedBytes = new Uint8Array([...evmV2TagBytes, ...extraArgsAsBytes]);

  return combinedBytes;
}
