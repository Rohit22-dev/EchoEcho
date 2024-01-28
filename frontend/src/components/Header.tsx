import React from "react";
import { ModeToggle } from "./theme-toggle";

const Header = () => {
  return (
    <div className="border border-secondary p-2 px-20 justify-between flex items-center h-fit">
      <div className="text-2xl">Header</div>
      <ModeToggle />
    </div>
  );
};

export default Header;
