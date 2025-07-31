package com.eventreservation.controller;

import com.eventreservation.dto.ReservationDto;
import com.eventreservation.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/reservations")
@CrossOrigin(origins = "http://localhost:3000")
public class ReservationController {
    
    @Autowired
    private ReservationService reservationService;
    
    @PostMapping
    public ResponseEntity<?> createReservation(@Valid @RequestBody ReservationDto reservationDto, 
                                             Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            ReservationDto createdReservation = reservationService.createReservation(reservationDto, userEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReservation);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<ReservationDto>> getUserReservations(Authentication authentication) {
        String userEmail = authentication.getName();
        List<ReservationDto> reservations = reservationService.getUserReservations(userEmail);
        return ResponseEntity.ok(reservations);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationById(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        Optional<ReservationDto> reservation = reservationService.getReservationById(id, userEmail);
        
        if (reservation.isPresent()) {
            return ResponseEntity.ok(reservation.get());
        }
        
        Map<String, String> error = new HashMap<>();
        error.put("error", "Reservation not found or access denied");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @GetMapping("/code/{reservationCode}")
    public ResponseEntity<?> getReservationByCode(@PathVariable String reservationCode, 
                                                 Authentication authentication) {
        String userEmail = authentication.getName();
        Optional<ReservationDto> reservation = reservationService.getReservationByCode(reservationCode, userEmail);
        
        if (reservation.isPresent()) {
            return ResponseEntity.ok(reservation.get());
        }
        
        Map<String, String> error = new HashMap<>();
        error.put("error", "Reservation not found or access denied");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id, Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            ReservationDto cancelledReservation = reservationService.cancelReservation(id, userEmail);
            return ResponseEntity.ok(cancelledReservation);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Admin endpoints
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationDto>> getAllReservations() {
        List<ReservationDto> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }
    
    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationDto>> getEventReservations(@PathVariable Long eventId) {
        List<ReservationDto> reservations = reservationService.getEventReservations(eventId);
        return ResponseEntity.ok(reservations);
    }
}