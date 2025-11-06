const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middlewares/verifyAdmin');
const adminDashboardController = require('../controllers/adminDashboardController');

// Middleware de logging para debug
router.use((req, res, next) => {
  console.log('🔍 Ruta dashboard - Método:', req.method, 'Path:', req.path);
  next();
});

// Todas las rutas requieren autenticación de admin
router.use(verifyAdmin);

// Middleware de logging después de autenticación
router.use((req, res, next) => {
  console.log('✅ Autenticación exitosa para dashboard');
  next();
});

// Ruta: GET /api/admin/dashboard
router.get('/', (req, res, next) => {
  console.log('📥 Llegó petición GET a /api/admin/dashboard');
  // Agregar headers para evitar caché
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
}, adminDashboardController.getDashboardStats);

module.exports = router;

