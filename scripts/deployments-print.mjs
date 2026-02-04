import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const mdPath = path.join(repoRoot, "DEPLOYMENTS.md");
const md = fs.readFileSync(mdPath, "utf8");

function sliceSection(full, heading) {
  const idx = full.indexOf(heading);
  if (idx === -1) return null;
  const nextIdx = full.indexOf("\n## ", idx + 1);
  return full.slice(idx, nextIdx === -1 ? full.length : nextIdx);
}

function parseUstaVersions(networkBlock) {
  const out = [];
  const re = /^### USTA (.+)$/gm;
  let m;
  while ((m = re.exec(networkBlock)) !== null) {
    const title = m[1].trim(); // e.g. "v3" or "v2-legacy (do not use)"
    const start = m.index;
    const next = networkBlock.indexOf("\n### USTA ", start + 1);
    const block = networkBlock.slice(start, next === -1 ? networkBlock.length : next);

    const pick = (r) => (block.match(r) ? block.match(r)[1].trim() : null);

    const versionNum = (() => {
      const vm = title.match(/\bv(\d+)\b/i);
      return vm ? Number(vm[1]) : null;
    })();

    const status = pick(/- Status:\s*(.+)/i) || "";
    const isCanonical = /current\s*\/\s*canonical/i.test(status) || /\bcanonical\b/i.test(status);
    const isDoNotUse = /\bdo not use\b/i.test(status) || /\blegacy\b/i.test(title) || /\blegacy\b/i.test(status);
    const isDeprecated = /\bdeprecated\b/i.test(status);

    const contract = pick(/- Contract:\s*(0x[a-fA-F0-9]{40})/);
    const deployerRecipient = pick(/- Deployer\/Recipient:\s*(0x[a-fA-F0-9]{40})/);
    const ustaBuild = pick(/- USTA_BUILD:\s*([0-9]+)/);
    const tx = pick(/- Tx:\s*(0x[a-fA-F0-9]{64})/);
    const etherscanTx = pick(/- Etherscan \(tx\):\s*(\S+)/);
    const etherscanCode = pick(/- Etherscan \(code\):\s*(\S+)/);
    const blockscoutCode = pick(/- Blockscout \(code\):\s*(\S+)/);
    const sourcify = pick(/- Sourcify:\s*(\S+)/);

    out.push({
      title,
      versionNum,
      status,
      isCanonical,
      isDoNotUse,
      isDeprecated,
      contract,
      deployerRecipient,
      ustaBuild,
      tx,
      etherscanTx,
      etherscanCode,
      blockscoutCode,
      sourcify,
    });
  }
  return out;
}

function isZeroAddress(addr) {
  return (
    typeof addr === "string" &&
    addr.toLowerCase() === "0x0000000000000000000000000000000000000000"
  );
}

function pickCanonical(versions) {
  // 1) explicit status wins
  const explicit = versions.find(
    (v) => v.isCanonical && v.contract && !isZeroAddress(v.contract)
  );
  if (explicit) return explicit;

  // 2) otherwise: highest numeric vN that isn't do-not-use and has a real contract
  const eligible = versions
    .filter((v) => v.contract && !isZeroAddress(v.contract))
    .filter((v) => !v.isDoNotUse)
    .sort((a, b) => (b.versionNum ?? -1) - (a.versionNum ?? -1));

  if (eligible.length > 0) return eligible[0];

  // 3) last resort: anything with a contract
  const any = versions.find((v) => v.contract && !isZeroAddress(v.contract));
  return any ?? null;
}

// ---- Sepolia ----
const sepoliaBlock = sliceSection(md, "## Sepolia (chainId: 11155111)");
if (!sepoliaBlock) throw new Error("Sepolia section not found in DEPLOYMENTS.md");

const sepoliaVersions = parseUstaVersions(sepoliaBlock);
const sepoliaCanonical = pickCanonical(sepoliaVersions);

console.log("Sepolia (chainId: 11155111)");
if (!sepoliaCanonical) {
  console.log("No deployment found.");
} else {
  const label =
    sepoliaCanonical.versionNum !== null ? `USTA v${sepoliaCanonical.versionNum}` : `USTA ${sepoliaCanonical.title}`;
  console.log(`${label} (current / canonical)`);
  if (sepoliaCanonical.contract) console.log("- Contract:", sepoliaCanonical.contract);
  if (sepoliaCanonical.deployerRecipient) console.log("- Deployer/Recipient:", sepoliaCanonical.deployerRecipient);
  if (sepoliaCanonical.ustaBuild) console.log("- USTA_BUILD:", sepoliaCanonical.ustaBuild);
  if (sepoliaCanonical.tx) console.log("- Tx:", sepoliaCanonical.tx);
  if (sepoliaCanonical.etherscanTx) console.log("- Etherscan (tx):", sepoliaCanonical.etherscanTx);
  if (sepoliaCanonical.etherscanCode) console.log("- Etherscan (code):", sepoliaCanonical.etherscanCode);
  if (sepoliaCanonical.blockscoutCode) console.log("- Blockscout (code):", sepoliaCanonical.blockscoutCode);
  if (sepoliaCanonical.sourcify) console.log("- Sourcify:", sepoliaCanonical.sourcify);
}

// ---- Mainnet (optional print) ----
const mainnetBlock = sliceSection(md, "## Mainnet (chainId: 1)");
if (mainnetBlock) {
  const mainnetVersions = parseUstaVersions(mainnetBlock);
  const mainnetCanonical = pickCanonical(mainnetVersions);

  console.log("");
  console.log("Mainnet (chainId: 1)");
  if (!mainnetCanonical) {
    console.log("No deployment found.");
  } else {
    const label =
      mainnetCanonical.versionNum !== null ? `USTA v${mainnetCanonical.versionNum}` : `USTA ${mainnetCanonical.title}`;
    console.log(`${label} (current / canonical)`);
    if (mainnetCanonical.contract) console.log("- Contract:", mainnetCanonical.contract);
    if (mainnetCanonical.deployerRecipient) console.log("- Deployer/Recipient:", mainnetCanonical.deployerRecipient);
    if (mainnetCanonical.ustaBuild) console.log("- USTA_BUILD:", mainnetCanonical.ustaBuild);
    if (mainnetCanonical.tx) console.log("- Tx:", mainnetCanonical.tx);
    if (mainnetCanonical.etherscanCode) console.log("- Etherscan (code):", mainnetCanonical.etherscanCode);
  }
}
