# USTA Token (ERC-20)

**USTA** is a fixed-supply ERC-20 token on Ethereum.  
Tagline: **“USTA bilir.”**

- **Supply:** 100,000,000,000 USTA (fixed, no inflation)
- **Minting:** one-time mint at deployment only
- **Admin keys:** none for supply (no owner mint / no emissions)

> USTA is a meme/community token for fun experiments, tipping and community activities.  
> **Not investment advice. No promises of profit.**

## Canonical contract

- **Ethereum Mainnet:** `0x8D15C25E0fF24256401Fd4DA6d85301084FC3672`

Canonical deployments and verification links: see **DEPLOYMENTS.md**.

## Official references

- Official links: **docs/OFFICIAL-LINKS.md**
- Litepaper (short): **docs/LITEPAPER.md**
- Security disclosure: **SECURITY.md**

---

## Repo contents

- `contracts/USTA.sol` — production ERC-20 (fixed supply)
- `test/USTA.test.ts` — supply + zero-address tests
- `scripts/deploy.*` — guarded deploy scripts
- `scripts/verify.mjs` — verification helper (reads DEPLOYMENTS.md)
- `scripts/audit-high.mjs` — CI gate: fails on **high/critical** npm audit findings

---

## Quickstart

Install:

```bash
npm ci
