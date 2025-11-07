const express = require('express');
const router = express.Router();

const categoriesController = require('../controllers/categoriesController');

router.get('/', (req, res, next) => {
  console.log('📂 GET /api/public/categorias (list)');
  next();
}, categoriesController.getCategories);

router.get('/:id', (req, res, next) => {
  console.log(`📁 GET /api/public/categorias/${req.params.id}`);
  next();
}, categoriesController.getCategoryById);

router.get('/:parentId/subcategorias', (req, res, next) => {
  console.log(`🧩 GET /api/public/categorias/${req.params.parentId}/subcategorias`);
  next();
}, categoriesController.getSubcategories);

module.exports = router;
