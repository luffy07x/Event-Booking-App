import api from './api';

export const reservationService = {
  async createReservation(reservationData) {
    const response = await api.post('/reservations', reservationData);
    return response.data;
  },

  async getUserReservations() {
    const response = await api.get('/reservations');
    return response.data;
  },

  async getReservationById(id) {
    const response = await api.get(`/reservations/${id}`);
    return response.data;
  },

  async getReservationByCode(reservationCode) {
    const response = await api.get(`/reservations/code/${reservationCode}`);
    return response.data;
  },

  async cancelReservation(id) {
    const response = await api.put(`/reservations/${id}/cancel`);
    return response.data;
  },

  // Admin functions
  async getAllReservations() {
    const response = await api.get('/reservations/all');
    return response.data;
  },

  async getEventReservations(eventId) {
    const response = await api.get(`/reservations/event/${eventId}`);
    return response.data;
  },
};