// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721/ERC721URIStorage.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "base64-sol/base64.sol";
import "hardhat/console.sol";

contract SVGNFT is ERC721URIStorage, VRFConsumerBase {
    using Strings for uint256;

    uint256 public constant price = 0.01 ether;

    bytes32 public keyHash;
    uint256 public fee;

    //SVG Params
    uint256 public immutable maxPaths;
    uint256 public immutable maxPathCommands;
    uint256 public immutable size;
    string[] public pathCommands;
    string[] public colors;

    mapping(bytes32 => address) private requestIdToSender;
    mapping(bytes32 => uint256) private requestIdToTokenId;
    mapping(uint256 => uint256) private tokenIdToRandomNumber;

    event CreatedNFT(uint256 indexed tokenId, string tokenURI);
    event requestedRandomSVG(
        bytes32 indexed requestId,
        uint256 indexed tokenId
    );
    event CreatedUnfinishedRandomSVG(
        uint256 indexed tokenId,
        uint256 randomNumber
    );

    constructor(
        address _VRFCoordinator,
        address _linkToken,
        bytes32 _keyhash,
        uint256 _fee
    )
        VRFConsumerBase(_VRFCoordinator, _linkToken)
        ERC721("ONCHAIN NFT", "ONCH ")
    {
        fee = _fee;
        keyHash = _keyhash;
        maxPaths = 10;
        maxPathCommands = 5;
        size = 500;
        pathCommands = ["M", "L"];
        colors = ["red", "blue", "green", "yellow", "black", "white"];
    }

    function create() external payable returns (bytes32 requestId) {
        require(price <= msg.value, "Ether value sent is not correct");
        uint256 mintIndex = totalSupply();
        requestId = requestRandomness(keyHash, fee);
        requestIdToSender[requestId] = msg.sender;
        requestIdToTokenId[requestId] = mintIndex;
        emit requestedRandomSVG(requestId, mintIndex);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomNumber)
        internal
        override
    {
        address nftOwner = requestIdToSender[requestId];
        uint256 tokenId = requestIdToTokenId[requestId];
        _safeMint(nftOwner, tokenId);
        tokenIdToRandomNumber[tokenId] = randomNumber;
        emit CreatedUnfinishedRandomSVG(tokenId, randomNumber);
    }

    function completeCreate(uint256 _tokenId) external {
        require(
            bytes(tokenURI(_tokenId)).length <= 0,
            "SVGNFT: tokenURI is already all set!"
        );
        require(_exists(_tokenId), "SVGNFT: TokenId has not been minted");
        require(
            tokenIdToRandomNumber[_tokenId] > 0,
            "SVGNFT: Need to wait for ChainLink VRF"
        );

        uint256 randomNumber = tokenIdToRandomNumber[_tokenId];
        string memory svg = generateSVG(randomNumber);
        string memory imageURI = _svgToImageURI(svg);
        string memory tokenURI = _formatTokenURI(imageURI);
        _setTokenURI(_tokenId, tokenURI);
        emit CreatedNFT(_tokenId, svg);
    }

    function generateSVG(uint256 _randomNumber)
        private
        returns (string memory finalSvg)
    {
        uint256 numberOfPaths = (_randomNumber % maxPaths) + 1;
        //opening svg tag
        finalSvg = string(
            abi.encodePacked(
                "<svg xmlns='http://www.w3.org/2000/svg' height='",
                size.toString(),
                "' width='",
                size.toString(),
                "'>"
            )
        );

        //path tags
        for (uint256 i = 0; i < numberOfPaths; i++) {
            uint256 newRNG = uint256(keccak256(abi.encode(_randomNumber, i)));
            string memory pathSvg = generatePath(newRNG);
            finalSvg = string(abi.encodePacked(finalSvg, pathSvg));
        }

        //closing svg tag
        finalSvg = string(abi.encodePacked(finalSvg, "</svg>"));
    }

    function generatePath(uint256 _randomNumber)
        private
        returns (string memory pathSvg)
    {
        uint256 numberOfPathCommands = (_randomNumber % maxPathCommands) + 1;
        pathSvg = "<path d='";
        for (uint256 i = 0; i < numberOfPathCommands; i++) {
            uint256 newRNG = uint256(
                keccak256(abi.encode(_randomNumber, size + i))
            );
            string memory pathCommand = generatePathCommand(newRNG);
            pathSvg = string(abi.encodePacked(pathSvg, pathCommand));
        }
        string memory color = colors[_randomNumber % colors.length];
        pathSvg = string(
            abi.encodePacked(pathSvg, "' fill='orange' stroke='", color, "'/>")
        );
    }

    function generatePathCommand(uint256 _randomNumber)
        private
        view
        returns (string memory pathCommand)
    {
        pathCommand = pathCommands[_randomNumber % pathCommands.length];
        uint256 parameterOne = uint256(
            keccak256(abi.encode(_randomNumber, size * 2))
        ) % size;
        uint256 parameterTwo = uint256(
            keccak256(abi.encode(_randomNumber, size * 3))
        ) % size;

        pathCommand = string(
            abi.encodePacked(
                pathCommand,
                " ",
                parameterOne.toString(),
                " ",
                parameterTwo.toString()
            )
        );
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
        pure
        returns (string memory)
    {
        string memory baseURL = "data:application/json;base64,";
        string memory json = Base64.encode(
            bytes(
                abi.encodePacked(
                    '{"name": "ONCHAIN NFT", "description": "{desc}", "attributes": "", "image": "',
                    imageURI,
                    '"}'
                )
            )
        );

        string memory tokenURI = string(abi.encodePacked(baseURL, json));
        return tokenURI;
    }
}
