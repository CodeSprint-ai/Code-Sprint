'use client';

import React from 'react';
import { PublicProfile } from '@/types/profile';
import { MapPin, Calendar, Github, Linkedin, Twitter, Globe, Edit2, Shield } from 'lucide-react';

interface ProfileHeaderProps {
    profile: PublicProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
    return (
        <div className="relative rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800 backdrop-blur-md">
            {/* Banner/Background Gradient */}
            <div className="h-32 bg-gradient-to-r from-cyan-900/20 via-violet-900/20 to-fuchsia-900/20 relative">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/80"></div>
            </div>

            <div className="px-8 pb-8">
                <div className="flex flex-col md:flex-row gap-6 items-start -mt-12">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-zinc-950 border-4 border-zinc-900 shadow-xl flex items-center justify-center overflow-hidden relative z-10">
                            {profile.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-4xl font-bold text-zinc-500">
                                    {profile.username?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        {/* Rank Badge */}
                        <div className="absolute -bottom-2 -right-2 z-20 bg-zinc-900 rounded-lg p-1 border border-zinc-800 shadow-lg">
                            <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold px-2 py-0.5 rounded">
                                {profile.stats?.rank ? `#${profile.stats.rank}` : 'Unranked'}
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 pt-2 md:pt-14 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                                    {profile.name || profile.username}
                                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium uppercase tracking-wider">
                                        Pro
                                    </span>
                                </h1>
                                <p className="text-zinc-400 font-mono text-sm mt-1">@{profile.username}</p>
                            </div>

                            <div className="flex gap-2">
                                {profile.socialLinks?.github && (
                                    <SocialLink href={profile.socialLinks.github} icon={<Github size={18} />} label="GitHub" />
                                )}
                                {profile.socialLinks?.linkedin && (
                                    <SocialLink href={profile.socialLinks.linkedin} icon={<Linkedin size={18} />} label="LinkedIn" />
                                )}
                                {profile.socialLinks?.twitter && (
                                    <SocialLink href={profile.socialLinks.twitter} icon={<Twitter size={18} />} label="Twitter" />
                                )}
                                {profile.socialLinks?.website && (
                                    <SocialLink href={profile.socialLinks.website} icon={<Globe size={18} />} label="Website" />
                                )}
                            </div>
                        </div>

                        {profile.bio && (
                            <p className="text-zinc-300 text-sm max-w-2xl leading-relaxed">
                                {profile.bio}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                            {profile.country && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={14} className="text-zinc-400" />
                                    {profile.country}
                                </div>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-zinc-400" />
                                Joined {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Shield size={14} className="text-emerald-400" />
                                Verified Developer
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    const fullHref = href.startsWith('http') ? href : `https://${href}`;
    return (
        <a
            href={fullHref}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700/50 hover:border-zinc-600 transition-all"
            title={label}
        >
            {icon}
        </a>
    );
}

export default ProfileHeader;
