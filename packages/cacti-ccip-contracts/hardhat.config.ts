import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
  },
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "shanghai",
      optimizer: {
        enabled: true,
        runs: 1000000,
      },
    },
  },
  paths: {
    sources: "./src/main/solidity/",
    tests: "./src/test/solidity/",
    cache: "./.tmp/cache",
    artifacts: "./dist/hardhat/artifacts/",
  },
  mocha: {
    timeout: 40000,
  },
};

export default config;
