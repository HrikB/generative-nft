import { ethers, network } from "hardhat";
// import fs from "fs";

async function main() {
  if (network.config.chainId === 31337) {
    console.log("Local network detected! Deploying Mocks...");
    const LinkToken = await ethers.getContractFactory("LinkToken");
    const linkToken = await LinkToken.deploy();
    const VRFCoordinatorMock = await ethers.getContractFactory(
      "VRFCoordinatorMock"
    );
    const vrfCoordinatorMock = await VRFCoordinatorMock.deploy();
    await linkToken.deployed();
    await vrfCoordinatorMock.deployed();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
