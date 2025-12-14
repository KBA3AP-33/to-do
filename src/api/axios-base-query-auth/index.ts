import axios from 'axios';
import { authApi } from '@src/api/auth';
import type { AxiosRequestConfig } from 'axios';

export const axiosBaseQueryAuth =
  () =>
  async ({ url, method, data, params, headers }: AxiosRequestConfig) => {
    try {
      const result = await authApi({
        url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (error: unknown) {
      return axios.isAxiosError(error)
        ? {
            status: error.response?.status,
            data: error.response?.data,
          }
        : { error };
    }
  };
