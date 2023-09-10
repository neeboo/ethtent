// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor() ERC20("DAI", "dai") {
    }

    function mint(uint256 amount) public onlyOwner {
        _mint(msg.sender, amount * (10 ** uint256(decimals())));
    }

    function burn(uint256 amount) public onlyOwner {
        _burn(msg.sender, amount * (10 ** uint256(decimals())));
    }
}