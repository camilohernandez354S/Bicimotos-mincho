const db = require('../config/database');

// ✅ Obtener todos los mensajes
exports.getAllMessages = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        id, 
        name, 
        email, 
        phone,
        subject, 
        message, 
        status,
        priority,
        created_at,
        updated_at
      FROM contact_messages 
      ORDER BY 
        CASE status 
          WHEN 'new' THEN 1 
          WHEN 'read' THEN 2 
          WHEN 'replied' THEN 3 
          ELSE 4 
        END,
        created_at DESC
    `);
    
    res.status(200).json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    console.error('❌ Error obteniendo mensajes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener mensajes' 
    });
  }
};

// ✅ Obtener un mensaje por ID
exports.getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM contact_messages WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error obteniendo mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener mensaje'
    });
  }
};

// ✅ Marcar mensaje como leído
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `UPDATE contact_messages 
       SET status = 'read', updated_at = NOW() 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Mensaje marcado como leído',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error marcando mensaje como leído:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar mensaje' 
    });
  }
};

// ✅ Eliminar mensaje
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM contact_messages WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Mensaje eliminado correctamente' 
    });
  } catch (error) {
    console.error('❌ Error eliminando mensaje:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar mensaje' 
    });
  }
};

// ✅ Contador de mensajes no leídos (status = 'new')
exports.getUnreadCount = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) AS unread FROM contact_messages WHERE status = 'new'"
    );
    const count = parseInt(result.rows[0].unread, 10);
    
    res.status(200).json({ 
      success: true, 
      count: count 
    });
  } catch (error) {
    console.error('❌ Error obteniendo contador de mensajes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al contar mensajes' 
    });
  }
};

