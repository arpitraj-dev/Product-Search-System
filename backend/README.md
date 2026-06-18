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

## ⚙ Core Implementation Highlights

### 1. Dynamic Query Specification Engine
Instead of writing static SQL queries or custom repository method parameters, searches are built dynamically using JPA specifications:
- **String Queries**: Partial string matching using `criteriaBuilder.like(criteriaBuilder.lower(root.get("field")), "%" + term + "%")`.
- **Category Grouping**: Category ID filtering via `criteriaBuilder.equal(root.get("category").get("id"), categoryId)`.
- **Directional Sorting**: PageRequest arguments configured with Sort parameters matching columns like `createdAt`, `price`, or `name`.

### 2. Auto-Increment Sequence Reset Mechanism
When database deletions occur, ID sequences can skip numbers. To keep record IDs clean, the repository executes native queries on category or product removal:
```java
@Modifying
@Transactional
@Query(value = "ALTER TABLE categories AUTO_INCREMENT = 1", nativeQuery = true)
void resetAutoIncrement();
```
- Called automatically during cascade operations in the service implementations to ensure subsequent records inherit the next logical sequential index.

### 3. Comprehensive Global Exception Handler
Uncaptured exceptions are caught by a global advisor using `@RestControllerAdvice`, converting stack traces into structured JSON templates:
- **Validation Errors (400 Bad Request)**: Triggered when input criteria fails validation, returning field-specific validation reports.
- **Not Found Errors (404 Not Found)**: Raised when requesting non-existent resource IDs.

---

## 🚀 Setup & Execution

### Prerequisites
- **Java 21 JDK**
- **Apache Maven 3.9**
- **MySQL 8.0**

### Environment Configuration
The database parameters are loaded via the `spring-dotenv` package. Configure a `.env` file at the parent workspace root:
```env
DB_URL=jdbc:mysql://localhost:3306/product_search_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Maven Scripts

| Script Command | Target Goal |
| :--- | :--- |
| `mvn clean compile` | Cleans target logs and compiles source files. |
| `mvn test` | Runs Unit testing profiles using an H2 database. |
| `mvn package` | Prepares executable compilation packages (`.jar` bundle). |
| `mvn spring-boot:run` | Launches the server at **http://localhost:8080**. |

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
