import { ethers } from "ethers";

const CommitOnchainConfigAbi = [
  {
    components: [{ name: "priceRegistry", type: "address" }],
    type: "tuple",
  },
];

/**
 * **Input**: `0x8610f3910e7D2f1C36066E9216010807eD19D993`
 * **Output**: `[]uint8 len: 32, cap: 60, [0,0,0,0,0,0,0,0,0,0,0,0,134,16,243,145,14,125,47,28,54,6,110,146,22,1,8,7,237,25,217,147]`
 * @param destPriceRegistryAddress For example `"0x8610f3910e7D2f1C36066E9216010807eD19D993"`.
 * @returns
 */
export async function createDefaultCommitOnchainConfig(
  destPriceRegistryAddress: string,
): Promise<Readonly<Uint8Array>> {
  const fn = "createDefaultCommitOnchainConfig()";

  // Ensure the address is a valid Ethereum address
  if (!ethers.isAddress(destPriceRegistryAddress)) {
    throw new Error(`${fn} Invalid Ethereum address for PriceRegistry`);
  }

  const encoder = ethers.AbiCoder.defaultAbiCoder();

  // Results in an array like this:
  // ["tuple(address)"]
  // which we could've just hardcoded but with this logic here, if we extend
  // the ABI definition above with more fields later, this should automatically
  // pick those changes up (or at least some type of changes of it).
  const abi = CommitOnchainConfigAbi.map((it) => {
    const structFieldTypesCsv = it.components.map((c) => c.type).join(",");
    return `${it.type}(${structFieldTypesCsv})`;
  });

  // Create an ABI encoder
  const encodedData = encoder.encode(abi, [[destPriceRegistryAddress]]);

  const encodedDataAsBytes = ethers.getBytes(encodedData);
  return encodedDataAsBytes;
}
