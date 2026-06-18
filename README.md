# Product Search System

A production-quality **Java 21 / Spring Boot 3** REST API for managing products and categories with advanced search capabilities.

## Tech Stack

- **Java 21** | **Spring Boot 3.4.1** | **Maven**
- **Spring Data JPA** with MySQL
- **JPA Specifications** for dynamic query building
- **Lombok** | **Spring Validation** | **Swagger/OpenAPI**

## Features

- Full CRUD for **Products** and **Categories**
- Normalized database with `@ManyToOne` / `@OneToMany` relationships
- Advanced search with **keyword filtering**, **category filtering**, **pagination**, and **sorting**
- Global exception handling via `@RestControllerAdvice`
- Bean Validation on all inputs
- Interactive API docs via Swagger UI

## Setup

### Prerequisites

- Java 21+
- Maven 3.9+
- MySQL 8.0+

### Database

```sql
CREATE DATABASE IF NOT EXISTS product_search_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
```

Then run `backend/src/main/resources/schema.sql` to create tables and load sample data.

### Environment Variables

Copy `.env.example` to `.env` and set your database credentials:

```
DB_URL=jdbc:mysql://localhost:3306/product_search_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=root
DB_PASSWORD=your_password
```

### Run

```bash
cd backend
mvn spring-boot:run
```

Or pass credentials inline:

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--DB_USERNAME=root --DB_PASSWORD=your_password"
```

### API Documentation

Once running, open: **http://localhost:8080/swagger-ui.html**

## API Endpoints

### Categories

| Method   | Endpoint                | Description        |
|----------|-------------------------|--------------------|
| `POST`   | `/api/categories`       | Create a category  |
| `GET`    | `/api/categories`       | Get all categories |
| `GET`    | `/api/categories/{id}`  | Get category by ID |
| `PUT`    | `/api/categories/{id}`  | Update a category  |
| `DELETE` | `/api/categories/{id}`  | Delete a category  |

### Products

| Method   | Endpoint                  | Description          |
|----------|---------------------------|----------------------|
| `POST`   | `/api/products`           | Create a product     |
| `GET`    | `/api/products`           | Get all products     |
| `GET`    | `/api/products/{id}`      | Get product by ID    |
| `PUT`    | `/api/products/{id}`      | Update a product     |
| `DELETE` | `/api/products/{id}`      | Delete a product     |
| `GET`    | `/api/products/search`    | Advanced search      |

### Search Parameters

| Parameter    | Required | Default     | Description                     |
|--------------|----------|-------------|---------------------------------|
| `keyword`    | No       | —           | Case-insensitive partial match  |
| `categoryId` | No       | —           | Filter by category              |
| `page`       | No       | `0`         | Page number (zero-based)        |
| `size`       | No       | `10`        | Items per page                  |
| `sortBy`     | No       | `createdAt` | Sort field                      |
| `direction`  | No       | `asc`       | Sort direction (`asc` / `desc`) |

## Project Structure

```
backend/
└── src/main/java/com/productsearch/
    ├── config/          # OpenAPI configuration
    ├── controller/      # REST controllers
    ├── dto/             # Request/Response DTOs
    ├── entity/          # JPA entities
    ├── exception/       # Custom exceptions & global handler
    ├── repository/      # Spring Data repositories
    ├── service/         # Business logic
    └── specification/   # JPA Specifications for dynamic queries
```
