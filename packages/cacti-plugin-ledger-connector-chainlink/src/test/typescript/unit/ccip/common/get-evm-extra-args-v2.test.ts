import "jest-extended";

import { getEvmExtraArgsV2 } from "../../../../../main/typescript/ccip/common/get-evm-extra-args-v2";

function areEqual(first: Uint8Array, second: Uint8Array): boolean {
  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
}

describe("getEvmExtraArgsV2()", () => {
  it("Can produce byte equivalent input to the chainlink node's go code", () => {
    const resultTypedArray = getEvmExtraArgsV2({
      allowOutOfOrder: true,
      gasLimit: BigInt(200003),
    });

    // The bytes extracted from the CCIP integration tests
    const expectedBytes = Uint8Array.from([
      24, 29, 207, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 13, 67, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    ]);

    expect(areEqual(resultTypedArray, expectedBytes)).toBeTrue();
  });
});
