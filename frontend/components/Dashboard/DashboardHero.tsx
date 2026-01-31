"use client";

import React from "react";
import { ArrowRight, Zap } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

interface DashboardHeroProps {
    motivation?: string;
}

export function DashboardHero({ motivation = "Consistency is key to mastery." }: DashboardHeroProps) {
    const { user } = useAuthStore();

    return (
        <div className="relative w-full rounded-2xl bg-[#09090b] border border-white/5 overflow-hidden group">
            {/* Subtle Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-20 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center md:text-left space-y-4">
                    {/* System Online Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-emerald-400 text-[10px] font-mono font-bold tracking-widest uppercase">
                            System Online
                        </span>
                    </div>

                    {/* Welcome Message */}
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            Welcome back,{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                {user?.name || "Coder"}
                            </span>
                        </h1>
                        <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto md:mx-0">
                            {motivation}
                        </p>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="shrink-0">
                    <Link
                        href="/sprint"
                        className="group relative inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                        <Zap className="w-5 h-5 fill-current" />
                        <span>Start Sprint Session</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
