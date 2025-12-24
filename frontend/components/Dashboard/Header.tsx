// import React from "react";

// import { Moon, Sun } from "lucide-react";
// import { useTheme } from "next-themes";
// import ThemeSwitcher from "../ThemeSwitcher";
// import { Button } from "../ui/button";
// import { useAuth } from "@/hooks/useAuth";

// const Header = () => {
//   const { logout } = useAuth();

//   return (
//     <div className=" flex justify-center items-center w-screen  h-20 ">
//       <div className="flex justify-between w-full mx-5    ">
//         <div className="flex items-center">Code Sprint</div>
//         <div className="flex items-center space-x-4">
//           {/* <ThemeSwitcher /> */}
//           <Button
//             // variant="destructive"
//             onClick={async () => {
//               await logout();
//             }}
//           >
//             Logout
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;




import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
// import Link from "next/link";

const Header = () => {
  const { logout } = useAuth();

  return (
    <header
      className="
        w-full
        h-16
        bg-gradient-to-r from-black/80 via-black/70 to-emerald-900/60
        backdrop-blur-lg
        border-b border-white/10
      "
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Title */}
        <div className="text-2xl font-bold text-green-500 ">
          CodeSprintAI
        </div>

        {/* Actions */}
        <Button
          onClick={async () => await logout()}
          className="
            bg-white/10
            text-white
            border border-white/20
            hover:bg-red-500/20
            hover:border-red-500/30
            transition-all
            duration-300
            flex items-center gap-2
          "
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;
