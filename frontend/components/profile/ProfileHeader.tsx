'use client';

import React from 'react';
import { PublicProfile } from '@/types/profile';
import { MapPin, Calendar, Github, Linkedin, Twitter, Globe, CheckCircle2 } from 'lucide-react';

interface ProfileHeaderProps {
    profile: PublicProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
    return (
        <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-[#09090b] group">
            {/* Banner with gradient and dot pattern */}
            <div className="h-48 bg-gradient-to-r from-emerald-900/10 via-black to-emerald-900/10 relative">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            <div className="px-8 pb-8">
                <div className="relative flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-2xl bg-[#09090b] border-4 border-[#09090b] shadow-2xl flex items-center justify-center overflow-hidden">
                            {profile.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                    <span className="text-4xl">🧑‍💻</span>
                                </div>
                            )}
                        </div>
                        {/* Level Badge */}
                        {(() => {
                            const level = profile.level || 'BEGINNER';
                            const levelStyles: Record<string, string> = {
                                BEGINNER: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
                                INTERMEDIATE: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                                ADVANCED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                                EXPERT: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                            };
                            const style = levelStyles[level] || levelStyles.BEGINNER;
                            return (
                                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 ${style} text-[10px] font-bold px-2 py-0.5 rounded border backdrop-blur-md uppercase tracking-wide`}>
                                    {level}
                                </div>
                            );
                        })()}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 mb-2 space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-white tracking-tight">
                                {profile.name || profile.username}
                            </h1>
                            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">
                                PRO
                            </span>
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
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5 hover:border-white/10 transition-all"
            title={label}
        >
            {icon}
        </a>
    );
}

export default ProfileHeader;
