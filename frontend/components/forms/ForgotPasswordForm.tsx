"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Terminal, ArrowRight, Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgotPasswordSchema, ForgotPasswordFormValues } from "@/validations/authForm";
import api from "@/services/api";

const ForgotPasswordForm: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [submittedEmail, setSubmittedEmail] = React.useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = async (values: ForgotPasswordFormValues) => {
        setIsLoading(true);
        try {
            await api.post("/auth/forgot-password", { email: values.email });
            setSubmittedEmail(values.email);
            setIsSuccess(true);
            toast.success("Reset link sent!", { description: "Check your email for instructions" });
        } catch (err: any) {
            toast.error("Failed to send reset link", {
                description: err?.response?.data?.message || err?.message || "Please try again",
            });
        } finally {
            setIsLoading(false);
        }
    };

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
                            <span className="text-2xl font-bold tracking-tight text-white code-font">
                                CodeSprint<span className="text-brand-green">AI</span>
                            </span>
                        </Link>
                        <h1 className="text-2xl font-bold text-white mb-2">Forgot Password</h1>
                        <p className="text-zinc-400">
                            {isSuccess
                                ? "Check your inbox for reset instructions"
                                : "Enter your email and we'll send you a reset link"}
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
                                <p className="text-zinc-300">
                                    We sent a password reset link to:
                                </p>
                                <p className="text-brand-green font-medium">{submittedEmail}</p>
                            </div>
                            <p className="text-zinc-500 text-sm">
                                Didn't receive the email? Check your spam folder or{" "}
                                <button
                                    onClick={() => setIsSuccess(false)}
                                    className="text-brand-green hover:underline"
                                >
                                    try again
                                </button>
                            </p>
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center gap-2 text-brand-green hover:text-brand-greenGlow transition-colors font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-zinc-300 ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-brand-green transition-colors" />
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        {...register("email")}
                                        className="bg-brand-surface/50 border-white/10 text-zinc-100 focus:border-brand-green/50 focus:ring-brand-green/20 placeholder:text-zinc-600 pl-10 h-11 transition-all duration-300"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-red-500 ml-1 font-medium animate-in slide-in-from-top-1 fade-in">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-brand-green to-emerald-600 hover:from-brand-greenGlow hover:to-emerald-700 text-white font-semibold h-11 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Send Reset Link <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    )}

                    {/* Footer */}
                    {!isSuccess && (
                        <p className="mt-8 text-center text-sm text-zinc-500">
                            Remember your password?{" "}
                            <Link
                                href="/auth/login"
                                className="font-medium text-brand-green hover:text-brand-greenGlow transition-colors hover:underline underline-offset-4"
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

export default ForgotPasswordForm;
