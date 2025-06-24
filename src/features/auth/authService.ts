import api from '../../lib/api';
import { AuthResponse } from '../../types';

export const authService = {
  register: async (data: { username: string; name: string; password: string }) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
  login: async (data: { username: string; password: string }) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
};