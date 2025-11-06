const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middlewares/verifyAdmin');
const messagesController = require('../controllers/messagesController');

console.log('✅ RUTA /api/admin/mensajes registrada');

// Todas las rutas requieren autenticación de admin
router.use(verifyAdmin);

// ⚠️ IMPORTANTE: Las rutas específicas deben ir ANTES que las rutas con parámetros dinámicos
// Ruta: GET /api/admin/mensajes/count/unread
router.get('/count/unread', messagesController.getUnreadCount);

// Ruta: GET /api/admin/mensajes
router.get('/', (req, res, next) => {
  console.log('📩 Entrando a GET /api/admin/mensajes');
  next();
}, messagesController.getAllMessages);

// LUEGO las rutas con parámetros dinámicos
// Ruta: GET /api/admin/mensajes/:id
router.get('/:id', messagesController.getMessageById);

// Ruta: PATCH /api/admin/mensajes/:id/read
router.patch('/:id/read', messagesController.markAsRead);

// Ruta: DELETE /api/admin/mensajes/:id
router.delete('/:id', messagesController.deleteMessage);

module.exports = router;

