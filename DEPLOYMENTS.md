# DEPLOYMENTS

This file is the **single source of truth** for canonical deployments.

## Sepolia (chainId: 11155111)

### USTA v3

- Status: current / canonical
- Contract: 0x52FD8cC2FB7739E2c24209ce1e2212b8FFf5EDe1
- Deployer/Recipient: 0x73EA5AA254984ccd2665Bed07355C6F2f79C7f18
- USTA_BUILD: 20260203
- Tx: 0x14196e27f7980f4051a337a2c08d3ee25633c85efcbe08986af8aba753bc75a2
- Etherscan (tx): https://sepolia.etherscan.io/tx/0x14196e27f7980f4051a337a2c08d3ee25633c85efcbe08986af8aba753bc75a2
- Etherscan (code): https://sepolia.etherscan.io/address/0x52FD8cC2FB7739E2c24209ce1e2212b8FFf5EDe1#code
- Blockscout (code): https://eth-sepolia.blockscout.com/address/0x52FD8cC2FB7739E2c24209ce1e2212b8FFf5EDe1#code
- Sourcify: https://sourcify.dev/server/repo-ui/11155111/0x52FD8cC2FB7739E2c24209ce1e2212b8FFf5EDe1

### USTA v2

- Status: deprecated (etherscan shows "Similar Match")
- Contract: 0xc59e8ba5278c1d12e09072D709709d7702afd29f
- Deployer/Recipient: 0x73EA5AA254984ccd2665Bed07355C6F2f79C7f18
- Tx: 0x828d7a5883cc2aa37ff7a7a8b15b5d8af084aae6328fd69c064b6921b6ffcb61
- Etherscan (code): https://sepolia.etherscan.io/address/0xc59e8ba5278c1d12e09072D709709d7702afd29f#code
- Blockscout (code): https://eth-sepolia.blockscout.com/address/0xc59e8ba5278c1d12e09072D709709d7702afd29f#code
- Sourcify: https://sourcify.dev/server/repo-ui/11155111/0xc59e8ba5278c1d12e09072D709709d7702afd29f

> Status note: Etherscan shows "Similar Match Source Code" for v2, which blocks Full/Exact match verification.

### USTA v2-legacy (do not use)

- Status: do not use (bytecode mismatch w/ current sources)
- Contract: 0xc06cfAa8B8C844C6A523f9f9F111Bc9d0FC470bA
- Deployer/Recipient: 0x73EA5AA254984ccd2665Bed07355C6F2f79C7f18
- Etherscan (code): https://sepolia.etherscan.io/address/0xc06cfAa8B8C844C6A523f9f9F111Bc9d0FC470bA#code
- Blockscout (code): https://eth-sepolia.blockscout.com/address/0xc06cfAa8B8C844C6A523f9f9F111Bc9d0FC470bA#code
- Sourcify: https://sourcify.dev/server/repo-ui/11155111/0xc06cfAa8B8C844C6A523f9f9F111Bc9d0FC470bA

> Status note: Bytecode does NOT match current local sources, so Hardhat verify fails (HHE80009).

## Mainnet (chainId: 1)

### USTA v1

- Status: current / canonical
- Contract: 0x8D15C25E0fF24256401Fd4DA6d85301084FC3672
- Deployer/Recipient: 0xd2A41bDF76247a858f26A8D0bfb1d09B446725A0
- USTA_BUILD: 20260203
- Tx: 0x62e1687d6abf497e478f19ccae1e695db1af2d7e4f868d35635a954ce3b36f6e
- Etherscan (tx): https://etherscan.io/tx/0x62e1687d6abf497e478f19ccae1e695db1af2d7e4f868d35635a954ce3b36f6e
- Etherscan (code): https://etherscan.io/address/0x8D15C25E0fF24256401Fd4DA6d85301084FC3672#code
- Blockscout (code): https://eth.blockscout.com/address/0x8D15C25E0fF24256401Fd4DA6d85301084FC3672#code
- Sourcify: https://sourcify.dev/server/repo-ui/1/0x8D15C25E0fF24256401Fd4DA6d85301084FC3672

## Notes

- USTA has a fixed total supply (100B * 1e18) minted once at deployment.
- Any deployment not listed here must not be treated as canonical.
