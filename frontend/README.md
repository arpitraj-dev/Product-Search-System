# ⚛ Product Search System Frontend Client

A responsive, search-centric single-page web client built on **React 19**, **Vite**, **Tailwind CSS v4**, and **Framer Motion**, delivering a premium visual interface.

---

## 🏗 Client Architecture & Core Systems

The frontend client operates as a decoupled single-page application communicating with the backend API via Axios. The system architecture is organized around four core pillars:

### 1. View & Page Mounts (React 19)
- **Root Layout Node (`App.jsx`)**: Declares the main app shell, loading the sticky `Navbar`, responsive `Sidebar`, dynamic `Footer`, and global toast message dispatchers.
- **Route Manager**: Leverages React Router DOM to map path routes. The views are wrapped inside Framer Motion's `<AnimatePresence>` to support slide page transitions.

### 2. State & Hooks Layer (`hooks/`)
- Encapsulates lifecycle fetch states in custom React hooks:
  * **`useProducts`**: Manages search request states, product lists payload caches, and loading metrics.
  * **`useCategories`**: Fetches and groups categories for catalog selectors and discovery grids.
  * **`useDebounce`**: Optimizes inputs to delay execution and throttle query loads.

### 3. Event Orchestrator Lifecycle
- **Debounced Input Search**: User key-presses inside the `SearchBar` trigger debounced queries, resolving suggestion lists.
- **Keyboard Navigation**: Native key down event bindings allow selection of elements using Up/Down arrow keys and Enter.

### 4. Layout Stacking Context (React Portals)
- Overlays (modals and forms) are rendered using React DOM Portals, rendering them outside the main `<main>` container and mounting them directly onto `document.body` at `z-[100]` to avoid overflow clipping and overlap bugs.

---

## 🎨 Design Systems & Custom Styles

The UI implements a premium glassmorphic theme to deliver a professional visual experience. The design patterns are configured inside `src/index.css`:

### 1. Layers of the Animated Background
- **Layer 1: Rotating Mesh Gradient**: A slow 25-second infinite loop shifting across dark slate, indigo, and violet tones (`#020617` → `#0f172a` → `#1e1b4b`) to create a dynamic background.
- **Layer 2: Floating Atmospheric Orbs**: 3 large radial blur divs (Indigo, Purple, Cyan) animated on independent translation tracks (`orbFloat`) to add depth.
- **Layer 3: Scale Grid Overlay**: ARepeating CSS grid overlay (`bg-[size:32px_32px]`) with micro-opacity lines to provide visual scale.

### 2. Glassmorphism Panels
- **`glass-panel`**: Used for sticky header bars, sidebar menus, stat boards, and validation form cards. Features semi-transparent slate backgrounds (`rgba(15,23,42,0.45)`), backdrop filters (`blur(20px)`), and fine borders (`border-white/8`).
- **`glass-card`**: Used for catalog card tiles. Features smooth hover transitions, neon color prices, and glowing indigo outlines when hovered.

---

## 🏗 Core UI Features & Components

### 1. Debounced Autocomplete Search Bar
The search input (`SearchBar.jsx`) uses a custom debounce hook (`useDebounce.js`) with a 200ms delay to fetch recommendations from the category suggestion APIs without overloading backend services.
- **Keyboard Navigation Hookup**:
  - `ArrowDown` & `ArrowUp`: Highlights items in the suggestions list.
  - `Enter`: Confirms selection and triggers page navigation.
  - `Escape` / Document Mouse Down: Closes suggestions list.

### 2. React Portal Overlay Modals
Modals (such as forms and delete confirmation boxes) are wrapped inside **React Portals** (`createPortal(..., document.body)`) to escape parent HTML elements.
- **Z-Index Layering**: Rendered at `z-[100]`.
- **Layout Integrity**: Prevents modals from being clipped by overflow containers or overlapped by sticky header/footer layers when scrolling.

### 3. Responsive Admin Drawer Sidebar
The administration sidebar (`Sidebar.jsx`) dynamically adapts to different screen sizes:
- **Desktop**: Renders as a permanent, semi-transparent left panel.
- **Mobile**: Transforms into a sliding drawer overlay (`transform transition-transform duration-300 ease-out`), toggled by a floating hamburger menu button labeled "Control Panel".
- **Visuals**: Features neon active route highlights and a pulsing green "Live Console" online status indicator.

---

## 📁 Project Folder Structure

```
frontend/src/
├── assets/          # Static assets & logos
├── components/      # UI components
│   ├── SearchBar.jsx               # Autocomplete search with key navigation
│   ├── ProductTable.jsx            # Inventory table layout
│   ├── ProductCard.jsx             # Grid card layout
│   ├── DeleteConfirmationModal.jsx # React Portal overlay modal
│   └── Footer.jsx                  # Dynamic layout margin footer
├── hooks/           # State management hooks
│   ├── useProducts.js              # Fetching products
│   ├── useCategories.js            # Fetching category groups
│   └── useDebounce.js              # Debounces search inputs
├── pages/           # Pages & layouts
│   ├── Home.jsx                    # Landing page
│   ├── SearchPage.jsx              # Main search explorer layout
│   ├── ProductsPage.jsx            # Products management
│   └── CategoriesPage.jsx          # Categories management
└── services/        # Axios configurations for HTTP requests
```

---

## 🚀 Execution & Build Reference

### 1. Installation
Run the package script inside the frontend folder:
```bash
npm install
```

### 2. Run Local Development Server
Launch the hot-reloader:
```bash
npm run dev
```
👉 *Open browser window to **http://localhost:5173***.

### 3. Compile Production Bundle
Bundle assets for static deployment:
```bash
npm run build
```
*Vite compiles and places optimized HTML, CSS, and JS chunks in the `/dist` folder.*
