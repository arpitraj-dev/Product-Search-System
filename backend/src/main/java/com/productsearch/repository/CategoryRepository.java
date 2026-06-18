package com.productsearch.repository;

import com.productsearch.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Resets the AUTO_INCREMENT counter of the categories table.
     * MySQL will automatically set it to MAX(id) + 1.
     */
    @Modifying
    @Query(value = "ALTER TABLE categories AUTO_INCREMENT = 1", nativeQuery = true)
    void resetAutoIncrement();
}
