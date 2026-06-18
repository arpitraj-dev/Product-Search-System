package com.productsearch.service;

import com.productsearch.dto.CategoryRequestDto;
import com.productsearch.dto.CategoryResponseDto;

import java.util.List;

public interface CategoryService {

    /**
     * Creates a new category.
     *
     * @param requestDto category data
     * @return the created category
     */
    CategoryResponseDto createCategory(CategoryRequestDto requestDto);

    /**
     * Retrieves all categories.
     *
     * @return list of all categories
     */
    List<CategoryResponseDto> getAllCategories();

    /**
     * Retrieves a single category by its ID.
     *
     * @param id the category ID
     * @return the category
     * @throws com.productsearch.exception.CategoryNotFoundException if not found
     */
    CategoryResponseDto getCategoryById(Long id);

    /**
     * Updates an existing category.
     *
     * @param id         the category ID
     * @param requestDto updated category data
     * @return the updated category
     * @throws com.productsearch.exception.CategoryNotFoundException if not found
     */
    CategoryResponseDto updateCategory(Long id, CategoryRequestDto requestDto);

    /**
     * Deletes a category by its ID.
     *
     * @param id the category ID
     * @throws com.productsearch.exception.CategoryNotFoundException if not found
     */
    void deleteCategory(Long id);
}
