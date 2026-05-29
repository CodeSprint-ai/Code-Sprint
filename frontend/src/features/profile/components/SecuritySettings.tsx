'use client';

import { useState } from 'react';
import { usePasswordManagement } from '@/hooks/useSessions';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

interface SecuritySettingsProps {
    hasPassword: boolean;
}

export default function SecuritySettings({ hasPassword }: SecuritySettingsProps) {
    const { changePassword, addPassword, isChanging, isAdding, changeError, addError } = usePasswordManagement();
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [revokeOther, setRevokeOther] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setErrorMessage('Password must be at least 6 characters');
            return;
        }

        try {
            if (hasPassword) {
                const result = await changePassword({
                    currentPassword,
                    newPassword,
                    revokeOtherSessions: revokeOther,
                });
                setSuccessMessage(
                    result.sessionsRevoked
                        ? `Password changed! ${result.sessionsRevoked} other session(s) logged out.`
                        : 'Password changed successfully!'
                );
            } else {
                await addPassword({ newPassword });
                setSuccessMessage('Password added successfully! You can now log in with email/password.');
            }

            // Reset form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordForm(false);
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.message || 'Failed to update password');
        }
    };

    return (
        <div className="dark:bg-[#1a1a2e] bg-white rounded-lg p-6 border dark:border-[#2a2a3e] border-zinc-200">
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>

            {/* Success/Error Messages */}
            {successMessage && (
                <div className="mb-4 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {errorMessage}
                </div>
            )}

            {/* Password Section */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="dark:text-gray-300 text-gray-700">Password</span>
                    <button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="text-sm text-blue-400 hover:text-blue-300"
                    >
                        {hasPassword ? 'Change Password' : 'Add Password'}
                    </button>
                </div>
                <p className="text-sm text-gray-500">
                    {hasPassword
                        ? 'You have a password set for email login'
                        : 'Add a password to enable email login'}
                </p>

                {showPasswordForm && (
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        {hasPassword && (
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full dark:bg-[#0a0a0f] bg-zinc-50 border dark:border-[#2a2a3e] border-zinc-200 rounded-lg px-3 py-2 pr-10 dark:text-white text-zinc-900 focus:border-blue-500 focus:outline-none"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
                                    >
                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full dark:bg-[#0a0a0f] bg-zinc-50 border dark:border-[#2a2a3e] border-zinc-200 rounded-lg px-3 py-2 pr-10 dark:text-white text-zinc-900 focus:border-blue-500 focus:outline-none"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full dark:bg-[#0a0a0f] bg-zinc-50 border dark:border-[#2a2a3e] border-zinc-200 rounded-lg px-3 py-2 pr-10 dark:text-white text-zinc-900 focus:border-blue-500 focus:outline-none"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        {hasPassword && (
                            <label className="flex items-center gap-2 text-sm text-gray-400">
                                <input
                                    type="checkbox"
                                    checked={revokeOther}
                                    onChange={(e) => setRevokeOther(e.target.checked)}
                                    className="rounded"
                                />
                                Log out from all other devices
                            </label>
                        )}
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={isChanging || isAdding}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isChanging || isAdding ? 'Saving...' : 'Save Password'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowPasswordForm(false)}
                                className="px-4 py-2 dark:bg-[#2a2a3e] bg-zinc-200 dark:text-gray-300 text-gray-700 rounded-lg dark:hover:bg-[#3a3a4e] hover:bg-zinc-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Sessions Link */}
            <div className="pt-4 border-t dark:border-[#2a2a3e] border-zinc-200">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="dark:text-gray-300 text-gray-700">Active Sessions</span>
                        <p className="text-sm text-gray-500">Manage your logged-in devices</p>
                    </div>
                    <Link
                        href="/profile/sessions"
                        className="text-sm text-blue-400 hover:text-blue-300"
                    >
                        View Sessions →
                    </Link>
                </div>
            </div>
        </div>
    );
}
