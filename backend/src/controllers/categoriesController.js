const Category = require('../models/Category');

// Obtener todas las categorías (público)
const getCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();

    res.status(200).json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener categoría por ID (público)
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.getById(id);

    if (!category || !category.is_active) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener categoría por slug (público)
const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.getBySlug(slug);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener categorías principales (público)
const getMainCategories = async (req, res) => {
  try {
    const categories = await Category.getMainCategories();

    res.status(200).json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error obteniendo categorías principales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener subcategorías (público) - Por ahora devuelve array vacío ya que no hay jerarquía
const getSubcategories = async (req, res) => {
  try {
    // Como la estructura actual no tiene jerarquía de categorías,
    // devolvemos un array vacío
    res.status(200).json({
      success: true,
      data: []
    });

  } catch (error) {
    console.error('Error obteniendo subcategorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ========== RUTAS PRIVADAS (ADMIN) ==========

// Crear categoría (admin)
const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: category
    });

  } catch (error) {
    console.error('Error creando categoría:', error);
    
    if (error.message.includes('slug') || error.message.includes('requeridos')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar categoría (admin)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const category = await Category.update(id, updateData);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: category
    });

  } catch (error) {
    console.error('Error actualizando categoría:', error);
    
    if (error.message.includes('slug') || error.message.includes('no encontrada')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar categoría (admin)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si hay productos asociados
    const Product = require('../models/Product');
    const products = await Product.getByCategory(id, 1);
    
    if (products.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar la categoría porque tiene productos asociados'
      });
    }

    const category = await Category.delete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener todas las categorías (admin)
const getAllCategories = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search,
      status
    } = req.query;

    let categories;
    
    if (search) {
      // Búsqueda simple por nombre
      const db = require('../config/database');
      const query = `
        SELECT 
          c.*,
          COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
        WHERE c.name ILIKE $1 ${status ? 'AND c.is_active = $2' : ''}
        GROUP BY c.id
        ORDER BY c.name ASC
        LIMIT $${status ? 3 : 2} OFFSET $${status ? 4 : 3}
      `;
      const params = [`%${search}%`];
      if (status) params.push(status === 'active');
      params.push(parseInt(limit));
      params.push((parseInt(page) - 1) * parseInt(limit));
      
      const result = await db.query(query, params);
      categories = result.rows;
    } else {
      categories = await Category.getAll();
    }

    const total = await Category.count(status !== 'inactive');

    res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas de categorías (admin)
const getCategoryStats = async (req, res) => {
  try {
    const db = require('../config/database');

    const totalResult = await db.query('SELECT COUNT(*) as total FROM categories');
    const totalCategories = parseInt(totalResult.rows[0].total);

    const activeResult = await db.query('SELECT COUNT(*) as total FROM categories WHERE is_active = true');
    const activeCategories = parseInt(activeResult.rows[0].total);

    // Categorías con más productos
    const topCategoriesQuery = `
      SELECT 
        c.id,
        c.name,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
      GROUP BY c.id, c.name
      ORDER BY product_count DESC
      LIMIT 5
    `;
    const topCategoriesResult = await db.query(topCategoriesQuery);

    res.status(200).json({
      success: true,
      data: {
        total: totalCategories,
        active: activeCategories,
        topCategories: topCategoriesResult.rows
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
  // Rutas públicas
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  getMainCategories,
  getSubcategories,
  
  // Rutas privadas (admin)
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryStats
};