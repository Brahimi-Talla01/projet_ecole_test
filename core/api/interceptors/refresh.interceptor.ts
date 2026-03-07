import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/core/config/env';

interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (error: any) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];


// Traite les requêtes en attente après une tentative de refresh
const processQueue = (error: any = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

export const refreshTokenInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

  if (error.response?.status !== 401 || originalRequest?._retry) {
    return Promise.reject(error);
  }

  // Si l'erreur vient de l'appel de refresh lui-même, on déconnecte
  if (originalRequest.url?.includes('/auth/refresh')) {
    isRefreshing = false;
    if (typeof window !== 'undefined') window.location.href = '/login';
    return Promise.reject(error);
  }

  // Gestion de la file d'attente pendant qu'un refresh est déjà en cours
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then(() => axios(originalRequest))
      .catch((err) => Promise.reject(err));
  }

  // Lancement du processus de refresh
  originalRequest._retry = true;
  isRefreshing = true;

  try {
    await axios.post(
      `${env.apiUrl}/auth/refresh`,
      {},
      { withCredentials: true }
    );

    processQueue(null);
    return axios(originalRequest);
  } catch (refreshError) {
    processQueue(refreshError);
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
};