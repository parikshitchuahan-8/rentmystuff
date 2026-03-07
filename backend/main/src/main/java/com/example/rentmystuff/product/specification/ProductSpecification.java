package com.example.rentmystuff.product.specification;

import com.example.rentmystuff.product.entity.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> hasTitle(String title) {
        return (root, query, cb) ->
                title == null ? null :
                        cb.like(cb.lower(root.get("title")),
                                "%" + title.toLowerCase() + "%");
    }

    public static Specification<Product> hasCategory(String category) {
        return (root, query, cb) ->
                category == null ? null :
                        cb.equal(cb.lower(root.get("category")),
                                category.toLowerCase());
    }

    public static Specification<Product> priceBetween(
            Double min,
            Double max
    ) {
        return (root, query, cb) ->
                (min == null || max == null) ? null :
                        cb.between(root.get("pricePerDay"), min, max);
    }
}