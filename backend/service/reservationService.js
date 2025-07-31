const Reservation = require('../model/Reservation');
const Event = require('../model/Event');
const { ReservationDTO, ReservationSummaryDTO } = require('../dto/ReservationDTO');

class ReservationService {
  async createReservation(reservationData, userId) {
    try {
      // Get event details
      const event = await Event.findById(reservationData.event);
      
      if (!event) {
        throw new Error('Event not found');
      }

      // Check if event is published and registration is open
      if (event.status !== 'published') {
        throw new Error('Event is not available for registration');
      }

      if (new Date() > event.registrationDeadline) {
        throw new Error('Registration deadline has passed');
      }

      // Check availability
      if (event.currentAttendees + reservationData.numberOfAttendees > event.maxAttendees) {
        throw new Error('Not enough available spots for this event');
      }

      // Calculate total amount
      const totalAmount = event.pricing.type === 'paid' 
        ? event.pricing.amount * reservationData.numberOfAttendees 
        : 0;

      // Create reservation
      const reservation = new Reservation({
        ...reservationData,
        user: userId,
        totalAmount,
        paymentMethod: event.pricing.type === 'free' ? 'free' : reservationData.paymentMethod
      });

      await reservation.save();

      // Update event attendee count
      event.currentAttendees += reservationData.numberOfAttendees;
      await event.save();

      // Populate and return reservation
      const populatedReservation = await Reservation.findById(reservation._id)
        .populate('event', 'title dateTime venue.name pricing')
        .populate('user', 'name email phone');

      return new ReservationDTO(populatedReservation);
    } catch (error) {
      throw new Error(`Failed to create reservation: ${error.message}`);
    }
  }

  async getUserReservations(userId, filters = {}) {
    try {
      let query = { user: userId };

      // Apply filters
      if (filters.status) query.status = filters.status;
      if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;

      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 10;
      const skip = (page - 1) * limit;

      const reservations = await Reservation.find(query)
        .populate('event', 'title dateTime venue.name status images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Reservation.countDocuments(query);

      return {
        reservations: ReservationSummaryDTO.fromArray(reservations),
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch user reservations: ${error.message}`);
    }
  }

  async getReservationById(reservationId, userId) {
    try {
      const reservation = await Reservation.findById(reservationId)
        .populate('event', 'title description dateTime venue pricing organizer')
        .populate('user', 'name email phone');

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      // Check if user owns this reservation or is admin
      if (reservation.user._id.toString() !== userId) {
        throw new Error('Not authorized to view this reservation');
      }

      return new ReservationDTO(reservation);
    } catch (error) {
      throw new Error(`Failed to fetch reservation: ${error.message}`);
    }
  }

  async updateReservation(reservationId, updateData, userId) {
    try {
      const reservation = await Reservation.findById(reservationId);

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      // Check if user owns this reservation
      if (reservation.user.toString() !== userId) {
        throw new Error('Not authorized to update this reservation');
      }

      // Check if reservation can be updated (not cancelled or attended)
      if (['cancelled', 'attended'].includes(reservation.status)) {
        throw new Error('Cannot update a cancelled or attended reservation');
      }

      Object.assign(reservation, updateData);
      await reservation.save();

      const updatedReservation = await Reservation.findById(reservationId)
        .populate('event', 'title dateTime venue.name')
        .populate('user', 'name email phone');

      return new ReservationDTO(updatedReservation);
    } catch (error) {
      throw new Error(`Failed to update reservation: ${error.message}`);
    }
  }

  async cancelReservation(reservationId, userId, reason = '') {
    try {
      const reservation = await Reservation.findById(reservationId);

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      // Check if user owns this reservation
      if (reservation.user.toString() !== userId) {
        throw new Error('Not authorized to cancel this reservation');
      }

      // Check if reservation can be cancelled
      if (reservation.status === 'cancelled') {
        throw new Error('Reservation is already cancelled');
      }

      if (reservation.status === 'attended') {
        throw new Error('Cannot cancel an attended reservation');
      }

      // Cancel the reservation
      await reservation.cancel(userId, reason);

      // Update event attendee count
      const event = await Event.findById(reservation.event);
      if (event) {
        event.currentAttendees -= reservation.numberOfAttendees;
        await event.save();
      }

      return { message: 'Reservation cancelled successfully' };
    } catch (error) {
      throw new Error(`Failed to cancel reservation: ${error.message}`);
    }
  }

  async getEventReservations(eventId, organizerId) {
    try {
      // Verify that the user is the organizer of this event
      const event = await Event.findById(eventId);
      
      if (!event) {
        throw new Error('Event not found');
      }

      if (event.organizer.toString() !== organizerId) {
        throw new Error('Not authorized to view reservations for this event');
      }

      const reservations = await Reservation.find({ event: eventId })
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 });

      return ReservationDTO.fromArray(reservations);
    } catch (error) {
      throw new Error(`Failed to fetch event reservations: ${error.message}`);
    }
  }

  async checkInReservation(reservationId, organizerId) {
    try {
      const reservation = await Reservation.findById(reservationId)
        .populate('event');

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      // Verify that the user is the organizer of this event
      if (reservation.event.organizer.toString() !== organizerId) {
        throw new Error('Not authorized to check in this reservation');
      }

      // Check if reservation is confirmed
      if (reservation.status !== 'confirmed') {
        throw new Error('Reservation must be confirmed before check-in');
      }

      // Check in the reservation
      await reservation.checkIn();

      return { message: 'Reservation checked in successfully' };
    } catch (error) {
      throw new Error(`Failed to check in reservation: ${error.message}`);
    }
  }

  async getReservationByCode(reservationCode) {
    try {
      const reservation = await Reservation.findOne({ reservationCode })
        .populate('event', 'title dateTime venue organizer')
        .populate('user', 'name email phone');

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      return new ReservationDTO(reservation);
    } catch (error) {
      throw new Error(`Failed to fetch reservation by code: ${error.message}`);
    }
  }

  async confirmPayment(reservationId, paymentDetails) {
    try {
      const reservation = await Reservation.findById(reservationId);

      if (!reservation) {
        throw new Error('Reservation not found');
      }

      // Update payment status and details
      reservation.paymentStatus = 'paid';
      reservation.status = 'confirmed';
      reservation.paymentDetails = {
        ...reservation.paymentDetails,
        ...paymentDetails,
        paymentDate: new Date()
      };

      await reservation.save();

      return { message: 'Payment confirmed successfully' };
    } catch (error) {
      throw new Error(`Failed to confirm payment: ${error.message}`);
    }
  }

  async getReservationStats(organizerId) {
    try {
      // Get events organized by this user
      const events = await Event.find({ organizer: organizerId }).select('_id');
      const eventIds = events.map(event => event._id);

      const stats = await Reservation.aggregate([
        { $match: { event: { $in: eventIds } } },
        {
          $group: {
            _id: null,
            totalReservations: { $sum: 1 },
            totalAttendees: { $sum: '$numberOfAttendees' },
            totalRevenue: { $sum: '$totalAmount' },
            confirmedReservations: {
              $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
            },
            cancelledReservations: {
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
            },
            attendedReservations: {
              $sum: { $cond: [{ $eq: ['$status', 'attended'] }, 1, 0] }
            }
          }
        }
      ]);

      return stats[0] || {
        totalReservations: 0,
        totalAttendees: 0,
        totalRevenue: 0,
        confirmedReservations: 0,
        cancelledReservations: 0,
        attendedReservations: 0
      };
    } catch (error) {
      throw new Error(`Failed to fetch reservation stats: ${error.message}`);
    }
  }
}

module.exports = new ReservationService();