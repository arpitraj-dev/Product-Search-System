package com.productsearch.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Response payload for delete operations")
public class DeleteResponseDto {

    @Schema(description = "Success message", example = "Product deleted successfully")
    private String message;
}
