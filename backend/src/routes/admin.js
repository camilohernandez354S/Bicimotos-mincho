const express = require('express');
const router = express.Router();

// Importar controladores
const authController = require('../controllers/authController');

// Importar middleware
const verifyAdmin = require('../middlewares/verifyAdmin');

// ========== RUTAS DE AUTENTICACIÓN ==========

// Login del administrador (pública)
router.post('/login', authController.login);

// Verificar token
router.get('/verify', authController.verifyToken);

// Logout
router.post('/logout', authController.logout);

// Obtener perfil del admin (protegida)
router.get('/profile', verifyAdmin, authController.getProfile);

// Actualizar perfil del admin (protegida)
router.put('/profile', verifyAdmin, authController.updateProfile);

// Cambiar contraseña (protegida)
router.put('/change-password', verifyAdmin, authController.changePassword);

// ========== RUTAS DE DASHBOARD ==========

// Dashboard principal - MOVIDO A adminDashboardRoutes.js
// Esta ruta está deshabilitada porque ahora se maneja en adminDashboardRoutes.js
// router.get('/dashboard', verifyAdmin, async (req, res) => {
//   ...
// });

module.exports = router;