import axios, {
  type AxiosProgressEvent,
  type AxiosRequestConfig,
  AxiosError,
} from 'axios';
import { type BaseQueryFn } from '@reduxjs/toolkit/query/react';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
  withCredentials: true,
});
// https://sem-backend.vercel.app  https://sem-backend.vercel.app/
// We no longer manually attach the token because we are using HTTP-Only Cookies.
// The browser will automatically send the cookie with every request.
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

export interface AxiosRequest<TData = unknown> {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: TData | FormData | File;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export const axiosBaseQuery =
  <TData = unknown>(): BaseQueryFn<AxiosRequest<TData>, unknown, unknown> =>
    async ({ url, method, data, params, headers, onUploadProgress }) => {
      // Debug log for outgoing requests
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 [${method?.toUpperCase()}] ${url}`, { data, params });
      }
      
      try {
        const result = await axiosInstance({
          url,
          method,
          data,
          params,
          headers,
          onUploadProgress,
        });
        return { data: result.data as TData };
      } catch (err) {
        const error = err as AxiosError<any>;
        const status = error.response?.status;
        const message = error.response?.data?.message;
        const errorName = error.response?.data?.error?.name;

        const isTokenExpired =
          status === 401 ||
          message === 'jwt expired' ||
          errorName === 'TokenExpiredError';

        if (isTokenExpired) {
          // Handle global token expiration logout here if needed
        }
        return {
          error: {
            status: error.response?.status,
            data: error.response?.data || error.message,
          },
        };
      }
    };
