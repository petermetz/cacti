import "jest-extended";

import { isIVolumeCreateResponse } from "../../../../main/typescript/chainlink/i-volume-create-response";
import { IVolumeCreateResponse } from "../../../../main/typescript/chainlink/i-volume-create-response";

describe("isIVolumeCreateResponse", () => {
  test("returns false for empty arrays", () => {
    expect(isIVolumeCreateResponse([])).toBe(false);
  });

  test("returns false for Symbol types", () => {
    expect(isIVolumeCreateResponse(Symbol("test"))).toBe(false);
  });

  test("returns false for number zero", () => {
    expect(isIVolumeCreateResponse(0)).toBe(false);
  });

  test("returns false for NaN", () => {
    expect(isIVolumeCreateResponse(NaN)).toBe(false);
  });

  test("returns false for bigint zero", () => {
    expect(isIVolumeCreateResponse(0n)).toBe(false);
  });

  test("returns false for Error instances", () => {
    expect(isIVolumeCreateResponse(new Error("test error"))).toBe(false);
  });

  test("returns false for function references", () => {
    const func = () => {};
    expect(isIVolumeCreateResponse(func)).toBe(false);
  });

  test("returns true for an object with unexpected extra properties", () => {
    const objectWithExtraProps = {
      Name: "test-volume",
      Driver: "local",
      Mountpoint: "/var/lib/docker/volumes/test-volume/_data",
      Labels: { test: "label" },
      Scope: "local",
      Options: {},
      unexpectedProperty: "unexpected", // Extra property
    };
    expect(isIVolumeCreateResponse(objectWithExtraProps)).toBe(true);
  });

  test("returns false for primitive values", () => {
    expect(isIVolumeCreateResponse("string")).toBe(false);
    expect(isIVolumeCreateResponse(42)).toBe(false);
    expect(isIVolumeCreateResponse(true)).toBe(false);
    expect(isIVolumeCreateResponse(null)).toBe(false);
    expect(isIVolumeCreateResponse(undefined)).toBe(false);
  });

  test("returns true for valid IVolumeCreateResponse objects", () => {
    const validObject: IVolumeCreateResponse = {
      Name: "test-volume",
      Driver: "local",
      Mountpoint: "/var/lib/docker/volumes/test-volume/_data",
      CreatedAt: "2024-11-15T12:00:00Z",
      Status: { key1: "value1" },
      Labels: { environment: "dev" },
      Scope: "local",
      Options: { opt1: "value1" },
      UsageData: { Size: 1024, RefCount: 2 },
    };

    expect(isIVolumeCreateResponse(validObject)).toBe(true);
  });

  test("returns true for valid objects with optional fields omitted", () => {
    const minimalObject: IVolumeCreateResponse = {
      Name: "minimal-volume",
      Driver: "local",
      Mountpoint: "/var/lib/docker/volumes/minimal-volume/_data",
      Labels: { app: "test" },
      Scope: "local",
      Options: {},
    };

    expect(isIVolumeCreateResponse(minimalObject)).toBe(true);
  });

  test("returns false for invalid objects missing required fields", () => {
    const invalidObject = {
      Driver: "local", // Missing 'Name' and other required fields
    };

    expect(isIVolumeCreateResponse(invalidObject)).toBe(false);
  });

  test("returns false for objects with incorrect types in optional fields", () => {
    const invalidObject = {
      Name: "test-volume",
      Driver: "local",
      Mountpoint: "/var/lib/docker/volumes/test-volume/_data",
      Labels: { environment: "dev" },
      Scope: "local",
      Options: {},
      UsageData: { Size: "1024", RefCount: 2 }, // Size is a string instead of a number
    };

    expect(isIVolumeCreateResponse(invalidObject)).toBe(false);
  });

  test("handles null and undefined gracefully", () => {
    expect(isIVolumeCreateResponse(null)).toBe(false);
    expect(isIVolumeCreateResponse(undefined)).toBe(false);
  });

  test("handles UsageData when null or undefined", () => {
    const validObjectWithNullUsageData: IVolumeCreateResponse = {
      Name: "test-volume",
      Driver: "local",
      Mountpoint: "/var/lib/docker/volumes/test-volume/_data",
      Labels: { test: "label" },
      Scope: "local",
      Options: {},
      UsageData: null,
    };

    const validObjectWithUndefinedUsageData: IVolumeCreateResponse = {
      Name: "test-volume",
      Driver: "local",
      Mountpoint: "/var/lib/docker/volumes/test-volume/_data",
      Labels: { test: "label" },
      Scope: "local",
      Options: {},
    };

    expect(isIVolumeCreateResponse(validObjectWithNullUsageData)).toBe(true);
    expect(isIVolumeCreateResponse(validObjectWithUndefinedUsageData)).toBe(
      true,
    );
  });
});
