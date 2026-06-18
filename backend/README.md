# ☕ Product Search System Backend API

A robust **Java 21 / Spring Boot 3.4.1** REST API that handles persistent database CRUD operations, cascading sequences, inputs validation, and dynamic criteria search operations.

---

## 🏗 Technical Architecture & Layer Workflow

The application implements a decoupled layer architecture, enforcing strict separations of concerns:

```
[REST Controller] ────► [Service Layer] ────► [Repository Layer] ────► [MySQL DB]
        │                      │
        ▼                      ▼
[Request Validation]   [JPA Specifications]
     (DTo/Beans)            (Queries)
```

### 1. REST Resource Controllers (`controller/`)
Controllers expose endpoints mapping JSON requests to internal Java objects.
- **Request Validation**: Direct input bounds are checked using Jakarta validations (`MethodArgumentNotValidException` is thrown on constraint failures).
- **CORS Mapping**: Configured to authorize frontend cross-origin requests securely.
- **Response Formatting**: Returns standard JSON transfer schemas to decouple internal DB entity layers.

### 2. Data Transfer Objects (`dto/`)
DTO records define the input/output models of the REST API:
- **`CategoryDTO`**: Validates string bounds.
- **`ProductDTO`**: Validates minimum numeric values for price schemas (`@DecimalMin`) and prevents blank product descriptions or category selections.

### 3. Business Service & Transaction Limits (`service/`)
Service layers isolate business decisions from DB access:
- **Transaction Contexts (`@Transactional`)**: Methods modifying multiple tables (like cascading category deletions) are executed in isolated transactional states to ensure atomic consistency.
- **Auto-Increment Readjustment**: Services invoke sequence index adjusters automatically upon deletions.

### 4. Repository & Query Handlers (`repository/`)
Repositories extend `JpaRepository` and `JpaSpecificationExecutor` to execute standard database CRUD transactions. In addition, native queries are defined using `@Query` annotations to handle custom database resets.

### 5. JPA Criteria Specifications Query Builder (`specification/`)
Instead of compiling raw SQL queries, search queries are compiled programmatically.
- **`ProductSpecification`**: Implements custom filtering functions mapping keyword searches and category matches:
  * Creates variable Predicate arrays depending on the presence of parameters (`keyword`, `categoryId`).
  * Resolves partial, case-insensitive matches using criteria builders: `criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + keyword.toLowerCase() + "%")`.
  * Returns combined arrays using `criteriaBuilder.and(...)` back to the root query executor, integrating sort direction strings (`asc`/`desc`) dynamically.

---

## 📦 Deliverables

This folder contains the Java Maven microservice backend codebase along with the following deliverables:

### 1. Setup and Run Instructions

#### Prerequisites
- **Java 21 JDK** or higher
- **Apache Maven 3.9+**
- **MySQL 8.0**

#### Database Schema Setup
Ensure your MySQL engine is running and configure the schema:
```sql
CREATE DATABASE IF NOT EXISTS product_search_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
```

#### Environment Variables Configuration
The application reads database parameters from a `.env` file at the project root directory. Verify it contains your SQL credentials:
```env
DB_URL=jdbc:mysql://localhost:3306/product_search_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
```

#### Compile and Run Maven Commands
Execute these maven commands inside the `backend/` folder:

| Script Command | Goal / Description |
| :--- | :--- |
| `mvn clean compile` | Cleans build artifacts and compiles source resources |
| `mvn test` | Runs Unit tests against the H2 in-memory profile |
| `mvn package` | Prepares compiled packages as an executable `.jar` bundle |
| `mvn spring-boot:run` | Boots up the Tomcat API server on **http://localhost:8080** |

👉 Interactive API sandbox maps to **http://localhost:8080/swagger-ui.html**.

---

### 2. Technology Stack Used

- **Java 21 JDK**
- **Spring Boot 3.4.1** (REST Web services core framework)
- **Spring Data JPA** (MySQL 8 database connector via Hibernate ORM)
- **Spring Validation** (Request payload validation using JSR annotations)
- **Spring Dotenv** (Loads credentials from root `.env` files)
- **Swagger / OpenAPI 3** (REST API browser and testing tool)
- **MySQL 8** (Persistent database storing products catalog and categories)

---

### 3. Any Assumptions Made During Development

1. **Transactional Boundaries**: Assumed transactional operations (like category removal cascading) should run inside isolated transaction boundaries (`@Transactional`) to guarantee database consistency.
2. **Auto-Increment Sequential Contiguity**: Assumed that resetting the auto-increment counter (`ALTER TABLE AUTO_INCREMENT = 1`) on deletions is desirable to maintain clean sequential IDs.
3. **Cascading Delete Path**: Assumed that deleting a category must perform a cascade delete on all associated products in the database to prevent orphaned records.
4. **Dynamic Query Pagination Defaulting**: Assumed that search queries without explicit parameters should default to page 0 and limit 10 sorted by creation date descending.
5. **stateless query execution**: Assumed REST resource endpoints are fully stateless; security configurations and CORS variables allow all frontend connections.

---

## 📋 API Specs Sheets & Examples

### Endpoints List

#### 📂 Categories Management
- `GET /api/categories` — Fetch all categories.
- `GET /api/categories/{id}` — Fetch single category.
- `POST /api/categories` — Create category (Enforces `@NotBlank` on name).
- `PUT /api/categories/{id}` — Update category name.
- `DELETE /api/categories/{id}` — Delete category (Cascades to remove products and resets sequences).

#### 📦 Products Management
- `GET /api/products` — Fetch all products (unpaginated).
- `GET /api/products/{id}` — Fetch product details.
- `POST /api/products` — Insert product (Enforces `@NotBlank` on name and `@DecimalMin` on price).
- `PUT /api/products/{id}` — Update product specifications.
- `DELETE /api/products/{id}` — Delete product (Resets auto-increment).
- `GET /api/products/search` — Dynamic paginated search.

### Payload Schema Examples

#### Success Response: Creating Product (`POST /api/products`)
**Payload:**
```json
{
  "name": "Apple iPhone 15 Pro",
  "price": 129900.00,
  "categoryId": 1,
  "description": "Titanium design, A17 Pro chip."
}
```
**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Apple iPhone 15 Pro",
  "price": 129900.00,
  "description": "Titanium design, A17 Pro chip.",
  "categoryId": 1,
  "categoryName": "Smartphones",
  "createdAt": "2026-06-18T11:00:00Z",
  "updatedAt": "2026-06-18T11:00:00Z"
}
```

#### Validation Error: Invalid Price DTO (`POST /api/products`)
**Payload:**
```json
{
  "name": "Logitech MX Master 3S",
  "price": -150.00,
  "categoryId": 2
}
```
**Response (400 Bad Request):**
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": {
    "price": "Price must be greater than zero"
  },
  "timestamp": "2026-06-18T11:01:00Z"
}
```

