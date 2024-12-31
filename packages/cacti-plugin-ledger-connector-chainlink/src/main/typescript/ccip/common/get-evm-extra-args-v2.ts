import { ethers } from "ethers";

// bytes4(keccak256("CCIP EVMExtraArgsV2"));
export const EVM_V2_TAG_HEX = "0x181dcf10";

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
 */
export function getEVMExtraArgsV2(opts: {
  readonly gasLimit: Readonly<bigint>;
  readonly allowOutOfOrder: Readonly<boolean>;
}): Uint8Array {
  const encoder = ethers.AbiCoder.defaultAbiCoder();
  const evmV2Tag = Uint8Array.from(Buffer.from(EVM_V2_TAG_HEX, "hex"));

  const encodedExtraArgsAsString = encoder.encode(
    ["uint256", "bool"],
    [opts.gasLimit, opts.allowOutOfOrder],
  );

  const extraArgsAsBytes = ethers.getBytes(encodedExtraArgsAsString);

  const combinedBytes = new Uint8Array([...evmV2Tag, ...extraArgsAsBytes]);

  return combinedBytes;
}
