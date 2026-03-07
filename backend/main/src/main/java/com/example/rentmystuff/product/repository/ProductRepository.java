package com.example.rentmystuff.product.repository;


import com.example.rentmystuff.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface ProductRepository
        extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {
    Page<Product> findByPricePerDayBetween(
            Double min,
            Double max,
            Pageable pageable
    );

    Page<Product> findByTitleContainingIgnoreCase(
            String title,
            Pageable pageable
    );

    Page<Product> findByCategoryIgnoreCase(
            String category,
            Pageable pageable
    );


}