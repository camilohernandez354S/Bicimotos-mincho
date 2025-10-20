const express = require('express');
const router = express.Router();

// Importar controladores
const productsController = require('../controllers/productsController');
const categoriesController = require('../controllers/categoriesController');
const contactController = require('../controllers/contactController');

// ========== RUTAS DE PRODUCTOS (PÚBLICAS) ==========

// Obtener todos los productos con filtros
router.get('/products', productsController.getProducts);

// Obtener producto por ID
router.get('/products/:id', productsController.getProductById);

// Obtener productos destacados
router.get('/products/featured/list', productsController.getFeaturedProducts);

// Obtener productos relacionados
router.get('/products/:id/related', productsController.getRelatedProducts);

// ========== RUTAS DE CATEGORÍAS (PÚBLICAS) ==========

// Obtener todas las categorías
router.get('/categories', categoriesController.getCategories);

// Obtener categoría por ID
router.get('/categories/:id', categoriesController.getCategoryById);

// Obtener categorías principales
router.get('/categories/main/list', categoriesController.getMainCategories);

// Obtener subcategorías
router.get('/categories/:parentId/subcategories', categoriesController.getSubcategories);

// ========== RUTAS DE CONTACTO (PÚBLICAS) ==========

// Enviar mensaje de contacto
router.post('/contact', contactController.createMessage);

// ========== RUTAS DE INFORMACIÓN GENERAL (PÚBLICAS) ==========

// Información de la empresa
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Bicimotos Mincho',
      description: 'Tu tienda especializada en componentes de bicicletas',
      email: 'info@bicimotosmincho.com',
      phone: '+57 300 123 4567',
      address: 'Calle 123 #45-67, Bogotá, Colombia',
      hours: {
        monday: '9:00 AM - 6:00 PM',
        tuesday: '9:00 AM - 6:00 PM',
        wednesday: '9:00 AM - 6:00 PM',
        thursday: '9:00 AM - 6:00 PM',
        friday: '9:00 AM - 6:00 PM',
        saturday: '9:00 AM - 4:00 PM',
        sunday: 'Cerrado'
      },
      social: {
        facebook: 'https://facebook.com/bicimotosmincho',
        instagram: 'https://instagram.com/bicimotosmincho',
        whatsapp: 'https://wa.me/573001234567'
      }
    }
  });
});

// Configuración del sitio
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      currency: 'COP',
      currencySymbol: '$',
      taxRate: 0.19,
      shippingCost: 15000,
      freeShippingThreshold: 200000,
      maxImageSize: 5242880, // 5MB
      allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
      pagination: {
        defaultLimit: 12,
        maxLimit: 50
      },
      search: {
        minQueryLength: 2,
        maxResults: 100
      }
    }
  });
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;
