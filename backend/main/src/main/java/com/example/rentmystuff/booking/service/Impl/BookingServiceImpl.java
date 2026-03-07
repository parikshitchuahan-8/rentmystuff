package com.example.rentmystuff.booking.service.Impl;

import com.example.rentmystuff.booking.dto.BookingRequest;
import com.example.rentmystuff.booking.dto.BookingResponse;
import com.example.rentmystuff.booking.dto.UnavailableDateResponse;
import com.example.rentmystuff.booking.entity.Booking;
import com.example.rentmystuff.booking.entity.BookingStatus;
import com.example.rentmystuff.booking.mapper.BookingMapper;
import com.example.rentmystuff.booking.repository.BookingRepository;
import com.example.rentmystuff.booking.service.BookingService;
import com.example.rentmystuff.exception.ResourceNotFoundException;
import com.example.rentmystuff.product.entity.Product;
import com.example.rentmystuff.product.repository.ProductRepository;
import com.example.rentmystuff.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public BookingResponse bookProduct(BookingRequest request, UUID renterId) {

        boolean exists = bookingRepository.existsByProductIdAndDateOverlap(
                request.getProductId(),
                request.getStartDate(),
                request.getEndDate()
        );

        if (exists) {
            throw new RuntimeException("Product already booked for selected dates");
        }


        var product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        var renter = userRepository.findById(renterId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(product.getOwner().getId().equals(renter.getId())){
            throw new RuntimeException("you cannot rent your own product");
        }
        if (!product.getAvailable()) {
            throw new RuntimeException("Product not available");
        }

        long days = ChronoUnit.DAYS.between(
                request.getStartDate(),
                request.getEndDate()
        );

        double total = days * product.getPricePerDay();

        Booking booking = Booking.builder()
                .product(product)
                .renter(renter)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalPrice(total)
                .status(BookingStatus.PENDING)
                .build();



        List<Booking> overlapping =
                bookingRepository.findOverlappingBookings(
                        request.getProductId(),
                        request.getStartDate(),
                        request.getEndDate()
                );

        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Product already booked for selected dates");
        }


        bookingRepository.save(booking);
        productRepository.save(product);

        return BookingResponse.builder()
                .id(booking.getId())
                .productId(product.getId())
                .renterId(renter.getId())
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .build();
    }

    @Override
    public List<BookingResponse> getBookingsByUser(UUID userId) {

        return bookingRepository.findByRenterId(userId)
                .stream()
                .map(BookingMapper::toResponse)
                .toList();
    }


    @Override
    public void cancelBooking(UUID bookingId, String userEmail) {

        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found"));

        if (!booking.getRenter().getEmail().equals(userEmail)) {
            throw new RuntimeException("You are not allowed to cancel this booking");
        }

        Product product = booking.getProduct();
        product.setAvailable(true);

        bookingRepository.delete(booking);
        productRepository.save(product);
    }

    @Override
    public List<UnavailableDateResponse> getUnavailableDates(UUID productId) {

        return bookingRepository.findByProductId(productId)
                .stream()
                .map(booking ->
                        new UnavailableDateResponse(
                                booking.getStartDate(),
                                booking.getEndDate()
                        )
                )
                .toList();
    }

    @Override
    public void approveBooking(UUID bookingId, String ownerEmail) {

        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // OWNER CHECK
        if (!booking.getProduct().getOwner().getEmail().equals(ownerEmail)) {
            throw new RuntimeException("You are not allowed to approve this booking");
        }

        booking.setStatus(BookingStatus.APPROVED);
        bookingRepository.save(booking);
    }

    @Override
    public void rejectBooking(UUID bookingId, String ownerEmail) {

        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // OWNER CHECK
        if (!booking.getProduct().getOwner().getEmail().equals(ownerEmail)) {
            throw new RuntimeException("You are not allowed to reject this booking");
        }

        booking.setStatus(BookingStatus.REJECTED);
        bookingRepository.save(booking);
    }

    @Override
    public List<BookingResponse> getBookingsForOwner(UUID ownerId) {

        return bookingRepository.findByProductOwnerId(ownerId)
                .stream()
                .map(BookingMapper::toResponse)
                .toList();
    }


}