import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { networkConfig } from "../helper-hardhat-config";
import { ethers } from "hardhat";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, getChainId } = hre;

  const { deploy, get, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  let linkTokenAddress, vrfCoordinatorAddress;

  log("------------------------------------------------");
  if (chainId === "31337") {
    let linkToken = await get("LinkToken");
    let vrfCoordinatorMock = await get("VRFCoordinatorMock");
    linkTokenAddress = linkToken.address;
    vrfCoordinatorAddress = vrfCoordinatorMock.address;
  } else {
    //@ts-ignore
    linkTokenAddress = networkConfig[chainId]["linkToken"];
    //@ts-ignore
    vrfCoordinatorAddress = networkConfig[chainId]["vrfCoordinator"];
  }
  //@ts-ignore
  const keyHash = networkConfig[chainId]["keyHash"];
  //@ts-ignore
  const fee = networkConfig[chainId]["fee"];
  let args = [vrfCoordinatorAddress, linkTokenAddress, keyHash, fee];
  log("------------------------------------------------");
  const SVGNFT = await deploy("SVGNFT", {
    from: deployer,
    args: args,
    log: true,
  });
  log("NFT Contract Deployed!");
  //@ts-ignore
  const networkName = networkConfig[chainId]["name"];
  log(
    `Verify with: \n npx hardhat verify --network ${networkName} ${
      SVGNFT.address
    } ${args.toString().replace(/,/g, " ")}`
  );


func.tags = ["all", "rsvg"];
export default func;
