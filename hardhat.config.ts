import dotenv from "dotenv";
import { defineConfig, configVariable } from "hardhat/config";

import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import hardhatVerify from "@nomicfoundation/hardhat-verify";

dotenv.config({ path: process.env.ENV_FILE ?? ".env" });

export default defineConfig({
  plugins: [hardhatToolboxMochaEthers, hardhatVerify],

  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "shanghai",
    },
  },

  paths: {
    tests: {
      mocha: "./test",
    },
  },

  networks: {
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },

  verify: {
    etherscan: {
      apiKey: configVariable("ETHERSCAN_API_KEY"),
    },
  },
});
