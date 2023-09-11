// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DAI is ERC20 {
    constructor() ERC20("DAI", "dai") {
        mint(msg.sender,10000);
    }

    // for demo public mint
    function mint(address to,uint256 amount) public {
        _mint(to,amount);
    }
}
