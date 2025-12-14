import axios, { AxiosError } from 'axios';
import config from '@src/config';

export const api = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);
