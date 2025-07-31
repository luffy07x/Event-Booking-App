package com.eventreservation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class EventReservationApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventReservationApplication.class, args);
    }
}