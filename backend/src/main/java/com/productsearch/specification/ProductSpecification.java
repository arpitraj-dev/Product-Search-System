package com.productsearch.specification;

import com.productsearch.entity.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * Builds dynamic JPA Specifications for Product queries.
 * Supports keyword search (case-insensitive partial match) and category filtering.
 * All filters are optional — no filter returns all products.
 */
public final class ProductSpecification {

    private ProductSpecification() {
        // Utility class — prevent instantiation
    }

    /**
     * Creates a dynamic specification combining optional keyword and category filters.
     *
     * @param keyword    optional search keyword for product name
     * @param categoryId optional category ID filter
     * @return a composed Specification
     */
    public static Specification<Product> withFilters(String keyword, Long categoryId) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.isBlank()) {
                predicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("name")),
                                "%" + keyword.toLowerCase() + "%"
                        )
                );
            }

            if (categoryId != null) {
                predicates.add(
                        criteriaBuilder.equal(root.get("category").get("id"), categoryId)
                );
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
