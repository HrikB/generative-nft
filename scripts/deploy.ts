// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // // We get the contract to deploy
  // const Greeter = await ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Hardhat!");

  // await greeter.deployed();

  // console.log("Greeter deployed to:", greeter.address);
  const SVG = await ethers.getContractFactory("SVGNFT");
  const svgDeploy = await SVG.deploy();

  await svgDeploy.deployed();
  console.log("SVGNFT deployed to ", svgDeploy.address);

  let fPath = __dirname + "/blob.svg";
  let svg = fs.readFileSync(fPath, { encoding: "utf8" });

  const [minter] = await ethers.getSigners();

  await svgDeploy
    .connect(minter)
    .create(svg, { value: ethers.utils.parseUnits("0.01", "ether") });

  const tokenURI = await svgDeploy.tokenURI(0);
  console.log(tokenURI);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
