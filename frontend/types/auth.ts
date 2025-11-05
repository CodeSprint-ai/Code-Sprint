// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

export interface AuthResponse {
  accessToken: string;
  user: User;
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