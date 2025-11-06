const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middlewares/verifyAdmin');
const ordersController = require('../controllers/ordersController');

console.log('✅ RUTA /api/admin/ordenes registrada');

// Todas las rutas requieren autenticación de admin
router.use(verifyAdmin);

// ⚠️ IMPORTANTE: Las rutas específicas deben ir ANTES que las rutas con parámetros dinámicos
// Ruta: GET /api/admin/ordenes/count/pending
router.get('/count/pending', ordersController.getPendingCount);

// Ruta: GET /api/admin/ordenes
router.get('/', (req, res, next) => {
  console.log('📦 Entrando a GET /api/admin/ordenes');
  next();
}, ordersController.getAllOrders);

// LUEGO las rutas con parámetros dinámicos
// Ruta: GET /api/admin/ordenes/:id
router.get('/:id', ordersController.getOrderDetails);

// Ruta: PATCH /api/admin/ordenes/:id/status
router.patch('/:id/status', ordersController.updateOrderStatus);

// Ruta: DELETE /api/admin/ordenes/:id
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;

