import { ethers, network } from "hardhat";
// import fs from "fs";

async function main() {
  if (network.config.chainId == 31337) {
    //Localhost Hardhat node
  }

  const SVG = await ethers.getContractFactory("SVGNFT");
  const svgDeploy = await SVG.deploy();

  await svgDeploy.deployed();
  console.log("SVGNFT deployed to ", svgDeploy.address);

  // let fPath = __dirname + "/blob1.svg";
  // let svg = fs.readFileSync(fPath, { encoding: "utf8" });

  // const svgDeploy = SVG.attach("0x590Bf53513fa5b3a8F4b999d918B6a7d4044E13B");
  const [minter] = await ethers.getSigners();
  await svgDeploy.connect(minter).create({
    value: ethers.utils.parseUnits("0.01", "ether"),
    gasLimit: "1650000",
  });

  const tokenURI = await svgDeploy.tokenURI(0);
  console.log(tokenURI);
  const owner = await svgDeploy.ownerOf(0);
  console.log(owner);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
