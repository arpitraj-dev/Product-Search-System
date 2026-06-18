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

## 🛠 Tech Stack

### Frontend Client
- **React 19 (Vite)**: Structured UI engine.
- **Tailwind CSS v4**: Styling framework.
- **Framer Motion**: Smooth animations.
- **React Router DOM 7**: Clean routing.
- **React Hook Form**: Form inputs validation.
- **React Hot Toast**: Action notification overlays.
- **React Portals**: Modal elements mounted outside stacking context.

### Backend API
- **Java 21 & Spring Boot 3.4.1**: Enterprise microservices core.
- **Spring Data JPA**: MySQL connector.
- **JPA Specifications**: Compilation-safe dynamic SQL generation.
- **Swagger UI (OpenAPI 3)**: Interactive endpoints testing sandbox.
- **Spring Dotenv**: Environment variables manager.
- **MySQL**: Relational database used for persistent data storage, querying, and transaction management.

---

## 🚀 Installation & Local Execution

### Step 1: Database Setup
Launch your MySQL server instance and run:
```sql
CREATE DATABASE IF NOT EXISTS product_search_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
```

### Step 2: Ingest Environment Variables
Copy `.env.example` to `.env` in the root folder and input your MySQL configuration:
```env
DB_URL=jdbc:mysql://localhost:3306/product_search_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
```

### Step 3: Start the Backend Server
```bash
cd backend
mvn spring-boot:run
```
- The backend API boots on **http://localhost:8080**.
- Swagger UI sandbox is available at **http://localhost:8080/swagger-ui.html**.

### Step 4: Start the Frontend Client
```bash
cd frontend
npm install
npm run dev
```
- The React application opens on **http://localhost:5173**.

---

## 📂 Project Directory Structure

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

