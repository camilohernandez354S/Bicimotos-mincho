const db = require('../config/database');

class ContactMessage {
  // 🔹 Crear mensaje de contacto
  static async create(data) {
    const {
      name,
      email,
      phone,
      subject,
      message,
      ip_address,
      user_agent
    } = data;

    // Validaciones
    if (!name || !email || !subject || !message) {
      throw new Error('Nombre, email, asunto y mensaje son requeridos');
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email inválido');
    }

    const query = `
      INSERT INTO contact_messages (
        name, email, phone, subject, message, 
        ip_address, user_agent, status, priority
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      name.trim(),
      email.toLowerCase().trim(),
      phone ? phone.trim() : null,
      subject.trim(),
      message.trim(),
      ip_address || null,
      user_agent || null,
      'new',
      'medium'
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  }

  // 🔹 Obtener todos los mensajes
  static async getAll(filters = {}) {
    let query = `
      SELECT * FROM contact_messages
      WHERE 1=1
    `;
    
    const params = [];
    let idx = 1;

    if (filters.status) {
      query += ` AND status = $${idx++}`;
      params.push(filters.status);
    }

    if (filters.priority) {
      query += ` AND priority = $${idx++}`;
      params.push(filters.priority);
    }

    query += ` ORDER BY created_at DESC`;

    if (filters.limit) {
      query += ` LIMIT $${idx++}`;
      params.push(filters.limit);
    }

    if (filters.offset) {
      query += ` OFFSET $${idx++}`;
      params.push(filters.offset);
    }

    const { rows } = await db.query(query, params);
    return rows;
  }

  // 🔹 Obtener mensaje por ID
  static async getById(id) {
    const query = 'SELECT * FROM contact_messages WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // 🔹 Marcar como leído
  static async markAsRead(id, adminId = null) {
    const query = `
      UPDATE contact_messages
      SET status = 'read',
          assigned_to = $2,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await db.query(query, [id, adminId]);
    return rows[0];
  }

  // 🔹 Responder mensaje
  static async reply(id, replyMessage, adminId) {
    const query = `
      UPDATE contact_messages
      SET status = 'replied',
          reply_message = $2,
          replied_by = $3,
          replied_at = NOW(),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await db.query(query, [id, replyMessage, adminId]);
    return rows[0];
  }

  // 🔹 Cerrar mensaje
  static async close(id, adminId = null) {
    const query = `
      UPDATE contact_messages
      SET status = 'closed',
          assigned_to = $2,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await db.query(query, [id, adminId]);
    return rows[0];
  }

  // 🔹 Contar mensajes
  static async count(filters = {}) {
    let query = 'SELECT COUNT(*) as total FROM contact_messages WHERE 1=1';
    const params = [];
    let idx = 1;

    if (filters.status) {
      query += ` AND status = $${idx++}`;
      params.push(filters.status);
    }

    const { rows } = await db.query(query, params);
    return parseInt(rows[0].total);
  }
}

module.exports = ContactMessage;