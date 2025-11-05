"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema, LoginFormValues } from "@/validations/authForm";
import { GoogleIcon } from "../icons/GoogleIcon";
import { GitHubIcon } from "../icons/GithubIcon";
import { useSearchParams } from "next/navigation";

const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useAuth();

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
      toast.success("Login successful 🎉", { description: "Welcome back!" });
    } catch (err: any) {
      toast.error("Login failed", {
        description: err?.message || "Invalid credentials",
      });
    }
  };

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `http://localhost:5000/auth/${provider}?redirect=${redirect}`;
  };

  return (
    <div className="w-96 mx-auto p-6 rounded-xl shadow-md border">
      <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Inline error from useAuth */}
        {error && <p className="text-sm text-red-500">{error.message}</p>}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground my-4">
        <span className="h-px flex-1 bg-border"></span>
        or
        <span className="h-px flex-1 bg-border"></span>
      </div>

      {/* OAuth Buttons */}
      <div className="flex flex-col gap-2">
        <Button
          className="w-full flex items-center gap-2"
          onClick={() => handleOAuthLogin("google")}
        >
          <GoogleIcon className="h-5 w-5" /> Login with Google
        </Button>
        <Button
          className="w-full flex items-center gap-2"
          onClick={() => handleOAuthLogin("github")}
        >
          <GitHubIcon className="h-5 w-5" /> Login with Github
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
