import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const mdPath = path.join(repoRoot, "DEPLOYMENTS.md");
const md = fs.readFileSync(mdPath, "utf8");

const [,, netName, version, ...opts] = process.argv;

if (!netName || !version) {
  console.error(
    "Usage: node scripts/verify.mjs <sepolia|mainnet> <v1|v2|v3|...> [--build-profile production|default] [--force]"
  );
  process.exit(1);
}

let force = false;
let buildProfile = "production";

for (let i = 0; i < opts.length; i++) {
  const a = opts[i];
  if (a === "--force") {
    force = true;
    continue;
  }
  if (a === "--build-profile") {
    const v = opts[i + 1];
    if (!v) {
      console.error("Missing value after --build-profile");
      process.exit(1);
    }
    if (v !== "production" && v !== "default") {
      console.error("Invalid build profile. Use: production | default");
      process.exit(1);
    }
    buildProfile = v;
    i++;
    continue;
  }
  console.error(`Unknown option: ${a}`);
  process.exit(1);
}

const netHeading =
  netName === "sepolia" ? "## Sepolia" :
  netName === "mainnet" ? "## Mainnet" :
  null;

if (!netHeading) {
  console.error(`Unknown network: ${netName}`);
  process.exit(1);
}

const netIdx = md.indexOf(netHeading);
if (netIdx === -1) {
  console.error(`Network section not found in DEPLOYMENTS.md: ${netHeading}`);
  process.exit(1);
}

const nextNetIdx = md.indexOf("\n## ", netIdx + 1);
const netBlock = md.slice(netIdx, nextNetIdx === -1 ? md.length : nextNetIdx);

const sectionHeader = `### USTA ${version}`;
const secIdx = netBlock.indexOf(sectionHeader);
if (secIdx === -1) {
  console.error(`Section not found: ${sectionHeader} under ${netHeading}`);
  process.exit(1);
}

const secBlock = netBlock.slice(secIdx);

const pick = (re) => (secBlock.match(re) ? secBlock.match(re)[1].trim() : null);

const contract = pick(/- Contract:\s*(0x[a-fA-F0-9]{40})/);
const recipient = pick(/- Deployer\/Recipient:\s*(0x[a-fA-F0-9]{40})/);

if (!contract || !recipient) {
  console.error("Missing Contract or Deployer/Recipient in DEPLOYMENTS.md section.");
  process.exit(1);
}

const forceFlag = force ? " --force" : "";
const profileFlag = buildProfile ? ` --build-profile ${buildProfile}` : "";

const isWin = process.platform === "win32";
const cmd = isWin ? (process.env.ComSpec || "cmd.exe") : "npx";
const hardhatCmd = `npx hardhat verify --network ${netName}${profileFlag}${forceFlag} ${contract} ${recipient}`;
const args = isWin
  ? ["/d", "/s", "/c", hardhatCmd]
  : ["hardhat", "verify", "--network", netName, "--build-profile", buildProfile, ...(force ? ["--force"] : []), contract, recipient];

console.log(`Verifying on ${netName}: ${contract}`);
console.log(`Constructor arg (USTA_INITIAL_RECIPIENT): ${recipient}`);
console.log(`Build profile: ${buildProfile}`);
console.log(`Force: ${force ? "YES" : "NO"}`);
console.log(`Running: ${isWin ? hardhatCmd : `npx ${args.join(" ")}`}`);

const r = spawnSync(cmd, args, { stdio: "inherit", encoding: "utf8" });
process.exit(r.status ?? 1);
