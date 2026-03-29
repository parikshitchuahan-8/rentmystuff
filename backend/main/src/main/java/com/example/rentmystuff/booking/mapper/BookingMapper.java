package com.example.rentmystuff.booking.mapper;

import com.example.rentmystuff.booking.dto.BookingResponse;
import com.example.rentmystuff.booking.entity.Booking;

public class BookingMapper {

    public static BookingResponse toResponse(Booking booking){

        return BookingResponse.builder()
                .id(booking.getId())
                .productId(booking.getProduct().getId())
                .productTitle(booking.getProduct().getTitle())
                .imageUrl(booking.getProduct().getImageUrl())
                .ownerId(booking.getProduct().getOwner().getId())
                .renterId(booking.getRenter().getId())
                .renterEmail(booking.getRenter().getEmail())
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .build();
    }
}
