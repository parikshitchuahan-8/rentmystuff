package com.example.rentmystuff.product.controller;
import com.example.rentmystuff.booking.dto.UnavailableDateResponse;
import com.example.rentmystuff.booking.service.BookingService;

import com.example.rentmystuff.common.dto.ApiResponse;
import com.example.rentmystuff.product.dto.ProductRequest;
import com.example.rentmystuff.product.dto.ProductResponse;
import com.example.rentmystuff.product.service.ProductService;
import com.example.rentmystuff.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final UserRepository userRepository;
    private final BookingService bookingService;


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductResponse addProduct(
            @ModelAttribute ProductRequest request,
            Principal principal
    ) {
        var user = userRepository.findByEmail(principal.getName())
                .orElseThrow();

        return productService.addProduct(request, user.getId());
    }





    @GetMapping("/{id}")
    public ProductResponse getById(@PathVariable UUID id) {
        return productService.getProductById(id);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> delete(
            @PathVariable UUID id,
            Principal principal
    ) {

        productService.deleteProduct(id, principal.getName());

        return ApiResponse.<String>builder()
                .success(true)
                .message("Product deleted successfully")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductRequest request,
            Principal principal
    ) {
        ProductResponse response =
                productService.updateProduct(id, request, principal.getName());

        return ApiResponse.<ProductResponse>builder()
                .success(true)
                .message("Product updated successfully")
                .data(response)
                .timestamp(LocalDateTime.now())
                .build();
    }


    @GetMapping
    public ApiResponse<Page<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "pricePerDay") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {

        Page<ProductResponse> products =
                productService.getAllProducts(page, size, sortBy, direction);

        return ApiResponse.<Page<ProductResponse>>builder()
                .success(true)
                .message("Products fetched successfully")
                .data(products)
                .timestamp(LocalDateTime.now())
                .build();
    }
    @GetMapping("/filter")
    public ApiResponse<Page<ProductResponse>> filterProducts(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double min,
            @RequestParam(required = false) Double max,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String direction
    ) {

        Page<ProductResponse> result =
                productService.filterProducts(
                        title, category, min, max,
                        page, size, sortBy, direction
                );

        return ApiResponse.<Page<ProductResponse>>builder()
                .success(true)
                .message("Filtered products fetched successfully")
                .data(result)
                .timestamp(LocalDateTime.now())
                .build();
    }

    @GetMapping("/{id}/unavailable-dates")
    public List<UnavailableDateResponse> getUnavailableDates(
            @PathVariable UUID id
    ) {
        return bookingService.getUnavailableDates(id);
    }


}
