package com.example.rentmystuff.booking.service;



import com.example.rentmystuff.booking.dto.BookingRequest;
import com.example.rentmystuff.booking.dto.BookingResponse;
import com.example.rentmystuff.booking.dto.UnavailableDateResponse;

import java.util.List;
import java.util.UUID;


public interface BookingService {

    BookingResponse bookProduct(BookingRequest request, UUID userId);

    List<BookingResponse> getBookingsByUser(UUID userId);

    void cancelBooking(UUID bookingId, String userEmail);
    List<UnavailableDateResponse> getUnavailableDates(UUID productId);
    void approveBooking(UUID bookingId, String userEmail);

    void rejectBooking(UUID bookingId, String userEmail);
    List<BookingResponse> getBookingsForOwner(UUID ownerId);



}
