const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Configuración de seguridad
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por IP
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
});
app.use('/api/', limiter);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Crear directorio de datos si no existe
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Inicializar datos de ejemplo
const initializeData = () => {
  const usersFile = path.join(dataDir, 'users.json');
  const productsFile = path.join(dataDir, 'products.json');
  const categoriesFile = path.join(dataDir, 'categories.json');
  const ordersFile = path.join(dataDir, 'orders.json');

  // Crear archivos si no existen
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
  }
  
  if (!fs.existsSync(productsFile)) {
    const sampleProducts = [
      {
        id: 1,
        name: 'Transmisión Shimano XT M8100',
        description: 'Grupo de transmisión de alta gama para mountain bike con cambio de 12 velocidades',
        price: 1200000,
        original_price: 1500000,
        category_id: 1,
        brand: 'Shimano',
        model: 'XT M8100',
        sku: 'SH-XT-M8100-12S',
        images: [
          {
            url: 'https://via.placeholder.com/400x300',
            alt: 'Transmisión Shimano XT',
            isPrimary: true
          }
        ],
        stock: 5,
        specifications: {
          weight: '2.1 kg',
          material: 'Aluminio y acero',
          compatibility: 'Mountain Bike',
          warranty: '2 años'
        },
        features: ['12 velocidades', 'Cambio hidráulico', 'Resistente al agua'],
        is_active: true,
        is_featured: true,
        tags: ['mountain', '12v', 'hidráulico'],
        average_rating: 4.8,
        total_reviews: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Kit Frenos Hidráulicos Shimano Deore',
        description: 'Sistema de frenado hidráulico de alta calidad para mountain bike',
        price: 850000,
        original_price: 1000000,
        category_id: 2,
        brand: 'Shimano',
        model: 'Deore BR-M6120',
        sku: 'SH-DEORE-BR-M6120',
        images: [
          {
            url: 'https://via.placeholder.com/400x300',
            alt: 'Frenos Shimano Deore',
            isPrimary: true
          }
        ],
        stock: 8,
        specifications: {
          weight: '450g',
          material: 'Aluminio',
          compatibility: 'Mountain Bike',
          warranty: '2 años'
        },
        features: ['Frenado potente', 'Resistente al agua', 'Fácil mantenimiento'],
        is_active: true,
        is_featured: true,
        tags: ['hidráulico', 'mountain', 'potente'],
        average_rating: 4.6,
        total_reviews: 12,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Ruedas Shimano Deore XT',
        description: 'Juego de ruedas de alta calidad para mountain bike',
        price: 1500000,
        original_price: 1800000,
        category_id: 3,
        brand: 'Shimano',
        model: 'Deore XT WH-MT800',
        sku: 'SH-DEORE-WH-MT800',
        images: [
          {
            url: 'https://via.placeholder.com/400x300',
            alt: 'Ruedas Shimano Deore XT',
            isPrimary: true
          }
        ],
        stock: 3,
        specifications: {
          weight: '1.8 kg',
          material: 'Aluminio',
          compatibility: 'Mountain Bike',
          warranty: '2 años'
        },
        features: ['Ligeras', 'Resistentes', 'Buena aerodinámica'],
        is_active: true,
        is_featured: true,
        tags: ['ligeras', 'resistentes', 'mountain'],
        average_rating: 4.9,
        total_reviews: 8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    fs.writeFileSync(productsFile, JSON.stringify(sampleProducts, null, 2));
  }

  if (!fs.existsSync(categoriesFile)) {
    const sampleCategories = [
      {
        id: 1,
        name: 'Transmisiones',
        description: 'Grupos de transmisión completos y componentes individuales',
        slug: 'transmisiones',
        is_active: true,
        sort_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Frenos',
        description: 'Sistemas de frenado hidráulicos y mecánicos',
        slug: 'frenos',
        is_active: true,
        sort_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Ruedas',
        description: 'Ruedas completas, llantas y cubiertas',
        slug: 'ruedas',
        is_active: true,
        sort_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    fs.writeFileSync(categoriesFile, JSON.stringify(sampleCategories, null, 2));
  }

  if (!fs.existsSync(ordersFile)) {
    fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
  }

  console.log('✅ Datos de ejemplo inicializados');
};

// Inicializar datos
initializeData();

// Rutas simples para la API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Bicimotos Mincho API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas de productos
app.get('/api/products', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(path.join(dataDir, 'products.json'), 'utf8'));
    const featured = req.query.featured === 'true';
    
    let filteredProducts = products.filter(p => p.is_active);
    
    if (featured) {
      filteredProducts = filteredProducts.filter(p => p.is_featured);
    }

    res.json({
      success: true,
      data: filteredProducts,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: filteredProducts.length,
        itemsPerPage: filteredProducts.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

app.get('/api/products/featured/list', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(path.join(dataDir, 'products.json'), 'utf8'));
    const featuredProducts = products.filter(p => p.is_active && p.is_featured);
    
    res.json({
      success: true,
      data: featuredProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(path.join(dataDir, 'products.json'), 'utf8'));
    const product = products.find(p => p.id === parseInt(req.params.id) && p.is_active);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Rutas de categorías
app.get('/api/categories', (req, res) => {
  try {
    const categories = JSON.parse(fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf8'));
    const activeCategories = categories.filter(c => c.is_active);
    
    res.json({
      success: true,
      data: activeCategories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Rutas de autenticación básica
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    
    // Validación básica
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son obligatorios' 
      });
    }

    const users = JSON.parse(fs.readFileSync(path.join(dataDir, 'users.json'), 'utf8'));
    
    // Verificar si el usuario ya existe
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ya existe un usuario con este email' 
      });
    }

    const newUser = {
      id: users.length + 1,
      email,
      password, // En producción debería estar hasheado
      first_name,
      last_name,
      role: 'customer',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(newUser);
    fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(users, null, 2));

    // Token simple (en producción usar JWT)
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: { ...newUser, password: undefined },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const users = JSON.parse(fs.readFileSync(path.join(dataDir, 'users.json'), 'utf8'));
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    if (!user.is_active) {
      return res.status(401).json({ 
        success: false, 
        message: 'Cuenta desactivada' 
      });
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: { ...user, password: undefined },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`🌐 API disponible en: http://localhost:${PORT}/api`);
  console.log(`📊 Datos almacenados en: ${dataDir}`);
});

module.exports = app;
