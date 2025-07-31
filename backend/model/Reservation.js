const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  attendees: [{
    name: {
      type: String,
      required: [true, 'Attendee name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Attendee email is required'],
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email'
      ]
    },
    phone: {
      type: String,
      trim: true
    },
    age: {
      type: Number,
      min: [0, 'Age cannot be negative']
    },
    dietaryRestrictions: [String],
    specialRequirements: String
  }],
  numberOfAttendees: {
    type: Number,
    required: [true, 'Number of attendees is required'],
    min: [1, 'Must have at least 1 attendee']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash', 'free'],
    default: 'free'
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date,
    refundId: String,
    refundDate: Date,
    refundReason: String
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled', 'attended', 'no_show'],
    default: 'pending'
  },
  reservationCode: {
    type: String,
    unique: true,
    required: true
  },
  qrCode: {
    type: String // Base64 encoded QR code
  },
  checkInTime: Date,
  checkOutTime: Date,
  notes: {
    user: String,
    admin: String
  },
  cancellation: {
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    refundAmount: Number
  },
  reminders: {
    sent: [Date],
    nextReminder: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
reservationSchema.index({ event: 1, user: 1 });
reservationSchema.index({ reservationCode: 1 });
reservationSchema.index({ status: 1, 'event': 1 });

// Generate unique reservation code before saving
reservationSchema.pre('save', async function(next) {
  if (!this.reservationCode) {
    let code;
    let isUnique = false;
    
    while (!isUnique) {
      // Generate 8-character alphanumeric code
      code = Math.random().toString(36).substr(2, 8).toUpperCase();
      
      // Check if code already exists
      const existingReservation = await this.constructor.findOne({ reservationCode: code });
      if (!existingReservation) {
        isUnique = true;
      }
    }
    
    this.reservationCode = code;
  }
  
  next();
});

// Virtual for reservation age
reservationSchema.virtual('reservationAge').get(function() {
  return Date.now() - this.createdAt;
});

// Static method to find user reservations
reservationSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId })
    .populate('event', 'title dateTime venue.name status')
    .sort({ createdAt: -1 });
};

// Static method to find event reservations
reservationSchema.statics.findByEvent = function(eventId) {
  return this.find({ event: eventId })
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });
};

// Instance method to cancel reservation
reservationSchema.methods.cancel = function(cancelledBy, reason) {
  this.status = 'cancelled';
  this.cancellation = {
    cancelledAt: new Date(),
    cancelledBy: cancelledBy,
    reason: reason
  };
  
  return this.save();
};

// Instance method to confirm reservation
reservationSchema.methods.confirm = function() {
  this.status = 'confirmed';
  this.paymentStatus = 'paid';
  this.paymentDetails.paymentDate = new Date();
  
  return this.save();
};

// Instance method to check in
reservationSchema.methods.checkIn = function() {
  this.status = 'attended';
  this.checkInTime = new Date();
  
  return this.save();
};

module.exports = mongoose.model('Reservation', reservationSchema);