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
  recalculateMyStats,
  getSessions,
  revokeSession,
  revokeAllSessions,
  changePassword,
} from '@/services/profileApi';
import ProfileHeader from './ProfileHeader';
import StatsCards from './StatsCards';
import DifficultyChart from './DifficultyChart';
import SubmissionHeatmap from './SubmissionHeatmap';
import BadgesGrid from './BadgesGrid';
import LanguageChart from './LanguageChart';
import { Loader2, Settings, Bookmark, Award, Activity, User, Save, Code2, RefreshCw, Zap, Shield, Smartphone, Globe, Monitor, Trash2, Lock } from 'lucide-react';
import { PrivateProfile, SavedProblem, UserPreferences, Session } from '@/types/profile';
import { toast } from 'sonner';
import ProfileImageUpload from './ProfileImageUpload';

type TabId = 'overview' | 'badges' | 'saved' | 'settings' | 'sessions';

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

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['my-sessions'],
    queryFn: getSessions,
    enabled: activeTab === 'sessions',
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

  const recalculateStatsMutation = useMutation({
    mutationFn: recalculateMyStats,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      queryClient.invalidateQueries({ queryKey: ['my-stats'] });
      toast.success(`Stats synced! You've solved ${data.totalSolved} problems. Current streak: ${data.currentStreak} days.`);
    },
    onError: () => {
      toast.error('Failed to recalculate stats');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to change password');
    },
  });

  const revokeSessionMutation = useMutation({
    mutationFn: revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-sessions'] });
      toast.success('Session revoked successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to revoke session');
    },
  });

  const revokeAllSessionsMutation = useMutation({
    mutationFn: revokeAllSessions,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-sessions'] });
      toast.success(`Logged out from ${data.sessionsRevoked} other sessions`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to revoke all sessions');
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
    { id: 'sessions' as TabId, label: 'Sessions', icon: Shield },
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
    <div className="h-full overflow-y-auto py-8 px-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
        {/* Profile Header */}
        <ProfileHeader profile={publicProfile} />

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-white/5 px-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 text-sm font-bold px-4 transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-zinc-500 hover:text-white'
                }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <StatsCards stats={publicProfile.stats} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#09090b] border border-white/5 rounded-xl p-6 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-8 relative z-10">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-white text-sm">Problem Difficulty</h3>
                  </div>
                  {stats && <DifficultyChart distribution={stats.difficultyDistribution} />}
                </div>
                <div className="bg-[#09090b] border border-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-8">
                    <Code2 className="w-4 h-4 text-purple-400" />
                    <h3 className="font-bold text-white text-sm">Language Usage</h3>
                  </div>
                  {stats && <LanguageChart usage={stats.languageUsage} />}
                </div>
              </div>

              {stats && (
                <div className="bg-[#09090b] border border-white/5 rounded-xl p-6 overflow-hidden">
                  <div className="flex items-center gap-2 mb-8">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-white text-sm">Submission Activity</h3>
                  </div>
                  <SubmissionHeatmap data={stats.submissionHeatmap} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'badges' && (
            <BadgesGrid badges={badges} showAll />
          )}

          {activeTab === 'saved' && (
            <SavedProblemsTab savedProblems={savedProblems} />
          )}

          {activeTab === 'sessions' && (
            <SessionsTab
              sessions={sessions}
              isLoading={sessionsLoading}
              onRevoke={(id) => revokeSessionMutation.mutate(id)}
              onRevokeAll={() => revokeAllSessionsMutation.mutate()}
              isRevoking={revokeSessionMutation.isPending || revokeAllSessionsMutation.isPending}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              profile={profile}
              onUpdateProfile={(data) => updateProfileMutation.mutate(data)}
              onUpdateSettings={(data) => updateSettingsMutation.mutate(data)}
              onRecalculateStats={() => recalculateStatsMutation.mutate()}
              onChangePassword={(data) => changePasswordMutation.mutate(data)}
              isUpdating={updateProfileMutation.isPending || updateSettingsMutation.isPending}
              isRecalculating={recalculateStatsMutation.isPending}
              isChangingPassword={changePasswordMutation.isPending}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Saved Problems Tab Component
function SavedProblemsTab({ savedProblems }: { savedProblems: SavedProblem[] }) {
  const difficultyColors = {
    EASY: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    MEDIUM: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    HARD: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  if (savedProblems.length === 0) {
    return (
      <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-12 text-center backdrop-blur-sm">
        <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
          <Bookmark size={32} className="text-zinc-500" />
        </div>
        <p className="text-zinc-300 font-medium mb-1">No saved problems yet</p>
        <p className="text-sm text-zinc-500">Bookmark problems while solving to see them here!</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 overflow-hidden backdrop-blur-sm">
      <div className="divide-y divide-zinc-800">
        {savedProblems.map((problem) => (
          <a
            key={problem.uuid}
            href={`/problems/${problem.problemUuid}`}
            className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${difficultyColors[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              <span className="text-zinc-200 font-medium group-hover:text-cyan-400 transition-colors">{problem.problemTitle}</span>
            </div>
            {problem.notes && (
              <span className="text-sm text-zinc-500 truncate max-w-xs">{problem.notes}</span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

// Sessions Tab Component
function SessionsTab({
  sessions,
  isLoading,
  onRevoke,
  onRevokeAll,
  isRevoking,
}: {
  sessions: Session[];
  isLoading: boolean;
  onRevoke: (id: string) => void;
  onRevokeAll: () => void;
  isRevoking: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const currentSession = sessions.find((s) => s.isCurrent);
  const otherSessions = sessions.filter((s) => !s.isCurrent);
  const sortedSessions = currentSession ? [currentSession, ...otherSessions] : sessions;

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Shield size={20} className="text-emerald-400" />
              Active Sessions
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              Manage your active sessions across different devices and browsers.
            </p>
          </div>
          {otherSessions.length > 0 && (
            <button
              onClick={onRevokeAll}
              disabled={isRevoking}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-medium transition-colors border border-red-500/20 flex items-center gap-2"
            >
              <Trash2 size={16} />
              Revoke All Others
            </button>
          )}
        </div>

        <div className="space-y-4">
          {sortedSessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${session.isCurrent
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-zinc-800/30 border-zinc-800'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${session.isCurrent ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                  {session.device?.toLowerCase().includes('mobile') ? (
                    <Smartphone size={20} />
                  ) : (
                    <Monitor size={20} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">
                      {session.browser || 'Unknown Browser'} on {session.os || 'Unknown OS'}
                    </span>
                    {session.isCurrent && (
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20 font-medium">
                        Current Session
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Globe size={12} />
                      {session.ipAddress || 'Unknown IP'} • {session.location || 'Unknown Location'}
                    </span>
                    <span>
                      Active: {new Date(session.lastActiveAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {!session.isCurrent && (
                <button
                  onClick={() => onRevoke(session.id)}
                  disabled={isRevoking}
                  className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Revoke Session"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Settings Tab Component
// Settings Tab Component
function SettingsTab({
  profile,
  onUpdateProfile,
  onUpdateSettings,
  onRecalculateStats,
  onChangePassword,
  isUpdating,
  isRecalculating,
  isChangingPassword,
}: {
  profile: PrivateProfile;
  onUpdateProfile: (data: any) => void;
  onUpdateSettings: (data: Partial<UserPreferences>) => void;
  onRecalculateStats: () => void;
  onChangePassword: (data: any) => void;
  isUpdating: boolean;
  isRecalculating: boolean;
  isChangingPassword: boolean;
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

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    onChangePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const inputClasses = "w-full px-4 py-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800 text-white placeholder-zinc-600 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 focus:outline-none transition-all";
  const labelClasses = "block text-sm font-medium text-zinc-400 mb-1.5";

  return (
    <div className="space-y-6">
      {/* Profile Image Upload */}
      <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <User size={20} className="text-emerald-400" />
          Profile Picture
        </h3>
        <ProfileImageUpload
          currentAvatarUrl={profile.avatarUrl}
          userName={profile.name}
        />
      </div>

      {/* Profile Settings */}
      <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <User size={20} className="text-cyan-400" />
          Profile Information
        </h3>
        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className={`${inputClasses} resize-none`}
            />
          </div>

          <div>
            <label className={labelClasses}>Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>GitHub Username</label>
              <input
                type="text"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>LinkedIn Username</label>
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className={inputClasses}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium disabled:opacity-50 transition-all shadow-lg shadow-cyan-900/20"
          >
            {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Profile
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Lock size={20} className="text-red-400" />
          Change Password
        </h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div>
            <label className={labelClasses}>Current Password</label>
            <input
              type="password"
              required
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className={inputClasses}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className={inputClasses}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium disabled:opacity-50 transition-all shadow-lg shadow-red-900/20"
          >
            {isChangingPassword ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Update Password
          </button>
        </form>
      </div>

      {/* Sync Stats */}
      <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap size={20} className="text-amber-400" />
          Sync Statistics
        </h3>
        <p className="text-sm text-zinc-400 mb-4">
          Recalculate your stats from your submission history. Use this if your solved count or streak seems incorrect.
        </p>
        <button
          onClick={onRecalculateStats}
          disabled={isRecalculating}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium disabled:opacity-50 transition-all shadow-lg shadow-amber-900/20"
        >
          {isRecalculating ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          {isRecalculating ? 'Syncing...' : 'Sync My Stats'}
        </button>
      </div>

      {/* Preferences */}
      <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <Settings size={20} className="text-violet-400" />
          Preferences
        </h3>
        <form onSubmit={handlePreferencesSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>Theme</label>
              <select
                value={preferences.theme}
                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value as any })}
                className={inputClasses}
              >
                <option value="SYSTEM">System</option>
                <option value="LIGHT">Light</option>
                <option value="DARK">Dark</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Default Language</label>
              <select
                value={preferences.defaultLanguage}
                onChange={(e) => setPreferences({ ...preferences, defaultLanguage: e.target.value as any })}
                className={inputClasses}
              >
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                  className="peer sr-only"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </div>
              <span className="text-zinc-300 group-hover:text-white transition-colors">Email notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.marketingEmails}
                  onChange={(e) => setPreferences({ ...preferences, marketingEmails: e.target.checked })}
                  className="peer sr-only"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </div>
              <span className="text-zinc-300 group-hover:text-white transition-colors">Marketing emails</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium disabled:opacity-50 transition-all shadow-lg shadow-violet-900/20"
          >
            {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Preferences
          </button>
        </form>
      </div>
    </div>
  );
}