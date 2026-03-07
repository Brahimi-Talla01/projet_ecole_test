import { AxiosError } from 'axios';
import { ApiError } from '../types/api-response';


// Intercepteur de gestion des erreurs HTTP
export const errorResponseInterceptor = async (error: AxiosError<ApiError>) => {
      const { response } = error;

      if (!response) {
            if (error.request) {
                  console.error('❌ No response from server. Check CORS or Server status.');
            } else {
                  console.error('❌ Request Setup Error:', error.message);
            }

            return Promise.reject({
                  message: 'Le serveur ne répond pas. Veuillez vérifier votre connexion ou réessayer plus tard.',
                  statusCode: 503, 
            });
      }

      // Gestion selon le code HTTP
      switch (response.status) {
            case 400:
                  console.error('❌ Bad Request:', response.data.message);
                  break;

            case 401:
                  console.error('❌ Unauthorized:', response.data.message);
                  break;

            case 403:
                  console.error('❌ Forbidden:', response.data.message);
                  break;

            case 404:
                  console.error('❌ Not Found:', response.data.message);
                  break;

            case 422:
                  console.error('❌ Validation Error:', response.data.errors);
                  break;

            case 429:
                  console.error('❌ Too Many Requests');
                  break;

            case 500:
                  console.error('❌ Server Error:', response.data.message);
                  break;

            default:
                  console.error('❌ API Error:', response.status, response.data.message);
      }

      return Promise.reject(response.data);
};