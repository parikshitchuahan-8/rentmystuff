package com.example.rentmystuff.product.dto;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@Builder
public class ProductResponse {

    private UUID id;
    private String title;
    private String description;
    private String category;
    private Double pricePerDay;
    private String imageUrl;
    private Boolean available;
    private UUID ownerId;
    private String ownerEmail;
}
