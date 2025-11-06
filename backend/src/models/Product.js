const db = require('../config/database');

class Product {
  // 🔹 Listar todos los productos activos
  static async getAll(filters = {}) {
    let query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;
    
    const params = [];
    let idx = 1;

    if (filters.category_id) {
      query += ` AND p.category_id = $${idx++}`;
      params.push(filters.category_id);
    }

    if (filters.brand) {
      query += ` AND p.brand ILIKE $${idx++}`;
      params.push(`%${filters.brand}%`);
    }

    if (filters.in_stock) {
      query += ` AND p.stock > 0`;
    }

    query += ` ORDER BY p.is_featured DESC, p.created_at DESC`;

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

  // 🔹 Obtener un producto por ID
  static async getById(id) {
    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // 🔹 Crear producto nuevo
  static async create(data) {
    const {
      name,
      description,
      price,
      original_price,
      stock,
      sku,
      brand,
      model,
      category_id,
      image_url,
      images,
      specifications,
      features,
      tags,
      is_active,
      is_featured,
      views,
      sales,
      rating_average,
      rating_count
    } = data;

    // Validaciones
    if (!name || !description || !price || !sku || !brand) {
      throw new Error('Campos requeridos: name, description, price, sku, brand');
    }

    if (price < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    if (stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    // Verificar que el SKU sea único
    const existingSku = await db.query('SELECT id FROM products WHERE sku = $1', [sku.toUpperCase()]);
    if (existingSku.rows.length > 0) {
      throw new Error('El SKU ya existe');
    }

    const query = `
      INSERT INTO products (
        name, description, price, original_price, stock, sku,
        brand, model, category_id, image_url, images,
        specifications, features, tags, is_active, is_featured, 
        views, sales, rating_average, rating_count
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14, $15, $16, 
        $17, $18, $19, $20
      )
      RETURNING *
    `;

    const values = [
      name.trim(),
      description.trim(),
      price,
      original_price || null,
      stock || 0,
      sku.toUpperCase().trim(),
      brand.trim(),
      model ? model.trim() : null,
      category_id || null,
      image_url || null,
      images ? JSON.stringify(images) : null,
      specifications ? JSON.stringify(specifications) : JSON.stringify({}),
      features || [],
      tags || [],
      is_active !== undefined ? is_active : true,
      is_featured !== undefined ? is_featured : false,
      views || 0,
      sales || 0,
      rating_average || 0,
      rating_count || 0
    ];

    const { rows } = await db.query(query, values);
    return rows[0];
  }

  // 🔹 Actualizar producto
  static async update(id, data) {
    // Verificar que el producto existe
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error('Producto no encontrado');
    }

    // Validar SKU único si se está actualizando
    if (data.sku && data.sku !== existing.sku) {
      const existingSku = await db.query('SELECT id FROM products WHERE sku = $1 AND id != $2', [data.sku.toUpperCase(), id]);
      if (existingSku.rows.length > 0) {
        throw new Error('El SKU ya existe');
      }
      data.sku = data.sku.toUpperCase().trim();
    }

    // Validar precio
    if (data.price !== undefined && data.price < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    // Validar stock
    if (data.stock !== undefined && data.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    const fields = [];
    const values = [];
    let idx = 1;

    // Mapear campos de camelCase a snake_case
    const fieldMap = {
      originalPrice: 'original_price',
      categoryId: 'category_id',
      imageUrl: 'image_url',
      isActive: 'is_active',
      isFeatured: 'is_featured',
      ratingAverage: 'rating_average',
      ratingCount: 'rating_count'
    };

    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;

      const dbField = fieldMap[key] || key;
      
      // Manejar campos JSON
      if (dbField === 'specifications' || dbField === 'images') {
        fields.push(`${dbField} = $${idx++}`);
        values.push(typeof value === 'string' ? value : JSON.stringify(value));
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
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *
    `;

    const { rows } = await db.query(query, values);
    return rows[0];
  }

  // 🔹 Eliminar producto (soft delete)
  static async delete(id) {
    const query = `
      UPDATE products
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // 🔹 Eliminar producto permanentemente
  static async deletePermanent(id) {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // 🔹 Incrementar vistas
  static async incrementViews(id) {
    const query = `
      UPDATE products
      SET views = views + 1
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // 🔹 Incrementar ventas
  static async incrementSales(id, quantity = 1) {
    // Validar que haya stock suficiente
    const product = await this.getById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (product.stock < quantity) {
      throw new Error('Stock insuficiente');
    }

    const query = `
      UPDATE products
      SET sales = sales + $2,
          stock = GREATEST(stock - $2, 0),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await db.query(query, [id, quantity]);
    return rows[0];
  }

  // 🔹 Buscar productos (nombre, descripción, marca, categoría)
  static async searchProducts(queryString, filters = {}) {
    let sql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;
    
    const params = [];
    let idx = 1;

    if (queryString) {
      sql += ` AND (
        p.name ILIKE $${idx} OR 
        p.description ILIKE $${idx} OR 
        p.brand ILIKE $${idx} OR
        p.model ILIKE $${idx} OR
        p.sku ILIKE $${idx}
      )`;
      params.push(`%${queryString}%`);
      idx++;
    }

    if (filters.category_id) {
      sql += ` AND p.category_id = $${idx++}`;
      params.push(filters.category_id);
    }

    if (filters.brand) {
      sql += ` AND p.brand ILIKE $${idx++}`;
      params.push(`%${filters.brand}%`);
    }

    if (filters.min_price) {
      sql += ` AND p.price >= $${idx++}`;
      params.push(filters.min_price);
    }

    if (filters.max_price) {
      sql += ` AND p.price <= $${idx++}`;
      params.push(filters.max_price);
    }

    if (filters.in_stock) {
      sql += ` AND p.stock > 0`;
    }

    if (filters.is_featured) {
      sql += ` AND p.is_featured = true`;
    }

    sql += ' ORDER BY p.is_featured DESC, p.created_at DESC';

    if (filters.limit) {
      sql += ` LIMIT $${idx++}`;
      params.push(filters.limit);
    }

    if (filters.offset) {
      sql += ` OFFSET $${idx++}`;
      params.push(filters.offset);
    }

    const { rows } = await db.query(sql, params);
    return rows;
  }

  // 🔹 Obtener productos destacados
  static async getFeatured(limit = 10) {
    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true AND p.is_featured = true
      ORDER BY p.created_at DESC
      LIMIT $1
    `;
    const { rows } = await db.query(query, [limit]);
    return rows;
  }

  // 🔹 Obtener productos por categoría
  static async getByCategory(categoryId, limit = 20) {
    const query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true AND p.category_id = $1
      ORDER BY p.is_featured DESC, p.created_at DESC
      LIMIT $2
    `;
    const { rows } = await db.query(query, [categoryId, limit]);
    return rows;
  }

  // 🔹 Obtener productos con stock bajo
  static async getLowStock(threshold = 5) {
    const query = `
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true AND p.stock <= $1
      ORDER BY p.stock ASC
    `;
    const { rows } = await db.query(query, [threshold]);
    return rows;
  }

  // 🔹 Obtener productos más vendidos
  static async getTopSelling(limit = 10) {
    const query = `
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
      ORDER BY p.sales DESC
      LIMIT $1
    `;
    const { rows } = await db.query(query, [limit]);
    return rows;
  }

  // 🔹 Obtener productos más vistos
  static async getMostViewed(limit = 10) {
    const query = `
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
      ORDER BY p.views DESC
      LIMIT $1
    `;
    const { rows } = await db.query(query, [limit]);
    return rows;
  }

  // 🔹 Contar productos
  static async count(filters = {}) {
    let query = 'SELECT COUNT(*) as total FROM products WHERE is_active = true';
    const params = [];
    let idx = 1;

    if (filters.category_id) {
      query += ` AND category_id = $${idx++}`;
      params.push(filters.category_id);
    }

    if (filters.in_stock) {
      query += ` AND stock > 0`;
    }

    const { rows } = await db.query(query, params);
    return parseInt(rows[0].total);
  }

  // 🔹 Actualizar rating
  static async updateRating(id, rating) {
    // Validar rating
    if (rating < 0 || rating > 5) {
      throw new Error('El rating debe estar entre 0 y 5');
    }

    const product = await this.getById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const currentCount = product.rating_count || 0;
    const currentAverage = parseFloat(product.rating_average) || 0;
    
    // Calcular nuevo promedio
    const newCount = currentCount + 1;
    const newAverage = ((currentAverage * currentCount) + rating) / newCount;

    const query = `
      UPDATE products
      SET rating_average = $1,
          rating_count = $2,
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;

    const { rows } = await db.query(query, [newAverage.toFixed(2), newCount, id]);
    return rows[0];
  }
}

module.exports = Product;