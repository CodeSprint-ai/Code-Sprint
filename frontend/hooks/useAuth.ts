// src/hooks/useAuth.ts
import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { AuthResponse, LoginCredentials, User } from '../types/auth';

interface UseAuthReturn {
  login: UseMutationResult<AuthResponse, Error, LoginCredentials, unknown>['mutate'];
  logout: UseMutationResult<void, Error, void, unknown>['mutate'];
  isLoading: boolean;
  error: Error | null;
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const { user, token, setAuth, clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  // Login mutation
  const loginMutation = useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data: AuthResponse) => {
      setAuth(data.user, data.accessToken);
      queryClient.invalidateQueries();
    },
  });

  // Logout mutation
  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async (): Promise<void> => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
    error: loginMutation.error || logoutMutation.error,
    token,
    user,
    isAuthenticated: !!token,
  };
};