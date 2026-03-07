package com.example.rentmystuff.product.mapper;

import com.example.rentmystuff.product.dto.ProductRequest;
import com.example.rentmystuff.product.dto.ProductResponse;
import com.example.rentmystuff.product.entity.Product;
import org.apache.coyote.Request;

public class ProductMapper {

    public static Product toEntity(ProductRequest request) {

        return Product.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .pricePerDay(request.getPricePerDay())
                .category(request.getCategory())
                .available(true)
                .build();
    }

    public static ProductResponse toResponse(Product product) {

        return ProductResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .pricePerDay(product.getPricePerDay())
                .imageUrl(product.getImageUrl())
                .available(product.getAvailable())
                .ownerId(product.getOwner().getId())
                .ownerEmail(product.getOwner().getEmail())
                .build();
    }
}
