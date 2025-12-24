import { RoleEnum } from "@/enum/role.enum";

// src/types/auth.ts
export interface User {
  userUuid: string;
  email: string;
  name: string;
  role: RoleEnum;
  // Add other user properties as needed
}

export interface AuthResponse {
  data: {   // i would remove it on mine
    accessToken: string;
    user: User;
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

export interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setToken: (token: string) => void;
  isAuthenticated: () => boolean;
}
