const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const verifyAdmin = require('../middlewares/verifyAdmin');
const productsController = require('../controllers/productsController');

// Todas las rutas requieren autenticación de admin
router.use(verifyAdmin);

// GET /api/admin/products - Listar todos los productos (admin)
router.get('/', productsController.getAllProducts);

// POST /api/admin/products - Crear nuevo producto (con imagen obligatoria)
router.post('/', upload.single('image'), productsController.createProduct);

// GET /api/admin/products/:id - Obtener producto por ID (admin - incluye inactivos)
router.get('/:id', productsController.getProductByIdAdmin);

// PUT /api/admin/products/:id - Actualizar producto (imagen opcional)
router.put('/:id', upload.single('image'), productsController.updateProduct);

// DELETE /api/admin/products/:id - Eliminar producto
router.delete('/:id', productsController.deleteProduct);

module.exports = router;