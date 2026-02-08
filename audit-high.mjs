import { spawnSync } from "node:child_process";

const isWin = process.platform === "win32";

const cmd = isWin ? (process.env.ComSpec || "cmd.exe") : "npm";
const args = isWin ? ["/d", "/s", "/c", "npm audit --json"] : ["audit", "--json"];

const r = spawnSync(cmd, args, { encoding: "utf8" });

if (r.error) {
  console.error("Failed to run npm audit:", r.error);
  process.exit(1);
}

const out = (r.stdout ?? "").trim();
const err = (r.stderr ?? "").trim();

// Bazı ortamlarda JSON stderr'e düşebiliyor; ikisini de dene.
const jsonText =
  out ||
  (err.startsWith("{") ? err : "");

if (!jsonText) {
  console.error("npm audit --json produced no stdout/stderr JSON");
  console.error("status:", r.status);
  if (err) console.error("stderr:", err.slice(0, 2000));
  process.exit(1);
}

let audit;
try {
  audit = JSON.parse(jsonText);
} catch {
  console.error("Failed to parse npm audit JSON.");
  console.error(jsonText.slice(0, 2000));
  process.exit(1);
}

const counts = audit?.metadata?.vulnerabilities;
if (!counts) {
  console.error("audit metadata.vulnerabilities missing; cannot gate safely.");
  process.exit(1);
}

const high = counts.high ?? 0;
const critical = counts.critical ?? 0;

if (high + critical > 0) {
  console.error(`AUDIT FAIL (high=${high}, critical=${critical})`);
  process.exit(1);
}

console.log(`AUDIT OK (high=${high}, critical=${critical})`);
process.exit(0);
