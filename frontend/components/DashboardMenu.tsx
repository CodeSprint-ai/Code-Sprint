import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import ThemeSwitcher from "./ThemeSwitcher";

const DashboardMenu = () => {
  return (
    <div className="z-50 w-screen flex justify-end h-20 border-2 border-white">
      <ThemeSwitcher />
      <Button variant="destructive" onClick={() => {}}>
        Logout
      </Button>
    </div>
  );
};

export default DashboardMenu;
