const express = require('express');
const router = express.Router();

// Importar controladores
const authController = require('../controllers/authController');
const productsController = require('../controllers/productsController');
const categoriesController = require('../controllers/categoriesController');
const contactController = require('../controllers/contactController');

// Importar middlewares
const { verifyAdmin, requireSuperAdmin, logAccess, adminRateLimit } = require('../middlewares/verifyAdmin');

// Aplicar middleware de logging a todas las rutas admin
router.use(logAccess);

// Aplicar rate limiting a todas las rutas admin
router.use(adminRateLimit(200, 15 * 60 * 1000)); // 200 requests por 15 minutos

// ========== RUTAS DE AUTENTICACIÓN ==========

// Login del administrador
router.post('/login', authController.login);

// Verificar token
router.get('/verify', authController.verifyToken);

// Logout
router.post('/logout', authController.logout);

// Obtener perfil del admin
router.get('/profile', verifyAdmin, authController.getProfile);

// Actualizar perfil del admin
router.put('/profile', verifyAdmin, authController.updateProfile);

// Cambiar contraseña
router.put('/change-password', verifyAdmin, authController.changePassword);

// ========== RUTAS DE PRODUCTOS (ADMIN) ==========

// Obtener todos los productos (con filtros admin)
router.get('/products', verifyAdmin, productsController.getAllProducts);

// Crear producto
router.post('/products', verifyAdmin, productsController.createProduct);

// Actualizar producto
router.put('/products/:id', verifyAdmin, productsController.updateProduct);

// Eliminar producto
router.delete('/products/:id', verifyAdmin, productsController.deleteProduct);

// Obtener estadísticas de productos
router.get('/products/stats', verifyAdmin, productsController.getProductStats);

// ========== RUTAS DE CATEGORÍAS (ADMIN) ==========

// Obtener todas las categorías (con filtros admin)
router.get('/categories', verifyAdmin, categoriesController.getAllCategories);

// Crear categoría
router.post('/categories', verifyAdmin, categoriesController.createCategory);

// Actualizar categoría
router.put('/categories/:id', verifyAdmin, categoriesController.updateCategory);

// Eliminar categoría
router.delete('/categories/:id', verifyAdmin, categoriesController.deleteCategory);

// Obtener estadísticas de categorías
router.get('/categories/stats', verifyAdmin, categoriesController.getCategoryStats);

// ========== RUTAS DE MENSAJES DE CONTACTO (ADMIN) ==========

// Obtener todos los mensajes
router.get('/messages', verifyAdmin, contactController.getAllMessages);

// Obtener mensaje por ID
router.get('/messages/:id', verifyAdmin, contactController.getMessageById);

// Marcar mensaje como leído
router.put('/messages/:id/read', verifyAdmin, contactController.markAsRead);

// Responder mensaje
router.post('/messages/:id/reply', verifyAdmin, contactController.replyToMessage);

// Cerrar mensaje
router.put('/messages/:id/close', verifyAdmin, contactController.closeMessage);

// Agregar nota a mensaje
router.post('/messages/:id/notes', verifyAdmin, contactController.addNote);

// Eliminar mensaje
router.delete('/messages/:id', verifyAdmin, contactController.deleteMessage);

// Obtener estadísticas de mensajes
router.get('/messages/stats', verifyAdmin, contactController.getMessageStats);

// ========== RUTAS DE DASHBOARD ==========

// Dashboard principal
router.get('/dashboard', verifyAdmin, async (req, res) => {
  try {
    const Product = require('../models/Product');
    const Category = require('../models/Category');
    const ContactMessage = require('../models/ContactMessage');

    // Estadísticas generales
    const [
      totalProducts,
      activeProducts,
      totalCategories,
      totalMessages,
      newMessages,
      lowStockProducts
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Category.countDocuments({ isActive: true }),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: 'new' }),
      Product.countDocuments({ stock: { $lte: 5 } })
    ]);

    // Productos más vendidos
    const topSellingProducts = await Product.find()
      .sort({ sales: -1 })
      .limit(5)
      .select('name sales price');

    // Productos más vistos
    const mostViewedProducts = await Product.find()
      .sort({ views: -1 })
      .limit(5)
      .select('name views price');

    // Mensajes recientes
    const recentMessages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject status createdAt');

    // Estadísticas por mes (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Product.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          activeProducts,
          totalCategories,
          totalMessages,
          newMessages,
          lowStockProducts
        },
        topSellingProducts,
        mostViewedProducts,
        recentMessages,
        monthlyStats
      }
    });

  } catch (error) {
    console.error('Error obteniendo dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// ========== RUTAS DE CONFIGURACIÓN (SUPER ADMIN) ==========

// Obtener configuración del sistema
router.get('/config', requireSuperAdmin, (req, res) => {
  res.json({
    success: true,
    data: {
      appName: 'Bicimotos Mincho',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      features: {
        userRegistration: false,
        userLogin: false,
        adminPanel: true,
        productManagement: true,
        categoryManagement: true,
        contactMessages: true
      },
      limits: {
        maxProducts: 1000,
        maxCategories: 100,
        maxImageSize: 5242880,
        maxFileUploads: 10
      }
    }
  });
});

// Actualizar configuración del sistema
router.put('/config', requireSuperAdmin, (req, res) => {
  // Aquí se implementaría la lógica para actualizar configuración
  res.json({
    success: true,
    message: 'Configuración actualizada exitosamente'
  });
});

module.exports = router;
