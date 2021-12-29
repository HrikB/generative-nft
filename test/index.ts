import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
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
    it("Should revert with 0 address query", async () => {
      await expect(erc721.balanceOf(constants.AddressZero)).to.be.revertedWith(
        "ERC721: balance query for zero address"
      );
    });
  });

  describe("ownerOf()", () => {
    it("Should revert if token does not exist", async () => {
      await expect(erc721.ownerOf(1)).to.be.revertedWith(
        "ERC721: owner query for nonexistent token"
      );
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
const MAX_SUPPLY = 9;
const MINT_PRICE = 0.1;
console.log(MINT_PRICE);
let accounts;
let minter1: SignerWithAddress;

describe("GenArt", function () {
  beforeEach(async () => {
    GenArtContr = await ethers.getContractFactory("GenArt");
    genArtDeploy = await GenArtContr.deploy(artName, artSymbol, MAX_SUPPLY);
    await genArtDeploy.deployed();

    accounts = await ethers.getSigners();
    [minter1] = accounts;
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
    it("Should implement the ERC721Enumerable interface", async () => {
      expect(await erc721.supportsInterface("0x780e9d63")).to.equal(true);
    });
  });

  describe("activateSale", () => {
    it("Should start off as false", async () => {
      expect(await genArtDeploy.isSaleActive()).to.equal(false);
    });

    it("Should be true after function run", async () => {
      await genArtDeploy.activateSale();
      expect(await genArtDeploy.isSaleActive()).to.equal(true);
    });
  });

  describe("mintArt()", () => {
    it("Should fail if sale is inactive", async () => {
      await expect(genArtDeploy.connect(minter1).mintArt(1)).to.be.revertedWith(
        "The sale must be active to mint"
      );
    });

    describe("If sale is active", () => {
      beforeEach(async () => {
        const activateSale = await genArtDeploy.activateSale();
        activateSale.wait();
      });

      it("Should fail if mint amount is more than 10", async () => {
        await expect(
          genArtDeploy.connect(minter1).mintArt(11)
        ).to.be.revertedWith("Can only mint 10 tokens at a time");
      });

      it("Should fail if the amount being minted would exceed the maximum supply", async () => {
        await expect(
          genArtDeploy.connect(minter1).mintArt(10)
        ).to.be.revertedWith("Purchase would exceed maximum supply");
      });

      it("Should fail if correct amount of ether is not sent", async () => {
        await expect(
          genArtDeploy.connect(minter1).mintArt(1)
        ).to.be.revertedWith("Ether value sent is not correct");
      });

      it("Should increment total supply by mint amount", async () => {
        const amount = 7;
        await genArtDeploy.connect(minter1).mintArt(amount, {
          value: ethers.utils.parseUnits(
            (MINT_PRICE * amount).toString(),
            "ether"
          ),
        });
        await expect(await genArtDeploy.totalSupply()).to.equal(amount);
      });
    });
  });
});
