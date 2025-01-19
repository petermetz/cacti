import "jest-extended";

import { createDefaultExecOffchainConfig } from "../../../../../main/typescript/ccip/common/create-default-exec-offchain-config";

function areEqual(first: Uint8Array, second: Uint8Array): boolean {
  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
}

describe("createDefaultExecOffchainConfig()", () => {
  it("Can produce byte equivalent input to the chainlink node's go code", async () => {
    const resultTypedArray = await createDefaultExecOffchainConfig();

    // The bytes extracted from the CCIP integration tests
    // If you change parameters inside the function this will change as well
    const expectedBytes = Uint8Array.from([
      123, 34, 83, 111, 117, 114, 99, 101, 70, 105, 110, 97, 108, 105, 116, 121,
      68, 101, 112, 116, 104, 34, 58, 48, 44, 34, 68, 101, 115, 116, 79, 112,
      116, 105, 109, 105, 115, 116, 105, 99, 67, 111, 110, 102, 105, 114, 109,
      97, 116, 105, 111, 110, 115, 34, 58, 49, 44, 34, 68, 101, 115, 116, 70,
      105, 110, 97, 108, 105, 116, 121, 68, 101, 112, 116, 104, 34, 58, 48, 44,
      34, 66, 97, 116, 99, 104, 71, 97, 115, 76, 105, 109, 105, 116, 34, 58, 53,
      48, 48, 48, 48, 48, 48, 44, 34, 82, 101, 108, 97, 116, 105, 118, 101, 66,
      111, 111, 115, 116, 80, 101, 114, 87, 97, 105, 116, 72, 111, 117, 114, 34,
      58, 48, 46, 48, 55, 44, 34, 73, 110, 102, 108, 105, 103, 104, 116, 67, 97,
      99, 104, 101, 69, 120, 112, 105, 114, 121, 34, 58, 34, 49, 109, 48, 115,
      34, 44, 34, 82, 111, 111, 116, 83, 110, 111, 111, 122, 101, 84, 105, 109,
      101, 34, 58, 34, 49, 109, 48, 115, 34, 44, 34, 66, 97, 116, 99, 104, 105,
      110, 103, 83, 116, 114, 97, 116, 101, 103, 121, 73, 68, 34, 58, 48, 44,
      34, 77, 101, 115, 115, 97, 103, 101, 86, 105, 115, 105, 98, 105, 108, 105,
      116, 121, 73, 110, 116, 101, 114, 118, 97, 108, 34, 58, 34, 48, 115, 34,
      125,
    ]);

    expect(areEqual(resultTypedArray, expectedBytes)).toBeTrue();
  });
});
