package com.eventreservation.repository;

import com.eventreservation.model.Event;
import com.eventreservation.model.EventCategory;
import com.eventreservation.model.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findByStatus(EventStatus status);
    
    List<Event> findByCategory(EventCategory category);
    
    @Query("SELECT e FROM Event e WHERE e.status = 'ACTIVE' AND e.eventDateTime > :now ORDER BY e.eventDateTime ASC")
    List<Event> findUpcomingActiveEvents(@Param("now") LocalDateTime now);
    
    @Query("SELECT e FROM Event e WHERE e.status = 'ACTIVE' AND e.eventDateTime > :now AND e.availableCapacity > 0 ORDER BY e.eventDateTime ASC")
    List<Event> findBookableEvents(@Param("now") LocalDateTime now);
    
    @Query("SELECT e FROM Event e WHERE e.status = 'ACTIVE' AND e.eventDateTime > :now AND " +
           "(LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.venue) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Event> searchEvents(@Param("keyword") String keyword, @Param("now") LocalDateTime now);
    
    @Query("SELECT e FROM Event e WHERE e.status = 'ACTIVE' AND e.eventDateTime > :now AND e.category = :category ORDER BY e.eventDateTime ASC")
    List<Event> findActiveEventsByCategory(@Param("category") EventCategory category, @Param("now") LocalDateTime now);
    
    Page<Event> findByStatusAndEventDateTimeAfter(EventStatus status, LocalDateTime dateTime, Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE e.eventDateTime BETWEEN :startDate AND :endDate ORDER BY e.eventDateTime ASC")
    List<Event> findEventsBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}