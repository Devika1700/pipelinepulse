import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { AuthResponse } from "../features/auth/types";
// The access token lives only in this variable (JavaScript memory), never in localStorage.
let accessToken: string | null = null;
let onAuthFailure: (() => void) | null = null;
export function setAccessToken(token: string | null) {
  accessToken = token;
}
export function setAuthFailureHandler(handler: (() => void) | null) {
  onAuthFailure = handler;
}
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
// Attach the token to every outgoing request.
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
// Only ONE refresh request can be in flight at a time. Everyone else waits for the same promise.
let refreshPromise: Promise<AuthResponse> | null = null;
export function refreshSession(): Promise<AuthResponse> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<AuthResponse>("/api/auth/refresh", null, { withCredentials: true })
      .then((response) => {
        setAccessToken(response.data.accessToken);
        return response.data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}
type RetryableConfig = InternalAxiosRequestConfig & { _retried?: boolean };
// When a request fails with 401, refresh the token once and retry the request.
api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || !error.config) {
      return Promise.reject(error);
    }
    const original = error.config as RetryableConfig;
    const isAuthRoute = original.url?.startsWith("/auth/") ?? false;
    if (error.response?.status === 401 && !original._retried && !isAuthRoute) {
      original._retried = true;
      try {
        await refreshSession();
        return api(original); // the request interceptor attaches the new token
      } catch {
        setAccessToken(null);
        onAuthFailure?.();
      }
    }
    return Promise.reject(error);
  },
);
