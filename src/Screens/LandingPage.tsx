import React from "react";
import { useNavigate } from "react-router-dom";
import LandingVid from "../assets/club-landing.mp4";

const QuickDesc =
  "A limited NFT collection where the token itself doubles as your membership to a swamp club for apes. The club is open! Ape in with us.";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="relative mt-16">
        <div className="w-11/12 mx-auto h-fit mb-5">
          <video autoPlay loop className="w-full" src={LandingVid} />
          <div className="absolute bottom-0 bg-black w-96 h-2/6 flex">
            <div className="w-9/12 mx-2 border-b-white border-b h-full flex justify-center flex-col">
              <h1 className="text-landing-title leading-8 font-extrabold italic font-display mb-5 w-11/12">
                Welcome to the Bored Ape Yacht Club
              </h1>
              <button
                onClick={() => navigate("/home")}
                className="bg-swamp rounded-md w-full h-12"
              >
                <p className="bg-swamp text-black font-bold">Enter</p>
              </button>
            </div>
            <div className="relative w-3/12">
              <p className="animate-pulsefull  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap font-display font-medium italic text-scroll">
                ← SCROLL DOWN
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-11/12 mx-auto h-fit mb-5">
        <p className="px-5 py-10 normal-case w-8/12 border-b border-b-white">
          {QuickDesc}
        </p>
      </div>
    </>
  );
}

export default LandingPage;
