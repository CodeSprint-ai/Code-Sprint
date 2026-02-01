import { RoleEnum } from "@/enum/role.enum";

// src/types/auth.ts
export interface User {
  userUuid: string;
  email: string;
  name: string;
  role: RoleEnum;
  avatarUrl?: string;
  // Add other user properties as needed
}

export interface AuthResponse {
  data: {
    accessToken: string;
    user: User;
  };
}

export interface SignupResponse {
  data: {
    message: string;
  };
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  token: string;
  newPassword: string;
}

export interface MessageResponse {
  data: {
    message: string;
  };
}

export interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setToken: (token: string) => void;
  isAuthenticated: () => boolean;
  updateUser: (updates: Partial<User>) => void;
}
