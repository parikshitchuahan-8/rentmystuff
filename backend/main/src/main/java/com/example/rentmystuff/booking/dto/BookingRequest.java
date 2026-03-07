package com.example.rentmystuff.booking.dto;


import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class BookingRequest {

    private UUID productId;
    private LocalDate startDate;
    private LocalDate endDate;
}