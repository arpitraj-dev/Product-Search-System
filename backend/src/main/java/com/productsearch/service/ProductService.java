package com.productsearch.service;

import com.productsearch.dto.ProductRequestDto;
import com.productsearch.dto.ProductResponseDto;
import com.productsearch.dto.ProductSearchResponseDto;

import java.util.List;

public interface ProductService {

    /**
     * Creates a new product.
     *
     * @param requestDto product data with categoryId
     * @return the created product
     * @throws com.productsearch.exception.CategoryNotFoundException if categoryId is invalid
     */
    ProductResponseDto createProduct(ProductRequestDto requestDto);

    /**
     * Retrieves all products.
     *
     * @return list of all products
     */
    List<ProductResponseDto> getAllProducts();

    /**
     * Retrieves a single product by its ID.
     *
     * @param id the product ID
     * @return the product
     * @throws com.productsearch.exception.ProductNotFoundException if not found
     */
    ProductResponseDto getProductById(Long id);

    /**
     * Updates an existing product.
     *
     * @param id         the product ID
     * @param requestDto updated product data with categoryId
     * @return the updated product
     * @throws com.productsearch.exception.ProductNotFoundException  if product not found
     * @throws com.productsearch.exception.CategoryNotFoundException if categoryId is invalid
     */
    ProductResponseDto updateProduct(Long id, ProductRequestDto requestDto);

    /**
     * Deletes a product by its ID.
     *
     * @param id the product ID
     * @throws com.productsearch.exception.ProductNotFoundException if not found
     */
    void deleteProduct(Long id);

    /**
     * Advanced product search with optional filters, pagination, and sorting.
     *
     * @param keyword    optional search keyword (case-insensitive, partial match)
     * @param categoryId optional category filter
     * @param page       page number (zero-based)
     * @param size       page size
     * @param sortBy     field to sort by
     * @param direction  sort direction (asc/desc)
     * @return paginated search results
     */
    ProductSearchResponseDto searchProducts(String keyword, Long categoryId,
                                            int page, int size,
                                            String sortBy, String direction);
}
