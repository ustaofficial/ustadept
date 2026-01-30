import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const mdPath = path.join(repoRoot, "DEPLOYMENTS.md");
const md = fs.readFileSync(mdPath, "utf8");

const v2Idx = md.indexOf("### USTA v2");
if (v2Idx === -1) throw new Error("USTA v2 section not found in DEPLOYMENTS.md");
const v2Block = md.slice(v2Idx);

const pick = (re) => (v2Block.match(re) ? v2Block.match(re)[1].trim() : null);

const contract = pick(/- Contract:\s*(0x[a-fA-F0-9]{40})/);
const deployerRecipient = pick(/- Deployer\/Recipient:\s*(0x[a-fA-F0-9]{40})/);
const tx = pick(/- Tx:\s*(0x[a-fA-F0-9]{64})/);
const etherscanTx = pick(/- Etherscan \(tx\):\s*(\S+)/);
const etherscanCode = pick(/- Etherscan \(code\):\s*(\S+)/);
const blockscoutCode = pick(/- Blockscout \(code\):\s*(\S+)/);
const sourcify = pick(/- Sourcify:\s*(\S+)/);

console.log("Sepolia (chainId: 11155111)");
console.log("USTA v2 (current / canonical)");
if (contract) console.log("- Contract:", contract);
if (deployerRecipient) console.log("- Deployer/Recipient:", deployerRecipient);
if (tx) console.log("- Tx:", tx);
if (etherscanTx) console.log("- Etherscan (tx):", etherscanTx);
if (etherscanCode) console.log("- Etherscan (code):", etherscanCode);
if (blockscoutCode) console.log("- Blockscout (code):", blockscoutCode);
if (sourcify) console.log("- Sourcify:", sourcify);
