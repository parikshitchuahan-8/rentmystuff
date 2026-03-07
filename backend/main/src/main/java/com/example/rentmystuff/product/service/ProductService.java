package com.example.rentmystuff.product.service;

import com.example.rentmystuff.product.dto.ProductRequest;
import com.example.rentmystuff.product.dto.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ProductService {

    ProductResponse addProduct(ProductRequest request, UUID ownerId);

    List<ProductResponse> getAllProducts();

    ProductResponse getProductById(UUID id);

    void deleteProduct(UUID productId, String userEmail);


    Page<ProductResponse> getAllProducts(
            int page,
            int size,
            String sortBy,
            String direction
    );

    Page<ProductResponse> getProductsByPriceRange(
            Double min,
            Double max,
            Pageable pageable
    );


    Page<ProductResponse> searchByTitle(
            String title,
            Pageable pageable
    );



    Page<ProductResponse> filterProducts(
            String title,
            String category,
            Double min,
            Double max,
            Integer page,
            Integer size,
            String sortBy,
            String direction
    );
    ProductResponse updateProduct(
            UUID productId,
            ProductRequest request,
            String userEmail
    );


}