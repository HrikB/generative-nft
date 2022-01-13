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

  //Funding with LINK
  const [signer] = await ethers.getSigners();
  const linkTokenContract = await ethers.getContractFactory("LinkToken");
  const linkToken = new ethers.Contract(
    linkTokenAddress,
    linkTokenContract.interface,
    signer
  );

  let fund_tx = await linkToken.transfer(SVGNFT.address, fee);
  await fund_tx.wait(1);

  // create an NFT! by calling a random number
  const SVGNFTContract = await ethers.getContractFactory("SVGNFT");
  const svg = new ethers.Contract(
    SVGNFT.address,
    SVGNFTContract.interface,
    signer
  );

  let creation_tx = await svg.create({
    gasLimit: 300000,
    value: ethers.utils.parseUnits("0.01", "ether"),
  });
  let receipt = await creation_tx.wait(1); //tokenId is an indexed topic

  let tokenId = receipt.events[3].topics[2];
  log(`NFT minted! Token ID: ${tokenId}`);
  log(`Let's wait for the chainlink to respond... `);

  if (chainId !== "31337") {
    await new Promise((resolve) => setTimeout(resolve, 180000));

    let finish_tx = await svg.completeCreate(tokenId, { gasLimit: 3000000 });
    await finish_tx.wait(1);

    log(`You can view the tokenURI here: ${await svg.tokenURI(tokenId)}`);
  } else {
    const VRFCoordinatorMock = await deployments.get("VRFCoordinatorMock");
    const vrfCoordinator = await ethers.getContractAt(
      "VRFCoordinatorMock",
      VRFCoordinatorMock.address,
      signer
    );

    let vrf_tx = await vrfCoordinator.callBackWithRandomness(
      receipt.logs[3].topics[1],
      77777,
      SVGNFT.address
    );

    await vrf_tx.wait(1);
    log("Now mint can be finished off");

    let finish_tx = await svg.completeCreate(tokenId, { gasLimit: 3000000 });
    await finish_tx.wait(1);

    log(`You can view the tokenURI here: ${await svg.tokenURI(tokenId)}`);
  }
};

func.tags = ["all", "rsvg"];
export default func;
