# USTA Token

USTA is a **fixed-supply ERC-20 token** with a hard cap of **100,000,000,000 (100B)** units.
The entire supply is minted **once at deployment** and **no further minting is possible**.

This repository contains the production-ready smart contract, tests, deployment scripts,
and a deterministic audit gate.

---

## Overview

- **Token type:** ERC-20  
- **Total supply:** 100,000,000,000 USTA (fixed, no inflation)  
- **Decimals:** 18  
- **Minting:** One-time mint at deployment only  
- **Ownership:** No post-deploy minting or admin supply controls  

Canonical deployments are tracked in **DEPLOYMENTS.md**.

---

## Quickstart

Install dependencies:

```bash
npm ci
