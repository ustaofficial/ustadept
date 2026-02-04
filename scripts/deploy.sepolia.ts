import { network } from "hardhat";

const { ethers } = await network.connect();

function explorerBase(chainId: bigint): string | null {
  if (chainId === 11155111n) return "https://sepolia.etherscan.io";
  if (chainId === 1n) return "https://etherscan.io";
  return null;
}

async function main() {
  const net = await ethers.provider.getNetwork();

  // HARD GUARD: SEPOLIA ONLY
  if (net.chainId !== 11155111n) {
    throw new Error(
      `ERROR: Wrong network. Expected Sepolia (chainId=11155111), got ${net.chainId}`
    );
  }

  const recipient = process.env.USTA_INITIAL_RECIPIENT;
  if (!recipient) {
    throw new Error("ERROR: USTA_INITIAL_RECIPIENT is not set");
  }

  // checksum + format validation (throws if invalid)
  const recipientAddr = ethers.getAddress(recipient);
  if (recipientAddr === ethers.ZeroAddress) {
    throw new Error("ERROR: USTA_INITIAL_RECIPIENT is zero address");
  }

  console.log("Deploying USTA to SEPOLIA");
  console.log("Recipient:", recipientAddr);

  const token = await ethers.deployContract("USTA", [recipientAddr]);
  await token.waitForDeployment();

  const address = await token.getAddress();
  const deployTx = token.deploymentTransaction();
  const txHash = deployTx?.hash ?? null;

  // Optional sanity log (requires USTA_BUILD getter)
  let build: bigint | null = null;
  try {
    // @ts-expect-error - dynamic contract typing
    build = (await token.USTA_BUILD()) as bigint;
  } catch {
    build = null;
  }

  console.log("USTA deployed");
  console.log("Contract:", address);
  console.log("Recipient:", recipientAddr);
  console.log("ChainId:", net.chainId.toString());
  if (build !== null) console.log("USTA_BUILD:", build.toString());
  if (txHash) console.log("Tx:", txHash);

  const base = explorerBase(net.chainId);
  if (base) {
    if (txHash) console.log("Etherscan (tx):", `${base}/tx/${txHash}`);
    console.log("Etherscan (code):", `${base}/address/${address}#code`);
  }

  console.log("\nVerify cmd (PRODUCTION build-profile!):");
  console.log(
    `npx hardhat verify --network sepolia --build-profile production ${address} ${recipientAddr}`
  );

  console.log("\n--- DEPLOYMENTS.md snippet ---");
  console.log(`- Contract: ${address}`);
  console.log(`- Deployer/Recipient: ${recipientAddr}`);
  if (build !== null) console.log(`- USTA_BUILD: ${build.toString()}`);
  if (txHash) console.log(`- Tx: ${txHash}`);
  if (base && txHash) console.log(`- Etherscan (tx): ${base}/tx/${txHash}`);
  if (base) console.log(`- Etherscan (code): ${base}/address/${address}#code`);
  console.log("--- end ---\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
