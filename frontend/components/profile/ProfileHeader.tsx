'use client';

import React from 'react';
import { Github, Linkedin, Twitter, Globe, MapPin, Calendar } from 'lucide-react';
import { PublicProfile } from '@/types/profile';

interface ProfileHeaderProps {
    profile: PublicProfile;
}

const levelColors: Record<string, string> = {
    BEGINNER: 'bg-green-500/20 text-green-400 border-green-500/30',
    INTERMEDIATE: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    ADVANCED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    EXPERT: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

export function ProfileHeader({ profile }: ProfileHeaderProps) {
    const joinDate = new Date(profile.joinedAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 p-8">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent" />

            <div className="relative flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                            {profile.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                                    <span className="text-4xl font-bold text-white">
                                        {profile.name?.charAt(0) || profile.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                        {/* Level badge */}
                        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium border ${levelColors[profile.level] || levelColors.BEGINNER}`}>
                            {profile.level}
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-white">{profile.name || profile.username}</h1>
                        <span className="text-slate-400">@{profile.username}</span>
                    </div>

                    {profile.bio && (
                        <p className="text-slate-300 mb-4 max-w-2xl">{profile.bio}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                        {profile.country && (
                            <div className="flex items-center gap-1.5">
                                <MapPin size={16} />
                                <span>{profile.country}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Calendar size={16} />
                            <span>Joined {joinDate}</span>
                        </div>
                    </div>

                    {/* Social links */}
                    {profile.socialLinks && Object.values(profile.socialLinks).some(Boolean) && (
                        <div className="flex gap-3 mt-4">
                            {profile.socialLinks.github && (
                                <a
                                    href={`https://github.com/${profile.socialLinks.github}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                    <Github size={20} className="text-slate-300" />
                                </a>
                            )}
                            {profile.socialLinks.linkedin && (
                                <a
                                    href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                    <Linkedin size={20} className="text-slate-300" />
                                </a>
                            )}
                            {profile.socialLinks.twitter && (
                                <a
                                    href={`https://twitter.com/${profile.socialLinks.twitter}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                    <Twitter size={20} className="text-slate-300" />
                                </a>
                            )}
                            {profile.socialLinks.website && (
                                <a
                                    href={profile.socialLinks.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                    <Globe size={20} className="text-slate-300" />
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Rank badge (top right) */}
                {profile.stats.rank && (
                    <div className="absolute top-4 right-4 md:static md:flex-shrink-0">
                        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-yellow-400">#{profile.stats.rank}</div>
                            <div className="text-xs text-slate-400 uppercase tracking-wide">Global Rank</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileHeader;
