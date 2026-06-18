package com.productsearch.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request payload for creating or updating a product")
public class ProductRequestDto {

    @NotBlank(message = "Product name cannot be blank")
    @Size(max = 255, message = "Product name must not exceed 255 characters")
    @Schema(description = "Name of the product", example = "iPhone 15")
    private String name;

    @NotNull(message = "Category ID is required")
    @Schema(description = "ID of the product category", example = "1")
    private Long categoryId;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    @Schema(description = "Product price", example = "79999")
    private BigDecimal price;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    @Schema(description = "Product description", example = "Apple smartphone")
    private String description;
}
