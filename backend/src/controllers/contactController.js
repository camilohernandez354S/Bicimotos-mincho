const ContactMessage = require('../models/ContactMessage');

// Crear mensaje de contacto (público)
const createMessage = async (req, res) => {
  console.log('📩 createMessage ejecutándose...');
  try {
    const messageData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      subject: req.body.subject,
      message: req.body.message,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('User-Agent')
    };

    const message = await ContactMessage.create(messageData);

    console.log(`✅ createMessage: Mensaje creado con ID ${message.id}`);
    res.status(201).json({
      success: true,
      message: 'Mensaje enviado exitosamente. Te contactaremos pronto.',
      data: {
        id: message.id,
        subject: message.subject,
        created_at: message.created_at
      }
    });

  } catch (error) {
    console.error('❌ Error creando mensaje:', error);
    console.error('❌ Stack:', error.stack);
    
    if (error.message.includes('requeridos') || error.message.includes('Email inválido')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ========== RUTAS PRIVADAS (ADMIN) ==========

// Obtener todos los mensajes (admin)
const getAllMessages = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status,
      priority,
      search
    } = req.query;

    const filters = {
      status: status || null,
      priority: priority || null,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };

    let messages;
    
    if (search) {
      // Búsqueda con SQL
      const db = require('../config/database');
      let query = `
        SELECT * FROM contact_messages
        WHERE (name ILIKE $1 OR email ILIKE $2 OR subject ILIKE $3 OR message ILIKE $4)
      `;
      const params = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];
      let idx = 5;

      if (status) {
        query += ` AND status = $${idx++}`;
        params.push(status);
      }

      if (priority) {
        query += ` AND priority = $${idx++}`;
        params.push(priority);
      }

      query += ` ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
      params.push(parseInt(limit));
      params.push((parseInt(page) - 1) * parseInt(limit));

      const result = await db.query(query, params);
      messages = result.rows;
    } else {
      messages = await ContactMessage.getAll(filters);
    }

    const total = await ContactMessage.count(filters);

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener mensaje por ID (admin)
const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.getById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });

  } catch (error) {
    console.error('Error obteniendo mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Marcar mensaje como leído (admin)
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.admin.id;

    const message = await ContactMessage.markAsRead(id, adminId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mensaje marcado como leído',
      data: message
    });

  } catch (error) {
    console.error('Error marcando mensaje como leído:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Responder mensaje (admin)
const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;
    const adminId = req.admin.id;

    if (!replyMessage) {
      return res.status(400).json({
        success: false,
        message: 'El mensaje de respuesta es requerido'
      });
    }

    const message = await ContactMessage.reply(id, replyMessage, adminId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Respuesta enviada exitosamente',
      data: message
    });

  } catch (error) {
    console.error('Error respondiendo mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Cerrar mensaje (admin)
const closeMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.admin.id;

    const message = await ContactMessage.close(id, adminId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mensaje cerrado exitosamente',
      data: message
    });

  } catch (error) {
    console.error('Error cerrando mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar mensaje (admin)
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const db = require('../config/database');
    const result = await db.query('DELETE FROM contact_messages WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mensaje eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas de mensajes (admin)
const getMessageStats = async (req, res) => {
  try {
    const db = require('../config/database');

    // Contar mensajes por estado
    const totalResult = await db.query('SELECT COUNT(*) as total FROM contact_messages');
    const totalMessages = parseInt(totalResult.rows[0].total);

    const newResult = await db.query("SELECT COUNT(*) as total FROM contact_messages WHERE status = 'new'");
    const newMessages = parseInt(newResult.rows[0].total);

    const readResult = await db.query("SELECT COUNT(*) as total FROM contact_messages WHERE status = 'read'");
    const readMessages = parseInt(readResult.rows[0].total);

    const repliedResult = await db.query("SELECT COUNT(*) as total FROM contact_messages WHERE status = 'replied'");
    const repliedMessages = parseInt(repliedResult.rows[0].total);

    const closedResult = await db.query("SELECT COUNT(*) as total FROM contact_messages WHERE status = 'closed'");
    const closedMessages = parseInt(closedResult.rows[0].total);

    const urgentResult = await db.query("SELECT COUNT(*) as total FROM contact_messages WHERE priority = 'urgent' AND status != 'closed'");
    const urgentMessages = parseInt(urgentResult.rows[0].total);

    // Mensajes por prioridad
    const priorityStatsResult = await db.query(`
      SELECT priority, COUNT(*) as count
      FROM contact_messages
      GROUP BY priority
    `);

    // Mensajes por estado
    const statusStatsResult = await db.query(`
      SELECT status, COUNT(*) as count
      FROM contact_messages
      GROUP BY status
    `);

    // Mensajes recientes (últimos 7 días)
    const recentResult = await db.query(`
      SELECT COUNT(*) as total
      FROM contact_messages
      WHERE created_at >= NOW() - INTERVAL '7 days'
    `);
    const recentMessages = parseInt(recentResult.rows[0].total);

    res.status(200).json({
      success: true,
      data: {
        total: totalMessages,
        new: newMessages,
        read: readMessages,
        replied: repliedMessages,
        closed: closedMessages,
        urgent: urgentMessages,
        recent: recentMessages,
        priorityStats: priorityStatsResult.rows.map(r => ({ _id: r.priority, count: parseInt(r.count) })),
        statusStats: statusStatsResult.rows.map(r => ({ _id: r.status, count: parseInt(r.count) }))
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  // Ruta pública
  createMessage,
  
  // Rutas privadas (admin)
  getAllMessages,
  getMessageById,
  markAsRead,
  replyToMessage,
  closeMessage,
  deleteMessage,
  getMessageStats
};