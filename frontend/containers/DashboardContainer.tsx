"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";
import SprintDashboardContainer from "@/components/Sprint/SprintDashboardContainer";
import { DashboardHero } from "@/components/Dashboard/DashboardHero";
import {
  RankPanel,
  RecentActivity,
  LearningPath,
  WeeklyVelocityCard,
  MasteryCard,
  ChallengeCard,
} from "@/components/Dashboard/DashboardWidgets";

const DashboardContainer = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 animate-fade-in pb-10">

      <DashboardHero />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Charts & Stats) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Weekly Velocity Card */}
          <WeeklyVelocityCard />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mastery Card */}
            <MasteryCard />

            {/* Challenge Card */}
            <ChallengeCard />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Rank Panel */}
          <RankPanel />

          {/* Recent Activity */}
          <RecentActivity />

          {/* Learning Path */}
          <LearningPath />
        </div>
      </div>
      {/* <SprintDashboardContainer /> */}
    </div>
  );
};

export default DashboardContainer;

