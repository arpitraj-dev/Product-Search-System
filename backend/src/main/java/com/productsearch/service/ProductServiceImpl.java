package com.productsearch.service;

import com.productsearch.dto.ProductRequestDto;
import com.productsearch.dto.ProductResponseDto;
import com.productsearch.dto.ProductSearchResponseDto;
import com.productsearch.entity.Category;
import com.productsearch.entity.Product;
import com.productsearch.exception.CategoryNotFoundException;
import com.productsearch.exception.ProductNotFoundException;
import com.productsearch.repository.CategoryRepository;
import com.productsearch.repository.ProductRepository;
import com.productsearch.specification.ProductSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public ProductResponseDto createProduct(ProductRequestDto requestDto) {
        log.info("Creating product with name: {}", requestDto.getName());

        Category category = findCategoryOrThrow(requestDto.getCategoryId());

        Product product = Product.builder()
                .name(requestDto.getName())
                .category(category)
                .price(requestDto.getPrice())
                .description(requestDto.getDescription())
                .build();

        Product savedProduct = productRepository.save(product);
        log.info("Product created successfully with id: {}", savedProduct.getId());

        return mapToResponseDto(savedProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDto> getAllProducts() {
        log.info("Fetching all products");

        List<Product> products = productRepository.findAll();
        log.info("Found {} products", products.size());

        return products.stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDto getProductById(Long id) {
        log.info("Fetching product with id: {}", id);

        Product product = findProductOrThrow(id);
        return mapToResponseDto(product);
    }

    @Override
    @Transactional
    public ProductResponseDto updateProduct(Long id, ProductRequestDto requestDto) {
        log.info("Updating product with id: {}", id);

        Product existingProduct = findProductOrThrow(id);
        Category category = findCategoryOrThrow(requestDto.getCategoryId());

        existingProduct.setName(requestDto.getName());
        existingProduct.setCategory(category);
        existingProduct.setPrice(requestDto.getPrice());
        existingProduct.setDescription(requestDto.getDescription());

        Product updatedProduct = productRepository.save(existingProduct);
        log.info("Product updated successfully with id: {}", updatedProduct.getId());

        return mapToResponseDto(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        log.info("Deleting product with id: {}", id);

        Product product = findProductOrThrow(id);
        productRepository.delete(product);

        log.info("Product deleted successfully with id: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductSearchResponseDto searchProducts(String keyword, Long categoryId,
                                                   int page, int size,
                                                   String sortBy, String direction) {
        log.info("Searching products — keyword: '{}', categoryId: {}, page: {}, size: {}, sortBy: {}, direction: {}",
                keyword, categoryId, page, size, sortBy, direction);

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Specification<Product> spec = ProductSpecification.withFilters(keyword, categoryId);

        Page<Product> productPage = productRepository.findAll(spec, pageable);

        List<ProductResponseDto> products = productPage.getContent().stream()
                .map(this::mapToResponseDto)
                .toList();

        log.info("Search returned {} of {} total products", products.size(), productPage.getTotalElements());

        return ProductSearchResponseDto.builder()
                .currentPage(productPage.getNumber())
                .pageSize(productPage.getSize())
                .totalPages(productPage.getTotalPages())
                .totalElements(productPage.getTotalElements())
                .products(products)
                .build();
    }

    /**
     * Finds a product by ID or throws ProductNotFoundException.
     */
    private Product findProductOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Product not found with id: {}", id);
                    return new ProductNotFoundException(id);
                });
    }

    /**
     * Finds a category by ID or throws CategoryNotFoundException.
     */
    private Category findCategoryOrThrow(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> {
                    log.warn("Category not found with id: {}", categoryId);
                    return new CategoryNotFoundException(categoryId);
                });
    }

    /**
     * Maps a Product entity to a ProductResponseDto.
     */
    private ProductResponseDto mapToResponseDto(Product product) {
        return ProductResponseDto.builder()
                .id(product.getId())
                .name(product.getName())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .price(product.getPrice())
                .description(product.getDescription())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
