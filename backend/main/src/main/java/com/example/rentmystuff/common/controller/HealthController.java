package com.example.rentmystuff.common.controller;

import com.example.rentmystuff.common.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.<String>builder()
                .success(true)
                .message("Service is healthy")
                .data("UP")
                .timestamp(LocalDateTime.now())
                .build();
    }
}
