import { ethers } from "ethers";

// bytes4(keccak256("CCIP EVMExtraArgsV1"));
export const EVM_V1_TAG_HEX = "0x97a657c9";

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
 */
export function getEVMExtraArgsV1(opts: {
  readonly gasLimit: Readonly<bigint>;
  readonly strict: Readonly<boolean>;
}): Uint8Array {
  const encoder = ethers.AbiCoder.defaultAbiCoder();
  const evmV2Tag = Uint8Array.from(Buffer.from(EVM_V1_TAG_HEX, "hex"));

  const encodedExtraArgsAsString = encoder.encode(
    ["uint256", "bool"],
    [opts.gasLimit, opts.strict],
  );

  const extraArgsAsBytes = ethers.getBytes(encodedExtraArgsAsString);

  const combinedBytes = new Uint8Array([...evmV2Tag, ...extraArgsAsBytes]);

  return combinedBytes;
}
