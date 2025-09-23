import React from "react";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import ThemeSwitcher from "../ThemeSwitcher";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <div className=" flex justify-center items-center w-screen  h-20 ">
      <div className="flex justify-between w-full mx-5    ">
        <div className="flex items-center">
            Code Sprint
        </div>
        <div className="flex items-center space-x-4">
          <ThemeSwitcher />
          <Button variant="destructive" onClick={() => {}}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
