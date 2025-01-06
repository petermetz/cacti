import "jest-extended";

import { getEvmExtraArgsV1 } from "../../../../../main/typescript/ccip/common/get-evm-extra-args-v1";

function areEqual(first: Uint8Array, second: Uint8Array): boolean {
  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
}

describe("getEvmExtraArgsV1()", () => {
  it("Can produce byte equivalent input to the chainlink node's go code", () => {
    const resultTypedArray = getEvmExtraArgsV1({
      strict: false,
      gasLimit: BigInt(200003),
    });

    // The bytes extracted from the CCIP integration tests
    const expectedBytes = Uint8Array.from([
      151, 166, 87, 201, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 13, 67, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]);

    expect(areEqual(resultTypedArray, expectedBytes)).toBeTrue();
  });
});
