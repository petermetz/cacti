import "jest-extended";

import { createDefaultCommitOnchainConfig } from "../../../../../main/typescript/ccip/common/create-default-commit-onchain-config";

function areEqual(first: Uint8Array, second: Uint8Array): boolean {
  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
}

describe("createDefaultCommitOnchainConfig()", () => {
  it("Can produce byte equivalent input to the chainlink node's go code", async () => {
    const priceRegistryAddr = "0x8610f3910e7D2f1C36066E9216010807eD19D993";
    const resultTypedArray =
      await createDefaultCommitOnchainConfig(priceRegistryAddr);

    // The bytes extracted from the CCIP integration tests
    const expectedBytes = Uint8Array.from([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 134, 16, 243, 145, 14, 125, 47, 28,
      54, 6, 110, 146, 22, 1, 8, 7, 237, 25, 217, 147,
    ]);

    expect(areEqual(resultTypedArray, expectedBytes)).toBeTrue();
  });
});
