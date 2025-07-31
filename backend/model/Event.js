const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: [
      'conference',
      'workshop',
      'seminar',
      'concert',
      'festival',
      'sports',
      'networking',
      'exhibition',
      'party',
      'other'
    ]
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  venue: {
    name: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true
    },
    address: {
      street: String,
      city: { type: String, required: true },
      state: String,
      country: { type: String, required: true },
      zipCode: String
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    capacity: {
      type: Number,
      required: [true, 'Venue capacity is required'],
      min: [1, 'Capacity must be at least 1']
    }
  },
  dateTime: {
    start: {
      type: Date,
      required: [true, 'Start date and time is required']
    },
    end: {
      type: Date,
      required: [true, 'End date and time is required']
    }
  },
  pricing: {
    type: {
      type: String,
      enum: ['free', 'paid'],
      default: 'free'
    },
    amount: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  images: [{
    url: String,
    public_id: String,
    alt: String
  }],
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  maxAttendees: {
    type: Number,
    required: [true, 'Maximum attendees limit is required'],
    min: [1, 'Must allow at least 1 attendee']
  },
  currentAttendees: {
    type: Number,
    default: 0
  },
  requirements: {
    ageRestriction: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 120 }
    },
    specialRequirements: [String]
  },
  contact: {
    email: String,
    phone: String,
    website: String
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
eventSchema.index({ 'venue.address.city': 1, category: 1, 'dateTime.start': 1 });
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  return this.maxAttendees - this.currentAttendees;
});

// Virtual for event duration
eventSchema.virtual('duration').get(function() {
  return this.dateTime.end - this.dateTime.start;
});

// Pre-save validation
eventSchema.pre('save', function(next) {
  // Ensure end date is after start date
  if (this.dateTime.end <= this.dateTime.start) {
    return next(new Error('End date must be after start date'));
  }
  
  // Ensure registration deadline is before event start
  if (this.registrationDeadline >= this.dateTime.start) {
    return next(new Error('Registration deadline must be before event start date'));
  }
  
  next();
});

// Static method to find upcoming events
eventSchema.statics.findUpcoming = function() {
  return this.find({
    'dateTime.start': { $gte: new Date() },
    status: 'published'
  }).sort({ 'dateTime.start': 1 });
};

// Static method to find events by category
eventSchema.statics.findByCategory = function(category) {
  return this.find({ 
    category: category,
    status: 'published',
    'dateTime.start': { $gte: new Date() }
  });
};

module.exports = mongoose.model('Event', eventSchema);