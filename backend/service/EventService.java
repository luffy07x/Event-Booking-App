package com.eventreservation.service;

import com.eventreservation.model.Event;
import com.eventreservation.model.EventCategory;
import com.eventreservation.model.EventStatus;
import com.eventreservation.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }
    
    public List<Event> getUpcomingEvents() {
        return eventRepository.findUpcomingActiveEvents(LocalDateTime.now());
    }
    
    public List<Event> getBookableEvents() {
        return eventRepository.findBookableEvents(LocalDateTime.now());
    }
    
    public List<Event> searchEvents(String keyword) {
        return eventRepository.searchEvents(keyword, LocalDateTime.now());
    }
    
    public List<Event> getEventsByCategory(EventCategory category) {
        return eventRepository.findActiveEventsByCategory(category, LocalDateTime.now());
    }
    
    public Page<Event> getEventsWithPagination(Pageable pageable) {
        return eventRepository.findByStatusAndEventDateTimeAfter(
            EventStatus.ACTIVE, LocalDateTime.now(), pageable);
    }
    
    public List<Event> getEventsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return eventRepository.findEventsBetweenDates(startDate, endDate);
    }
    
    public Event createEvent(Event event) {
        // Set default values
        if (event.getStatus() == null) {
            event.setStatus(EventStatus.ACTIVE);
        }
        if (event.getAvailableCapacity() == null) {
            event.setAvailableCapacity(event.getTotalCapacity());
        }
        
        return eventRepository.save(event);
    }
    
    public Event updateEvent(Long eventId, Event updatedEvent) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        event.setTitle(updatedEvent.getTitle());
        event.setDescription(updatedEvent.getDescription());
        event.setEventDateTime(updatedEvent.getEventDateTime());
        event.setEndDateTime(updatedEvent.getEndDateTime());
        event.setVenue(updatedEvent.getVenue());
        event.setVenueAddress(updatedEvent.getVenueAddress());
        event.setTotalCapacity(updatedEvent.getTotalCapacity());
        event.setPrice(updatedEvent.getPrice());
        event.setCategory(updatedEvent.getCategory());
        event.setImageUrl(updatedEvent.getImageUrl());
        event.setOrganizerName(updatedEvent.getOrganizerName());
        event.setOrganizerEmail(updatedEvent.getOrganizerEmail());
        event.setOrganizerPhone(updatedEvent.getOrganizerPhone());
        
        return eventRepository.save(event);
    }
    
    public void deleteEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new RuntimeException("Event not found");
        }
        eventRepository.deleteById(eventId);
    }
    
    public Event updateEventStatus(Long eventId, EventStatus status) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        event.setStatus(status);
        return eventRepository.save(event);
    }
    
    public boolean isEventBookable(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        return event.isBookable();
    }
    
    public synchronized void decreaseEventCapacity(Long eventId, int ticketCount) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (!event.isBookable()) {
            throw new RuntimeException("Event is not bookable");
        }
        
        if (event.getAvailableCapacity() < ticketCount) {
            throw new RuntimeException("Not enough available capacity");
        }
        
        event.decreaseCapacity(ticketCount);
        eventRepository.save(event);
    }
    
    public synchronized void increaseEventCapacity(Long eventId, int ticketCount) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        event.increaseCapacity(ticketCount);
        eventRepository.save(event);
    }
    
    public List<Event> getFeaturedEvents() {
        // Return upcoming events with good availability
        return eventRepository.findBookableEvents(LocalDateTime.now())
                .stream()
                .filter(event -> event.getAvailableCapacity() > event.getTotalCapacity() * 0.5)
                .limit(6)
                .toList();
    }
}