import React from "react";
import { ModeToggle } from "./theme-toggle";

const Header = () => {
  return (
    <div className="border border-secondary p-2 h-fit w-full">
      <div className="w-4/5 justify-between flex items-center mx-auto">
        <div className="text-2xl">Echo Echo</div>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
