import React from "react";

const HEADER_LABELS = ["BUY A MONKEY", "ROADMAP", "TEAM", "PROVENANCE"];

function Header() {
  return (
    <div className="h-20 flex justify-end items-center w-full">
      {HEADER_LABELS.map((label) => (
        <span key={label} className="mr-10 text-sm italic hover:cursor-pointer">
          {label}
        </span>
      ))}
    </div>
  );
}

export default Header;
