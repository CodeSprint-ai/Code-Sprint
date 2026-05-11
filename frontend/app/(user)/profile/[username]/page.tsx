'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getPublicProfile, getPublicStats, getPublicBadges } from '@/services/profileApi';
import {
    ProfileHeader,
    StatsCards,
    DifficultyChart,
    SubmissionHeatmap,
    BadgesGrid,
    LanguageChart,
} from '@/components/profile';
import { Skeleton } from '@/components/ui/skeleton';

export default function PublicProfilePage() {
    const params = useParams();
    const username = params.username as string;

    const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
        queryKey: ['profile', username],
        queryFn: () => getPublicProfile(username),
        enabled: !!username,
    });

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['profile-stats', username],
        queryFn: () => getPublicStats(username),
        enabled: !!username,
    });

    const { data: badges = [], isLoading: badgesLoading } = useQuery({
        queryKey: ['profile-badges', username],
        queryFn: () => getPublicBadges(username),
        enabled: !!username,
    });

    if (profileLoading) {
        return (
            <div className="max-w-6xl mx-auto space-y-6 py-8 px-4">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-64 rounded-2xl" />
                    <Skeleton className="h-64 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (profileError || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">User Not Found</h1>
                    <p className="text-slate-400">The profile you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Profile Header */}
                <ProfileHeader profile={profile} />

                {/* Stats Cards */}
                <StatsCards stats={profile.stats} />

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Difficulty Chart */}
                    {stats && (
                        <DifficultyChart distribution={stats.difficultyDistribution} />
                    )}

                    {/* Language Usage */}
                    {stats && (
                        <LanguageChart usage={stats.languageUsage} />
                    )}
                </div>

                {/* Submission Heatmap */}
                {stats && (
                    <SubmissionHeatmap data={stats.submissionHeatmap} />
                )}

                {/* Badges */}
                <BadgesGrid badges={badges} />
            </div>
        </div>
    );
}
