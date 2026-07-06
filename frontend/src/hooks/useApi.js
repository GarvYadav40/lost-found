import { useAuth } from '@clerk/clerk-react';
import { useMemo } from 'react';
import axios from 'axios';

export const useApi = () => {
  const { getToken } = useAuth();

  const apiInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    });

    instance.interceptors.request.use(async (config) => {
      const token = await getToken();

      console.log("Clerk token:", token);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    return instance;
  }, [getToken]);

  return apiInstance;
};