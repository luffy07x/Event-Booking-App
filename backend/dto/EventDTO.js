class EventDTO {
  constructor(event) {
    this.id = event._id;
    this.title = event.title;
    this.description = event.description;
    this.category = event.category;
    this.organizer = event.organizer;
    this.venue = event.venue;
    this.dateTime = event.dateTime;
    this.pricing = event.pricing;
    this.images = event.images;
    this.tags = event.tags;
    this.status = event.status;
    this.maxAttendees = event.maxAttendees;
    this.currentAttendees = event.currentAttendees;
    this.availableSpots = event.availableSpots;
    this.featured = event.featured;
    this.createdAt = event.createdAt;
    this.updatedAt = event.updatedAt;
  }

  static fromArray(events) {
    return events.map(event => new EventDTO(event));
  }
}

class EventCreateDTO {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.venue = data.venue;
    this.dateTime = data.dateTime;
    this.pricing = data.pricing;
    this.images = data.images || [];
    this.tags = data.tags || [];
    this.registrationDeadline = data.registrationDeadline;
    this.maxAttendees = data.maxAttendees;
    this.requirements = data.requirements;
    this.contact = data.contact;
    this.socialMedia = data.socialMedia;
  }
}

class EventUpdateDTO {
  constructor(data) {
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.category !== undefined) this.category = data.category;
    if (data.venue !== undefined) this.venue = data.venue;
    if (data.dateTime !== undefined) this.dateTime = data.dateTime;
    if (data.pricing !== undefined) this.pricing = data.pricing;
    if (data.images !== undefined) this.images = data.images;
    if (data.tags !== undefined) this.tags = data.tags;
    if (data.status !== undefined) this.status = data.status;
    if (data.maxAttendees !== undefined) this.maxAttendees = data.maxAttendees;
    if (data.requirements !== undefined) this.requirements = data.requirements;
    if (data.contact !== undefined) this.contact = data.contact;
    if (data.socialMedia !== undefined) this.socialMedia = data.socialMedia;
    if (data.featured !== undefined) this.featured = data.featured;
  }
}

class EventSummaryDTO {
  constructor(event) {
    this.id = event._id;
    this.title = event.title;
    this.category = event.category;
    this.dateTime = {
      start: event.dateTime.start,
      end: event.dateTime.end
    };
    this.venue = {
      name: event.venue.name,
      city: event.venue.address.city,
      country: event.venue.address.country
    };
    this.pricing = event.pricing;
    this.availableSpots = event.availableSpots;
    this.images = event.images.length > 0 ? [event.images[0]] : [];
    this.featured = event.featured;
  }

  static fromArray(events) {
    return events.map(event => new EventSummaryDTO(event));
  }
}

module.exports = {
  EventDTO,
  EventCreateDTO,
  EventUpdateDTO,
  EventSummaryDTO
};