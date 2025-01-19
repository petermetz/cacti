import { ethers } from "ethers";

import { LoggerProvider, LogLevelDesc } from "@hyperledger/cactus-common";

const EVM2EVMOffRampDynamicConfigAbi = [
  {
    components: [
      { name: "permissionLessExecutionThresholdSeconds", type: "uint32" },
      { name: "maxDataBytes", type: "uint32" },
      { name: "maxNumberOfTokensPerMsg", type: "uint16" },
      { name: "router", type: "address" },
      { name: "priceRegistry", type: "address" },
    ],
    type: "tuple",
  },
];

/**
 * ```go
 * func (c *CCIPContracts) CreateDefaultExecOnchainConfig(t *testing.T) []byte {
 *   config, err := abihelpers.EncodeAbiStruct(v1_5_0.ExecOnchainConfig{
 *     PermissionLessExecutionThresholdSeconds: PermissionLessExecutionThresholdSeconds,
 *     Router:                                  c.Dest.Router.Address(),
 *     PriceRegistry:                           c.Dest.PriceRegistry.Address(),
 *     MaxDataBytes:                            1e5,
 *     MaxNumberOfTokensPerMsg:                 5,
 *   })
 *   require.NoError(t, err)
 *   return config
 * }
 * ```
 *
 * **Input**:
 *
 * PermissionLessExecutionThresholdSeconds => 86400
 * Router => 0x238210402b9ccbe9fAbEB928c6AD7693A70aa4Ef
 * PriceRegistry => 0x8d89268d5159F96D3e514dF49f98F1BE388E00ec
 * MaxDataBytes => 100000.000000
 * MaxNumberOfTokensPerMsg => 5
 *
 * **Output**: `[0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 81 128 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 134 160 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 5 0 0 0 0 0 0 0 0 0 0 0 0 35 130 16 64 43 156 203 233 250 190 185 40 198 173 118 147 167 10 164 239 0 0 0 0 0 0 0 0 0 0 0 0 141 137 38 141 81 89 249 109 62 81 77 244 159 152 241 190 56 142 0 236]`
 *
 * @returns
 */
export async function createDefaultExecOnchainConfig(opts: {
  readonly logLevel: Readonly<LogLevelDesc>;
  readonly dstRouterAddr: Readonly<string>;
  readonly dstPriceRegistryAddr: Readonly<string>;
}): Promise<Readonly<Uint8Array>> {
  const { logLevel = "WARN" } = opts;
  const fn = "createDefaultExecOnchainConfig()";
  const log = LoggerProvider.getOrCreate({
    label: fn,
    level: logLevel,
  });
  log.debug("ENTER");
  const permissionLessExecutionThresholdSeconds = 86400;
  const maxDataBytes = 1e5;
  const maxNumberOfTokensPerMsg = 5;

  if (!ethers.isAddress(opts.dstRouterAddr)) {
    throw new Error(`${fn} Invalid EVM address for Destination Router`);
  }
  if (!ethers.isAddress(opts.dstPriceRegistryAddr)) {
    throw new Error(`${fn} Invalid EVM address for Destination Price Registry`);
  }

  const encoder = ethers.AbiCoder.defaultAbiCoder();

  const abi = EVM2EVMOffRampDynamicConfigAbi.map((it) => {
    const structFieldTypesCsv = it.components.map((c) => c.type).join(",");
    return `${it.type}(${structFieldTypesCsv})`;
  });

  const params = [
    permissionLessExecutionThresholdSeconds,
    maxDataBytes,
    maxNumberOfTokensPerMsg,
    opts.dstRouterAddr,
    opts.dstPriceRegistryAddr,
  ];

  // Create an ABI encoder
  const encodedData = encoder.encode(abi, [params]);

  const encodedDataAsBytes = ethers.getBytes(encodedData);
  return encodedDataAsBytes;
}
