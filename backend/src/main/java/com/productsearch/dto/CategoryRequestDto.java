package com.productsearch.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request payload for creating or updating a category")
public class CategoryRequestDto {

    @NotBlank(message = "Category name cannot be blank")
    @Size(max = 255, message = "Category name must not exceed 255 characters")
    @Schema(description = "Name of the category", example = "Electronics")
    private String name;
}
