"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Terminal, ArrowRight, Loader2, UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "../../hooks/useAuth";
import { signupSchema, SignupFormValues } from "@/validations/authForm";

const SignUpForm: React.FC = () => {
  const { signup, isLoading, error } = useAuth();
  const router = useRouter();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await signup(values);
      toast.success("Account created 🎉", {
        description: "Check your email to verify your account",
      });
      router.push("/auth/login");
    } catch (err: any) {
      toast.error("Sign up failed", {
        description: err?.response?.data?.message || err?.message || "Something went wrong",
      });
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
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[100px] animate-blob animation-delay-2000 pointer-events-none" />

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
            <h1 className="text-2xl font-bold text-white mb-2">Create an account</h1>
            <p className="text-zinc-400">Join our community of developers today</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-medium text-zinc-300 ml-1">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="bg-brand-surface/50 border-white/10 text-zinc-100 focus:border-brand-green/50 focus:ring-brand-green/20 placeholder:text-zinc-600 pl-4 h-11 transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 ml-1 font-medium animate-in slide-in-from-top-1 fade-in" />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-medium text-zinc-300 ml-1">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                        className="bg-brand-surface/50 border-white/10 text-zinc-100 focus:border-brand-green/50 focus:ring-brand-green/20 placeholder:text-zinc-600 pl-4 h-11 transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 ml-1 font-medium animate-in slide-in-from-top-1 fade-in" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-medium text-zinc-300 ml-1">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="bg-brand-surface/50 border-white/10 text-zinc-100 focus:border-brand-green/50 focus:ring-brand-green/20 placeholder:text-zinc-600 pl-4 h-11 transition-all duration-300"
                      />
                    </FormControl>
                    <div className="flex gap-1 mt-1">
                      <FormMessage className="text-xs text-red-500 ml-1 font-medium animate-in slide-in-from-top-1 fade-in" />
                    </div>
                  </FormItem>
                )}
              />

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium animate-in zoom-in-95 fade-in">
                  {error.message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-green to-emerald-600 hover:from-brand-greenGlow hover:to-emerald-700 text-white font-semibold h-11 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Start Coding <UserPlus className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-brand-green hover:text-brand-greenGlow transition-colors hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpForm;
