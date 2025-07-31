import axios from 'axios';

// Mock API base URL - replace with your actual API endpoint
const API_BASE_URL = 'https://api.eventbooking.com'; // This would be your real API

// Mock data for demonstration
const mockEvents = [
  {
    id: 1,
    title: 'Tech Conference 2024',
    description: 'Join us for the biggest tech conference of the year featuring industry leaders and cutting-edge innovations.',
    date: '2024-06-15',
    time: '09:00',
    location: 'San Francisco Convention Center',
    price: 299,
    capacity: 500,
    booked: 342,
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizer: 'TechEvents Inc.',
    tags: ['Technology', 'Networking', 'Innovation'],
    featured: true
  },
  {
    id: 2,
    title: 'Summer Music Festival',
    description: 'Experience an unforgettable weekend of music with top artists from around the world.',
    date: '2024-07-20',
    time: '18:00',
    location: 'Central Park, New York',
    price: 89,
    capacity: 2000,
    booked: 1456,
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizer: 'Music World Events',
    tags: ['Music', 'Festival', 'Outdoor'],
    featured: true
  },
  {
    id: 3,
    title: 'Startup Pitch Competition',
    description: 'Watch innovative startups pitch their ideas to top investors and compete for funding.',
    date: '2024-05-10',
    time: '14:00',
    location: 'Innovation Hub, Austin',
    price: 45,
    capacity: 200,
    booked: 156,
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizer: 'Startup Network',
    tags: ['Business', 'Startups', 'Investment'],
    featured: false
  },
  {
    id: 4,
    title: 'Art Gallery Opening',
    description: 'Discover contemporary art from emerging artists in an exclusive gallery opening.',
    date: '2024-04-25',
    time: '19:00',
    location: 'Modern Art Gallery, Los Angeles',
    price: 25,
    capacity: 150,
    booked: 89,
    category: 'Art',
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizer: 'Modern Art Collective',
    tags: ['Art', 'Culture', 'Exhibition'],
    featured: false
  },
  {
    id: 5,
    title: 'Food & Wine Festival',
    description: 'Taste exquisite dishes and wines from renowned chefs and vineyards.',
    date: '2024-08-12',
    time: '16:00',
    location: 'Napa Valley, California',
    price: 125,
    capacity: 300,
    booked: 234,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizer: 'Culinary Events Co.',
    tags: ['Food', 'Wine', 'Tasting'],
    featured: true
  },
  {
    id: 6,
    title: 'Digital Marketing Workshop',
    description: 'Learn the latest digital marketing strategies from industry experts.',
    date: '2024-05-30',
    time: '10:00',
    location: 'Business Center, Chicago',
    price: 199,
    capacity: 100,
    booked: 67,
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizer: 'Marketing Academy',
    tags: ['Marketing', 'Workshop', 'Digital'],
    featured: false
  }
];

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const eventService = {
  // Get all events
  getAllEvents: async (filters = {}) => {
    try {
      // In a real app, this would make an API call
      // const response = await api.get('/events', { params: filters });
      // return response.data;
      
      // Mock implementation
      let filteredEvents = [...mockEvents];
      
      if (filters.category) {
        filteredEvents = filteredEvents.filter(event => 
          event.category.toLowerCase() === filters.category.toLowerCase()
        );
      }
      
      if (filters.search) {
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          event.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      if (filters.featured) {
        filteredEvents = filteredEvents.filter(event => event.featured);
      }
      
      return filteredEvents;
    } catch (error) {
      throw new Error('Failed to fetch events');
    }
  },

  // Get event by ID
  getEventById: async (id) => {
    try {
      // const response = await api.get(`/events/${id}`);
      // return response.data;
      
      const event = mockEvents.find(event => event.id === parseInt(id));
      if (!event) {
        throw new Error('Event not found');
      }
      return event;
    } catch (error) {
      throw new Error('Failed to fetch event details');
    }
  },

  // Book an event
  bookEvent: async (eventId, bookingData) => {
    try {
      // const response = await api.post(`/events/${eventId}/book`, bookingData);
      // return response.data;
      
      // Mock implementation
      const booking = {
        id: Date.now(),
        eventId: parseInt(eventId),
        ...bookingData,
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        totalAmount: bookingData.tickets * mockEvents.find(e => e.id === parseInt(eventId))?.price || 0
      };
      
      return booking;
    } catch (error) {
      throw new Error('Failed to book event');
    }
  },

  // Get user bookings
  getUserBookings: async (userId) => {
    try {
      // const response = await api.get(`/users/${userId}/bookings`);
      // return response.data;
      
      // Mock implementation
      return [];
    } catch (error) {
      throw new Error('Failed to fetch bookings');
    }
  },

  // Get event categories
  getCategories: async () => {
    try {
      // const response = await api.get('/categories');
      // return response.data;
      
      const categories = [...new Set(mockEvents.map(event => event.category))];
      return categories;
    } catch (error) {
      throw new Error('Failed to fetch categories');
    }
  }
};