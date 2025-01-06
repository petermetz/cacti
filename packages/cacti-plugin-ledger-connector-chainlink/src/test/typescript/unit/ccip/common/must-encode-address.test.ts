import "jest-extended";
import { mustEncodeAddress } from "../../../../../main/typescript/ccip/common/must-encode-address";

function areEqual(first: Uint8Array, second: Uint8Array): boolean {
  return (
    first.length === second.length &&
    first.every((value, index) => value === second[index])
  );
}

describe("mustEncodeAddress()", () => {
  it("produces byte-by-byte equal input/output pairs", () => {
    const receiverAddressHexStr = "f806dd1bf22c783fd1da7e8239d75e76dac6723d";
    const receiverAddressHexStr0x = "0x".concat(receiverAddressHexStr);

    const receiverAddressEncodedBytesExpected = Uint8Array.from([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 248, 6, 221, 27, 242, 44, 120, 63,
      209, 218, 126, 130, 57, 215, 94, 118, 218, 198, 114, 61,
    ]);

    const receiverAddressEncodedBytes = mustEncodeAddress(
      receiverAddressHexStr,
    );

    const receiverAddressEncodedBytes0x = mustEncodeAddress(
      receiverAddressHexStr0x,
    );

    expect(
      areEqual(
        receiverAddressEncodedBytes,
        receiverAddressEncodedBytesExpected,
      ),
    );

    expect(
      areEqual(
        receiverAddressEncodedBytes0x,
        receiverAddressEncodedBytesExpected,
      ),
    );
  });
});
