"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema, LoginFormValues } from "@/lib/validations/authForm";
import { GoogleIcon } from "../icons/GoogleIcon";
import { GitHubIcon } from "../icons/GithubIcon";
const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
      toast.success("Login successful 🎉", {
        description: "Welcome back!",
      });
    } catch (err: any) {
      toast.error("Login failed", {
        description: err?.message || "Invalid credentials",
      });
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    window.location.href = `http://localhost:5000/auth/${provider}`;
  };

  return (
    <div className="w-96 mx-auto p-6 rounded-xl shadow-md border">
      <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Inline error (from useAuth, not zod) */}
          {error && <p className="text-sm text-red-500">{error.message}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
      {/* Divider */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
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
          <GoogleIcon className="h-5 w-5" />
          Login with Google
        </Button>

        <Button
          className="w-full flex items-center gap-2"
          onClick={() => handleOAuthLogin("google")}
        >
          <GitHubIcon className="h-5 w-5" />
          Login with Github
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
