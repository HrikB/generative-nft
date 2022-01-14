import { useEffect } from "react";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { VRFCoordiantor, LinkToken, BSYC } from "../contracts";

const fee = "100000000000000000"; //0.1 Link

const useMint = (provider: Web3Provider) => {
  useEffect(() => {
    (async () => {
      //Funding with LINK
      const signer = provider.getSigner();
      const linkToken = new ethers.Contract(
        LinkToken.ADDRESS,
        LinkToken.ABI,
        signer
      );

      let fund_tx = await linkToken.transfer(BSYC.ADDRESS, fee);
      await fund_tx.wait(1);

      // create an NFT! by calling a random number
      const svg = new ethers.Contract(BSYC.ADDRESS, BSYC.ABI, signer);

      let creation_tx = await svg.create({
        gasLimit: 300000,
        value: ethers.utils.parseUnits("0.01", "ether"),
      });
      let receipt = await creation_tx.wait(1); //tokenId is an indexed topic

      let tokenId = receipt.events[3].topics[2];
      console.log(`NFT minted! Token ID: ${tokenId}`);
      console.log(`Let's wait for the chainlink to respond... `);

      await new Promise((resolve) => setTimeout(resolve, 6000));

      let finish_tx = await svg.completeCreate(tokenId, {
        gasLimit: 3000000,
      });
      await finish_tx.wait(1);

      console.log(
        `You can view the tokenURI here: ${await svg.tokenURI(tokenId)}`
      );
    })();
  });
};

export default useMint;
