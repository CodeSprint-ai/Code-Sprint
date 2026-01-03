"use client";
import React from "react";
// import { ProblemCard } from "@/components/ProblemCard";
import { useAuthStore } from "@/store/authStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SprintDashboardContainer from "@/components/Sprint/SprintDashboardContainer";

const DashboardContainer = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="p-6">
      <div className="text-xl mb-6">
        Welcome, <span className="font-semibold">{user?.name}</span>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sprint">Sprint Mode</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="p-4 border rounded-md bg-zinc-900/50 border-zinc-800">
            <h2 className="text-lg font-semibold mb-2">Overview</h2>
            <p className="text-gray-400">Dashboard overview content goes here...</p>
            {/* Add existing overview widgets here if any */}
          </div>
        </TabsContent>

        <TabsContent value="sprint">
          <SprintDashboardContainer />
        </TabsContent>
      </Tabs>
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
