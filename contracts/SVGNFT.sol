// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721/ERC721URIStorage.sol";
import "base64-sol/base64.sol";
import "hardhat/console.sol";

contract SVGNFT is ERC721URIStorage {
    uint256 public constant price = 0.01 ether;

    event CreatedNFT(uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("ONCHAIN NFT", "ONCH") {}

    function create(string memory svg) public payable {
        require(price <= msg.value, "Ether value sent is not correct");
        uint256 mintIndex = totalSupply();
        _safeMint(msg.sender, mintIndex);
        string memory imageURI = _svgToImageURI(svg);
        string memory tokenURI = _formatTokenURI(imageURI);
        _setTokenURI(mintIndex, tokenURI);
        emit CreatedNFT(mintIndex, tokenURI);
    }

    function _svgToImageURI(string memory svg)
        internal
        pure
        returns (string memory)
    {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(
            bytes(string(abi.encodePacked(svg)))
        );
        string memory imageURI = string(
            abi.encodePacked(baseURL, svgBase64Encoded)
        );
        return imageURI;
    }

    function _formatTokenURI(string memory imageURI)
        internal
        view
        returns (string memory)
    {
        string memory baseURL = "data:application/json;base64,";
        string memory json = Base64.encode(
            bytes(
                abi.encodePacked(
                    '{"name": "',
                    ERC721.name(),
                    '", "description": "{desc}", "attributes": "", "image": "',
                    imageURI,
                    '"}'
                )
            )
        );

        string memory tokenURI = string(abi.encodePacked(baseURL, json));
        return tokenURI;
    }
}
