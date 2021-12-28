import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC721, GenArt } from "../typechain";

const { utils, constants } = ethers;
// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();
//     expect(await greeter.greet()).to.equal("Hello, world!");
//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
//     // wait until the transaction is mined
//     await setGreetingTx.wait();
//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });

let ERC721Contr;
let erc721: ERC721;
const name = "Bored Ape Yacht Club";
const symbol = "BAYC";

describe("ERC721", function () {
  beforeEach(async () => {
    ERC721Contr = await ethers.getContractFactory("ERC721");
    erc721 = await ERC721Contr.deploy(name, symbol);
    await erc721.deployed();
  });

  describe("supportsInterface()", () => {
    it("Should implement the ERC165 interface", async () => {
      expect(await erc721.supportsInterface("0x01ffc9a7")).to.equal(true);
    });

    it("Should implement the ERC721 interface", async () => {
      expect(await erc721.supportsInterface("0x80ac58cd")).to.equal(true);
    });

    it("Should implement the ERC721Metadata interface", async () => {
      expect(await erc721.supportsInterface("0x5b5e139f")).to.equal(true);
    });
  });

  describe("balanceOf()", () => {
    it("Should revert with 0 address query", () => {
      expect(erc721.balanceOf(constants.AddressZero))
        .to.be.revertedWith(
          "Error: VM Exception while processing transaction: reverted with reason string 'ERC721: balance query for zero address'"
        )
        .catch((err) => {});
    });
  });

  describe("ownerOf()", () => {
    it("Should revert if token does not exist", () => {
      expect(erc721.ownerOf(1))
        .to.be.revertedWith(
          "Error: VM Exception while processing transaction: reverted with reason string 'ERC721: owner query for nonexistent token'"
        )
        .catch((err) => {});
    });
  });

  describe("NFT attributes", () => {
    it("Should return the correct name", async () => {
      expect(await erc721.name()).to.equal(name);
    });

    it("Should return the correct symbol", async () => {
      expect(await erc721.symbol()).to.equal(symbol);
    });
  });
});

let GenArtContr;
let genArtDeploy: GenArt;
const artName = "Rasha Collection";
const artSymbol = "RSHC";

describe("GenArt", function () {
  beforeEach(async () => {
    GenArtContr = await ethers.getContractFactory("GenArt");
    genArtDeploy = await GenArtContr.deploy(artName, artSymbol);
    await genArtDeploy.deployed();
  });

  describe("constructor()", () => {
    it("Should set ERC721 _name and _symbol variables", async () => {
      const actualName = await genArtDeploy.name();
      const actualSymbol = await genArtDeploy.symbol();
      expect(actualName).to.equal(artName);
      expect(actualSymbol).to.equal(artSymbol);
    });
  });

  describe("supportsInterface()", () => {
    it("Should implement the ERC165 interface", async () => {
      expect(await erc721.supportsInterface("0x01ffc9a7")).to.equal(true);
    });

    it("Should implement the ERC721 interface", async () => {
      expect(await erc721.supportsInterface("0x80ac58cd")).to.equal(true);
    });

    it("Should implement the ERC721Metadata interface", async () => {
      expect(await erc721.supportsInterface("0x5b5e139f")).to.equal(true);
    });
  });
});
