export interface IEVM2EVMOnRampStaticConfig {
  linkToken: string; // Address in Ethereum is typically represented as a string in TS
  chainSelector: bigint; // uint64 maps to BigInt in TS
  destChainSelector: bigint; // uint64 maps to BigInt in TS
  defaultTxGasLimit: bigint; // uint64 maps to BigInt in TS
  maxNopFeesJuels: bigint; // *big.Int maps to BigInt in TS
  prevOnRamp: string; // Address as string
  rmnProxy: string; // Address as string
  tokenAdminRegistry: string; // Address as string
}

// User-defined type guard for IEVM2EVMOnRampStaticConfig
export function isIEVM2EVMOnRampStaticConfig(
  x: unknown,
): x is IEVM2EVMOnRampStaticConfig {
  if (typeof x !== "object" || x === null) return false;

  const obj = x as IEVM2EVMOnRampStaticConfig;

  const keys = Object.keys(obj);
  const expectedKeys = [
    "linkToken",
    "chainSelector",
    "destChainSelector",
    "defaultTxGasLimit",
    "maxNopFeesJuels",
    "prevOnRamp",
    "rmnProxy",
    "tokenAdminRegistry",
  ];

  return (
    keys.length === expectedKeys.length &&
    keys.every((key) => expectedKeys.includes(key)) &&
    typeof obj.linkToken === "string" &&
    typeof obj.chainSelector === "bigint" &&
    typeof obj.destChainSelector === "bigint" &&
    typeof obj.defaultTxGasLimit === "bigint" &&
    typeof obj.maxNopFeesJuels === "bigint" &&
    typeof obj.prevOnRamp === "string" &&
    typeof obj.rmnProxy === "string" &&
    typeof obj.tokenAdminRegistry === "string"
  );
}
