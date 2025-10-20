const express = require('express');
const { body, validationResult } = require('express-validator');
const { Cart, Product, User } = require('../models');
const { authenticateToken } = require('./auth');
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

// GET /api/cart - Obtener carrito del usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { user_id: req.user.id, is_active: true },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'email']
      }]
    });

    if (!cart) {
      cart = await Cart.create({
        user_id: req.user.id,
        items: [],
        total_amount: 0,
        total_items: 0
      });
    }

    // Obtener información completa de los productos
    const cartItems = [];
    for (const item of cart.items) {
      const product = await Product.findByPk(item.product_id, {
        include: ['category']
      });
      if (product && product.is_active) {
        cartItems.push({
          ...item,
          product: product.toJSON()
        });
      }
    }

    res.json({
      success: true,
      data: {
        ...cart.toJSON(),
        items: cartItems
      }
    });
  } catch (error) {
    console.error('Error obteniendo carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/cart/add - Agregar producto al carrito
router.post('/add', authenticateToken, [
  body('product_id').isInt().withMessage('El ID del producto debe ser un número'),
  body('quantity').isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    // Verificar que el producto existe y está disponible
    const product = await Product.findOne({
      where: { id: product_id, is_active: true }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Stock insuficiente'
      });
    }

    // Obtener o crear carrito
    let cart = await Cart.findOne({
      where: { user_id: req.user.id, is_active: true }
    });

    if (!cart) {
      cart = await Cart.create({
        user_id: req.user.id,
        items: [],
        total_amount: 0,
        total_items: 0
      });
    }

    // Agregar producto al carrito
    await cart.addItem(product_id, quantity);

    res.json({
      success: true,
      message: 'Producto agregado al carrito exitosamente',
      data: cart
    });
  } catch (error) {
    console.error('Error agregando al carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/cart/update - Actualizar cantidad de producto en el carrito
router.put('/update', authenticateToken, [
  body('product_id').isInt().withMessage('El ID del producto debe ser un número'),
  body('quantity').isInt({ min: 0 }).withMessage('La cantidad debe ser 0 o mayor'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    const cart = await Cart.findOne({
      where: { user_id: req.user.id, is_active: true }
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Carrito no encontrado'
      });
    }

    // Actualizar cantidad
    await cart.updateItemQuantity(product_id, quantity);

    res.json({
      success: true,
      message: 'Carrito actualizado exitosamente',
      data: cart
    });
  } catch (error) {
    console.error('Error actualizando carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/cart/remove - Remover producto del carrito
router.delete('/remove', authenticateToken, [
  body('product_id').isInt().withMessage('El ID del producto debe ser un número'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { product_id } = req.body;

    const cart = await Cart.findOne({
      where: { user_id: req.user.id, is_active: true }
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Carrito no encontrado'
      });
    }

    // Remover producto
    await cart.removeItem(product_id);

    res.json({
      success: true,
      message: 'Producto removido del carrito exitosamente',
      data: cart
    });
  } catch (error) {
    console.error('Error removiendo del carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// DELETE /api/cart/clear - Limpiar carrito
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { user_id: req.user.id, is_active: true }
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Carrito no encontrado'
      });
    }

    // Limpiar carrito
    await cart.clear();

    res.json({
      success: true,
      message: 'Carrito limpiado exitosamente',
      data: cart
    });
  } catch (error) {
    console.error('Error limpiando carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
