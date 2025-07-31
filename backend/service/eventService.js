const Event = require('../model/Event');
const { EventDTO, EventSummaryDTO } = require('../dto/EventDTO');

class EventService {
  async getAllEvents(filters = {}) {
    try {
      let query = { status: 'published' };
      
      // Apply filters
      if (filters.category) query.category = filters.category;
      if (filters.city) query['venue.address.city'] = new RegExp(filters.city, 'i');
      if (filters.country) query['venue.address.country'] = new RegExp(filters.country, 'i');
      if (filters.featured) query.featured = filters.featured === 'true';
      
      // Date filters
      if (filters.startDate || filters.endDate) {
        query['dateTime.start'] = {};
        if (filters.startDate) query['dateTime.start'].$gte = new Date(filters.startDate);
        if (filters.endDate) query['dateTime.start'].$lte = new Date(filters.endDate);
      }
      
      // Price filters
      if (filters.minPrice || filters.maxPrice) {
        query['pricing.amount'] = {};
        if (filters.minPrice) query['pricing.amount'].$gte = parseFloat(filters.minPrice);
        if (filters.maxPrice) query['pricing.amount'].$lte = parseFloat(filters.maxPrice);
      }
      
      // Search query
      if (filters.search) {
        query.$text = { $search: filters.search };
      }
      
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 12;
      const skip = (page - 1) * limit;
      
      const events = await Event.find(query)
        .populate('organizer', 'name email avatar')
        .sort({ 
          featured: -1, 
          'dateTime.start': 1 
        })
        .skip(skip)
        .limit(limit);
      
      const total = await Event.countDocuments(query);
      
      return {
        events: EventSummaryDTO.fromArray(events),
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  }

  async getEventById(id) {
    try {
      const event = await Event.findById(id)
        .populate('organizer', 'name email phone avatar');
      
      if (!event) {
        throw new Error('Event not found');
      }
      
      return new EventDTO(event);
    } catch (error) {
      throw new Error(`Failed to fetch event: ${error.message}`);
    }
  }

  async createEvent(eventData, organizerId) {
    try {
      const event = new Event({
        ...eventData,
        organizer: organizerId
      });
      
      await event.save();
      
      const populatedEvent = await Event.findById(event._id)
        .populate('organizer', 'name email avatar');
      
      return new EventDTO(populatedEvent);
    } catch (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }
  }

  async updateEvent(id, updateData, userId) {
    try {
      const event = await Event.findById(id);
      
      if (!event) {
        throw new Error('Event not found');
      }
      
      // Check if user is the organizer or admin
      if (event.organizer.toString() !== userId) {
        throw new Error('Not authorized to update this event');
      }
      
      Object.assign(event, updateData);
      await event.save();
      
      const updatedEvent = await Event.findById(id)
        .populate('organizer', 'name email avatar');
      
      return new EventDTO(updatedEvent);
    } catch (error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }
  }

  async deleteEvent(id, userId) {
    try {
      const event = await Event.findById(id);
      
      if (!event) {
        throw new Error('Event not found');
      }
      
      // Check if user is the organizer or admin
      if (event.organizer.toString() !== userId) {
        throw new Error('Not authorized to delete this event');
      }
      
      await Event.findByIdAndDelete(id);
      
      return { message: 'Event deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  }

  async getUpcomingEvents(limit = 6) {
    try {
      const events = await Event.findUpcoming()
        .populate('organizer', 'name avatar')
        .limit(limit);
      
      return EventSummaryDTO.fromArray(events);
    } catch (error) {
      throw new Error(`Failed to fetch upcoming events: ${error.message}`);
    }
  }

  async getFeaturedEvents(limit = 4) {
    try {
      const events = await Event.find({
        featured: true,
        status: 'published',
        'dateTime.start': { $gte: new Date() }
      })
        .populate('organizer', 'name avatar')
        .sort({ 'dateTime.start': 1 })
        .limit(limit);
      
      return EventSummaryDTO.fromArray(events);
    } catch (error) {
      throw new Error(`Failed to fetch featured events: ${error.message}`);
    }
  }

  async getEventsByCategory(category, limit = 10) {
    try {
      const events = await Event.findByCategory(category)
        .populate('organizer', 'name avatar')
        .limit(limit);
      
      return EventSummaryDTO.fromArray(events);
    } catch (error) {
      throw new Error(`Failed to fetch events by category: ${error.message}`);
    }
  }

  async getEventsByOrganizer(organizerId) {
    try {
      const events = await Event.find({ organizer: organizerId })
        .populate('organizer', 'name email avatar')
        .sort({ createdAt: -1 });
      
      return EventDTO.fromArray(events);
    } catch (error) {
      throw new Error(`Failed to fetch organizer events: ${error.message}`);
    }
  }

  async searchEvents(searchTerm) {
    try {
      const events = await Event.find({
        $text: { $search: searchTerm },
        status: 'published',
        'dateTime.start': { $gte: new Date() }
      })
        .populate('organizer', 'name avatar')
        .sort({ score: { $meta: 'textScore' } });
      
      return EventSummaryDTO.fromArray(events);
    } catch (error) {
      throw new Error(`Failed to search events: ${error.message}`);
    }
  }
}

module.exports = new EventService();