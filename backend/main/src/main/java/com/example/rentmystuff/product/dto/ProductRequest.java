package com.example.rentmystuff.product.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ProductRequest {

    private String title;
    private String description;
    private Double pricePerDay;
    private String category;
    private MultipartFile image;
}
