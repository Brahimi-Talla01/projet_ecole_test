import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const RETRY_CONFIG = {
      maxRetries: 3,
      retryDelay: 1000, 
      retryableStatuses: [408, 429, 500, 502, 503, 504], 
};


export const retryInterceptor = async (error: AxiosError) => {
      const config = error.config as InternalAxiosRequestConfig & {
            _retry?: number;
      };

      // Vérifier si on peut retry
      if (!config || !error.response) {
            return Promise.reject(error);
      }

      const shouldRetry =
      RETRY_CONFIG.retryableStatuses.includes(error.response.status);

      if (!shouldRetry) {
            return Promise.reject(error);
      }

      // Initialiser le compteur de retry
      config._retry = config._retry || 0;

      // Vérifier le nombre de retry
      if (config._retry >= RETRY_CONFIG.maxRetries) {
            console.error(
                  `Max retries (${RETRY_CONFIG.maxRetries}) reached for:`,
                  config.url
            );
            return Promise.reject(error);
      }

      // Incrémenter le compteur
      config._retry += 1;

      console.warn(
            `Retrying request (${config._retry}/${RETRY_CONFIG.maxRetries}):`,
            config.url
      );

      await new Promise((resolve) =>
            setTimeout(resolve, RETRY_CONFIG.retryDelay * config._retry!)
      );

      // Réessayer la requête
      return axios(config);
};