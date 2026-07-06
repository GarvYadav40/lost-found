import { useAuth } from '@clerk/clerk-react';
import { useMemo } from 'react';
import axios from 'axios';

export const useApi = () => {
  const { getToken } = useAuth();

  const apiInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    });

    instance.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error fetching auth token in interceptor:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return instance;
  }, [getToken]);

  return apiInstance;
};
