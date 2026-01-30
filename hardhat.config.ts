import dotenv from "dotenv";
import { defineConfig, configVariable } from "hardhat/config";

import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import hardhatVerify from "@nomicfoundation/hardhat-verify";

dotenv.config({ path: process.env.ENV_FILE ?? ".env" });

export default defineConfig({
  plugins: [hardhatEthers, hardhatVerify],

  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "shanghai",
    },
  },

  networks: {
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("DEPLOYER_PRIVATE_KEY")],
    },
  },

  verify: {
    etherscan: {
      apiKey: configVariable("ETHERSCAN_API_KEY"),
    },
  },
});
