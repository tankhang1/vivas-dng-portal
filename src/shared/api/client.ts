import axios, { isAxiosError } from 'axios';

import { ApiError } from './error';
import { clearAccessToken, getAccessToken } from './token';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const details = error.response?.data ?? null;
      const responseData = error.response?.data;
      const message =
        typeof responseData === 'object' &&
        responseData !== null &&
        'message' in responseData &&
        typeof responseData.message === 'string'
          ? responseData.message
          : error.message;

      if (status === 401) {
        clearAccessToken();
      }

      return Promise.reject(new ApiError(message, status, details));
    }

    return Promise.reject(error);
  },
);
