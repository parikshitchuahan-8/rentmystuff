package com.example.rentmystuff.booking.repository;

import com.example.rentmystuff.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;


public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByRenterId(UUID renterId);

    boolean existsByProductId(UUID productId);


    @Query("""
SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END
FROM Booking b
WHERE b.product.id = :productId
AND b.status IN ('PENDING', 'APPROVED')
AND b.startDate <= :endDate
AND b.endDate >= :startDate
""")
    boolean existsByProductIdAndDateOverlap(
            UUID productId,
            LocalDate startDate,
            LocalDate endDate
    );

    List<Booking> findByProductIdAndStatusIn(UUID productId, List<com.example.rentmystuff.booking.entity.BookingStatus> statuses);

    @Query("""
    SELECT b FROM Booking b
    WHERE b.product.id = :productId
    AND b.status IN ('PENDING', 'APPROVED')
    AND (
        (:startDate BETWEEN b.startDate AND b.endDate)
        OR
        (:endDate BETWEEN b.startDate AND b.endDate)
        OR
        (b.startDate BETWEEN :startDate AND :endDate)
    )
""")
    List<Booking> findOverlappingBookings(
            UUID productId,
            LocalDate startDate,
            LocalDate endDate
    );

    List<Booking> findByProductOwnerId(UUID ownerId);


}
