import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  const net = await ethers.provider.getNetwork();

  // 🔒 HARD GUARD: SEPOLIA ONLY
  if (net.chainId !== 11155111n) {
    throw new Error(
      `❌ Wrong network. Expected Sepolia (chainId=11155111), got ${net.chainId}`
    );
  }

  const recipient = process.env.USTA_INITIAL_RECIPIENT;
  if (!recipient) {
    throw new Error("❌ USTA_INITIAL_RECIPIENT is not set");
  }

  // ✅ checksum + format validation (throws if invalid)
  const recipientAddr = ethers.getAddress(recipient);
  if (recipientAddr === ethers.ZeroAddress) {
    throw new Error("❌ USTA_INITIAL_RECIPIENT is zero address");
  }

  console.log("🚀 Deploying USTA to SEPOLIA");
  console.log("→ Recipient:", recipientAddr);

  const token = await ethers.deployContract("USTA", [recipientAddr]);
  await token.waitForDeployment();

  const address = await token.getAddress();

  console.log("✅ USTA deployed");
  console.log("→ Contract:", address);
  console.log("→ Recipient:", recipientAddr);
  console.log("→ ChainId:", net.chainId.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
