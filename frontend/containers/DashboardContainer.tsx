"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { DashboardHero } from "@/components/Dashboard/DashboardHero";
import {
  RankPanel,
  RecentActivity,
  LearningPath,
  WeeklyVelocityCard,
  MasteryCard,
  ChallengeCard,
} from "@/components/Dashboard/DashboardWidgets";
import {
  getDashboardStats,
  getRecentSubmissions,
  getWeeklyActivity,
  DashboardStats,
  RecentSubmission,
  WeeklyActivityEntry,
} from "@/services/dashboardApi";

const DashboardContainer = () => {
  const user = useAuthStore((state) => state.user);

  // State for dashboard data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<{
    data: WeeklyActivityEntry[];
    total: number;
    percentChange: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const [statsData, submissions, activity] = await Promise.all([
          getDashboardStats(),
          getRecentSubmissions(5),
          getWeeklyActivity(),
        ]);

        setStats(statsData);
        setRecentSubmissions(submissions);
        setWeeklyActivity(activity);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 animate-fade-in pb-10">

      <DashboardHero />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Charts & Stats) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Weekly Velocity Card */}
          <WeeklyVelocityCard
            weeklyData={weeklyActivity?.data}
            total={weeklyActivity?.total ?? 0}
            percentChange={weeklyActivity?.percentChange ?? 0}
            isLoading={isLoading}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mastery Card */}
            <MasteryCard
              easy={stats?.easySolved ?? 0}
              medium={stats?.mediumSolved ?? 0}
              hard={stats?.hardSolved ?? 0}
              isLoading={isLoading}
            />

            {/* Challenge Card */}
            <ChallengeCard />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Rank Panel - Shows streak for now */}
          <RankPanel
            totalSolved={stats?.totalSolved ?? 0}
            currentStreak={stats?.currentStreak ?? 0}
          />

          {/* Recent Activity */}
          <RecentActivity
            activities={recentSubmissions.map(s => ({
              title: s.title,
              status: s.status,
              lang: s.lang,
              problemUuid: s.problemUuid,
            }))}
            isLoading={isLoading}
          />

          {/* Learning Path */}
          <LearningPath />
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;
