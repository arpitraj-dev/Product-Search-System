package com.productsearch.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Paginated search response for products")
public class ProductSearchResponseDto {

    @Schema(description = "Current page number (zero-based)", example = "0")
    private int currentPage;

    @Schema(description = "Number of items per page", example = "10")
    private int pageSize;

    @Schema(description = "Total number of pages", example = "5")
    private int totalPages;

    @Schema(description = "Total number of matching products", example = "50")
    private long totalElements;

    @Schema(description = "List of products on the current page")
    private List<ProductResponseDto> products;
}
