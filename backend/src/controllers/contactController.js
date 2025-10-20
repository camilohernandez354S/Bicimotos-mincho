const ContactMessage = require('../models/ContactMessage');

// Crear mensaje de contacto (público)
const createMessage = async (req, res) => {
  try {
    const messageData = req.body;

    // Obtener IP y User Agent
    messageData.ipAddress = req.ip || req.connection.remoteAddress;
    messageData.userAgent = req.get('User-Agent');

    const message = new ContactMessage(messageData);
    await message.save();

    res.status(201).json({
      success: true,
      message: 'Mensaje enviado exitosamente. Te contactaremos pronto.',
      data: {
        id: message._id,
        subject: message.subject,
        createdAt: message.createdAt
      }
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors
      });
    }

    console.error('Error creando mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
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
      search,
      dateFrom,
      dateTo,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};

    // Filtros
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Búsqueda
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { subject: new RegExp(search, 'i') },
        { message: new RegExp(search, 'i') }
      ];
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Ordenamiento
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    const messages = await ContactMessage.find(query)
      .populate('assignedTo', 'name email')
      .populate('reply.repliedBy', 'name email')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await ContactMessage.countDocuments(query);

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

    const message = await ContactMessage.findById(id)
      .populate('assignedTo', 'name email')
      .populate('reply.repliedBy', 'name email')
      .populate('notes.createdBy', 'name email')
      .select('-__v');

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

    const message = await ContactMessage.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }

    await message.markAsRead(adminId);

    res.status(200).json({
      success: true,
      message: 'Mensaje marcado como leído'
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

    const message = await ContactMessage.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }

    await message.replyTo(replyMessage, adminId);

    res.status(200).json({
      success: true,
      message: 'Respuesta enviada exitosamente'
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

    const message = await ContactMessage.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }

    await message.close(adminId);

    res.status(200).json({
      success: true,
      message: 'Mensaje cerrado exitosamente'
    });

  } catch (error) {
    console.error('Error cerrando mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Agregar nota a mensaje (admin)
const addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const adminId = req.admin.id;

    if (!note) {
      return res.status(400).json({
        success: false,
        message: 'La nota es requerida'
      });
    }

    const message = await ContactMessage.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }

    await message.addNote(note, adminId);

    res.status(200).json({
      success: true,
      message: 'Nota agregada exitosamente'
    });

  } catch (error) {
    console.error('Error agregando nota:', error);
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

    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
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
    const totalMessages = await ContactMessage.countDocuments();
    const newMessages = await ContactMessage.countDocuments({ status: 'new' });
    const readMessages = await ContactMessage.countDocuments({ status: 'read' });
    const repliedMessages = await ContactMessage.countDocuments({ status: 'replied' });
    const closedMessages = await ContactMessage.countDocuments({ status: 'closed' });

    // Mensajes urgentes
    const urgentMessages = await ContactMessage.countDocuments({ 
      priority: 'urgent',
      status: { $ne: 'closed' }
    });

    // Mensajes por prioridad
    const priorityStats = await ContactMessage.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Mensajes por estado
    const statusStats = await ContactMessage.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Mensajes recientes (últimos 7 días)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentMessages = await ContactMessage.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

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
        priorityStats,
        statusStats
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
  addNote,
  deleteMessage,
  getMessageStats
};
