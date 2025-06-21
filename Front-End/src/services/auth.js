import api from './api.js';

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, motdepasse: password });
  return response.data;
};