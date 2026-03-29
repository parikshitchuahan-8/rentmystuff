package com.example.rentmystuff.booking.controller;

import com.example.rentmystuff.booking.dto.BookingRequest;
import com.example.rentmystuff.booking.dto.BookingResponse;
import com.example.rentmystuff.booking.service.BookingService;
import com.example.rentmystuff.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    @PostMapping
    public BookingResponse bookProduct(
            @Valid @RequestBody BookingRequest request,
            Principal principal
    ) {
        var user = userRepository.findByEmail(principal.getName())
                .orElseThrow();

        return bookingService.bookProduct(request, user.getId());
    }

    @GetMapping("/my")
    public List<BookingResponse> getMyBookings(Principal principal) {

        var user = userRepository.findByEmail(principal.getName())
                .orElseThrow();

        return bookingService.getBookingsByUser(user.getId());
    }

    @DeleteMapping("/{id}")
    public void cancelBooking(
            @PathVariable UUID id,
            Principal principal
    ) {
        bookingService.cancelBooking(id, principal.getName());
    }

    @PutMapping("/{id}/approve")
    public void approveBooking(
            @PathVariable UUID id,
            Principal principal
    ) {
        bookingService.approveBooking(id, principal.getName());
    }

    @PutMapping("/{id}/reject")
    public void rejectBooking(
            @PathVariable UUID id,
            Principal principal
    ) {
        bookingService.rejectBooking(id, principal.getName());
    }

    @GetMapping("/owner")
    public List<BookingResponse> getOwnerBookings(Principal principal) {

        var user = userRepository.findByEmail(principal.getName())
                .orElseThrow();

        return bookingService.getBookingsForOwner(user.getId());
    }



}
