const db = require('../config/database');

class Category {
  // 🔹 Listar todas las categorías activas
  static async getAll() {
    const query = `
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      WHERE c.is_active = true
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  // 🔹 Obtener categoría por ID
  static async getById(id) {
    const query = `
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      WHERE c.id = $1
      GROUP BY c.id
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // 🔹 Obtener categoría por slug
  static async getBySlug(slug) {
    const query = `
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      WHERE c.slug = $1 AND c.is_active = true
      GROUP BY c.id
    `;
    const { rows } = await db.query(query, [slug.toLowerCase()]);
    return rows[0];
  }

  // 🔹 Crear categoría
  static async create(data) {
    const { name, slug, description, image_url } = data;

    // Validaciones
    if (!name || !slug) {
      throw new Error('Nombre y slug son requeridos');
    }

    // Generar slug automáticamente si no se proporciona
    let finalSlug = slug || this.generateSlug(name);

    // Verificar que el slug sea único
    const existing = await this.getBySlug(finalSlug);
    if (existing) {
      throw new Error('El slug ya existe');
    }

    const query = `
      INSERT INTO categories (name, slug, description, image_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      name.trim(),
      finalSlug.toLowerCase().trim(),
      description ? description.trim() : null,
      image_url || null
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  }

  // 🔹 Actualizar categoría
  static async update(id, data) {
    // Verificar que la categoría existe
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error('Categoría no encontrada');
    }

    const fields = [];
    const values = [];
    let idx = 1;

    // Mapear campos
    const fieldMap = {
      imageUrl: 'image_url',
      isActive: 'is_active'
    };

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;

      const dbField = fieldMap[key] || key;

      if (dbField === 'slug') {
        // Verificar que el nuevo slug sea único
        const existingSlug = await this.getBySlug(value);
        if (existingSlug && existingSlug.id !== id) {
          throw new Error('El slug ya existe');
        }
        fields.push(`${dbField} = $${idx++}`);
        values.push(value.toLowerCase().trim());
      } else {
        fields.push(`${dbField} = $${idx++}`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return existing;
    }

    // Agregar updated_at
    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE categories
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *
    `;

    const { rows } = await db.query(query, values);
    return rows[0];
  }

  // 🔹 Eliminar categoría (soft delete)
  static async delete(id) {
    const query = `
      UPDATE categories
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // 🔹 Generar slug desde nombre
  static generateSlug(name) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
      .replace(/^-|-$/g, ''); // Remover guiones al inicio y final
  }

  // 🔹 Obtener categorías principales (sin parent)
  static async getMainCategories() {
    const query = `
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      WHERE c.is_active = true
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  // 🔹 Contar categorías
  static async count(activeOnly = true) {
    let query = 'SELECT COUNT(*) as total FROM categories';
    const params = [];

    if (activeOnly) {
      query += ' WHERE is_active = true';
    }

    const { rows } = await db.query(query, params);
    return parseInt(rows[0].total);
  }
}

module.exports = Category;