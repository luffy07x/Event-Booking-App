import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    
    // Don't show toast for certain endpoints
    const silentEndpoints = ['/users/verify'];
    const shouldShowToast = !silentEndpoints.some(endpoint => 
      error.config?.url?.includes(endpoint)
    );
    
    if (shouldShowToast) {
      toast.error(message);
    }
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
  forgotPassword: (email) => api.post('/users/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/users/reset-password/${token}`, { password }),
  verifyToken: () => api.get('/users/verify'),
};

// Events API
export const eventsAPI = {
  getAllEvents: (params) => api.get('/events', { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getUpcomingEvents: (limit) => api.get(`/events/upcoming/list?limit=${limit}`),
  getFeaturedEvents: (limit) => api.get(`/events/featured/list?limit=${limit}`),
  getEventsByCategory: (category, limit) => api.get(`/events/category/${category}?limit=${limit}`),
  searchEvents: (term) => api.get(`/events/search/${term}`),
  getMyEvents: () => api.get('/events/organizer/my-events'),
};

// Reservations API
export const reservationsAPI = {
  createReservation: (reservationData) => api.post('/reservations', reservationData),
  getMyReservations: (params) => api.get('/reservations/my-reservations', { params }),
  getReservation: (id) => api.get(`/reservations/${id}`),
  updateReservation: (id, reservationData) => api.put(`/reservations/${id}`, reservationData),
  cancelReservation: (id, reason) => api.delete(`/reservations/${id}`, { data: { reason } }),
  getEventReservations: (eventId) => api.get(`/reservations/event/${eventId}`),
  checkInReservation: (id) => api.put(`/reservations/${id}/checkin`),
  getReservationByCode: (code) => api.get(`/reservations/code/${code}`),
  confirmPayment: (id, paymentDetails) => api.put(`/reservations/${id}/confirm-payment`, paymentDetails),
  getStats: () => api.get('/reservations/stats/overview'),
};

// Users API (Admin)
export const usersAPI = {
  getAllUsers: (params) => api.get('/users', { params }),
  deleteUser: (id) => api.delete(`/users/${id}`),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
};

// Utility functions
export const handleApiError = (error) => {
  console.error('API Error:', error);
  const message = error.response?.data?.message || error.message || 'Something went wrong';
  return message;
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;