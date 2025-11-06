const db = require('../config/database');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

/**
 * Obtener configuración actual del administrador
 */
exports.getAdminConfig = async (req, res) => {
  console.log('⚙️ Obteniendo configuración del administrador...');
  try {
    // Obtener el admin actual desde el token
    const adminId = req.admin?.id || 1; // Fallback a ID 1 si no está en el token
    
    // Verificar si existen las columnas name y logo_path
    let result;
    try {
      result = await db.query(
        'SELECT id, email, name, logo_path, created_at, updated_at FROM admin_users WHERE id = $1',
        [adminId]
      );
    } catch (error) {
      // Si las columnas no existen, usar solo email
      result = await db.query(
        'SELECT id, email, created_at, updated_at FROM admin_users WHERE id = $1',
        [adminId]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No se encontró usuario administrador' 
      });
    }

    const admin = result.rows[0];
    
    // Asegurar que name y logo_path existan
    if (!admin.name) admin.name = '';
    if (!admin.logo_path) admin.logo_path = '';

    console.log(`✅ getAdminConfig: Configuración obtenida para admin ID ${adminId}`);
    res.status(200).json({ 
      success: true, 
      data: admin 
    });
  } catch (error) {
    console.error('❌ Error en getAdminConfig:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener configuración',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Actualizar información básica del administrador (nombre, email)
 */
exports.updateAdminConfig = async (req, res) => {
  console.log('📝 Actualizando configuración básica del admin...');
  try {
    const adminId = req.admin?.id || 1;
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'El correo electrónico es requerido' 
      });
    }

    // Verificar si existe la columna name
    let result;
    try {
      // Intentar actualizar con name
      result = await db.query(
        'UPDATE admin_users SET email = $1, name = $2, updated_at = NOW() WHERE id = $3 RETURNING id, email, name, logo_path, updated_at',
        [email.toLowerCase(), name || '', adminId]
      );
    } catch (error) {
      // Si name no existe, solo actualizar email
      result = await db.query(
        'UPDATE admin_users SET email = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, updated_at',
        [email.toLowerCase(), adminId]
      );
      result.rows[0].name = name || '';
      result.rows[0].logo_path = '';
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin no encontrado' 
      });
    }

    console.log(`✅ updateAdminConfig: Configuración actualizada para admin ID ${adminId}`);
    res.status(200).json({ 
      success: true, 
      message: 'Configuración actualizada correctamente',
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('❌ Error en updateAdminConfig:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar configuración',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Actualizar contraseña del administrador
 */
exports.updatePassword = async (req, res) => {
  console.log('🔐 Actualizando contraseña del admin...');
  try {
    const adminId = req.admin?.id || 1;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'La contraseña actual y la nueva contraseña son requeridas' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'La nueva contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Obtener el admin actual
    const userResult = await db.query(
      'SELECT id, password FROM admin_users WHERE id = $1',
      [adminId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Admin no encontrado' 
      });
    }

    // Verificar contraseña actual
    const valid = await bcrypt.compare(currentPassword, userResult.rows[0].password);
    if (!valid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Contraseña actual incorrecta' 
      });
    }

    // Hashear nueva contraseña
    const hashed = await bcrypt.hash(newPassword, 10);
    
    // Actualizar contraseña
    await db.query(
      'UPDATE admin_users SET password = $1, updated_at = NOW() WHERE id = $2',
      [hashed, adminId]
    );

    console.log(`✅ updatePassword: Contraseña actualizada para admin ID ${adminId}`);
    res.status(200).json({ 
      success: true, 
      message: 'Contraseña actualizada correctamente' 
    });
  } catch (error) {
    console.error('❌ Error en updatePassword:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar contraseña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Subir o reemplazar logo del administrador
 */
exports.uploadLogo = async (req, res) => {
  console.log('🖼️ Subiendo nuevo logo...');
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No se proporcionó ningún archivo' 
      });
    }

    const adminId = req.admin?.id || 1;
    const logoPath = `/uploads/config/${req.file.filename}`;

    // Verificar si existe la columna logo_path
    try {
      await db.query(
        'UPDATE admin_users SET logo_path = $1, updated_at = NOW() WHERE id = $2 RETURNING id, logo_path',
        [logoPath, adminId]
      );
    } catch (error) {
      // Si la columna no existe, intentar agregarla
      try {
        await db.query('ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS logo_path VARCHAR(255)');
        await db.query(
          'UPDATE admin_users SET logo_path = $1, updated_at = NOW() WHERE id = $2 RETURNING id, logo_path',
          [logoPath, adminId]
        );
      } catch (alterError) {
        console.error('❌ Error agregando columna logo_path:', alterError);
        // Eliminar el archivo subido si falla
        const filePath = path.join(__dirname, '../../uploads/config', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        throw alterError;
      }
    }

    console.log(`✅ uploadLogo: Logo actualizado para admin ID ${adminId} - ${logoPath}`);
    res.status(200).json({ 
      success: true, 
      message: 'Logo actualizado correctamente',
      logo_path: logoPath 
    });
  } catch (error) {
    console.error('❌ Error en uploadLogo:', error);
    console.error('❌ Stack:', error.stack);
    
    // Eliminar el archivo si hubo error
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads/config', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error al subir logo',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

