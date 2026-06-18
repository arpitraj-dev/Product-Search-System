package com.productsearch.service;

import com.productsearch.dto.CategoryRequestDto;
import com.productsearch.dto.CategoryResponseDto;
import com.productsearch.entity.Category;
import com.productsearch.exception.CategoryNotFoundException;
import com.productsearch.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public CategoryResponseDto createCategory(CategoryRequestDto requestDto) {
        log.info("Creating category with name: {}", requestDto.getName());

        Category category = Category.builder()
                .name(requestDto.getName())
                .build();

        Category savedCategory = categoryRepository.save(category);
        log.info("Category created successfully with id: {}", savedCategory.getId());

        return mapToResponseDto(savedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponseDto> getAllCategories() {
        log.info("Fetching all categories");

        List<Category> categories = categoryRepository.findAll();
        log.info("Found {} categories", categories.size());

        return categories.stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponseDto getCategoryById(Long id) {
        log.info("Fetching category with id: {}", id);

        Category category = findCategoryOrThrow(id);
        return mapToResponseDto(category);
    }

    @Override
    @Transactional
    public CategoryResponseDto updateCategory(Long id, CategoryRequestDto requestDto) {
        log.info("Updating category with id: {}", id);

        Category existingCategory = findCategoryOrThrow(id);
        existingCategory.setName(requestDto.getName());

        Category updatedCategory = categoryRepository.save(existingCategory);
        log.info("Category updated successfully with id: {}", updatedCategory.getId());

        return mapToResponseDto(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        log.info("Deleting category with id: {}", id);

        Category category = findCategoryOrThrow(id);
        categoryRepository.delete(category);
        categoryRepository.resetAutoIncrement();

        log.info("Category deleted successfully with id: {}", id);
    }

    /**
     * Finds a category by ID or throws CategoryNotFoundException.
     */
    private Category findCategoryOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Category not found with id: {}", id);
                    return new CategoryNotFoundException(id);
                });
    }

    /**
     * Maps a Category entity to a CategoryResponseDto.
     */
    private CategoryResponseDto mapToResponseDto(Category category) {
        return CategoryResponseDto.builder()
                .id(category.getId())
                .name(category.getName())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
