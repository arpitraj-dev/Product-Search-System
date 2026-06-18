package com.productsearch.repository;

import com.productsearch.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    /**
     * Resets the AUTO_INCREMENT counter of the products table.
     * MySQL will automatically set it to MAX(id) + 1.
     */
    @Modifying
    @Query(value = "ALTER TABLE products AUTO_INCREMENT = 1", nativeQuery = true)
    void resetAutoIncrement();
}
