import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

export const useConnectWallet = () => {
  const [provider, setProvider] = useState<Web3Provider>();

  useEffect(() => {
    (async () => {
      const web3Modal = new Web3Modal({
        network: "rinkeby",
        cacheProvider: true,
      });

      const instance = await web3Modal.connect();

      setProvider(new ethers.providers.Web3Provider(instance));
    })();
  });

  return provider;
};
