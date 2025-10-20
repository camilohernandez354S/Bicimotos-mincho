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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar admin en la base de datos
    const admin = await AdminUser.findById(decoded.adminId).select('-password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido - Usuario no encontrado'
      });
    }

    // Verificar que el admin esté activo
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada'
      });
    }

    // Verificar que la cuenta no esté bloqueada
    if (admin.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Cuenta bloqueada temporalmente'
      });
    }

    // Agregar datos del admin al request
    req.admin = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
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

// Middleware opcional para verificar token (no falla si no hay token)
const optionalVerifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      req.admin = null;
      return next();
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      req.admin = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminUser.findById(decoded.adminId).select('-password');

    if (admin && admin.isActive && !admin.isLocked) {
      req.admin = {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      };
    } else {
      req.admin = null;
    }

    next();

  } catch (error) {
    // En caso de error, simplemente continuar sin admin
    req.admin = null;
    next();
  }
};

// Middleware para verificar rol específico
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado'
      });
    }

    const userRole = req.admin.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes'
      });
    }

    next();
  };
};

// Middleware para verificar super admin
const requireSuperAdmin = (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: 'Acceso no autorizado'
    });
  }

  if (req.admin.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Se requieren permisos de super administrador'
    });
  }

  next();
};

// Middleware para logging de acceso
const logAccess = (req, res, next) => {
  if (req.admin) {
    console.log(`🔐 Admin access: ${req.admin.name} (${req.admin.email}) - ${req.method} ${req.originalUrl}`);
  }
  next();
};

// Middleware para rate limiting por admin
const adminRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    if (!req.admin) {
      return next();
    }

    const adminId = req.admin.id;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Limpiar requests antiguos
    if (requests.has(adminId)) {
      const adminRequests = requests.get(adminId);
      const validRequests = adminRequests.filter(time => time > windowStart);
      requests.set(adminId, validRequests);
    }

    // Verificar límite
    const adminRequests = requests.get(adminId) || [];
    if (adminRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Demasiadas solicitudes. Intenta más tarde.'
      });
    }

    // Agregar request actual
    adminRequests.push(now);
    requests.set(adminId, adminRequests);

    next();
  };
};

module.exports = {
  verifyAdmin,
  optionalVerifyAdmin,
  requireRole,
  requireSuperAdmin,
  logAccess,
  adminRateLimit
};
