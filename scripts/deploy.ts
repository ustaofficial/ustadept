import { network } from "hardhat";

const { ethers } = await network.connect();

const SEPOLIA_CHAIN_ID = 11155111n;

async function main() {
  const net = await ethers.provider.getNetwork();

  // Hard safety: wrong RPC / wrong network deploy'u kes
  if (net.chainId !== SEPOLIA_CHAIN_ID) {
    throw new Error(
      `Refusing to deploy: expected chainId ${SEPOLIA_CHAIN_ID.toString()}, got ${net.chainId.toString()}`
    );
  }

  const [deployer] = await ethers.getSigners();

  const recipientRaw = (process.env.USTA_INITIAL_RECIPIENT ?? "").trim();
  const recipient = recipientRaw.length ? recipientRaw : deployer.address;

  if (!ethers.isAddress(recipient) || recipient === ethers.ZeroAddress) {
    throw new Error(`USTA_INITIAL_RECIPIENT invalid: ${recipient}`);
  }

  console.log("Network chainId:", net.chainId.toString());
  console.log("Deployer:", deployer.address);
  console.log("Recipient:", recipient);

  const token = await ethers.deployContract("USTA", [recipient]);
  const tx = token.deploymentTransaction();
  if (!tx) throw new Error("Deployment transaction missing");

  console.log("Deploy tx:", tx.hash);

  await token.waitForDeployment();
  const addr = await token.getAddress();

  console.log("Contract address:", addr);
  console.log("Etherscan tx:", `https://sepolia.etherscan.io/tx/${tx.hash}`);
  console.log("Etherscan code:", `https://sepolia.etherscan.io/address/${addr}#code`);
  console.log("Blockscout code:", `https://eth-sepolia.blockscout.com/address/${addr}#code`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
