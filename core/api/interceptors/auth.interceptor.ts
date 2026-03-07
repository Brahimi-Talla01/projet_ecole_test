import { InternalAxiosRequestConfig } from 'axios';

export const authRequestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
      return config;
};

export const authErrorInterceptor = (error: any) => {
      return Promise.reject(error);
};