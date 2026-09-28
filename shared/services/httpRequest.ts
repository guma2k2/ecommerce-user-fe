import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/shared/stores/authStore';
import { STORAGE_KEYS } from '@/shared/constants';
import { keysToCamelCase, keysToSnakeCase } from '@/shared/utils/appUtils';
import type { ApiResponse } from '@/shared/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

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
    const token =
      typeof window !== 'undefined'
        ? sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        : null;
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

const isUnauthenticatedResponse = (
  status?: string | number,
  data?: unknown,
  message?: unknown
): boolean => {
  const statusStr = String(status ?? '').toLowerCase();
  const dataStr = String(data ?? '').toLowerCase();
  const messageStr = typeof message === 'string' ? message.toLowerCase() : '';

  return (
    statusStr === '401' ||
    statusStr === 'unauthenticated' ||
    dataStr === 'unauthenticated' ||
    messageStr === 'unauthenticated'
  );
};

const handleRefreshAndRetry = async (
  originalRequest: InternalAxiosRequestConfig & { _retry?: boolean }
) => {
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

    const resData = refreshResponse.data;
    if (resData.status && String(resData.status) !== '200') {
      throw new Error(resData.message || 'Refresh token failed');
    }

    const responseData = resData.data;
    let newAccessToken = '';

    if (
      typeof responseData === 'string' &&
      (responseData.includes('.') || responseData.length > 30)
    ) {
      newAccessToken = responseData;
    } else if (
      responseData &&
      typeof responseData === 'object' &&
      'accessToken' in responseData &&
      responseData.accessToken
    ) {
      newAccessToken = responseData.accessToken;
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
};

// Response Interceptor
httpRequest.interceptors.response.use(
  async (response) => {
    if (response.data) {
      response.data = keysToCamelCase(response.data);

      const originalRequest = response.config as InternalAxiosRequestConfig & { _retry?: boolean };
      const isAuthPath =
        originalRequest?.url?.includes('/auth/public/refresh') ||
        originalRequest?.url?.includes('/auth/public/sign-in') ||
        originalRequest?.url?.includes('/auth/sign-out');

      const isUnauth = isUnauthenticatedResponse(
        response.data.status,
        response.data.data,
        response.data.message
      );

      // Trigger silent refresh ONLY when response indicates unauthenticated
      if (isUnauth && !originalRequest?._retry && !isAuthPath) {
        return handleRefreshAndRetry(originalRequest);
      }

      const businessStatus = response.data.status ? String(response.data.status) : '';
      if (businessStatus && businessStatus !== '200') {
        const businessCode = Number(businessStatus) || 400;
        const error = new AxiosError<ApiResponse<unknown>>(
          response.data.message || 'Business Error',
          businessStatus,
          response.config,
          response.request,
          {
            ...response,
            status: businessCode,
          }
        );
        return Promise.reject(error);
      }
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

    const isUnauth =
      error.response?.status === 401 ||
      isUnauthenticatedResponse(
        error.response?.data?.status,
        error.response?.data?.data,
        error.response?.data?.message
      );

    if (isUnauth && !originalRequest._retry && !isAuthPath) {
      return handleRefreshAndRetry(originalRequest);
    }

    if (error.response?.data) {
      error.response.data = keysToCamelCase(error.response.data);
    }

    return Promise.reject(error);
  }
);

