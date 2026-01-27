'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyProfile,
  getMyStats,
  getMyBadges,
  getMySavedProblems,
  updateMyProfile,
  updateMySettings,
} from '@/services/profileApi';
import ProfileHeader from './ProfileHeader';
import StatsCards from './StatsCards';
import DifficultyChart from './DifficultyChart';
import SubmissionHeatmap from './SubmissionHeatmap';
import BadgesGrid from './BadgesGrid';
import LanguageChart from './LanguageChart';
import { Loader2, Settings, Bookmark, Award, Activity, User, Save } from 'lucide-react';
import { PrivateProfile, SavedProblem, UserPreferences } from '@/types/profile';
import { toast } from 'sonner';

type TabId = 'overview' | 'badges' | 'saved' | 'settings';

export default function PrivateProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['my-profile'],
    queryFn: getMyProfile,
  });

  const { data: stats } = useQuery({
    queryKey: ['my-stats'],
    queryFn: getMyStats,
  });

  const { data: badges = [] } = useQuery({
    queryKey: ['my-badges'],
    queryFn: getMyBadges,
  });

  const { data: savedProblems = [] } = useQuery({
    queryKey: ['my-saved-problems'],
    queryFn: getMySavedProblems,
    enabled: activeTab === 'saved',
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: updateMySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      toast.success('Settings updated successfully');
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Error Loading Profile</h1>
          <p className="text-red-400 mb-2">{profileError?.message || 'Unknown error'}</p>
          <pre className="text-xs text-slate-500 bg-slate-900 p-4 rounded text-left max-w-lg overflow-auto">
            {JSON.stringify(profileError, null, 2)}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as TabId, label: 'Overview', icon: Activity },
    { id: 'badges' as TabId, label: 'Badges', icon: Award },
    { id: 'saved' as TabId, label: 'Saved Problems', icon: Bookmark },
    { id: 'settings' as TabId, label: 'Settings', icon: Settings },
  ];

  // Convert PrivateProfile to PublicProfile format for ProfileHeader
  const publicProfile = {
    ...profile,
    stats: {
      totalSolved: profile.stats.totalSolved,
      easySolved: profile.stats.easySolved,
      mediumSolved: profile.stats.mediumSolved,
      hardSolved: profile.stats.hardSolved,
      submissionSuccessRate: profile.stats.totalSubmissions > 0
        ? Math.round((profile.stats.acceptedSubmissions / profile.stats.totalSubmissions) * 1000) / 10
        : 0,
      currentStreak: profile.stats.currentStreak,
      maxStreak: profile.stats.maxStreak,
      rating: profile.stats.rating,
    },
    recentBadges: [],
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Header */}
        <ProfileHeader profile={publicProfile} />

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-700/50 pb-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.id
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <StatsCards stats={publicProfile.stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stats && <DifficultyChart distribution={stats.difficultyDistribution} />}
              {stats && <LanguageChart usage={stats.languageUsage} />}
            </div>

            {stats && <SubmissionHeatmap data={stats.submissionHeatmap} />}
          </div>
        )}

        {activeTab === 'badges' && (
          <BadgesGrid badges={badges} showAll />
        )}

        {activeTab === 'saved' && (
          <SavedProblemsTab savedProblems={savedProblems} />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            profile={profile}
            onUpdateProfile={(data) => updateProfileMutation.mutate(data)}
            onUpdateSettings={(data) => updateSettingsMutation.mutate(data)}
            isUpdating={updateProfileMutation.isPending || updateSettingsMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}

// Saved Problems Tab Component
function SavedProblemsTab({ savedProblems }: { savedProblems: SavedProblem[] }) {
  const difficultyColors = {
    EASY: 'text-green-400 bg-green-500/10',
    MEDIUM: 'text-yellow-400 bg-yellow-500/10',
    HARD: 'text-red-400 bg-red-500/10',
  };

  if (savedProblems.length === 0) {
    return (
      <div className="rounded-xl bg-slate-900/50 border border-slate-700/50 p-8 text-center">
        <Bookmark size={48} className="mx-auto text-slate-600 mb-3" />
        <p className="text-slate-400">No saved problems yet</p>
        <p className="text-sm text-slate-500">Bookmark problems while solving to see them here!</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-slate-900/50 border border-slate-700/50 overflow-hidden">
      <div className="divide-y divide-slate-700/50">
        {savedProblems.map((problem) => (
          <a
            key={problem.uuid}
            href={`/problems/${problem.problemSlug}`}
            className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              <span className="text-white font-medium">{problem.problemTitle}</span>
            </div>
            {problem.notes && (
              <span className="text-sm text-slate-400 truncate max-w-xs">{problem.notes}</span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

// Settings Tab Component
function SettingsTab({
  profile,
  onUpdateProfile,
  onUpdateSettings,
  isUpdating,
}: {
  profile: PrivateProfile;
  onUpdateProfile: (data: any) => void;
  onUpdateSettings: (data: Partial<UserPreferences>) => void;
  isUpdating: boolean;
}) {
  const [formData, setFormData] = useState({
    username: profile.username || '',
    name: profile.name || '',
    bio: profile.bio || '',
    country: profile.country || '',
    github: profile.socialLinks?.github || '',
    linkedin: profile.socialLinks?.linkedin || '',
    twitter: profile.socialLinks?.twitter || '',
    website: profile.socialLinks?.website || '',
  });

  const [preferences, setPreferences] = useState({
    theme: profile.preferences.theme,
    defaultLanguage: profile.preferences.defaultLanguage,
    emailNotifications: profile.preferences.emailNotifications,
    marketingEmails: profile.preferences.marketingEmails,
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      username: formData.username,
      name: formData.name,
      bio: formData.bio,
      country: formData.country,
      socialLinks: {
        github: formData.github,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        website: formData.website,
      },
    });
  };

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(preferences);
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className="rounded-xl bg-slate-900/50 border border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User size={20} />
          Profile Information
        </h3>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">GitHub Username</label>
              <input
                type="text"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">LinkedIn Username</label>
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 transition-colors"
          >
            {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Profile
          </button>
        </form>
      </div>

      {/* Preferences */}
      <div className="rounded-xl bg-slate-900/50 border border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Settings size={20} />
          Preferences
        </h3>
        <form onSubmit={handlePreferencesSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Theme</label>
              <select
                value={preferences.theme}
                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="SYSTEM">System</option>
                <option value="LIGHT">Light</option>
                <option value="DARK">Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Default Language</label>
              <select
                value={preferences.defaultLanguage}
                onChange={(e) => setPreferences({ ...preferences, defaultLanguage: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-white">Email notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.marketingEmails}
                onChange={(e) => setPreferences({ ...preferences, marketingEmails: e.target.checked })}
                className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-white">Marketing emails</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 transition-colors"
          >
            {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Preferences
          </button>
        </form>
      </div>
    </div>
  );
}