package com.example.rentmystuff.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class UnavailableDateResponse {

    private LocalDate startDate;
    private LocalDate endDate;
}
