"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Terminal, ArrowRight, Loader2, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema, LoginFormValues } from "@/validations/authForm";
import { GoogleIcon } from "../icons/GoogleIcon";
import { GitHubIcon } from "../icons/GithubIcon";
import api from "@/services/api";

const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useAuth();

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const router = useRouter();

  const [showResendVerification, setShowResendVerification] = React.useState(false);
  const [resendEmail, setResendEmail] = React.useState("");
  const [isResending, setIsResending] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setShowResendVerification(false);
      await login(values);
      toast.success("Login successful 🎉", { description: "Welcome back!" });
      router.push(redirect);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Invalid credentials";

      // Check if error is about email verification
      if (errorMessage.toLowerCase().includes("verify your email") ||
        errorMessage.toLowerCase().includes("email not verified")) {
        setShowResendVerification(true);
        setResendEmail(values.email);
      }

      toast.error("Login failed", { description: errorMessage });
    }
  };

  const handleResendVerification = async () => {
    if (!resendEmail) return;

    setIsResending(true);
    try {
      await api.post("/auth/resend-verification", { email: resendEmail });
      toast.success("Verification email sent!", {
        description: "Please check your inbox and spam folder."
      });
      setShowResendVerification(false);
    } catch (err: any) {
      toast.error("Failed to resend", {
        description: err?.response?.data?.message || "Please try again later."
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    window.location.href = `${backendUrl}/auth/${provider}?redirect=${redirect}`;
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
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-zinc-400">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300 ml-1">Email</label>
              <div className="relative group">
                <Input
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className="bg-brand-surface/50 border-white/10 text-zinc-100 focus:border-brand-green/50 focus:ring-brand-green/20 placeholder:text-zinc-600 pl-4 h-11 transition-all duration-300"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 ml-1 font-medium animate-in slide-in-from-top-1 fade-in">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-zinc-300">Password</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-brand-green hover:text-brand-greenGlow transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="bg-brand-surface/50 border-white/10 text-zinc-100 focus:border-brand-green/50 focus:ring-brand-green/20 placeholder:text-zinc-600 pl-4 h-11 transition-all duration-300"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 ml-1 font-medium animate-in slide-in-from-top-1 fade-in">{errors.password.message}</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium animate-in zoom-in-95 fade-in">
                {error.message}
              </div>
            )}

            {/* Resend Verification Email */}
            {showResendVerification && (
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 animate-in zoom-in-95 fade-in">
                <p className="text-amber-400 text-sm text-center mb-3">
                  Your email is not verified. Please check your inbox or request a new verification email.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 text-amber-400 font-medium h-10 rounded-lg transition-all duration-300"
                  onClick={handleResendVerification}
                  disabled={isResending}
                >
                  {isResending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Resend Verification Email
                    </span>
                  )}
                </Button>
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
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#18181b] px-4 text-zinc-500 font-medium tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-zinc-300 h-11 rounded-xl transition-all duration-300"
              onClick={() => handleOAuthLogin("google")}
            >
              <GoogleIcon className="h-5 w-5 mr-2" /> Google
            </Button>
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-zinc-300 h-11 rounded-xl transition-all duration-300"
              onClick={() => handleOAuthLogin("github")}
            >
              <GitHubIcon className="h-5 w-5 mr-2 text-white" /> GitHub
            </Button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-brand-green hover:text-brand-greenGlow transition-colors hover:underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
