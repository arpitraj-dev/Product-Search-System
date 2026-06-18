# 📦 Full-Stack Product Search & Discovery System

A full-stack web application featuring a robust **Java 21 / Spring Boot 3** REST API backend utilizing MySQL persistent storage with dynamic query filtering (JPA Specifications), and an immersive **React 19** frontend styled with a modern glassmorphic design system.

---

## 🏗 System Architecture & Workflow

The system is designed around a fully decoupled client-server model. The backend acts as a stateless REST API, and the frontend acts as a responsive Single Page Application (SPA).

```
       ┌────────────────────────────────────────────────────────┐
       │                 React 19 SPA (Client)                  │
       │  (Framer Motion / Tailwind v4 / Axios API Connectors)  │
       └──────────────────────────┬─────────────────────────────┘
                                  │
                                  │ HTTP REST Requests (JSON)
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │               Spring Boot 3 REST API                   │
       │      (REST Controller / Business Service Layers)        │
       └──────────────────────────┬─────────────────────────────┘
                                  │
                                  │ Spring Data JPA Specifications
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │                MySQL 8 Database Server                 │
       │       (Product Catalog & Categories Sequences)         │
       └────────────────────────────────────────────────────────┘
```

### Architectural Subsystems & Layers

#### 1. Client-Side Architecture (React 19)
- **View Layer**: Components and layout nodes styled using fine-tuned CSS variables and Tailwind classes.
- **State & Logic Layer**: Reusable custom state hooks (`useProducts`, `useCategories`) encapsulate UI states, load flags, and network error buffers.
- **Dynamic Action Interceptors**:
  - **Debounce Hook**: Input triggers are debounced (`useDebounce.js`) to throttle network autocompletion scans.
  - **Keyboard Event Router**: Hooks listen to key events (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`) to allow navigating suggestion drop-downs without mouse clicks.
- **Structural Portals**: Layout overlays (modals/forms) are mounted onto the root DOM body using `createPortal`, isolating modals from the document flow to prevent layout cropping.

#### 2. Server-Side Architecture (Spring Boot 3)
- **REST Resource Controllers**: Expose path variables, configure CORS headers, and trigger input validation checks (`MethodArgumentNotValidException`).
- **Data Transfer Objects (DTOs)**: Ensure strict isolation between persistent database models and the JSON models consumed by the API.
- **Service & Transactions Layer**: Enforces business logic rules, coordinates database sequence adjustments, and runs database interactions under transactional contexts (`@Transactional`).
- **Dynamic JPA Specifications Builder**: Dynamically builds SQL predicates (`Root`, `CriteriaQuery`, `CriteriaBuilder`) to filter, paginate, and sort records safely at runtime.
- **Persistence Layer**: Custom database queries executing cascading operations and sequence resets (`AUTO_INCREMENT = 1`) on category deletion.

---

## 🗄 Database Schema & Entity Relationships

The relational database consists of two normalized tables linked via a One-to-Many relationship with cascading deletes.

### Entity Relationship Diagram
```
  ┌──────────────────┐             ┌──────────────────┐
  │    categories    │ 1         * │     products     │
  ├──────────────────┤             ├──────────────────┤
  │ PK  id           ├────────────►│ PK  id           │
  │     name         │             │ FK  category_id  │
  │     created_at   │             │     name         │
  │                  │             │     price        │
  │                  │             │     description  │
  │                  │             │     created_at   │
  │                  │             │     updated_at   │
  └──────────────────┘             └──────────────────┘
```

### 1. Categories Table (`categories`)
- `id` (BIGINT, Primary Key, Auto-Increment)
- `name` (VARCHAR(255), Not Null, Unique)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 2. Products Table (`products`)
- `id` (BIGINT, Primary Key, Auto-Increment)
- `name` (VARCHAR(255), Not Null)
- `price` (DECIMAL(38,2), Not Null)
- `description` (TEXT)
- `category_id` (BIGINT, Foreign Key referencing `categories(id)`, Cascade on Delete)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Cascading Deletes & Auto-Increment Resets
- **Cascaded Delete**: Deleting a category automatically deletes all associated products in the database using Hibernate's `cascade = CascadeType.ALL` and database-level foreign key constraints.
- **Index Auto-Reset**: When records are deleted, the backend runs a native SQL sequence reset (`ALTER TABLE AUTO_INCREMENT = 1`) to ensure next items use the lowest available sequential index, keeping database ID structures clean.

---

## 📦 Deliverables

This repository contains the complete full-stack project codebase along with the following deliverables:

### 1. Setup and Run Instructions

#### Prerequisites
- **Java 21 JDK** or higher
- **Node.js 18+** & **npm**
- **MySQL 8.0**
- **Maven 3.9+**

#### Database Configuration
Open your local MySQL database engine client and run:
```sql
CREATE DATABASE IF NOT EXISTS product_search_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
```

#### Environment Configuration
Copy the `.env.example` file located at the parent root directory into a new file named `.env`, and customize your credentials:
```env
DB_URL=jdbc:mysql://localhost:3306/product_search_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
```

#### Running the Backend API
```bash
cd backend
mvn spring-boot:run
```
- The backend API server starts at **http://localhost:8080**.
- Swagger UI API documentation and interactive testing sandbox are accessible at **http://localhost:8080/swagger-ui.html**.

#### Running the Frontend Client
```bash
cd frontend
npm install
npm run dev
```
- The React development application runs at **http://localhost:5173**.

---

### 2. Technology Stack Used

#### Backend Core Services
- **Java 21** & **Spring Boot 3.4.1**
- **Spring Data JPA** (MySQL Hibernate connector)
- **Spring Validation** (Request body validation annotations)
- **Spring Dotenv** (Loads credentials from `.env` files)
- **Swagger UI / OpenAPI 3** (Interactive REST endpoint testing browser)
- **MySQL** (Relational database for catalog storage and transaction management)

#### Frontend User Interface
- **React 19** & **Vite** (Bundler & local dev server)
- **Tailwind CSS v4** (Modern utility styling system)
- **Framer Motion** (Stagger-loading card list animations)
- **React Router DOM 7** (Declarative route path mappings)
- **React Hook Form** (Form validation state management)
- **React Portals** (Mounting layout overlays outside parent CSS boundaries)

---

### 3. Any Assumptions Made During Development

1. **Decoupled Stacking Contexts**: Assumed overlay UI items (modals/forms) must be isolated from parent layout branches to prevent clipping. Used React Portals (`createPortal`) to guarantee elements stack cleanly over header and footer.
2. **Cascading Delete Behaviors**: Assumed that deleting a Product Category should automatically remove all products under that category in the catalog to maintain database integrity. Implemented using standard database cascading rules.
3. **Database Index Resets**: Assumed it is desirable to reset the table sequence auto-increment indices to the lowest available sequential number (`ALTER TABLE AUTO_INCREMENT = 1`) on deletions to keep IDs contiguous.
4. **Stateless Pagination**: Assumed all queries with pagination parameters are stateless. Empty queries default to returning all catalog items paginated.
5. **Debounce Delay Throttling**: Assumed a 200ms input debounce delay inside search queries is optimal to balance suggestion latency and avoid database load.

---

### 4. API Endpoints

The backend exposes the following REST resource endpoints:

#### 📂 Category Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories` | Fetch all category catalog groups |
| `GET` | `/api/categories/{id}` | Fetch category details by ID |
| `POST` | `/api/categories` | Create new category (payload validated) |
| `PUT` | `/api/categories/{id}` | Update category name |
| `DELETE` | `/api/categories/{id}` | Delete category, cascade products, reset IDs |

#### 📦 Product Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch all database products (unpaginated list) |
| `GET` | `/api/products/{id}` | Fetch detailed product card info by ID |
| `POST` | `/api/products` | Create new product card item (payload validated) |
| `PUT` | `/api/products/{id}` | Update product parameters |
| `DELETE` | `/api/products/{id}` | Remove product and reset sequence index |
| `GET` | `/api/products/search` | Paginated search (keywords, category filters, sorting) |

##### Search Parameter Specs
- `keyword` (Optional): Matches product names and descriptions.
- `categoryId` (Optional): Filters results to a specific category.
- `page` (Optional, Default: `0`): Page index.
- `size` (Optional, Default: `10`): Items per page.
- `sortBy` (Optional, Default: `createdAt`): Sorting column.
- `direction` (Optional, Default: `asc`): Sorting direction (`asc` / `desc`).

---

## 📁 Project Directory Structure

```
Product Search System/
├── backend/                  # Java Maven Backend Service
│   ├── src/main/java/        # Source code classes
│   │   └── com/productsearch/
│   │       ├── config/       # OpenAPI OpenAPI 3 configurations
│   │       ├── controller/   # API Endpoints handlers
│   │       ├── dto/          # Data validation objects
│   │       ├── entity/       # JPA entities (MySQL tables mapping)
│   │       ├── exception/    # Custom handlers for 404, 400 errors
│   │       ├── repository/   # JPA & Specification execution DB handles
│   │       ├── service/      # Business logic rules interfaces
│   │       └── specification/# JPA Specs query generators
│   └── src/main/resources/   # Application properties, schemas, and seeds
├── frontend/                 # React Vite Frontend Client
│   ├── src/components/       # Modals, Navbar, Sidebar...
│   ├── src/pages/            # Landing, Search catalog, details layouts
│   ├── src/hooks/            # useProducts, useCategories state utilities
│   └── src/services/         # Axios HTTP connection classes
└── README.md                 # Project root documentation
```

---

## Screenshots

| Home Dashboard | Product Search |
| :---: | :---: |
| ![Home Dashboard](frontend/screenshots/Home%20Dashboard.jpeg) | ![Product Search](frontend/screenshots/Product%20Search.jpeg) |

| Product Discovery | Featured Products |
| :---: | :---: |
| ![Product Discovery](frontend/screenshots/Product%20Discovery.jpeg) | ![Featured Products](frontend/screenshots/Featured%20Products.jpeg) |

| Product Management | Category Management |
| :---: | :---: |
| ![Product Management](frontend/screenshots/Product%20Management.jpeg) | ![Category Management](frontend/screenshots/Category%20Management.jpeg) |

| Add Product | Delete Product |
| :---: | :---: |
| ![Add Product](frontend/screenshots/Add%20Product.jpeg) | ![Delete Product](frontend/screenshots/Delete%20Product.jpeg) |


---

## 📝 Project Features Implementation Checklist

| Feature | Implementation Details | Files Reference |
| :--- | :--- | :--- |
| **Search Centric Home** | Landing page redesigned with headline spotlight focus search box. | [Home.jsx](file:///s:/Java/Product%20Search%20System/frontend/src/pages/Home.jsx) |
| **Advanced Search** | Paginated dynamic lookup matching names, descriptions, categories with sort selectors. | [SearchPage.jsx](file:///s:/Java/Product%20Search%20System/frontend/src/pages/SearchPage.jsx) |
| **Cascading Delete** | Deleting categories automatically removes all mapped catalog products. | [CategoryServiceImpl.java](file:///s:/Java/Product%20Search%20System/backend/src/main/java/com/productsearch/service/CategoryServiceImpl.java) |
| **Database sequence reset** | Resets database indices sequence values upon deletions. | [CategoryRepository.java](file:///s:/Java/Product%20Search%20System/backend/src/main/java/com/productsearch/repository/CategoryRepository.java) |
| **Autocomplete list** | Live suggestions loaded debounced with keyboard arrows up/down navigation. | [SearchBar.jsx](file:///s:/Java/Product%20Search%20System/frontend/src/components/SearchBar.jsx) |
| **Stacking Portals** | Modal popups wrapped in React Portals to prevent sticky layout overrides. | [DeleteConfirmationModal.jsx](file:///s:/Java/Product%20Search%20System/frontend/src/components/DeleteConfirmationModal.jsx) |
| **Responsive Sidebars** | Admin menu rendering static on desktop and sliding responsive drawer on mobile. | [Sidebar.jsx](file:///s:/Java/Product%20Search%20System/frontend/src/components/Sidebar.jsx) |
| **Global Exceptions** | Advices returning formal DTO JSON error structures upon DB errors. | [GlobalExceptionHandler.java](file:///s:/Java/Product%20Search%20System/backend/src/main/java/com/productsearch/exception/GlobalExceptionHandler.java) |
| **Test Coverage** | Unit test profiles validated with memory testing db. | [backend/src/test/](file:///s:/Java/Product%20Search%20System/backend/src/test/) |

---

## 🔒 Authors & Maintainers
Developed and maintained by **Arpit**.


