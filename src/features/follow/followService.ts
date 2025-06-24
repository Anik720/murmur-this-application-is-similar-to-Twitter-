import api from "../../lib/api";


export const followService = {
  followUser: async (id: string) => {
    await api.post(`/users/${id}/follow`);
  },
  unfollowUser: async (id: string) => {
    await api.delete(`/users/${id}/follow`);
  },
};