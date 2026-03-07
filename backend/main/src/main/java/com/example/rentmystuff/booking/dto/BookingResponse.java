package com.example.rentmystuff.booking.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Builder
public class BookingResponse {

    private UUID id;
    private UUID productId;
    private String productTitle;
    private String imageUrl;
    private UUID renterId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalPrice;
    private String status;
}
