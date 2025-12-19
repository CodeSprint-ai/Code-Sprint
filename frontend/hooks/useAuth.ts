// src/hooks/useAuth.ts
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
  User,
} from "../types/auth";
import { useRouter, useSearchParams } from "next/navigation";

interface UseAuthReturn {
  login: UseMutationResult<
    AuthResponse,
    Error,
    LoginCredentials,
    unknown
  >["mutateAsync"];

  signup: UseMutationResult<
    AuthResponse,
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
      console.log("🔥 Zustand state after login:", useAuthStore.getState());
      // queryClient.invalidateQueries();
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    },
  });

  // Signup mutation
  const signupMutation = useMutation<AuthResponse, Error, SignupCredentials>({
    mutationFn: async (
      credentials: SignupCredentials
    ): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>(
        "/auth/register",
        credentials
      );
      return response.data;
    },
    onSuccess: (data: AuthResponse) => {
      setAuth(data.data.user, data.data.accessToken);
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
    },
  });

  const initializeOAuth = async (): Promise<void> => {
    try {
      const { data } = await api.get<AuthResponse>("/auth/me");
      setAuth(data.data.user, data.data.accessToken);
    } catch {
      clearAuth();
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
