import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, getChainId } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  if (chainId === "31337") {
    log("Local network detected! Deploying Mocks...");
    const LinkToken = await deploy("LinkToken", { from: deployer, log: true });
    await deploy("VRFCoordinatorMock", {
      from: deployer,
      log: true,
      args: [LinkToken.address],
    });
    log("Mocks deployed!");
  }
};

func.tags = ["all", "rsvg", "svg"];
export default func;
