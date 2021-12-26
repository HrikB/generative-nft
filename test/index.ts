import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC721 } from "../typechain";

const { utils } = ethers;
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
//@ts-ignore
let erc721: ERC721;
describe("ERC721", function () {
  beforeEach(async () => {
    ERC721Contr = await ethers.getContractFactory("ERC721");
    erc721 = await ERC721Contr.deploy("Bored Ape Yacht Club", "BAYC");
    await erc721.deployed();
  });

  describe("supportsInterface", async () => {
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
