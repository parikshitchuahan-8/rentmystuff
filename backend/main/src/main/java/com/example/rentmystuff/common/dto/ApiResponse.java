package com.example.rentmystuff.common.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;
}