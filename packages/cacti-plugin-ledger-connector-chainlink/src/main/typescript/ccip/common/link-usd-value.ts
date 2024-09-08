/**
 * Inspired by the similarly named function defined in:
 * `core/services/ocr2/plugins/ccip/testhelpers/ccip_contracts.go`
 */
export function linkUSDValue(amount: bigint): bigint {
  return BigInt(1e18) * amount;
}
