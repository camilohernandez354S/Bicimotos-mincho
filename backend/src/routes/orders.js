const express = require('express');
const { body, validationResult } = require('express-validator');
const { Order, Cart, Product, User } = require('../models');
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

// GET /api/orders - Obtener órdenes del usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    const where = { user_id: req.user.id };
    if (status) where.status = status;

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'email']
      }]
    });

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/orders/:id - Obtener una orden específica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      where: { id, user_id: req.user.id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'email']
      }]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error obteniendo orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/orders - Crear nueva orden
router.post('/', authenticateToken, [
  body('shipping_address').isObject().withMessage('La dirección de envío es obligatoria'),
  body('shipping_address.street').notEmpty().withMessage('La calle es obligatoria'),
  body('shipping_address.city').notEmpty().withMessage('La ciudad es obligatoria'),
  body('shipping_address.state').notEmpty().withMessage('El estado es obligatorio'),
  body('shipping_address.postal_code').notEmpty().withMessage('El código postal es obligatorio'),
  body('shipping_address.country').notEmpty().withMessage('El país es obligatorio'),
  body('payment_method').isIn(['credit_card', 'debit_card', 'paypal', 'mercadopago', 'cash']).withMessage('Método de pago inválido'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Las notas no pueden exceder 500 caracteres'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { shipping_address, billing_address, payment_method, notes } = req.body;

    // Obtener carrito del usuario
    const cart = await Cart.findOne({
      where: { user_id: req.user.id, is_active: true }
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El carrito está vacío'
      });
    }

    // Verificar stock y calcular totales
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await Product.findByPk(item.product_id);
      
      if (!product || !product.is_active) {
        return res.status(400).json({
          success: false,
          message: `El producto ${item.product_id} no está disponible`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para el producto ${product.name}`
        });
      }

      const itemTotal = parseFloat(product.price) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // Calcular totales
    const taxAmount = subtotal * 0.19; // IVA 19%
    const shippingAmount = subtotal > 500000 ? 0 : 25000; // Envío gratis sobre $500k
    const totalAmount = subtotal + taxAmount + shippingAmount;

    // Crear orden
    const order = await Order.create({
      user_id: req.user.id,
      status: 'pending',
      payment_status: 'pending',
      payment_method,
      items: orderItems,
      subtotal,
      tax_amount: taxAmount,
      shipping_amount: shippingAmount,
      total_amount: totalAmount,
      shipping_address,
      billing_address: billing_address || shipping_address,
      notes
    });

    // Actualizar stock de productos
    for (const item of cart.items) {
      const product = await Product.findByPk(item.product_id);
      await product.update({
        stock: product.stock - item.quantity
      });
    }

    // Desactivar carrito
    await cart.update({ is_active: false });

    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      data: order
    });
  } catch (error) {
    console.error('Error creando orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/orders/:id/cancel - Cancelar orden
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      where: { id, user_id: req.user.id }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'La orden ya está cancelada'
      });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'No se puede cancelar una orden ya entregada'
      });
    }

    // Actualizar estado
    await order.updateStatus('cancelled');

    // Restaurar stock
    for (const item of order.items) {
      const product = await Product.findByPk(item.product_id);
      if (product) {
        await product.update({
          stock: product.stock + item.quantity
        });
      }
    }

    res.json({
      success: true,
      message: 'Orden cancelada exitosamente',
      data: order
    });
  } catch (error) {
    console.error('Error cancelando orden:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
