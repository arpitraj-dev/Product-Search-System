package com.productsearch.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI productSearchOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Product Search System API")
                        .description("REST API for managing products and categories. "
                                + "Supports full CRUD operations, normalized category relationships, "
                                + "and advanced search with keyword filtering, category filtering, pagination, and sorting.")
                        .version("2.0.0")
                        .contact(new Contact()
                                .name("Product Search Team")
                                .email("support@productsearch.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Local Development Server")
                ));
    }
}