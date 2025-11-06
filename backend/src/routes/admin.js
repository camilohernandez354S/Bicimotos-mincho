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

// Dashboard principal (protegida)
router.get('/dashboard', verifyAdmin, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Bienvenido al Dashboard del Administrador',
      data: {
        admin: req.admin,
        stats: {
          totalProducts: 0,
          activeProducts: 0,
          totalCategories: 0,
          totalMessages: 0
        }
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

module.exports = router;