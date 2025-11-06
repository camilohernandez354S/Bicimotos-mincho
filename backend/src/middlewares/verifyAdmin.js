const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

// Middleware para verificar token JWT del admin
const verifyAdmin = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    // Verificar formato "Bearer token"
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido'
      });
    }

    // Verificar y decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mincho_secret_key');

    // Buscar admin en la base de datos
    const admin = await AdminUser.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido - Usuario no encontrado'
      });
    }

    // Agregar datos del admin al request
    req.admin = {
      id: admin.id,
      email: admin.email
    };

    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    console.error('Error verificando token:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = verifyAdmin;