import React from "react";

const HEADER_LABELS = ["BUY A MONKEY", "ROADMAP", "TEAM", "PROVENANCE"];

function Header() {
  return (
    <div className="h-20 flex justify-end items-center w-full px-10">
      {HEADER_LABELS.map((label) => (
        <span
          key={label}
          className="mr-10 font-display text-xxs italic hover:cursor-pointer"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

export default Header;
