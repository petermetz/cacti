import "jest-extended";

import { createDefaultCommitOffchainConfig } from "../../../../../main/typescript/ccip/common/create-default-commit-offchain-config";

function areEqual(first: Uint8Array, second: Uint8Array): boolean {
  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
}

describe("createDefaultCommitOffchainConfig()", () => {
  it("Can produce byte equivalent input to the chainlink node's go code", async () => {
    const resultTypedArray = await createDefaultCommitOffchainConfig();

    // The bytes extracted from the CCIP integration tests
    // If you change parameters inside the function this will change as well
    const expectedBytes = Uint8Array.from([
      123, 34, 83, 111, 117, 114, 99, 101, 70, 105, 110, 97, 108, 105, 116, 121,
      68, 101, 112, 116, 104, 34, 58, 48, 44, 34, 68, 101, 115, 116, 70, 105,
      110, 97, 108, 105, 116, 121, 68, 101, 112, 116, 104, 34, 58, 48, 44, 34,
      71, 97, 115, 80, 114, 105, 99, 101, 72, 101, 97, 114, 116, 66, 101, 97,
      116, 34, 58, 34, 49, 48, 115, 34, 44, 34, 68, 65, 71, 97, 115, 80, 114,
      105, 99, 101, 68, 101, 118, 105, 97, 116, 105, 111, 110, 80, 80, 66, 34,
      58, 49, 44, 34, 69, 120, 101, 99, 71, 97, 115, 80, 114, 105, 99, 101, 68,
      101, 118, 105, 97, 116, 105, 111, 110, 80, 80, 66, 34, 58, 49, 44, 34, 84,
      111, 107, 101, 110, 80, 114, 105, 99, 101, 72, 101, 97, 114, 116, 66, 101,
      97, 116, 34, 58, 34, 49, 48, 115, 34, 44, 34, 84, 111, 107, 101, 110, 80,
      114, 105, 99, 101, 68, 101, 118, 105, 97, 116, 105, 111, 110, 80, 80, 66,
      34, 58, 49, 44, 34, 73, 110, 102, 108, 105, 103, 104, 116, 67, 97, 99,
      104, 101, 69, 120, 112, 105, 114, 121, 34, 58, 34, 53, 115, 34, 44, 34,
      80, 114, 105, 99, 101, 82, 101, 112, 111, 114, 116, 105, 110, 103, 68,
      105, 115, 97, 98, 108, 101, 100, 34, 58, 102, 97, 108, 115, 101, 125,
    ]);

    expect(areEqual(resultTypedArray, expectedBytes)).toBeTrue();
  });
});
