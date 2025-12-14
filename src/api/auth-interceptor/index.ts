import { Tokens } from '@src/utils/tokens';
import type { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { authApi } from '../auth';
import axios from 'axios';

const authReqInterceptor = (inst: AxiosInstance) => {
  inst.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const { accessToken } = Tokens.getTokens();

      if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
};

let isRefreshing = false;
const failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => (error ? prom.reject(error) : prom.resolve(token!)));
  failedQueue.length = 0;
};

const authResInterceptor = (inst: AxiosInstance) => {
  inst.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return authApi(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const { refreshToken } = Tokens.getTokens();

        if (!refreshToken) {
          Tokens.clearTokens();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh`, { refreshToken }, {
            headers: { 'Content-Type': 'application/json' },
          } as AxiosRequestConfig);

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

          Tokens.setTokens(newAccessToken, newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);

          return authApi(originalRequest);
        } catch (refreshError) {
          Tokens.clearTokens();
          processQueue(refreshError as AxiosError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (error.response?.status === 403) {
        console.error('Доступ запрещен');
      }

      return Promise.reject(error);
    }
  );
};

export const authInterceptor = (inst: AxiosInstance) => {
  authReqInterceptor(inst);
  authResInterceptor(inst);
};
