package com.example.rentmystuff.product.service.Impl;

import com.example.rentmystuff.booking.repository.BookingRepository;
import com.example.rentmystuff.exception.ResourceNotFoundException;
import com.example.rentmystuff.product.dto.ProductRequest;
import com.example.rentmystuff.product.dto.ProductResponse;
import com.example.rentmystuff.product.entity.Product;
import com.example.rentmystuff.product.mapper.ProductMapper;
import com.example.rentmystuff.product.repository.ProductRepository;
import com.example.rentmystuff.product.service.ProductService;
import com.example.rentmystuff.product.specification.ProductSpecification;
import com.example.rentmystuff.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private static final Logger logger =
            LoggerFactory.getLogger(ProductServiceImpl.class);


    @Override
    public ProductResponse addProduct(ProductRequest request, UUID ownerId) {

        logger.info("Attempting to add product for user {}", ownerId);

        var owner = userRepository.findById(ownerId)
                .orElseThrow(() -> {
                    logger.error("User not found with id {}", ownerId);
                    return new ResourceNotFoundException("User not found");
                });

        Product product = ProductMapper.toEntity(request);
        product.setOwner(owner);
        product.setImageUrl(storeImage(request));


        Product savedProduct = productRepository.save(product);

        logger.info("Product created successfully with id {}", savedProduct.getId());

        return ProductMapper.toResponse(savedProduct);
    }


    @Override
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(ProductMapper::toResponse)
                .toList();
    }

    @Override
    public ProductResponse getProductById(UUID id) {

        var product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return ProductMapper.toResponse(product);
    }

    @Override
    public void deleteProduct(UUID productId, String userEmail) {

        logger.info("User {} attempting to delete product {}",
                userEmail, productId);

        var product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        //  Ownership Check
        if (!product.getOwner().getEmail().equals(userEmail)) {

            logger.warn("Unauthorized delete attempt by user {} on product {}",
                    userEmail, productId);

            throw new RuntimeException("You are not allowed to delete this product");
        }

        if (bookingRepository.existsByProductId(productId)) {
            throw new RuntimeException("This product has booking history and cannot be deleted");
        }

        productRepository.delete(product);

        logger.info("Product {} deleted successfully by owner {}",
                productId, userEmail);
    }


    @Override
    public Page<ProductResponse> getAllProducts(
            int page,
            int size,
            String sortBy,
            String direction
    ) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return productRepository.findAll(pageable)
                .map(ProductMapper::toResponse);
    }

    @Override
    public Page<ProductResponse> getProductsByPriceRange(
            Double min,
            Double max,
            Pageable pageable
    ) {
        return productRepository
                .findByPricePerDayBetween(min, max, pageable)
                .map(ProductMapper::toResponse);
    }
    @Override
    public Page<ProductResponse> searchByTitle(
            String title,
            Pageable pageable
    ) {
        return productRepository
                .findByTitleContainingIgnoreCase(title, pageable)
                .map(ProductMapper::toResponse);
    }
    @Override
    public Page<ProductResponse> filterProducts(
            String title,
            String category,
            Double min,
            Double max,
            Integer page,
            Integer size,
            String sortBy,
            String direction
    ) {


        int pageNumber = (page != null) ? page : 0;
        int pageSize = (size != null) ? size : 5;
        String sortField = (sortBy != null) ? sortBy : "createdAt";
        String sortDir = (direction != null) ? direction : "desc";

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortField).descending()
                : Sort.by(sortField).ascending();

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Specification<Product> spec =
                (root, query, cb) -> cb.conjunction();

        if (title != null) {
            spec = spec.and(ProductSpecification.hasTitle(title));
        }

        if (category != null) {
            spec = spec.and(ProductSpecification.hasCategory(category));
        }

        if (min != null && max != null) {
            spec = spec.and(ProductSpecification.priceBetween(min, max));
        }

        return productRepository.findAll(spec, pageable)
                .map(ProductMapper::toResponse);
    }

    @Override
    public ProductResponse updateProduct(
            UUID productId,
            ProductRequest request,
            String userEmail
    ) {

        var product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        //  Ownership check
        if (!product.getOwner().getEmail().equals(userEmail)) {
            throw new RuntimeException("You are not allowed to update this product");
        }

        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPricePerDay(request.getPricePerDay());
        product.setCategory(request.getCategory());

        String imagePath = storeImage(request);
        if (imagePath != null) {
            product.setImageUrl(imagePath);
        }

        Product updated = productRepository.save(product);

        return ProductMapper.toResponse(updated);
    }

    private String storeImage(ProductRequest request) {
        if (request.getImage() == null || request.getImage().isEmpty()) {
            return null;
        }

        try {
            String uploadDir = "uploads/";
            String fileName = UUID.randomUUID() + "_" + request.getImage().getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);

            Files.createDirectories(filePath.getParent());
            Files.write(filePath, request.getImage().getBytes());

            return filePath.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store image");
        }
    }




}
