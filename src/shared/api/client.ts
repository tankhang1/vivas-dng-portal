import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { refreshToken } from "@/features/auth/api/auth.api";
import { clearAccessToken, getAccessToken } from "./token";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});

let refreshPromise: Promise<string> | null = null;

function isAuthRequest(url?: string) {
  return Boolean(
    url &&
      ["/login", "/refresh-token", "/check-token-expired"].some((path) =>
        url.includes(path),
      ),
  );
}

function refreshAccessTokenOnce() {
  if (!refreshPromise) {
    refreshPromise = refreshToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    (config.headers as Record<string, string>).Authorization =
      `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const status = error.response?.status;

    if (
      status !== 403 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthRequest(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    if (!getAccessToken()) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const nextToken = await refreshAccessTokenOnce();

      if (!nextToken) {
        clearAccessToken();
        return Promise.reject(error);
      }

      originalRequest.headers = originalRequest.headers ?? {};
      (originalRequest.headers as Record<string, string>).Authorization =
        `Bearer ${nextToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAccessToken();
      return Promise.reject(refreshError);
    }
  },
);
