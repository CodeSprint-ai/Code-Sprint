"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Terminal, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import api from "@/services/api";

type VerificationState = "loading" | "success" | "error";

const VerifyEmailContent: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [state, setState] = React.useState<VerificationState>("loading");
    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const hasVerified = React.useRef(false);

    React.useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setState("error");
                setErrorMessage("Invalid verification link. Please check your email for the correct link.");
                return;
            }

            if (hasVerified.current) return;
            hasVerified.current = true;

            try {
                await api.get(`/auth/verify-email?token=${token}`);
                setState("success");
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push("/auth/login");
                }, 3000);
            } catch (err: any) {
                setState("error");
                setErrorMessage(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to verify email. The link may have expired."
                );
            }
        };

        verifyEmail();
    }, [token, router]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-brand-dark">
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
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6 group cursor-pointer hover:opacity-80 transition-opacity">
                            <div className="bg-gradient-to-tr from-brand-green to-emerald-900 p-2 rounded-lg shadow-lg group-hover:shadow-brand-green/20 transition-all duration-300">
                                <Terminal className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white code-font">
                                CodeSprint<span className="text-brand-green">AI</span>
                            </span>
                        </Link>
                    </div>

                    {/* Loading State */}
                    {state === "loading" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-16 h-16 mx-auto bg-brand-green/20 rounded-full flex items-center justify-center">
                                <Skeleton className="w-8 h-8 rounded-full" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-2">Verifying Email</h1>
                                <p className="text-zinc-400">Please wait while we verify your email address...</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Success State */}
                    {state === "success" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-16 h-16 mx-auto bg-brand-green/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-brand-green" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-2">Email Verified!</h1>
                                <p className="text-zinc-400 mb-2">
                                    Your email has been verified successfully.
                                </p>
                                <p className="text-zinc-500 text-sm">
                                    Redirecting you to login...
                                </p>
                            </div>
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-green to-emerald-600 hover:from-brand-greenGlow hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                            >
                                Go to Login <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    )}

                    {/* Error State */}
                    {state === "error" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                                <XCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-2">Verification Failed</h1>
                                <p className="text-zinc-400">{errorMessage}</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/auth/signup"
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-green to-emerald-600 hover:from-brand-greenGlow hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                                >
                                    Sign Up Again <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/auth/login"
                                    className="text-brand-green hover:text-brand-greenGlow transition-colors font-medium"
                                >
                                    Already verified? Sign in
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyEmailContent;
