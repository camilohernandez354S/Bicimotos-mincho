const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middlewares/verifyAdmin');
const messagesController = require('../controllers/messagesController');

// Todas las rutas requieren autenticación de admin
router.use(verifyAdmin);

// Ruta: GET /api/admin/mensajes
router.get('/', messagesController.getAllMessages);

// Ruta: GET /api/admin/mensajes/:id
router.get('/:id', messagesController.getMessageById);

// Ruta: PATCH /api/admin/mensajes/:id/read
router.patch('/:id/read', messagesController.markAsRead);

// Ruta: DELETE /api/admin/mensajes/:id
router.delete('/:id', messagesController.deleteMessage);

// Ruta: GET /api/admin/mensajes/count/unread
router.get('/count/unread', messagesController.getUnreadCount);

module.exports = router;

