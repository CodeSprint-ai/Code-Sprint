'use client';

import { useState, Suspense } from 'react';
import { useSessions, useLogoutAllDevices } from '@/hooks/useSessions';
import { formatRelativeTime, getDeviceIcon, getBrowserIcon } from '@/services/sessionApi';

function SessionsContent() {
    const { sessions, isLoading, isError, refetch, revokeSession, revokeAllSessions, isRevoking } = useSessions();
    const { logoutAll, isLoggingOut } = useLogoutAllDevices();
    const [revokingId, setRevokingId] = useState<string | null>(null);

    const handleRevokeSession = async (sessionId: string) => {
        setRevokingId(sessionId);
        try {
            await revokeSession(sessionId);
        } finally {
            setRevokingId(null);
        }
    };

    const handleRevokeAll = async () => {
        if (confirm('Are you sure you want to log out from all other devices?')) {
            await revokeAllSessions();
        }
    };

    const handleLogoutAll = async () => {
        if (confirm('Are you sure you want to log out from ALL devices including this one?')) {
            await logoutAll();
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Active Sessions</h1>
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-[#1a1a2e] rounded-lg p-4 h-24" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Active Sessions</h1>
                    <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
                        Failed to load sessions.
                        <button onClick={() => refetch()} className="ml-2 underline hover:no-underline">
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Active Sessions</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Manage your login sessions across devices
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleRevokeAll}
                            disabled={isRevoking || sessions.filter(s => !s.isCurrent).length === 0}
                            className="px-4 py-2 bg-yellow-600/20 text-yellow-400 rounded-lg hover:bg-yellow-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                            Logout Other Devices
                        </button>
                        <button
                            onClick={handleLogoutAll}
                            disabled={isLoggingOut}
                            className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                            {isLoggingOut ? 'Logging out...' : 'Logout All'}
                        </button>
                    </div>
                </div>

                {/* Sessions List */}
                <div className="space-y-4">
                    {sessions.length === 0 ? (
                        <div className="bg-[#1a1a2e] rounded-lg p-6 text-center text-gray-400">
                            No active sessions found.
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <div
                                key={session.id}
                                className={`bg-[#1a1a2e] rounded-lg p-4 border ${session.isCurrent
                                        ? 'border-emerald-500/50'
                                        : 'border-[#2a2a3e]'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    {/* Device Info */}
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">
                                            {getDeviceIcon(session.device)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {session.browser || 'Unknown Browser'} on {session.os || 'Unknown OS'}
                                                </span>
                                                {session.isCurrent && (
                                                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-400 mt-1">
                                                {getBrowserIcon(session.browser)} {session.device} • {session.ipAddress || 'Unknown IP'}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                Last active: {formatRelativeTime(session.lastActiveAt)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {!session.isCurrent && (
                                        <button
                                            onClick={() => handleRevokeSession(session.id)}
                                            disabled={revokingId === session.id}
                                            className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                        >
                                            {revokingId === session.id ? 'Revoking...' : 'Revoke'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Security Note */}
                <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <h3 className="text-blue-400 font-medium mb-1">🔒 Security Tip</h3>
                    <p className="text-sm text-gray-400">
                        If you see any sessions you don&apos;t recognize, revoke them immediately and change your password.
                        This helps keep your account secure.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function SessionsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Active Sessions</h1>
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-[#1a1a2e] rounded-lg p-4 h-24" />
                        ))}
                    </div>
                </div>
            </div>
        }>
            <SessionsContent />
        </Suspense>
    );
}
