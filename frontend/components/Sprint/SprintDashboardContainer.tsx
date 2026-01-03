"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSprint, SprintSession } from "@/hooks/useSprint";
import SprintActive from "./SprintActive";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Trophy, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner"; // Assuming sonner

export default function SprintDashboardContainer() {
    const { user } = useAuthStore();
    const { createSprint, finishSprint, isCreating, isFinishing } = useSprint();
    const [activeSession, setActiveSession] = useState<SprintSession | null>(null);
    const [lastResult, setLastResult] = useState<SprintSession | null>(null);

    const handleStart = async () => {
        try {
            if (!user?.userUuid) return;
            const session = await createSprint({ userId: user.userUuid });
            setActiveSession(session);
        } catch (e) {
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
            toast.error("Failed to finish sprint");
        }
    };

    if (activeSession) {
        return <SprintActive session={activeSession} onFinish={handleFinish} />;
    }

    return (
        <div className="max-w-4xl mx-auto py-12 space-y-8">
            {/* Intro / Start Screen */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Code Sprint
                </h1>
                <p className="text-gray-400 text-lg">
                    Test your skills with 5 random problems (Easy, Medium, Hard).
                    <br />
                    You have 60 minutes to prove your level.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Rocket className="text-blue-500" />
                            Start New Sprint
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-400 mb-6">
                            Ready to challenge yourself? Start a new session now.
                        </p>
                        <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity"
                            size="lg"
                            onClick={handleStart}
                            disabled={isCreating}
                        >
                            {isCreating ? <Loader2 className="animate-spin mr-2" /> : null}
                            {isCreating ? "Starting..." : "Start Sprint"}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="text-yellow-500" />
                            Previous Results
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {lastResult ? (
                            <div className="space-y-2">
                                <div className="text-2xl font-bold text-white">
                                    Score: {lastResult.score}
                                </div>
                                <p className="text-gray-400">
                                    Sprint Completed at {new Date(lastResult.endTime).toLocaleDateString()}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                No recent sprint results available.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
