import { isIComposeUpOutput } from "../../../../main/typescript/chainlink/i-compose-up-output";
import { IComposeUpOutput } from "../../../../main/typescript/chainlink/i-compose-up-output";

describe("isIComposeUpOutput", () => {
  test("returns false for empty arrays", () => {
    expect(isIComposeUpOutput([])).toBe(false);
  });

  test("returns false for Symbol types", () => {
    expect(isIComposeUpOutput(Symbol("test"))).toBe(false);
  });

  test("returns false for number zero", () => {
    expect(isIComposeUpOutput(0)).toBe(false);
  });

  test("returns false for NaN", () => {
    expect(isIComposeUpOutput(NaN)).toBe(false);
  });

  test("returns false for bigint zero", () => {
    expect(isIComposeUpOutput(0n)).toBe(false);
  });

  test("returns false for Error instances", () => {
    expect(isIComposeUpOutput(new Error("test error"))).toBe(false);
  });

  test("returns false for function references", () => {
    const func = () => {};
    expect(isIComposeUpOutput(func)).toBe(false);
  });

  test("returns true for an object with unexpected extra properties", () => {
    const objectWithExtraProps = {
      file: "docker-compose.yml",
      secrets: [],
      volumes: [],
      configs: [],
      networks: [],
      services: [],
      extraProperty: "unexpected", // Extra property
    };

    expect(isIComposeUpOutput(objectWithExtraProps)).toBe(true);
  });

  test("returns false for primitive values", () => {
    expect(isIComposeUpOutput("string")).toBe(false);
    expect(isIComposeUpOutput(42)).toBe(false);
    expect(isIComposeUpOutput(true)).toBe(false);
    expect(isIComposeUpOutput(null)).toBe(false);
    expect(isIComposeUpOutput(undefined)).toBe(false);
  });
  test("returns true for valid IComposeUpOutput objects", () => {
    const validObject: IComposeUpOutput = {
      file: "docker-compose.yml",
      secrets: [],
      volumes: [
        {
          Name: "test-volume",
          Driver: "local",
          Mountpoint: "/var/lib/docker/volumes/test-volume/_data",
          Labels: { environment: "dev" },
          Scope: "local",
          Options: {},
        },
      ],
      configs: [],
      networks: [],
      services: [],
    };

    expect(isIComposeUpOutput(validObject)).toBe(true);
  });

  test("returns false for objects missing required fields", () => {
    const invalidObject = {
      file: "docker-compose.yml",
      secrets: [], // Missing other required properties like volumes, networks, etc.
    };

    expect(isIComposeUpOutput(invalidObject)).toBe(false);
  });

  test("returns false for incorrect types in nested properties", () => {
    const invalidObject = {
      file: "docker-compose.yml",
      secrets: [],
      volumes: [
        {
          Name: "test-volume",
          Driver: "local",
          Mountpoint: "/var/lib/docker/volumes/test-volume/_data",
          Labels: { environment: "dev" },
          Scope: "local",
          Options: {},
          UsageData: { Size: "invalid", RefCount: 2 }, // Size should be a number
        },
      ],
      configs: [],
      networks: ["not-a-network"], // Invalid network
      services: [],
    };

    expect(isIComposeUpOutput(invalidObject)).toBe(false);
  });

  test("handles null and undefined gracefully", () => {
    expect(isIComposeUpOutput(null)).toBe(false);
    expect(isIComposeUpOutput(undefined)).toBe(false);
  });

  test("handles empty arrays correctly", () => {
    const validObjectWithEmptyArrays: IComposeUpOutput = {
      file: "docker-compose.yml",
      secrets: [],
      volumes: [],
      configs: [],
      networks: [],
      services: [],
    };

    expect(isIComposeUpOutput(validObjectWithEmptyArrays)).toBe(true);
  });
});
