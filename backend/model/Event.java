package com.eventreservation.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "events")
@EntityListeners(AuditingEntityListener.class)
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Event title is required")
    @Size(max = 200)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @NotNull(message = "Event date and time is required")
    @Column(name = "event_date_time")
    private LocalDateTime eventDateTime;
    
    @Column(name = "end_date_time")
    private LocalDateTime endDateTime;
    
    @NotBlank(message = "Venue is required")
    @Size(max = 200)
    private String venue;
    
    @Column(name = "venue_address")
    private String venueAddress;
    
    @NotNull(message = "Total capacity is required")
    @Positive(message = "Capacity must be positive")
    @Column(name = "total_capacity")
    private Integer totalCapacity;
    
    @Column(name = "available_capacity")
    private Integer availableCapacity;
    
    @NotNull(message = "Price is required")
    @Column(precision = 10, scale = 2)
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    private EventCategory category;
    
    @Enumerated(EnumType.STRING)
    private EventStatus status = EventStatus.ACTIVE;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "organizer_name")
    private String organizerName;
    
    @Column(name = "organizer_email")
    private String organizerEmail;
    
    @Column(name = "organizer_phone")
    private String organizerPhone;
    
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Reservation> reservations;
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Event() {}
    
    public Event(String title, String description, LocalDateTime eventDateTime, 
                 String venue, Integer totalCapacity, BigDecimal price) {
        this.title = title;
        this.description = description;
        this.eventDateTime = eventDateTime;
        this.venue = venue;
        this.totalCapacity = totalCapacity;
        this.availableCapacity = totalCapacity;
        this.price = price;
    }
    
    // Business methods
    public boolean isBookable() {
        return status == EventStatus.ACTIVE && 
               availableCapacity > 0 && 
               eventDateTime.isAfter(LocalDateTime.now());
    }
    
    public void decreaseCapacity(int count) {
        if (availableCapacity >= count) {
            availableCapacity -= count;
        } else {
            throw new IllegalStateException("Not enough available capacity");
        }
    }
    
    public void increaseCapacity(int count) {
        availableCapacity = Math.min(availableCapacity + count, totalCapacity);
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getEventDateTime() { return eventDateTime; }
    public void setEventDateTime(LocalDateTime eventDateTime) { this.eventDateTime = eventDateTime; }
    
    public LocalDateTime getEndDateTime() { return endDateTime; }
    public void setEndDateTime(LocalDateTime endDateTime) { this.endDateTime = endDateTime; }
    
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
    
    public String getVenueAddress() { return venueAddress; }
    public void setVenueAddress(String venueAddress) { this.venueAddress = venueAddress; }
    
    public Integer getTotalCapacity() { return totalCapacity; }
    public void setTotalCapacity(Integer totalCapacity) { 
        this.totalCapacity = totalCapacity;
        if (this.availableCapacity == null) {
            this.availableCapacity = totalCapacity;
        }
    }
    
    public Integer getAvailableCapacity() { return availableCapacity; }
    public void setAvailableCapacity(Integer availableCapacity) { this.availableCapacity = availableCapacity; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public EventCategory getCategory() { return category; }
    public void setCategory(EventCategory category) { this.category = category; }
    
    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }
    
    public String getOrganizerEmail() { return organizerEmail; }
    public void setOrganizerEmail(String organizerEmail) { this.organizerEmail = organizerEmail; }
    
    public String getOrganizerPhone() { return organizerPhone; }
    public void setOrganizerPhone(String organizerPhone) { this.organizerPhone = organizerPhone; }
    
    public Set<Reservation> getReservations() { return reservations; }
    public void setReservations(Set<Reservation> reservations) { this.reservations = reservations; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

enum EventCategory {
    CONFERENCE, WORKSHOP, SEMINAR, CONCERT, FESTIVAL, SPORTS, NETWORKING, EXHIBITION, PARTY, OTHER
}

enum EventStatus {
    ACTIVE, CANCELLED, COMPLETED, POSTPONED
}