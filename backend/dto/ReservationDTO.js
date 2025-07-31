class ReservationDTO {
  constructor(reservation) {
    this.id = reservation._id;
    this.event = reservation.event;
    this.user = reservation.user;
    this.attendees = reservation.attendees;
    this.numberOfAttendees = reservation.numberOfAttendees;
    this.totalAmount = reservation.totalAmount;
    this.paymentStatus = reservation.paymentStatus;
    this.paymentMethod = reservation.paymentMethod;
    this.status = reservation.status;
    this.reservationCode = reservation.reservationCode;
    this.checkInTime = reservation.checkInTime;
    this.notes = reservation.notes;
    this.createdAt = reservation.createdAt;
    this.updatedAt = reservation.updatedAt;
  }

  static fromArray(reservations) {
    return reservations.map(reservation => new ReservationDTO(reservation));
  }
}

class ReservationCreateDTO {
  constructor(data) {
    this.event = data.event;
    this.attendees = data.attendees;
    this.numberOfAttendees = data.numberOfAttendees;
    this.paymentMethod = data.paymentMethod || 'free';
    this.notes = data.notes;
  }
}

class ReservationUpdateDTO {
  constructor(data) {
    if (data.attendees !== undefined) this.attendees = data.attendees;
    if (data.paymentStatus !== undefined) this.paymentStatus = data.paymentStatus;
    if (data.status !== undefined) this.status = data.status;
    if (data.notes !== undefined) this.notes = data.notes;
  }
}

class ReservationSummaryDTO {
  constructor(reservation) {
    this.id = reservation._id;
    this.reservationCode = reservation.reservationCode;
    this.numberOfAttendees = reservation.numberOfAttendees;
    this.totalAmount = reservation.totalAmount;
    this.status = reservation.status;
    this.paymentStatus = reservation.paymentStatus;
    this.createdAt = reservation.createdAt;
    
    // Include event summary if populated
    if (reservation.event && typeof reservation.event === 'object') {
      this.event = {
        id: reservation.event._id,
        title: reservation.event.title,
        dateTime: reservation.event.dateTime,
        venue: reservation.event.venue ? {
          name: reservation.event.venue.name
        } : null
      };
    }
  }

  static fromArray(reservations) {
    return reservations.map(reservation => new ReservationSummaryDTO(reservation));
  }
}

module.exports = {
  ReservationDTO,
  ReservationCreateDTO,
  ReservationUpdateDTO,
  ReservationSummaryDTO
};