// src/services/api.ts
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { AuthResponse } from "../types/auth";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// --- Refresh Queue State ---
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

// --- Request Interceptor ---
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    // const user = useAuthStore.getState().user
    // console.log({ token, user });

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor with Refresh Queue ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as any;
    const authStore = useAuthStore.getState();

    console.log({authStore});
    

    // ✅ Skip refresh logic for login/signup requests
    if (
      error.response?.status === 401 &&
      (originalRequest.url.includes("/auth/login") ||
        originalRequest.url.includes("/auth/signup"))
    ) {
      return Promise.reject(error);
    }

    // ✅ Refresh logic for expired tokens only
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Wait for ongoing refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const { data } = await axios.post<AuthResponse>(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // ✅ Save new token in store
        authStore.setToken(data.data.accessToken);

        processQueue(null, data.data.accessToken); // response should be like data.accesstoken right now its compromized

        // Retry the failed request with new token
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStore.clearAuth();
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
