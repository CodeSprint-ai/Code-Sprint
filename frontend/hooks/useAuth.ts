// src/hooks/useAuth.ts
import Cookies from "js-cookie";
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  SignupResponse,
  User,
} from "../types/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";

interface UseAuthReturn {
  login: UseMutationResult<
    AuthResponse,
    Error,
    LoginCredentials,
    unknown
  >["mutateAsync"];

  signup: UseMutationResult<
    SignupResponse,
    Error,
    SignupCredentials,
    unknown
  >["mutateAsync"];

  logout: UseMutationResult<void, Error, void, unknown>["mutateAsync"];

  isLoading: boolean;
  error: Error | null;
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  initializeOAuth: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const { user, token, setAuth, clearAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resolvedTheme } = useTheme();

  const queryClient = useQueryClient();

  // Login mutation
  const loginMutation = useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (
      credentials: LoginCredentials
    ): Promise<AuthResponse> => {
      console.log(credentials);

      const response = await api.post<AuthResponse>("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data: AuthResponse) => {
      console.log({
        access_token: data.data.accessToken,
        user: data.data.user,
      });

      setAuth(data.data.user, data.data.accessToken);
      Cookies.set("is_authenticated", "true", { expires: 7 }); // For middleware
      console.log("🔥 Zustand state after login:", useAuthStore.getState());

      // Let the caller component handle redirection
    },
  });

  // Signup mutation
  const signupMutation = useMutation<SignupResponse, Error, SignupCredentials>({
    mutationFn: async (
      credentials: SignupCredentials
    ): Promise<SignupResponse> => {
      const currentTheme = resolvedTheme === "light" ? "light" : "dark";
      const payload = { ...credentials, theme: currentTheme };
      const response = await api.post<SignupResponse>(
        "/auth/register",
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      // Registration successful, wait for email verification
      queryClient.invalidateQueries();
    },
  });

  // Logout mutation
  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async (): Promise<void> => {
      await api.post("/auth/logout");
      router.replace("/");
    },
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      Cookies.remove("is_authenticated");
    },
  });

  const initializeOAuth = async (): Promise<void> => {
    try {
      const { data } = await api.get<AuthResponse>("/auth/me");
      setAuth(data.data.user, data.data.accessToken);
      Cookies.set("is_authenticated", "true", { expires: 7 });
    } catch {
      clearAuth();
      Cookies.remove("is_authenticated");
    }
  };

  return {
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    initializeOAuth,
    isLoading:
      loginMutation.isPending ||
      signupMutation.isPending ||
      logoutMutation.isPending,
    error: loginMutation.error || signupMutation.error || logoutMutation.error,
    token,
    user,
    isAuthenticated: !!token,
  };
};
