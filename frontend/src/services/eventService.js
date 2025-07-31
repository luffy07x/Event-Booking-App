import api from './api';

export const eventService = {
  async getAllEvents() {
    const response = await api.get('/events');
    return response.data;
  },

  async getEventById(id) {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  async getFeaturedEvents() {
    const response = await api.get('/events/featured');
    return response.data;
  },

  async getBookableEvents() {
    const response = await api.get('/events/bookable');
    return response.data;
  },

  async searchEvents(keyword) {
    const response = await api.get(`/events/search?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  async getEventsByCategory(category) {
    const response = await api.get(`/events/category/${category}`);
    return response.data;
  },

  async getEventsWithPagination(page = 0, size = 10, sortBy = 'eventDateTime', sortDir = 'asc') {
    const response = await api.get(`/events/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
    return response.data;
  },

  async getEventsBetweenDates(startDate, endDate) {
    const response = await api.get(`/events/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  async getEventCategories() {
    const response = await api.get('/events/categories');
    return response.data;
  },

  // Admin functions
  async createEvent(eventData) {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  async updateEvent(id, eventData) {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  async deleteEvent(id) {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};