-- =========================================
-- Schéma de base de données INOVA Makers
-- Base de données: inovamakers
-- Version: 1.0
-- Date: Mars 2026
-- =========================================

-- Utiliser la base de données
USE inovamakers;

-- =========================================
-- TABLE: admins
-- Compte(s) administrateur
-- =========================================
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_active (is_active)
);

-- =========================================
-- TABLE: categories
-- Catégories de produits et services
-- =========================================
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    type ENUM('product', 'service', 'blog') NOT NULL,
    parent_id INT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_type (type),
    INDEX idx_active (is_active)
);

-- =========================================
-- TABLE: products
-- Produits de la boutique
-- =========================================
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'FCFA',
    category_id INT NOT NULL,
    sku VARCHAR(100) UNIQUE,
    stock_quantity INT DEFAULT 0,
    stock_status ENUM('in_stock', 'out_of_stock', 'on_backorder') DEFAULT 'in_stock',
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    badge VARCHAR(50) NULL,
    weight DECIMAL(8,2) NULL,
    dimensions VARCHAR(100) NULL,
    images JSON NULL, -- Array of image URLs
    features JSON NULL, -- Array of product features
    specifications JSON NULL, -- Technical specifications
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_slug (slug),
    INDEX idx_category (category_id),
    INDEX idx_featured (is_featured),
    INDEX idx_active (is_active),
    INDEX idx_price (price)
);

-- =========================================
-- TABLE: articles
-- Articles du blog
-- =========================================
CREATE TABLE articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content LONGTEXT,
    category_id INT NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255),
    author_bio TEXT,
    featured_image VARCHAR(500),
    read_time INT, -- in minutes
    tags JSON NULL, -- Array of tags
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_slug (slug),
    INDEX idx_category (category_id),
    INDEX idx_featured (is_featured),
    INDEX idx_published (is_published),
    INDEX idx_published_at (published_at)
);

-- =========================================
-- TABLE: services
-- Services proposés
-- =========================================
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    category_id INT NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(20),
    bg_color VARCHAR(20),
    features JSON NULL, -- Array of service features
    pricing JSON NULL, -- Pricing tiers or options
    delivery_time VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_slug (slug),
    INDEX idx_category (category_id),
    INDEX idx_active (is_active)
);

-- =========================================
-- TABLE: quote_requests
-- Demandes de devis
-- =========================================
CREATE TABLE quote_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    service_id INT NULL,
    project_type VARCHAR(100),
    budget VARCHAR(100),
    timeline VARCHAR(100),
    description TEXT,
    features JSON NULL, -- Array of requested features
    status ENUM('pending', 'contacted', 'quoted', 'accepted', 'rejected', 'completed') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    assigned_to VARCHAR(100) NULL,
    notes TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (service_id) REFERENCES services(id),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at)
);

-- =========================================
-- TABLE: contacts
-- Messages de contact
-- =========================================
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('general', 'support', 'partnership', 'complaint') DEFAULT 'general',
    status ENUM('new', 'read', 'replied', 'closed') DEFAULT 'new',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    assigned_to VARCHAR(100) NULL,
    notes TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
);

-- =========================================
-- TABLE: newsletter_subscribers
-- Abonnés à la newsletter
-- =========================================
CREATE TABLE newsletter_subscribers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    interests JSON NULL, -- Array of interests/categories
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL,
    ip_address VARCHAR(45),
    source VARCHAR(100), -- How they subscribed (website, landing page, etc.)

    INDEX idx_email (email),
    INDEX idx_active (is_active),
    INDEX idx_subscribed_at (subscribed_at)
);

-- =========================================
-- TABLE: product_reviews
-- Avis sur les produits
-- =========================================
CREATE TABLE product_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_rating (rating),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured)
);

-- =========================================
-- TABLE: analytics_events
-- Événements analytics (optionnel)
-- =========================================
CREATE TABLE analytics_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_type VARCHAR(100) NOT NULL,
    event_data JSON,
    user_id VARCHAR(100) NULL, -- For future user system
    session_id VARCHAR(255),
    page_url VARCHAR(500),
    referrer VARCHAR(500),
    user_agent TEXT,
    ip_address VARCHAR(45),
    country VARCHAR(2),
    device_type ENUM('desktop', 'mobile', 'tablet') NULL,
    browser VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_event_type (event_type),
    INDEX idx_session_id (session_id),
    INDEX idx_created_at (created_at),
    INDEX idx_page_url (page_url(255))
);

-- =========================================
-- DONNÉES DE BASE
-- =========================================

-- Insertion des catégories principales
INSERT INTO categories (name, slug, description, type, sort_order) VALUES
('Écrans LED', 'led', 'Écrans LED professionnels et grand format', 'product', 1),
('Horloges Numériques', 'clocks', 'Horloges LED et numériques', 'product', 2),
('Énergie Solaire', 'solar', 'Kits et solutions solaires', 'product', 3),
('Domotique', 'domotics', 'Solutions domotiques et IoT', 'product', 4),
('Solutions IoT', 'iot', 'Objets connectés et capteurs', 'product', 5),
('Innovation', 'innovation', 'Articles sur l\'innovation technologique', 'blog', 1),
('Énergie Solaire', 'solar-blog', 'Articles sur l\'énergie solaire', 'blog', 2),
('Domotique', 'domotics-blog', 'Articles sur la domotique', 'blog', 3),
('IoT', 'iot-blog', 'Articles sur l\'internet des objets', 'blog', 4),
('Affichage LED', 'led-blog', 'Articles sur les écrans LED', 'blog', 5),
('Engineering', 'engineering', 'Services d\'ingénierie et conseil', 'service', 1),
('Domotique', 'domotics-service', 'Installation et configuration domotique', 'service', 2),
('Affichage', 'display', 'Installation d\'écrans LED', 'service', 3);

-- Services principaux (slugs utilisés par /engineering, /domotics, /display)
-- Pour une base déjà créée : exécuter backend/scripts/seed-services.sql
INSERT INTO services (name, slug, short_description, description, category_id, icon, color, bg_color, features, sort_order)
SELECT 'Ingénierie', 'engineering', 'Conseil en innovation, objets connectés et solutions IoT.',
  'Conseil stratégique en innovation, conception d''objets connectés et développement de solutions IoT pour transformer votre activité.',
  id, 'cpu', 'blue-500', 'blue-500/10',
  JSON_ARRAY('Conseil stratégie innovation', 'Conception d''objets connectés', 'Développement IoT', 'Intégration systèmes'), 1
FROM categories WHERE slug = 'engineering';

INSERT INTO services (name, slug, short_description, description, category_id, icon, color, bg_color, features, sort_order)
SELECT 'Domotique & Énergie', 'domotics-service', 'Habitat intelligent, énergie solaire et sécurité connectée.',
  'Solutions complètes pour automatiser votre habitat : énergie solaire, gestion énergétique et sécurité connectée pour un confort optimal.',
  id, 'home', 'emerald-500', 'emerald-500/10',
  JSON_ARRAY('Éclairage intelligent', 'Énergie solaire', 'Gestion énergétique', 'Contrôle d''accès'), 2
FROM categories WHERE slug = 'domotics-service';

INSERT INTO services (name, slug, short_description, description, category_id, icon, color, bg_color, features, sort_order)
SELECT 'Affichage', 'display', 'Écrans LED géants, enseignes dynamiques et affichage numérique.',
  'Conception et installation d''écrans LED géants, enseignes dynamiques et systèmes d''affichage numérique pour maximiser votre visibilité.',
  id, 'monitor', 'orange-500', 'orange-500/10',
  JSON_ARRAY('Écrans LED géants', 'Horloges LED', 'Écrans informatifs', 'Installation et maintenance'), 3
FROM categories WHERE slug = 'display';

-- =========================================
-- VUES UTILES
-- =========================================

-- Vue des produits actifs avec catégorie
CREATE VIEW active_products AS
SELECT
    p.*,
    c.name as category_name,
    c.slug as category_slug
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.is_active = TRUE AND c.is_active = TRUE;

-- Vue des articles publiés avec catégorie
CREATE VIEW published_articles AS
SELECT
    a.*,
    c.name as category_name,
    c.slug as category_slug
FROM articles a
JOIN categories c ON a.category_id = c.id
WHERE a.is_published = TRUE AND c.is_active = TRUE
ORDER BY a.published_at DESC;

-- Vue des services actifs
CREATE VIEW active_services AS
SELECT * FROM services
WHERE is_active = TRUE
ORDER BY sort_order ASC;

-- =========================================
-- TRIGGERS POUR MAINTIEN DES DONNÉES
-- =========================================

-- Trigger pour mettre à jour le nombre d'avis et la note moyenne des produits
DELIMITER //
CREATE TRIGGER update_product_rating AFTER INSERT ON product_reviews
FOR EACH ROW
BEGIN
    UPDATE products
    SET
        review_count = (SELECT COUNT(*) FROM product_reviews WHERE product_id = NEW.product_id AND status = 'approved'),
        rating = (SELECT AVG(rating) FROM product_reviews WHERE product_id = NEW.product_id AND status = 'approved')
    WHERE id = NEW.product_id;
END;
//
DELIMITER ;

-- =========================================
-- INDEXES SUPPLÉMENTAIRES POUR PERFORMANCES
-- =========================================

-- Indexes composites pour les recherches fréquentes
CREATE INDEX idx_products_category_price ON products (category_id, price);
CREATE INDEX idx_products_featured_rating ON products (is_featured, rating DESC);
CREATE INDEX idx_articles_category_featured ON articles (category_id, is_featured, published_at DESC);
CREATE INDEX idx_quote_requests_status_date ON quote_requests (status, created_at);
CREATE INDEX idx_contacts_status_date ON contacts (status, created_at);

-- =========================================
-- CONTRAINTES D'INTÉGRITÉ
-- =========================================

-- Contrainte pour s'assurer que les prix sont positifs
ALTER TABLE products ADD CONSTRAINT chk_positive_price CHECK (price > 0);

-- Contrainte pour les notes d'avis
ALTER TABLE product_reviews ADD CONSTRAINT chk_rating_range CHECK (rating >= 1 AND rating <= 5);

-- Contrainte pour les emails
ALTER TABLE quote_requests ADD CONSTRAINT chk_email_format CHECK (email REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
ALTER TABLE contacts ADD CONSTRAINT chk_contact_email_format CHECK (email REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
ALTER TABLE newsletter_subscribers ADD CONSTRAINT chk_subscriber_email_format CHECK (email REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');