import "jest-extended";

import { LogLevelDesc } from "@hyperledger/cactus-common";

import { createDefaultExecOnchainConfig } from "../../../../../main/typescript/ccip/common/create-default-exec-onchain-config";

function areEqual(first: Uint8Array, second: Uint8Array): boolean {
  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
}

describe("createDefaultExecOnchainConfig()", () => {
  it("Can produce byte equivalent input to the chainlink node's go code", async () => {
    const logLevel: Readonly<LogLevelDesc> = "INFO";

    const dstPriceRegistryAddr = "0x8d89268d5159F96D3e514dF49f98F1BE388E00ec";
    const dstRouterAddr = "0x238210402b9ccbe9fAbEB928c6AD7693A70aa4Ef";

    const resultTypedArray = await createDefaultExecOnchainConfig({
      logLevel,
      dstPriceRegistryAddr,
      dstRouterAddr,
    });

    // The bytes extracted from the CCIP integration tests
    const expectedBytes = Uint8Array.from([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 1, 81, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 134, 160, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 35, 130, 16, 64, 43, 156, 203, 233, 250,
      190, 185, 40, 198, 173, 118, 147, 167, 10, 164, 239, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 141, 137, 38, 141, 81, 89, 249, 109, 62, 81, 77, 244, 159,
      152, 241, 190, 56, 142, 0, 236,
    ]);

    expect(areEqual(resultTypedArray, expectedBytes)).toBeTrue();
  });
});
