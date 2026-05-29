'use client';

import React from 'react';
import { PublicProfile } from '@/types/profile';
import { MapPin, Calendar, Github, Linkedin, Twitter, Globe, CheckCircle2, Trophy } from 'lucide-react';

interface ProfileHeaderProps {
    profile: PublicProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
    return (
        <div className="relative rounded-2xl overflow-hidden border dark:border-white/5 border-zinc-200 dark:bg-[#09090b] bg-white group">
            {/* Banner with gradient and dot pattern */}
            <div className="h-48 bg-gradient-to-r dark:from-emerald-900/10 dark:via-black dark:to-emerald-900/10 from-emerald-100/50 via-white to-emerald-100/50 relative">
                <div className="absolute inset-0 opacity-20 dark:bg-[radial-gradient(#10b981_1px,transparent_1px)] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            <div className="px-8 pb-8">
                <div className="relative flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-2xl dark:bg-[#09090b] bg-white border-4 dark:border-[#09090b] border-white shadow-2xl flex items-center justify-center overflow-hidden">
                            {profile.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full dark:bg-zinc-900 bg-zinc-100 flex items-center justify-center">
                                    <span className="text-4xl">🧑‍💻</span>
                                </div>
                            )}
                        </div>
                        {/* Level Badge */}
                        {(() => {
                            const level = profile.level || 'BEGINNER';
                            const levelStyles: Record<string, string> = {
                                BEGINNER: 'dark:bg-zinc-500/10 dark:text-zinc-400 dark:border-zinc-500/20 bg-zinc-100 text-zinc-600 border-zinc-200',
                                INTERMEDIATE: 'dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 bg-blue-50 text-blue-600 border-blue-200',
                                ADVANCED: 'dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20 bg-purple-50 text-purple-600 border-purple-200',
                                EXPERT: 'dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20 bg-amber-50 text-amber-600 border-amber-200',
                            };
                            const style = levelStyles[level] || levelStyles.BEGINNER;
                            return (
                                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 ${style} text-[10px] font-bold px-2 py-0.5 rounded border backdrop-blur-md uppercase tracking-wide shadow-sm`}>
                                    {level}
                                </div>
                            );
                        })()}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 mb-2 space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black dark:text-white text-zinc-900 tracking-tight">
                                {profile.name || profile.username}
                            </h1>
                            {/* <span className="dark:bg-emerald-500/10 dark:text-emerald-400 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded border dark:border-emerald-500/20 border-emerald-200 uppercase tracking-wider">
                                PRO
                            </span> */}
                        </div>
                        <div className="text-zinc-500 text-sm font-medium">@{profile.username}</div>

                        <div className="flex items-center gap-4 text-xs text-zinc-400 mt-3 font-mono">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                Joined January 2026
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-500">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Verified Developer
                            </div>
                            <div className="flex items-center gap-1.5 text-amber-500">
                                <Trophy className="w-3.5 h-3.5" />
                                {profile.stats?.rating ?? 0} Points
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-2 mb-2">
                        {profile.socialLinks?.github && (
                            <SocialLink href={profile.socialLinks.github} icon={<Github size={16} />} label="GitHub" />
                        )}
                        {profile.socialLinks?.linkedin && (
                            <SocialLink href={profile.socialLinks.linkedin} icon={<Linkedin size={16} />} label="LinkedIn" />
                        )}
                        {profile.socialLinks?.twitter && (
                            <SocialLink href={profile.socialLinks.twitter} icon={<Twitter size={16} />} label="Twitter" />
                        )}
                        {profile.socialLinks?.website && (
                            <SocialLink href={profile.socialLinks.website} icon={<Globe size={16} />} label="Website" />
                        )}
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
            className="p-2 rounded-lg dark:bg-white/5 bg-zinc-100 dark:hover:bg-white/10 hover:bg-zinc-200 dark:text-zinc-400 text-zinc-500 dark:hover:text-white hover:text-zinc-900 border dark:border-white/5 border-zinc-200 dark:hover:border-white/10 hover:border-zinc-300 transition-all"
            title={label}
        >
            {icon}
        </a>
    );
}

export default ProfileHeader;
