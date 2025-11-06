const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar configuración de base de datos
const db = require('./config/database');
const { ensureDefaultAdmin } = require('./controllers/authController');

const app = express();

// Configuración de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());

// Rate limiting general
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // límite de 200 requests por IP
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Crear tablas si no existen
const createTables = async () => {
  try {
    // Usar método manual que es más confiable
    await createTablesManually();
  } catch (error) {
    console.error('❌ Error creando tablas:', error);
    throw error;
  }
};

// Crear tablas manualmente
const createTablesManually = async () => {
  try {
    console.log('📦 Creando tablas en PostgreSQL...');
    
    // 1. Tabla admin_users
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
      console.log('✅ Tabla admin_users creada/verificada');
    } catch (err) {
      if (!err.message.includes('already exists') && !err.message.includes('duplicate')) {
        console.warn('⚠️  admin_users:', err.message);
      }
    }
    
    // 2. Tabla categories (debe crearse antes que products)
    try {
      await db.query(`
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
      `);
      console.log('✅ Tabla categories creada/verificada');
    } catch (err) {
      if (!err.message.includes('already exists') && !err.message.includes('duplicate')) {
        console.warn('⚠️  categories:', err.message);
      }
    }
    
    // 3. Tabla products (depende de categories)
    try {
      await db.query(`
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
      `);
      console.log('✅ Tabla products creada/verificada');
    } catch (err) {
      if (!err.message.includes('already exists') && !err.message.includes('duplicate')) {
        console.warn('⚠️  products:', err.message);
      }
    }
    
    // 4. Tabla contact_messages
    try {
      await db.query(`
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
      `);
      console.log('✅ Tabla contact_messages creada/verificada');
    } catch (err) {
      if (!err.message.includes('already exists') && !err.message.includes('duplicate')) {
        console.warn('⚠️  contact_messages:', err.message);
      }
    }
    
    // 5. Crear índices (ignorar errores si ya existen)
    try {
      const indexes = [
        'CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);',
        'CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);',
        'CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);',
        'CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);',
        'CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);',
        'CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);',
        'CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);',
        'CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);',
        'CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);'
      ];
      
      for (const indexQuery of indexes) {
        try {
          await db.query(indexQuery);
        } catch (err) {
          // Ignorar errores de índices que ya existen
          if (!err.message.includes('already exists') && !err.message.includes('duplicate')) {
            // Solo mostrar si es un error real
          }
        }
      }
      console.log('✅ Índices creados/verificados');
    } catch (err) {
      // Ignorar errores de índices
    }
    
    // 6. Crear función para updated_at (si no existe)
    try {
      await db.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';
      `);
      console.log('✅ Función update_updated_at_column creada/verificada');
    } catch (err) {
      console.warn('⚠️  Función update_updated_at:', err.message);
    }
    
    // 7. Crear triggers (si no existen)
    try {
      await db.query(`
        DROP TRIGGER IF EXISTS update_products_updated_at ON products;
        CREATE TRIGGER update_products_updated_at
          BEFORE UPDATE ON products
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `);
      
      await db.query(`
        DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
        CREATE TRIGGER update_categories_updated_at
          BEFORE UPDATE ON categories
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `);
      
      await db.query(`
        DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
        CREATE TRIGGER update_contact_messages_updated_at
          BEFORE UPDATE ON contact_messages
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `);
      console.log('✅ Triggers creados/verificados');
    } catch (err) {
      console.warn('⚠️  Triggers:', err.message);
    }
    
    console.log('✅ Todas las tablas creadas/verificadas exitosamente');
  } catch (error) {
    console.error('❌ Error creando tablas manualmente:', error.message);
    throw error;
  }
};

// Conexión a PostgreSQL
const connectDB = async () => {
  try {
    const connected = await db.connectDB();
    
    if (!connected) {
      console.error('❌ No se pudo conectar a PostgreSQL');
      console.error('💡 Verifica que PostgreSQL esté ejecutándose y las credenciales en .env sean correctas');
      process.exit(1);
    }
    
    // Crear tablas si no existen
    try {
      await createTables();
    } catch (error) {
      console.error('❌ Error creando tablas:', error.message);
      // Continuar aunque haya errores en algunas tablas
    }
    
    // Crear admin por defecto
    try {
      await ensureDefaultAdmin();
    } catch (error) {
      console.error('❌ Error creando admin por defecto:', error.message);
      // Continuar aunque falle la creación del admin
    }
    
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error.message);
    process.exit(1);
  }
};

// Inicializar base de datos
connectDB();

// Importar rutas
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

// Rutas públicas
app.use('/api', publicRoutes);

// Rutas privadas (admin)
app.use('/api/admin', adminRoutes);

// Ruta de prueba
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await db.getConnectionStatus();
    res.json({ 
      success: true,
      message: 'Bicimotos Mincho API funcionando correctamente',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus
    });
  } catch (error) {
    res.json({ 
      success: true,
      message: 'Bicimotos Mincho API funcionando correctamente',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: { state: 'error', error: error.message }
    });
  }
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenido a la API de Bicimotos Mincho',
    version: '1.0.0',
    endpoints: {
      public: '/api',
      admin: '/api/admin',
      health: '/api/health'
    }
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Error de validación de PostgreSQL
  if (err.code === '23505') { // Violación de restricción única
    return res.status(400).json({
      success: false,
      message: 'El registro ya existe'
    });
  }

  if (err.code === '23503') { // Violación de clave foránea
    return res.status(400).json({
      success: false,
      message: 'Referencia inválida'
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado'
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Ruta no encontrada' 
  });
});

// Manejo de señales para cierre graceful
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM recibido, cerrando servidor...');
  await db.disconnectDB();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT recibido, cerrando servidor...');
  await db.disconnectDB();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`🌐 API pública: http://localhost:${PORT}/api`);
  console.log(`🔐 API admin: http://localhost:${PORT}/api/admin`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;