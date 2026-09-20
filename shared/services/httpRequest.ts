import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/shared/stores/authStore';
import { keysToCamelCase, keysToSnakeCase } from '@/shared/utils/appUtils';
import type { ApiResponse } from '@/shared/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const httpRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface FailedQueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
httpRequest.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Auto-transform request body keys to snake_case unless it's FormData
    if (config.data && !(config.data instanceof FormData)) {
      config.data = keysToSnakeCase(config.data);
    }

    if (config.params) {
      config.params = keysToSnakeCase(config.params);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
httpRequest.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = keysToCamelCase(response.data);
    }
    return response;
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthPath =
      originalRequest.url?.includes('/auth/public/refresh') ||
      originalRequest.url?.includes('/auth/public/sign-in') ||
      originalRequest.url?.includes('/auth/sign-out');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthPath) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return httpRequest(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post<ApiResponse<{ accessToken?: string } | string>>(
          `${BASE_URL}/auth/public/refresh`,
          {},
          { withCredentials: true }
        );

        const responseData = refreshResponse.data.data;
        let newAccessToken = '';

        if (typeof responseData === 'string') {
          newAccessToken = responseData;
        } else if (responseData && typeof responseData === 'object' && 'accessToken' in responseData) {
          newAccessToken = responseData.accessToken || '';
        }

        if (!newAccessToken) {
          throw new Error('Refresh token response missing access token');
        }

        useAuthStore.getState().setAccessToken(newAccessToken);
        httpRequest.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return httpRequest(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.data) {
      error.response.data = keysToCamelCase(error.response.data);
    }

    return Promise.reject(error);
  }
);
