import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { env } from '@/core/config/env';
import { API_CONFIG } from '@/core/config/constants';
import {
      authRequestInterceptor,
      authErrorInterceptor,
} from './interceptors/auth.interceptor';
import { refreshTokenInterceptor } from './interceptors/refresh.interceptor';
import { retryInterceptor } from './interceptors/retry.interceptor';
import { errorResponseInterceptor } from './interceptors/error.interceptor';

// Instance Axios globale
export const apiClient = axios.create({
      baseURL: env.apiUrl,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
      'Content-Type': 'application/json',
      },
      withCredentials: true, 
});


// Injection des headers d'authentification
apiClient.interceptors.request.use(authRequestInterceptor, authErrorInterceptor);

// Formatage et normalisation des erreurs
apiClient.interceptors.response.use(
      (response: AxiosResponse) => response,
      errorResponseInterceptor,
);

// Retry automatique sur erreurs réseau transitoires
apiClient.interceptors.response.use(
      (response: AxiosResponse) => response,
      retryInterceptor,
);

// Refresh silencieux du token sur 401 
apiClient.interceptors.response.use(
      (response: AxiosResponse) => response,
      refreshTokenInterceptor,
);

// Logging — Développement uniquement
if (env.isDev) {
      apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            console.log(
                  `[API] ← ${config.method?.toUpperCase()} ${config.url}`,
                  config.data ?? '',
            );
            return config;
      });

      apiClient.interceptors.response.use(
            (response: AxiosResponse) => {
                  console.log(
                        `[API] → ${response.status} ${response.config.url}`,
                  );
                  return response;
            },
            (error) => {
                  console.error(
                        `[API] ✕ ${error.response?.status ?? 'NETWORK'} ${error.config?.url ?? ''}`,
                        error.message,
                  );
                  return Promise.reject(error);
            },
      );
}