const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

// Generar token JWT
const generateToken = (adminId, email) => {
  return jwt.sign(
    { id: adminId, email: email },
    process.env.JWT_SECRET || 'mincho_secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
};

// Login del administrador
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar datos de entrada
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar admin por email
    const admin = await AdminUser.findByEmail(email);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await AdminUser.validatePassword(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generateToken(admin.id, admin.email);

    // Datos del admin para enviar (sin contraseña)
    const adminData = {
      id: admin.id,
      email: admin.email,
      createdAt: admin.created_at
    };

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      token,
      admin: adminData
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear admin por defecto si no existe
exports.ensureDefaultAdmin = async () => {
  try {
    await AdminUser.createDefaultAdmin();
  } catch (error) {
    console.error('Error creando admin por defecto:', error);
  }
};

// Verificar token y obtener datos del admin
exports.verifyToken = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mincho_secret_key');
    
    // Buscar admin
    const admin = await AdminUser.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        createdAt: admin.created_at
      }
    });

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

// Logout (opcional, ya que JWT es stateless)
exports.logout = async (req, res) => {
  try {
    // En un sistema JWT stateless, el logout se maneja en el frontend
    // eliminando el token del localStorage
    res.status(200).json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual y nueva contraseña son requeridas'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Buscar admin
    const admin = await AdminUser.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await AdminUser.validatePassword(currentPassword, admin.password);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña
    await AdminUser.updatePassword(adminId, newPassword);

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener perfil del admin
exports.getProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const admin = await AdminUser.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        createdAt: admin.created_at
      }
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar perfil del admin
exports.updateProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El email es requerido'
      });
    }

    const db = require('../config/database');
    const query = 'UPDATE admin_users SET email = $1 WHERE id = $2 RETURNING id, email, created_at';
    const result = await db.query(query, [email.toLowerCase(), adminId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Administrador no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      admin: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        createdAt: result.rows[0].created_at
      }
    });

  } catch (error) {
    if (error.code === '23505') { // Código de violación de restricción única en PostgreSQL
      return res.status(400).json({
        success: false,
        message: 'El email ya está en uso'
      });
    }

    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};