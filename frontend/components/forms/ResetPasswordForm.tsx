"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Terminal, ArrowRight, ArrowLeft, Lock, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPasswordSchema, ResetPasswordFormValues } from "@/validations/authForm";
import api from "@/services/api";

const ResetPasswordForm: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [isLoading, setIsLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { newPassword: "", confirmPassword: "" },
    });

    const onSubmit = async (values: ResetPasswordFormValues) => {
        if (!token) {
            setError("Invalid reset link. Please request a new one.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await api.post("/auth/reset-password", {
                token,
                newPassword: values.newPassword
            });
            setIsSuccess(true);
            toast.success("Password reset successful!", { description: "You can now login with your new password" });
            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/auth/login");
            }, 3000);
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || "Failed to reset password";
            setError(message);
            toast.error("Reset failed", { description: message });
        } finally {
            setIsLoading(false);
        }
    };

    // Show error if no token
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-brand-dark">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="glass-card rounded-2xl p-8 backdrop-blur-xl border border-white/10 shadow-2xl text-center">
                        <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                            <XCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Invalid Reset Link</h1>
                        <p className="text-zinc-400 mb-6">
                            This password reset link is invalid or has expired. Please request a new one.
                        </p>
                        <Link
                            href="/auth/forgot-password"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-green to-emerald-600 hover:from-brand-greenGlow hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                        >
                            Request New Link <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-brand-dark">
            {/* Back to Home */}
            <Link
                href="/"
                className="absolute top-8 left-8 text-zinc-400 hover:text-brand-green flex items-center gap-2 transition-colors z-20 font-medium text-sm group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
            </Link>

            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
            <div className="absolute inset-0 bg-radial-glow opacity-20" style={{ '--gradient-stops': 'rgba(16, 185, 129, 0.3), transparent 70%' } as any} />

            {/* Blob Animation */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-green/20 rounded-full blur-[100px] animate-blob pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card rounded-2xl p-8 backdrop-blur-xl border border-white/10 shadow-2xl">
                    {/* Logo & Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6 group cursor-pointer hover:opacity-80 transition-opacity">
                            <div className="bg-gradient-to-tr from-brand-green to-emerald-900 p-2 rounded-lg shadow-lg group-hover:shadow-brand-green/20 transition-all duration-300">
                                <Terminal className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight dark:text-white text-zinc-900 code-font">
                                CodeSprint
                            </span>
                        </Link>
                        <h1 className="text-2xl font-bold dark:text-white text-zinc-900 mb-2">Reset Password</h1>
                        <p className="text-zinc-400">
                            {isSuccess
                                ? "Your password has been reset successfully"
                                : "Enter your new password below"}
                        </p>
                    </div>

                    {isSuccess ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-16 h-16 mx-auto bg-brand-green/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-brand-green" />
                            </div>
                            <div className="space-y-2">
                                <p className="dark:text-zinc-300 text-zinc-700">
                                    Your password has been reset successfully!
                                </p>
                                <p className="dark:text-zinc-500 text-zinc-400 text-sm">
                                    Redirecting you to login...
                                </p>
                            </div>
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center gap-2 dark:text-brand-green text-brand-green/50 hover:text-brand-greenGlow transition-colors font-medium"
                            >
                                Go to Login <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* New Password */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium dark:text-zinc-300 text-zinc-700 ml-1">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-brand-green transition-colors" />
                                    <Input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        {...register("newPassword")}
                                        className="dark:bg-brand-surface/50 bg-black/5 dark:border-white/10 border-black/10 dark:text-zinc-100 text-zinc-900 focus:border-brand-green/50 focus:ring-brand-green/20 dark:placeholder:text-zinc-600 placeholder:text-zinc-400 pl-10 pr-10 h-11 transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-brand-green transition-colors"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className="text-xs text-red-500 ml-1 font-medium animate-in slide-in-from-top-1 fade-in">{errors.newPassword.message}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-zinc-300 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-brand-green transition-colors" />
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        {...register("confirmPassword")}
                                        className="dark:bg-brand-surface/50 bg-black/5 dark:border-white/10 border-black/10 dark:text-zinc-100 text-zinc-900 focus:border-brand-green/50 focus:ring-brand-green/20 dark:placeholder:text-zinc-600 placeholder:text-zinc-400 pl-10 pr-10 h-11 transition-all duration-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-brand-green transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-500 ml-1 font-medium animate-in slide-in-from-top-1 fade-in">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium animate-in zoom-in-95 fade-in">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-brand-green to-emerald-600 hover:from-brand-greenGlow hover:to-emerald-700 text-white font-semibold h-11 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Skeleton className="w-4 h-4 rounded-full bg-white/20" />
                                        Resetting...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Reset Password <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    )}

                    {/* Footer */}
                    {!isSuccess && (
                        <p className="mt-8 text-center text-sm dark:text-zinc-400 text-zinc-500">
                            Remember your password?{" "}
                            <Link
                                href="/auth/login"
                                className="font-medium dark:text-brand-green text-brand-green/50 hover:text-brand-greenGlow transition-colors hover:underline underline-offset-4"
                            >
                                Sign in
                            </Link>
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPasswordForm;
