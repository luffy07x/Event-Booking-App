package com.eventreservation.repository;

import com.eventreservation.model.Reservation;
import com.eventreservation.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    List<Reservation> findByUserId(Long userId);
    
    List<Reservation> findByEventId(Long eventId);
    
    List<Reservation> findByUserIdAndStatus(Long userId, ReservationStatus status);
    
    Optional<Reservation> findByReservationCode(String reservationCode);
    
    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId ORDER BY r.createdAt DESC")
    List<Reservation> findUserReservationsOrderByDate(@Param("userId") Long userId);
    
    @Query("SELECT r FROM Reservation r WHERE r.event.id = :eventId AND r.status = 'CONFIRMED'")
    List<Reservation> findConfirmedReservationsByEvent(@Param("eventId") Long eventId);
    
    @Query("SELECT SUM(r.numberOfTickets) FROM Reservation r WHERE r.event.id = :eventId AND r.status = 'CONFIRMED'")
    Integer getTotalConfirmedTicketsByEvent(@Param("eventId") Long eventId);
    
    @Query("SELECT r FROM Reservation r JOIN FETCH r.event WHERE r.user.id = :userId ORDER BY r.event.eventDateTime ASC")
    List<Reservation> findUserReservationsWithEvents(@Param("userId") Long userId);
    
    boolean existsByUserIdAndEventId(Long userId, Long eventId);
}