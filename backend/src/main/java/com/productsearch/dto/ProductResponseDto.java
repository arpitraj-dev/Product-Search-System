package com.productsearch.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Response payload representing a product")
public class ProductResponseDto {

    @Schema(description = "Product ID", example = "1")
    private Long id;

    @Schema(description = "Name of the product", example = "iPhone 15")
    private String name;

    @Schema(description = "Category ID", example = "1")
    private Long categoryId;

    @Schema(description = "Category name", example = "Electronics")
    private String categoryName;

    @Schema(description = "Product price", example = "79999")
    private BigDecimal price;

    @Schema(description = "Product description", example = "Apple smartphone")
    private String description;

    @Schema(description = "Timestamp when the product was created", example = "2026-06-18T12:00:00")
    private LocalDateTime createdAt;

    @Schema(description = "Timestamp when the product was last updated", example = "2026-06-18T14:30:00")
    private LocalDateTime updatedAt;
}
