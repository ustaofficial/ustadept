// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @dev initialRecipient 0x0 olamaz
error ZeroAddress();

contract USTA is ERC20 {
    // 100B * 1e18 = 1e29
    uint256 public constant MAX_SUPPLY = 100_000_000_000 * 10 ** 18;

    /**
     * @dev Build marker:
     * - Explorer'larda "Similar Match" sorununu kırmak için runtime bytecode'u benzersiz yapar.
     * - Davranışı değiştirmez (sadece public getter üretir).
     * - Yeni deploy sonrası Etherscan'da full verify almayı hedefliyoruz.
     */
    uint256 public constant USTA_BUILD = 20260203;

    constructor(address initialRecipient) ERC20("USTA", "USTA") {
        if (initialRecipient == address(0)) revert ZeroAddress();
        _mint(initialRecipient, MAX_SUPPLY);
    }
}
