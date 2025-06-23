
import api from '../../lib/api';
import { Murmur, PaginatedResponse } from '../../types';

export const murmurService = {
  getTimeline: async (page: number = 1, pageSize: number = 10) => {
    const response = await api.get<PaginatedResponse<Murmur>>('/murmurs', {
      params: { page, pageSize },
    });
    return response.data;
  },
  getMurmur: async (id: string) => {
    const response = await api.get<Murmur>(`/murmurs/${id}`);
    return response.data;
  },
  createMurmur: async (content: string) => {
    const response = await api.post<Murmur>('/me/murmurs',  content );
    return response.data;
  },

  deleteMurmur: async (id: string) => {
    await api.delete(`/me/murmurs/${id}`);
  },
  likeMurmur: async (id: string) => {
    await api.post(`/murmurs/${id}/like`);
  },
  unlikeMurmur: async (id: string) => {
    await api.delete(`/murmurs/${id}/like`);
  },
};