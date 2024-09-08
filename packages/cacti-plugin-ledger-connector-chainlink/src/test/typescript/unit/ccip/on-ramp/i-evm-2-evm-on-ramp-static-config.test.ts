import { describe, it, expect } from "@jest/globals";

import { isIEVM2EVMOnRampStaticConfig } from "../../../../../main/typescript/ccip/on-ramp/i-evm-2-evm-on-ramp-static-config";

describe("isIEVM2EVMOnRampStaticConfig", () => {
  it("should return true for a valid EVM2EVMOnRampStaticConfig object", () => {
    const validObject: unknown = {
      linkToken: "0x1234567890abcdef1234567890abcdef12345678",
      chainSelector: 1n,
      destChainSelector: 2n,
      defaultTxGasLimit: 21000n,
      maxNopFeesJuels: 1000000000000000000n,
      prevOnRamp: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
      rmnProxy: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
      tokenAdminRegistry: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
    };
    expect(isIEVM2EVMOnRampStaticConfig(validObject)).toBe(true);
  });

  it("should return false for an object missing required properties", () => {
    const invalidObject: unknown = {
      linkToken: "0x1234567890abcdef1234567890abcdef12345678",
      chainSelector: 1n,
      // Missing other properties
    };
    expect(isIEVM2EVMOnRampStaticConfig(invalidObject)).toBe(false);
  });

  it("should return false for an object with invalid property types", () => {
    const invalidObject: unknown = {
      linkToken: 12345, // Should be string
      chainSelector: "1", // Should be bigint
      destChainSelector: 2n,
      defaultTxGasLimit: 21000n,
      maxNopFeesJuels: null,
      prevOnRamp: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
      rmnProxy: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
      tokenAdminRegistry: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
    };
    expect(isIEVM2EVMOnRampStaticConfig(invalidObject)).toBe(false);
  });

  it("should return false for null or non-object values", () => {
    expect(isIEVM2EVMOnRampStaticConfig(null)).toBe(false);
    expect(isIEVM2EVMOnRampStaticConfig(undefined)).toBe(false);
    expect(isIEVM2EVMOnRampStaticConfig(12345)).toBe(false);
    expect(isIEVM2EVMOnRampStaticConfig("string")).toBe(false);
    expect(isIEVM2EVMOnRampStaticConfig(true)).toBe(false);
  });

  it("should return false when maxNopFeesJuels is null", () => {
    const validObjectWithNull: unknown = {
      linkToken: "0x1234567890abcdef1234567890abcdef12345678",
      chainSelector: 1n,
      destChainSelector: 2n,
      defaultTxGasLimit: 21000n,
      maxNopFeesJuels: null,
      prevOnRamp: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
      rmnProxy: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
      tokenAdminRegistry: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
    };
    expect(isIEVM2EVMOnRampStaticConfig(validObjectWithNull)).toBeFalsy();
  });

  it("should return false if additional unexpected properties are present", () => {
    const invalidObjectWithExtraProps: unknown = {
      linkToken: "0x1234567890abcdef1234567890abcdef12345678",
      chainSelector: 1n,
      destChainSelector: 2n,
      defaultTxGasLimit: 21000n,
      maxNopFeesJuels: 1000000000000000000n,
      prevOnRamp: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
      rmnProxy: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
      tokenAdminRegistry: "0xabcdefabcdefabcdefabcdefabcdefabcdef",
      ExtraProperty: "unexpected",
    };
    expect(isIEVM2EVMOnRampStaticConfig(invalidObjectWithExtraProps)).toBe(
      false,
    );
  });
});
