const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Product, Category } = require('../models');
const router = express.Router();

// Middleware para validar errores
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  next();
};

// GET /api/products - Obtener todos los productos
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('La página debe ser un número positivo'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100'),
  query('category').optional().isInt().withMessage('La categoría debe ser un ID válido'),
  query('brand').optional().isIn(['Shimano', 'SRAM', 'Campagnolo', 'Otras']).withMessage('Marca no válida'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('El precio mínimo debe ser positivo'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('El precio máximo debe ser positivo'),
  query('search').optional().isLength({ min: 2 }).withMessage('La búsqueda debe tener al menos 2 caracteres'),
  query('featured').optional().isBoolean().withMessage('Featured debe ser true o false'),
  handleValidationErrors
], async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      featured,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { is_active: true };

    // Filtros
    if (category) where.category_id = category;
    if (brand) where.brand = brand;
    if (featured !== undefined) where.is_featured = featured === 'true';
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.$gte = parseFloat(minPrice);
      if (maxPrice) where.price.$lte = parseFloat(maxPrice);
    }

    // Búsqueda por texto
    if (search) {
      where.$or = [
        { name: { $iLike: `%${search}%` } },
        { description: { $iLike: `%${search}%` } },
        { model: { $iLike: `%${search}%` } }
      ];
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug']
      }],
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/products/:id - Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findOne({
      where: { id, is_active: true },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug']
      }]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/products/featured - Obtener productos destacados
router.get('/featured/list', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { is_active: true, is_featured: true },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug']
      }],
      order: [['created_at', 'DESC']],
      limit: 6
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error obteniendo productos destacados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/products/category/:categoryId - Obtener productos por categoría
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      where: { category_id: categoryId, is_active: true },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'slug']
      }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error obteniendo productos por categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
