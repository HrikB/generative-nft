import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, getChainId } = hre;
  //@ts-ignore
  const { deploy, log } = deployments;
  //@ts-ignore
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  log("------------------------------------------------");
  if (chainId === "31337") {
  }
};

func.tags = ["all"];
export default func;
