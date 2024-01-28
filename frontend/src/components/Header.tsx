import React from "react";
import { ModeToggle } from "./theme-toggle";

const Header = () => {
  return (
    <div className="h-fit border border-secondary p-2 px-20 flex-1 justify-between flex items-center">
      <div className="text-2xl">Header</div>
      <ModeToggle />
    </div>
  );
};

export default Header;
