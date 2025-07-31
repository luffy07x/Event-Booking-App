package com.eventreservation.service;

import com.eventreservation.dto.ReservationDto;
import com.eventreservation.model.Event;
import com.eventreservation.model.Reservation;
import com.eventreservation.model.ReservationStatus;
import com.eventreservation.model.User;
import com.eventreservation.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReservationService {
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private UserService userService;
    
    public ReservationDto createReservation(ReservationDto reservationDto, String userEmail) {
        User user = userService.getCurrentUser(userEmail);
        Event event = eventService.getEventById(reservationDto.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Check if event is bookable
        if (!event.isBookable()) {
            throw new RuntimeException("Event is not available for booking");
        }
        
        // Check if user already has a reservation for this event
        if (reservationRepository.existsByUserIdAndEventId(user.getId(), event.getId())) {
            throw new RuntimeException("You already have a reservation for this event");
        }
        
        // Check capacity
        if (event.getAvailableCapacity() < reservationDto.getNumberOfTickets()) {
            throw new RuntimeException("Not enough tickets available. Available: " + event.getAvailableCapacity());
        }
        
        // Calculate total amount
        BigDecimal totalAmount = event.getPrice().multiply(BigDecimal.valueOf(reservationDto.getNumberOfTickets()));
        
        // Create reservation
        Reservation reservation = new Reservation(user, event, reservationDto.getNumberOfTickets(), totalAmount);
        reservation.setSpecialRequests(reservationDto.getSpecialRequests());
        
        // Decrease event capacity
        eventService.decreaseEventCapacity(event.getId(), reservationDto.getNumberOfTickets());
        
        // Save reservation
        reservation = reservationRepository.save(reservation);
        
        return convertToDto(reservation);
    }
    
    public List<ReservationDto> getUserReservations(String userEmail) {
        User user = userService.getCurrentUser(userEmail);
        List<Reservation> reservations = reservationRepository.findUserReservationsWithEvents(user.getId());
        
        return reservations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<ReservationDto> getReservationById(Long reservationId, String userEmail) {
        User user = userService.getCurrentUser(userEmail);
        Optional<Reservation> reservation = reservationRepository.findById(reservationId);
        
        if (reservation.isPresent() && reservation.get().getUser().getId().equals(user.getId())) {
            return Optional.of(convertToDto(reservation.get()));
        }
        
        return Optional.empty();
    }
    
    public Optional<ReservationDto> getReservationByCode(String reservationCode, String userEmail) {
        User user = userService.getCurrentUser(userEmail);
        Optional<Reservation> reservation = reservationRepository.findByReservationCode(reservationCode);
        
        if (reservation.isPresent() && reservation.get().getUser().getId().equals(user.getId())) {
            return Optional.of(convertToDto(reservation.get()));
        }
        
        return Optional.empty();
    }
    
    public ReservationDto cancelReservation(Long reservationId, String userEmail) {
        User user = userService.getCurrentUser(userEmail);
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        // Check if reservation belongs to user
        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to cancel this reservation");
        }
        
        // Check if reservation can be cancelled
        if (!reservation.canBeCancelled()) {
            throw new RuntimeException("Reservation cannot be cancelled. Events can only be cancelled 24 hours in advance.");
        }
        
        // Update reservation status
        reservation.setStatus(ReservationStatus.CANCELLED);
        
        // Increase event capacity back
        eventService.increaseEventCapacity(reservation.getEvent().getId(), reservation.getNumberOfTickets());
        
        reservation = reservationRepository.save(reservation);
        
        return convertToDto(reservation);
    }
    
    // Admin methods
    public List<ReservationDto> getAllReservations() {
        List<Reservation> reservations = reservationRepository.findAll();
        return reservations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<ReservationDto> getEventReservations(Long eventId) {
        List<Reservation> reservations = reservationRepository.findByEventId(eventId);
        return reservations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public ReservationDto updateReservationStatus(Long reservationId, ReservationStatus status) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        ReservationStatus oldStatus = reservation.getStatus();
        reservation.setStatus(status);
        
        // Handle capacity changes based on status change
        if (oldStatus == ReservationStatus.CONFIRMED && status == ReservationStatus.CANCELLED) {
            eventService.increaseEventCapacity(reservation.getEvent().getId(), reservation.getNumberOfTickets());
        } else if (oldStatus == ReservationStatus.CANCELLED && status == ReservationStatus.CONFIRMED) {
            eventService.decreaseEventCapacity(reservation.getEvent().getId(), reservation.getNumberOfTickets());
        }
        
        reservation = reservationRepository.save(reservation);
        return convertToDto(reservation);
    }
    
    private ReservationDto convertToDto(Reservation reservation) {
        ReservationDto dto = new ReservationDto();
        dto.setId(reservation.getId());
        dto.setEventId(reservation.getEvent().getId());
        dto.setEventTitle(reservation.getEvent().getTitle());
        dto.setEventVenue(reservation.getEvent().getVenue());
        dto.setEventDateTime(reservation.getEvent().getEventDateTime());
        dto.setNumberOfTickets(reservation.getNumberOfTickets());
        dto.setTotalAmount(reservation.getTotalAmount());
        dto.setStatus(reservation.getStatus().name());
        dto.setReservationCode(reservation.getReservationCode());
        dto.setSpecialRequests(reservation.getSpecialRequests());
        dto.setCreatedAt(reservation.getCreatedAt());
        dto.setUserFullName(reservation.getUser().getFullName());
        dto.setUserEmail(reservation.getUser().getEmail());
        
        return dto;
    }
}