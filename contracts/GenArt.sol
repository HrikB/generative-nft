// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721/ERC721.sol";
import "hardhat/console.sol";

contract GenArt is ERC721 {
    bool public isSaleActive = false;

    uint256 public constant maxMintAmt = 10;

    uint256 public constant artPrice = 0.1 ether;

    uint256 public MAX_SUPPLY;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 maxNftSupply
    ) ERC721(_name, _symbol) {
        MAX_SUPPLY = maxNftSupply;
    }

    function activateSale() external {
        isSaleActive = true;
    }

    function mintArt(uint256 numOfTokens) public payable {
        require(isSaleActive, "The sale must be active to mint");
        require(numOfTokens <= maxMintAmt, "Can only mint 10 tokens at a time");
        require(
            totalSupply() + (numOfTokens) <= MAX_SUPPLY,
            "Purchase would exceed maximum supply"
        ); //overflow check not required in solidity ^0.8.0
        require(
            artPrice * numOfTokens <= msg.value,
            "Ether value sent is not correct"
        );

        for (uint256 i = 0; i < numOfTokens; i++) {
            uint256 mintIndex = totalSupply();
            if (totalSupply() < MAX_SUPPLY) {
                _safeMint(msg.sender, mintIndex);
            }
        }
    }
}
