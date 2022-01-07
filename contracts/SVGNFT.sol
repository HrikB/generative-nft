// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract SVGNFT is ERC721URIStorage {
    uint256 public constant price = 0.01 ether;

    constructor() ERC721("ONCHAIN NFT", "ONCH") {}

    function create(string memory svg) public {
        require(artPrice <= msg.value);
        _safeMint(msg.sender, totalSupply());
    }
}
