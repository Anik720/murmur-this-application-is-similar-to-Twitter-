import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/';

export const getTimelineMurmurs = async (page: number, limit: number = 10) => {
  const response = await axios.get(`${API_BASE_URL}/murmurs`, {
    params: { page, limit },
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });
  return response.data;
};

export const createMurmur = async (content: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/me/murmurs`,
    { content },
    { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
  );
  return response.data;
};

export const deleteMurmur = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/me/murmurs/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });
};

export const likeMurmur = async (id: number) => {
  const response = await axios.post(
    `${API_BASE_URL}/murmurs/${id}/like`,
    {},
    { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
  );
  return response.data;
};

export const unlikeMurmur = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/murmurs/${id}/like`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });
};