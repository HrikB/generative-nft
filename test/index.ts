import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC721, GenArt, GenArt__factory } from "../typechain";

const { constants } = ethers;
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

let GenArtContr: GenArt__factory;
let genArtDeploy: GenArt;
const artName = "Rasha Collection";
const artSymbol = "RSHC";
const MAX_SUPPLY = 12;
const MINT_PRICE = 0.1;
let accounts;

let minter1: SignerWithAddress;
let minter2: SignerWithAddress;
let minter3: SignerWithAddress;
// const provider = waffle.provider;
describe("GenArt", function () {
  beforeEach(async () => {
    GenArtContr = await ethers.getContractFactory("GenArt");

    accounts = await ethers.getSigners();
    [minter1, minter2, minter3] = accounts;
  });

  describe("constructor()", () => {
    beforeEach(async () => {
      genArtDeploy = await GenArtContr.deploy(artName, artSymbol, MAX_SUPPLY);
      await genArtDeploy.deployed();
    });

    it("Should set ERC721 _name and _symbol variables", async () => {
      const actualName = await genArtDeploy.name();
      const actualSymbol = await genArtDeploy.symbol();
      expect(actualName).to.equal(artName);
      expect(actualSymbol).to.equal(artSymbol);
    });
  });

  describe("supportsInterface()", () => {
    beforeEach(async () => {
      genArtDeploy = await GenArtContr.deploy(artName, artSymbol, MAX_SUPPLY);
      await genArtDeploy.deployed();
    });

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
    beforeEach(async () => {
      genArtDeploy = await GenArtContr.deploy(artName, artSymbol, MAX_SUPPLY);
      await genArtDeploy.deployed();
    });

    it("Should start off as false", async () => {
      expect(await genArtDeploy.isSaleActive()).to.equal(false);
    });

    it("Should be true after function run", async () => {
      await genArtDeploy.activateSale();
      expect(await genArtDeploy.isSaleActive()).to.equal(true);
    });
  });

  describe("mintArt()", () => {
    beforeEach(async () => {
      genArtDeploy = await GenArtContr.deploy(artName, artSymbol, MAX_SUPPLY);
      await genArtDeploy.deployed();
    });

    it("Should fail if sale is inactive", async () => {
      await expect(genArtDeploy.connect(minter1).mintArt(1)).to.be.revertedWith(
        "The sale must be active to mint"
      );
    });

    describe("If sale is active", () => {
      beforeEach(async () => {
        genArtDeploy = await GenArtContr.deploy(artName, artSymbol, MAX_SUPPLY);
        await genArtDeploy.deployed();
        const activateSale = await genArtDeploy.activateSale();
        activateSale.wait();
      });

      it("Should fail if the amount being minted would exceed the maximum supply", async () => {
        for (let i = 0; i < 5; i++) {
          await genArtDeploy.connect(minter1).mintArt(1, {
            value: ethers.utils.parseUnits(MINT_PRICE.toString(), "ether"),
          });
        }
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

  describe("balanceOf() and totalSupply()", () => {
    const amount1 = 2;
    const amount2 = 4;

    beforeEach(async () => {
      genArtDeploy = await GenArtContr.deploy(artName, artSymbol, MAX_SUPPLY);
      await genArtDeploy.deployed();
      await genArtDeploy.activateSale();
      await genArtDeploy.connect(minter1).mintArt(amount1, {
        value: ethers.utils.parseUnits(
          (MINT_PRICE * amount1).toString(),
          "ether"
        ),
      });
      await genArtDeploy.connect(minter2).mintArt(amount2, {
        value: ethers.utils.parseUnits(
          (MINT_PRICE * amount2).toString(),
          "ether"
        ),
      });
    });

    it("Should revert with 0 address query", async () => {
      await expect(
        genArtDeploy.balanceOf(constants.AddressZero)
      ).to.be.revertedWith("ERC721: balance query for zero address");
    });

    it("Should return appropriate balance of amount for minter1 and amount2 for minter2", async () => {
      expect(await genArtDeploy.balanceOf(minter1.address)).to.equal(amount1);
      expect(await genArtDeploy.balanceOf(minter2.address)).to.equal(amount2);
    });

    it("Should return total supply of 11", async () => {
      expect(await genArtDeploy.totalSupply()).to.equal(amount1 + amount2);
    });
  });

  describe("mappings", async () => {
    const amount1 = 2;
    const amount2 = 4;

    beforeEach(async () => {
      genArtDeploy = await GenArtContr.deploy(artName, artSymbol, MAX_SUPPLY);
      await genArtDeploy.deployed();
      await genArtDeploy.activateSale();
      await genArtDeploy.connect(minter1).mintArt(amount1, {
        value: ethers.utils.parseUnits(
          (MINT_PRICE * amount1).toString(),
          "ether"
        ),
      });
      await genArtDeploy.connect(minter2).mintArt(amount2, {
        value: ethers.utils.parseUnits(
          (MINT_PRICE * amount2).toString(),
          "ether"
        ),
      });
    });

    it("Should store token owners in _owners mapping", async () => {
      // const filter = {
      //   address: genArtDeploy.address,
      //   topics: [utils.id("Transfer(address,address,uint256)")],
      // };

      for (let i = 0; i <= amount1 + amount2; i++) {
        if (i == amount1 + amount2) return;
        if (i < amount1) {
          await genArtDeploy
            .connect(minter1)
            ["safeTransferFrom(address,address,uint256)"](
              minter1.address,
              minter2.address,
              i
            );
          expect(await genArtDeploy.ownerOf(i)).to.equal(minter2.address);
        } else {
          await genArtDeploy
            .connect(minter2)
            ["safeTransferFrom(address,address,uint256)"](
              minter2.address,
              minter1.address,
              i
            );
          expect(await genArtDeploy.ownerOf(i)).to.equal(minter1.address);
        }
      }
    });
  });

  describe("Approvals", () => {
    const amount1 = 2;
    const amount2 = 4;

    beforeEach(async () => {
      genArtDeploy = await GenArtContr.deploy(artName, artSymbol, MAX_SUPPLY);
      await genArtDeploy.deployed();
      await genArtDeploy.activateSale();
      await genArtDeploy.connect(minter1).mintArt(amount1, {
        value: ethers.utils.parseUnits(
          (MINT_PRICE * amount1).toString(),
          "ether"
        ),
      });
      await genArtDeploy.connect(minter2).mintArt(amount2, {
        value: ethers.utils.parseUnits(
          (MINT_PRICE * amount2).toString(),
          "ether"
        ),
      });
    });

    it("Should fail if owner is trying to approve themselves", async () => {
      await expect(
        genArtDeploy.connect(minter1).approve(minter1.address, 1)
      ).to.be.revertedWith("ERC721: approval to current owner");
    });

    it("Should fail if non-owner of token is trying to approve", async () => {
      await expect(
        genArtDeploy.connect(minter1).approve(minter3.address, 4)
      ).to.be.revertedWith(
        "ERC721: approve caller is not owner nor approved for all"
      );
    });

    it("Should update mapping on successful approval", async () => {
      await genArtDeploy.connect(minter1).approve(minter2.address, 0);
      expect(await genArtDeploy.getApproved(0)).to.equal(minter2.address);
    });

    it("Should allow approved to transfer item", async () => {
      await genArtDeploy.connect(minter1).approve(minter2.address, 0);
      await genArtDeploy
        .connect(minter2)
        ["safeTransferFrom(address,address,uint256)"](
          minter1.address,
          minter3.address,
          0
        );
      expect(await genArtDeploy.ownerOf(0)).to.equal(minter3.address);
    });

    it("Should allow addresses that are Approved for all to control all their assets", async () => {
      await genArtDeploy
        .connect(minter2)
        .setApprovalForAll(minter1.address, true);

      for (let i = 2; i <= 4; i++) {
        await genArtDeploy
          .connect(minter1)
          ["safeTransferFrom(address,address,uint256)"](
            minter2.address,
            minter3.address,
            i
          );
        expect(await genArtDeploy.ownerOf(i)).to.equal(minter3.address);
      }
      await genArtDeploy
        .connect(minter2)
        .setApprovalForAll(minter1.address, false);

      await expect(
        genArtDeploy
          .connect(minter1)
          ["safeTransferFrom(address,address,uint256)"](
            minter2.address,
            minter3.address,
            5
          )
      ).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
    });
  });
});
