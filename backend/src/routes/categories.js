const express = require('express');
const { body, validationResult } = require('express-validator');
const { Category, Product } = require('../models');
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

// GET /api/categories - Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { is_active: true },
      order: [['sort_order', 'ASC'], ['name', 'ASC']],
      include: [{
        model: Product,
        as: 'products',
        where: { is_active: true },
        required: false,
        attributes: ['id']
      }]
    });

    // Agregar conteo de productos
    const categoriesWithCount = categories.map(category => ({
      ...category.toJSON(),
      productCount: category.products ? category.products.length : 0
    }));

    res.json({
      success: true,
      data: categoriesWithCount
    });
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/categories/:id - Obtener una categoría por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findOne({
      where: { id, is_active: true },
      include: [{
        model: Product,
        as: 'products',
        where: { is_active: true },
        required: false,
        limit: 6,
        order: [['is_featured', 'DESC'], ['created_at', 'DESC']]
      }]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
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
});

// GET /api/categories/slug/:slug - Obtener una categoría por slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const category = await Category.findOne({
      where: { slug, is_active: true },
      include: [{
        model: Product,
        as: 'products',
        where: { is_active: true },
        required: false,
        order: [['is_featured', 'DESC'], ['created_at', 'DESC']]
      }]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error obteniendo categoría por slug:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/categories - Crear nueva categoría (Admin)
router.post('/', [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('description').optional().isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
  body('slug').notEmpty().withMessage('El slug es obligatorio'),
  body('parent_id').optional().isInt().withMessage('El parent_id debe ser un número'),
  body('sort_order').optional().isInt().withMessage('El sort_order debe ser un número'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { name, description, slug, parent_id, sort_order = 0 } = req.body;

    // Verificar que el slug sea único
    const existingCategory = await Category.findOne({ where: { slug } });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con este slug'
      });
    }

    const category = await Category.create({
      name,
      description,
      slug,
      parent_id: parent_id || null,
      sort_order
    });

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: category
    });
  } catch (error) {
    console.error('Error creando categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/categories/:id - Actualizar categoría (Admin)
router.put('/:id', [
  body('name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('description').optional().isLength({ max: 500 }).withMessage('La descripción no puede exceder 500 caracteres'),
  body('slug').optional().notEmpty().withMessage('El slug no puede estar vacío'),
  body('parent_id').optional().isInt().withMessage('El parent_id debe ser un número'),
  body('sort_order').optional().isInt().withMessage('El sort_order debe ser un número'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    // Si se está actualizando el slug, verificar que sea único
    if (updateData.slug && updateData.slug !== category.slug) {
      const existingCategory = await Category.findOne({ 
        where: { slug: updateData.slug, id: { $ne: id } } 
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una categoría con este slug'
        });
      }
    }

    await category.update(updateData);

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: category
    });
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/categories/:id - Eliminar categoría (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    // Verificar si hay productos asociados
    const productCount = await Product.count({ where: { category_id: id } });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar la categoría porque tiene productos asociados'
      });
    }

    await category.destroy();

    res.json({
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
});

module.exports = router;
