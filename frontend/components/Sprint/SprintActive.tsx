"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProblemPanel from "@/components/layout/ProblemPanel";
import EditorPanel from "@/components/layout/EditorPanel";
import { SprintSession } from "@/hooks/useSprint";
import { Clock } from "lucide-react";

interface SprintActiveProps {
    session: SprintSession;
    onFinish: () => void;
}

export default function SprintActive({ session, onFinish }: SprintActiveProps) {
    const [activeProblemIndex, setActiveProblemIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());

    // Current problem
    const currentSprintProblem = session.sprintProblems[activeProblemIndex];
    const currentProblem = currentSprintProblem?.problem;

    useEffect(() => {
        // Timer Logic
        const end = new Date(session.endTime).getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = end - now;
            if (diff <= 0) {
                setTimeLeft(0);
                clearInterval(interval);
                onFinish(); // Auto finish
            } else {
                setTimeLeft(Math.floor(diff / 1000));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [session, onFinish]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <main className="flex flex-col flex-1 min-h-screen">
            {/* Header */}
            <header className="border-b border-gray-800 px-4 py-3 flex justify-between items-center bg-zinc-950">
                <div className="flex items-center gap-4">
                    <span className="font-semibold text-lg">Sprint Mode</span>
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTime(timeLeft)}
                    </Badge>
                </div>

                {/* Problem Navigation */}
                <div className="flex items-center gap-2">
                    {session.sprintProblems.map((sp, idx) => {
                        const isSolved = solvedProblems.has(sp.problem?.uuid);
                        const isActive = activeProblemIndex === idx;
                        return (
                            <button
                                key={sp.order}
                                onClick={() => setActiveProblemIndex(idx)}
                                className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                    ${isActive ? 'ring-2 ring-blue-500 scale-110' : ''}
                                    ${isSolved ? 'bg-green-500 text-black' : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600'}
                                `}
                            >
                                {sp.order}
                            </button>
                        );
                    })}
                </div>

                <Button variant="destructive" size="sm" onClick={onFinish}>
                    Finish Sprint
                </Button>
            </header>

            {/* Split layout - matching submission page structure */}
            <section className="flex flex-1 flex-col lg:flex-row overflow-hidden">
                {/* Left panel - Problem Description */}
                <div className="w-auto lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-800 overflow-y-auto">
                    {currentProblem ? (
                        <ProblemPanel problem={currentProblem} />
                    ) : (
                        <div className="p-6 text-gray-500">Loading problem...</div>
                    )}
                </div>

                {/* Right panel - Editor */}
                <div className="w-auto lg:w-1/2 flex flex-col overflow-hidden p-4">
                    {currentProblem ? (
                        <EditorPanel
                            problem={currentProblem}
                            hideSubmit={true}
                            onNext={() => {
                                if (activeProblemIndex < session.sprintProblems.length - 1) {
                                    setActiveProblemIndex(activeProblemIndex + 1);
                                }
                            }}
                            isLastQuestion={activeProblemIndex === session.sprintProblems.length - 1}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a problem to start coding
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
