"use client";
import React from "react";
import { ProblemCard } from "@/components/ProblemCard";

import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardContainer = () => {
  // const { user } = useSelector((state: RootState) => state.auth);
  // const [profile, setProfile] = useState<any>(null);
  // const dispatch = useDispatch();
  // const { setTheme } = useTheme();

  // useEffect(() => {
  //     api
  //         .get("/user/me")
  //         .then((res) => setProfile(res.data))
  //         .catch(() => dispatch(logout()));
  // }, [dispatch]);

  return (
    <div className="text-lg">
      {/* profile?.name || user?.name */}
      Welcome, <span className="font-semibold">{"Usman"}</span>
    </div>
  );
};

export default DashboardContainer;

// <div className="p-6">
//   {/* Header */}
//   <div className="flex justify-between items-center mb-6">
//     <h1 className="text-2xl font-bold">Dashboard</h1>
//     <Button
//       variant="destructive"
//       // onClick={() => dispatch(logout())}
//     >
//       Logout
//     </Button>
//   </div>

//   {/* Welcome Section */}
//   <div className="text-lg">
//     {/* profile?.name || user?.name */}
//     Welcome, <span className="font-semibold">{"Usman"}</span>
//   </div>
// </div>
