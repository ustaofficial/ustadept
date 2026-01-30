# USTA Token (Fixed Supply)

- ERC-20 name/symbol: **USTA / USTA**
- Total supply: **100,000,000,000 * 10^18** (`MAX_SUPPLY`)
- Mint: **only once** at deployment to `initialRecipient` (`USTA_INITIAL_RECIPIENT`)
- No further mint function exists.

## Current deployment

### Sepolia (chainId: 11155111)

**USTA v2 (current / canonical):** `0x5Eb872baf62033d0173D368AE529d507E976213F`

- Etherscan (tx): https://sepolia.etherscan.io/tx/0x929163c8c245cfb4cc5b6a93d5ff1ee737c330f18ec0eb68bc91c6840c09a690a
- Etherscan (code): https://sepolia.etherscan.io/address/0x5Eb872baf62033d0173D368AE529d507E976213F#code
- Blockscout (code): https://eth-sepolia.blockscout.com/address/0x5Eb872baf62033d0173D368AE529d507E976213F#code
- Sourcify: https://sourcify.dev/server/repo-ui/11155111/0x5Eb872baf62033d0173D368AE529d507E976213F

Full history: see `DEPLOYMENTS.md`.

## Setup

```bash
npm ci
cp .env.example .env
