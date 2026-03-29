package com.example.rentmystuff.booking.dto;


import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class BookingRequest {

    @NotNull
    private UUID productId;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;
}
