"use client";

import React, { useState } from "react";
import { Zap, Play, Terminal, Lock, Activity, Database, Clock } from "lucide-react";
import { useSprint, SprintSession } from "@/hooks/useSprint";
import { useAuthStore } from "@/store/authStore";
import SprintActive from "@/components/Sprint/SprintActive";
import { toast } from "sonner";

export default function AdminSprintPage() {
    const { createSprint, finishSprint, isCreating } = useSprint();
    const user = useAuthStore((state) => state.user);
    const [activeSession, setActiveSession] = useState<SprintSession | null>(null);
    const [lastResult, setLastResult] = useState<SprintSession | null>(null);

    const handleStartSprint = async () => {
        if (!user?.userUuid) {
            console.error("User not authenticated");
            return;
        }
        try {
            const session = await createSprint({ userId: user.userUuid });
            setActiveSession(session);
        } catch (error) {
            console.error("Failed to start sprint:", error);
            toast.error("Failed to start sprint");
        }
    };

    const handleFinish = async () => {
        if (!activeSession) return;
        try {
            const result = await finishSprint({ sprintId: activeSession.uuid });
            setActiveSession(null);
            setLastResult(result);
        } catch (e) {
            console.error("Failed to finish sprint:", e);
            toast.error("Failed to finish sprint");
        }
    };

    if (activeSession) {
        return <SprintActive session={activeSession} onFinish={handleFinish} />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-5xl mx-auto animate-fade-in relative px-4">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 text-center mb-16 space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#09090b] border border-emerald-500/20 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] group">
                    <Zap className="w-8 h-8 text-emerald-500 fill-emerald-500/20 group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter font-mono">
                        SPRINT_MODE<span className="animate-pulse text-emerald-500">_</span>
                    </h1>
                    <p className="text-zinc-500 text-sm md:text-base font-mono max-w-lg mx-auto leading-relaxed">
                        High-intensity cognitive loading. 60 minute duration.<br />
                        <span className="text-zinc-600">5 randomized algorithm challenges.</span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full relative z-10">
                {/* Active Session Card */}
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/30 to-emerald-900/30 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-500" />
                    <div className="relative h-full bg-[#09090b] border border-white/5 rounded-2xl p-8 flex flex-col justify-between overflow-hidden">
                        {/* Decor */}
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Terminal className="w-32 h-32 text-emerald-500" />
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                    <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase font-mono">
                                        System Ready
                                    </span>
                                </div>
                                <Activity className="w-5 h-5 text-zinc-700" />
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-white mb-6 tracking-tight font-mono">
                                    Initialize Session
                                </h3>
                                <div className="font-mono text-xs space-y-3 text-zinc-500 bg-black/40 p-5 rounded-lg border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <span className="text-emerald-500">➜</span>
                                        <span className="text-zinc-400">Allocating memory heap...</span>
                                        <span className="text-emerald-500 ml-auto font-bold">OK</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-emerald-500">➜</span>
                                        <span className="text-zinc-400">Fetching problem set...</span>
                                        <span className="text-emerald-500 ml-auto font-bold">OK</span>
                                    </div>
                                    <div className="flex items-center gap-3 border-t border-white/5 pt-3 mt-1">
                                        <span className="text-emerald-500 animate-pulse">➜</span>
                                        <span className="text-zinc-200">Ready to begin sequence.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleStartSprint}
                            disabled={isCreating}
                            className="mt-8 w-full group/btn relative flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-black font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                            <Play className="w-5 h-5 fill-black" />
                            <span className="tracking-widest uppercase text-sm font-mono">
                                {isCreating ? "INITIALIZING..." : "EXECUTE"}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Archived Card / Results */}
                <div className="relative h-full bg-[#09090b] border border-white/5 rounded-2xl p-8 flex flex-col hover:border-white/10 transition-colors group">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-zinc-300 font-mono flex items-center gap-3">
                            <Clock className="w-5 h-5 text-zinc-500" />
                            {lastResult ? "Last Session Results" : "Archived_Runs"}
                        </h3>
                    </div>

                    {lastResult ? (
                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/30 rounded-xl bg-emerald-900/10 p-8 mb-8">
                            <div className="text-4xl font-bold text-white mb-2">
                                {lastResult.score}
                            </div>
                            <p className="text-zinc-400 font-mono text-sm">Points Acquired</p>
                            <p className="text-emerald-500 text-xs mt-4">
                                Completed: {new Date(lastResult.endTime).toLocaleDateString()}
                            </p>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/20 p-8 mb-8 group-hover:border-zinc-700 transition-colors">
                            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                                <Lock className="w-5 h-5 text-zinc-600" />
                            </div>
                            <p className="text-xs text-zinc-500 font-mono text-center leading-relaxed">
                                <span className="text-red-500/50 block mb-1 font-bold tracking-wider">
                                    ACCESS_DENIED
                                </span>
                                No previous sprint logs found<br />in local storage.
                            </p>
                        </div>
                    )}

                    <button className="w-full py-3.5 border border-white/5 hover:border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white rounded-xl transition-all text-xs font-mono font-medium uppercase tracking-wider flex items-center justify-center gap-2">
                        <Database className="w-4 h-4" />
                        View_Database
                    </button>
                </div>
            </div>
        </div>
    );
}
