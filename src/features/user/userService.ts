
import api from '../../lib/api';
import { Murmur, PaginatedResponse, User } from '../../types';

export const userService = {
  getCurrentUser: async () => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },
  getUser: async (id: string) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },
  getUserMurmurs: async (id: string, page: number = 1, pageSize: number = 10) => {
    const response = await api.get<PaginatedResponse<Murmur>>(`/users/${id}`, {
      params: { page, pageSize },
    });
    return response.data;
  },
};