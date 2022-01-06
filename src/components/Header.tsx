import React from "react";

const HEADER_LABELS = ["BUY A MONKEY", "ROADMAP", "TEAM", "PROVENANCE"];

function Header() {
  return (
    <div className="h-20 flex justify-end items-center w-full">
      {HEADER_LABELS.map((label) => (
        <span className="mr-10 font-display text-sm italic hover:cursor-pointer">
          {label}
        </span>
      ))}
    </div>
  );
}

export default Header;
