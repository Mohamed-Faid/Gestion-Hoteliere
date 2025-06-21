import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000'; // Matches backend address

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getUsers = () => api.get('/utilisateurs');
export const createUser = (data) => api.post('/utilisateurs', data);
export const updateUser = (id, data) => api.put(`/utilisateurs/${id}`, data);
export const deleteUser = (id) => api.delete(`/utilisateurs/${id}`);

export const getRooms = () => api.get('/chambres');
export const getAvailableRooms = (startDate, endDate) =>
  api.get(`/chambres/disponibles/${startDate}/${endDate}`);
export const createRoom = (data) => api.post('/chambres', data);
export const updateRoom = (id, data) => api.put(`/chambres/${id}`, data);
export const deleteRoom = (id) => api.delete(`/chambres/${id}`);

export const getClients = () => api.get('/clients');
export const createClient = (data) => api.post('/clients', data);
export const updateClient = (id, data) => api.put(`/clients/${id}`, data);
export const deleteClient = (id) => api.delete(`/clients/${id}`);

export const getReservations = () => api.get('/reservations');
export const createReservation = (data) => api.post('/reservations', data);
export const updateReservation = (id, data) =>
  api.put(`/reservations/${id}`, data);
export const deleteReservation = (id) => api.delete(`/reservations/${id}`);

export const getServices = () => api.get('/services');
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);

export const getDashboardStats = () => api.get('/dashboard/stats');

export default api;