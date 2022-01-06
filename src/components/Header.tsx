import React from "react";
import "./Header.css";

const HEADER_LABELS = ["BUY A MONKEY", "ROADMAP", "TEAM", "PROVENANCE"];

function Header() {
  return (
    <div className="header text-3xl">
      {HEADER_LABELS.map((label) => (
        <span className="header__labels">{label}</span>
      ))}
    </div>
  );
}

export default Header;
