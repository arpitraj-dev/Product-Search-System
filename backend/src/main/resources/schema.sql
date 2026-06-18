-- ============================================
-- Product Search System — MySQL Schema (Phase 3)
-- Normalized with categories table
-- ============================================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS product_search_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE product_search_db;

-- 2. Create the categories table
CREATE TABLE IF NOT EXISTS categories (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255)    NOT NULL UNIQUE,
    created_at  DATETIME(6)     NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at  DATETIME(6)     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- 3. Create the products table (references categories)
CREATE TABLE IF NOT EXISTS products (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255)    NOT NULL,
    category_id BIGINT          NOT NULL,
    price       DECIMAL(10, 2)  NOT NULL,
    description VARCHAR(1000)   NULL,
    created_at  DATETIME(6)     NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at  DATETIME(6)     NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    INDEX idx_product_name (name),
    INDEX idx_product_category (category_id),
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- 4. Insert sample categories
INSERT INTO categories (name) VALUES
    ('Electronics'),
    ('Audio'),
    ('Accessories'),
    ('Monitors'),
    ('Tablets'),
    ('Gaming'),
    ('Mobile');

-- 5. Insert sample products (referencing category IDs)
INSERT INTO products (name, category_id, price, description) VALUES
    ('MacBook Pro 16"',          1, 2499.99, 'Apple MacBook Pro with M3 Max chip, 36GB RAM, 1TB SSD'),
    ('MacBook Air 13"',          1, 1099.00, 'Apple MacBook Air with M3 chip, 8GB RAM, 256GB SSD'),
    ('Dell XPS 15',              1, 1799.00, 'Dell XPS 15 with Intel Core Ultra 7, 32GB RAM, 1TB SSD'),
    ('iPhone 16 Pro',            7,  1199.99, 'Apple iPhone 16 Pro with A18 Pro chip, 256GB storage'),
    ('Samsung Galaxy S25 Ultra', 7,  1299.99, 'Samsung flagship with Snapdragon 8 Elite, 512GB storage'),
    ('Sony WH-1000XM5',         2,  349.99, 'Premium noise-cancelling wireless headphones'),
    ('Bose QuietComfort Ultra',  2,  429.00, 'Spatial audio noise-cancelling headphones'),
    ('AirPods Pro 2',            2,  249.00, 'Apple AirPods Pro with H2 chip, adaptive audio'),
    ('Logitech MX Master 3S',   3,   99.99, 'Advanced ergonomic wireless mouse for professionals'),
    ('Keychron Q1 Pro',          3,  199.00, 'Wireless custom mechanical keyboard with QMK/VIA support'),
    ('Anker PowerCore 26800',    3,   65.99, 'Portable charger with 26800mAh capacity, dual USB output'),
    ('LG UltraFine 27" 5K',     4, 1299.99, 'LG 27-inch 5K IPS display with Thunderbolt 4'),
    ('Samsung Odyssey G9',       4, 1499.99, '49-inch curved DQHD gaming monitor, 240Hz'),
    ('iPad Pro 13"',             5, 1299.00, 'Apple iPad Pro with M4 chip, Liquid Retina XDR display'),
    ('Kindle Paperwhite',        5,  149.99, 'Amazon Kindle Paperwhite with 6.8-inch glare-free display'),
    ('Sony PlayStation 5',       6,  499.99, 'Next-gen gaming console with 825GB SSD and DualSense controller');
