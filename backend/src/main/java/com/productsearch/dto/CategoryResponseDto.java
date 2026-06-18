package com.productsearch.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Response payload representing a category")
public class CategoryResponseDto {

    @Schema(description = "Category ID", example = "1")
    private Long id;

    @Schema(description = "Category name", example = "Electronics")
    private String name;

    @Schema(description = "Timestamp when the category was created", example = "2026-06-18T12:00:00")
    private LocalDateTime createdAt;

    @Schema(description = "Timestamp when the category was last updated", example = "2026-06-18T14:30:00")
    private LocalDateTime updatedAt;
}
