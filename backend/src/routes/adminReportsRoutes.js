const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middlewares/verifyAdmin');
const reportsController = require('../controllers/reportsController');

console.log('✅ RUTA /api/admin/reportes registrada');

// Todas las rutas requieren autenticación de admin
router.use(verifyAdmin);

// GET /api/admin/reportes - Obtener resumen general
router.get('/', (req, res, next) => {
  console.log('📊 Entrando a GET /api/admin/reportes');
  next();
}, reportsController.getSummaryReports);

// GET /api/admin/reportes/export/pdf - Exportar PDF del resumen
router.get('/export/pdf', (req, res, next) => {
  console.log('🧾 Entrando a GET /api/admin/reportes/export/pdf');
  next();
}, reportsController.exportPDFReport);

module.exports = router;

