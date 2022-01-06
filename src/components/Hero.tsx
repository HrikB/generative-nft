import React from "react";
import HeroImg from "../assets/heroimg.png";

function Hero() {
  return (
    <div className="hero__container">
      <img
        className="w-11/12 mx-auto my-0"
        src={HeroImg}
        alt="Hero Image"
      ></img>
    </div>
  );
}

export default Hero;
