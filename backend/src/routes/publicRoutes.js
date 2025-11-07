const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController');
const contactController = require('../controllers/contactController');

console.log('🌍 RUTA /api/public registrada');

// Productos (lista)
router.get('/productos', (req, res, next) => {
  console.log('🛍️  GET /api/public/productos', req.query);
  next();
}, productsController.getProducts);

// Producto por ID
router.get('/productos/:id', (req, res, next) => {
  console.log(`🔍 GET /api/public/productos/${req.params.id}`);
  next();
}, productsController.getProductById);

// Productos destacados
router.get('/productos/destacados/lista', (req, res, next) => {
  console.log('⭐ GET /api/public/productos/destacados/lista', req.query);
  next();
}, productsController.getFeaturedProducts);

// Productos relacionados
router.get('/productos/:id/relacionados', (req, res, next) => {
  console.log(`🤝 GET /api/public/productos/${req.params.id}/relacionados`, req.query);
  next();
}, productsController.getRelatedProducts);

// Formulario de contacto
router.post('/contacto', (req, res, next) => {
  console.log('📩 POST /api/public/contacto', {
    body: {
      name: req.body?.name,
      email: req.body?.email,
      subject: req.body?.subject,
    }
  });
  next();
}, contactController.createMessage);

module.exports = router;
