import axios from 'axios';
import config from '@src/config';
import { authInterceptor } from '../auth-interceptor';

export const authApi = axios.create({
  baseURL: config.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

authInterceptor(authApi);
