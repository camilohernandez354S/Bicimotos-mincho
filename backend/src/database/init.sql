-- Script SQL para crear las tablas en PostgreSQL
-- Ejecuta este script en tu base de datos PostgreSQL antes de iniciar el servidor

-- ============================================
-- TABLA: admin_users
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

COMMENT ON TABLE admin_users IS 'Tabla de usuarios administradores del sistema';
COMMENT ON COLUMN admin_users.id IS 'ID único del administrador';
COMMENT ON COLUMN admin_users.email IS 'Email único del administrador';
COMMENT ON COLUMN admin_users.password IS 'Contraseña encriptada con bcrypt';
COMMENT ON COLUMN admin_users.created_at IS 'Fecha de creación del registro';

-- ============================================
-- TABLA: categories
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

COMMENT ON TABLE categories IS 'Tabla de categorías de productos';
COMMENT ON COLUMN categories.id IS 'ID único de la categoría';
COMMENT ON COLUMN categories.name IS 'Nombre de la categoría';
COMMENT ON COLUMN categories.slug IS 'Slug único para URLs amigables';
COMMENT ON COLUMN categories.description IS 'Descripción de la categoría';
COMMENT ON COLUMN categories.is_active IS 'Indica si la categoría está activa';

-- ============================================
-- TABLA: products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  original_price NUMERIC(10,2) CHECK (original_price >= 0),
  stock INT DEFAULT 0 CHECK (stock >= 0),
  sku VARCHAR(100) UNIQUE NOT NULL,
  brand VARCHAR(100),
  model VARCHAR(100),
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  images JSONB DEFAULT '[]',
  specifications JSONB DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0 CHECK (views >= 0),
  sales INT DEFAULT 0 CHECK (sales >= 0),
  rating_average NUMERIC(3,2) DEFAULT 0 CHECK (rating_average >= 0 AND rating_average <= 5),
  rating_count INT DEFAULT 0 CHECK (rating_count >= 0),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('spanish', name));
CREATE INDEX IF NOT EXISTS idx_products_description ON products USING gin(to_tsvector('spanish', description));

-- Comentarios en la tabla
COMMENT ON TABLE products IS 'Tabla de productos de la tienda';
COMMENT ON COLUMN products.id IS 'ID único del producto';
COMMENT ON COLUMN products.name IS 'Nombre del producto';
COMMENT ON COLUMN products.description IS 'Descripción detallada del producto';
COMMENT ON COLUMN products.price IS 'Precio actual del producto';
COMMENT ON COLUMN products.original_price IS 'Precio original (antes del descuento)';
COMMENT ON COLUMN products.stock IS 'Cantidad disponible en stock';
COMMENT ON COLUMN products.sku IS 'Código SKU único del producto';
COMMENT ON COLUMN products.brand IS 'Marca del producto';
COMMENT ON COLUMN products.model IS 'Modelo del producto';
COMMENT ON COLUMN products.category_id IS 'ID de la categoría (FK a categories)';
COMMENT ON COLUMN products.image_url IS 'URL de la imagen principal';
COMMENT ON COLUMN products.images IS 'Array JSON con todas las imágenes del producto';
COMMENT ON COLUMN products.specifications IS 'JSON con especificaciones técnicas';
COMMENT ON COLUMN products.features IS 'Array de características destacadas';
COMMENT ON COLUMN products.tags IS 'Array de etiquetas para búsqueda';
COMMENT ON COLUMN products.is_active IS 'Indica si el producto está activo';
COMMENT ON COLUMN products.is_featured IS 'Indica si el producto está destacado';
COMMENT ON COLUMN products.views IS 'Contador de visualizaciones';
COMMENT ON COLUMN products.sales IS 'Contador de ventas';
COMMENT ON COLUMN products.rating_average IS 'Promedio de calificaciones (0-5)';
COMMENT ON COLUMN products.rating_count IS 'Cantidad de calificaciones recibidas';

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en products
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en categories
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLA: contact_messages
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  ip_address VARCHAR(45),
  user_agent TEXT,
  assigned_to INT REFERENCES admin_users(id) ON DELETE SET NULL,
  reply_message TEXT,
  replied_by INT REFERENCES admin_users(id) ON DELETE SET NULL,
  replied_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_priority ON contact_messages(priority);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

COMMENT ON TABLE contact_messages IS 'Tabla de mensajes de contacto';
COMMENT ON COLUMN contact_messages.id IS 'ID único del mensaje';
COMMENT ON COLUMN contact_messages.name IS 'Nombre del remitente';
COMMENT ON COLUMN contact_messages.email IS 'Email del remitente';
COMMENT ON COLUMN contact_messages.status IS 'Estado del mensaje: new, read, replied, closed';
COMMENT ON COLUMN contact_messages.priority IS 'Prioridad del mensaje: low, medium, high, urgent';

-- Trigger para actualizar updated_at en contact_messages
DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
