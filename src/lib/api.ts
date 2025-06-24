import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '../store/AuthStore';


const api: AxiosInstance = axios.create({
  baseURL:  'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().access_token || JSON.parse(localStorage.getItem('access_token') as string);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;