const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middlewares/verifyAdmin');
const adminConfigController = require('../controllers/adminConfigController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

console.log('✅ RUTA /api/admin/configuracion registrada');

// Todas las rutas requieren autenticación de admin
router.use(verifyAdmin);

// Crear carpeta de configuración si no existe
const configUploadPath = path.join(__dirname, '../uploads/config');
if (!fs.existsSync(configUploadPath)) {
  fs.mkdirSync(configUploadPath, { recursive: true });
  console.log('📁 Carpeta uploads/config creada');
}

// Configuración de subida de archivos (logo)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, configUploadPath);
  },
  filename: (req, file, cb) => {
    // Mantener extensión original
    const ext = path.extname(file.originalname);
    const filename = `logo${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  // Permitir solo imágenes
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPG, PNG, WEBP, GIF)'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB máximo
});

// GET /api/admin/configuracion - Obtener configuración actual
router.get('/', (req, res, next) => {
  console.log('⚙️ Entrando a GET /api/admin/configuracion');
  next();
}, adminConfigController.getAdminConfig);

// PUT /api/admin/configuracion - Actualizar información básica (nombre, email)
router.put('/', (req, res, next) => {
  console.log('📝 Entrando a PUT /api/admin/configuracion');
  next();
}, adminConfigController.updateAdminConfig);

// PUT /api/admin/configuracion/password - Actualizar contraseña
router.put('/password', (req, res, next) => {
  console.log('🔐 Entrando a PUT /api/admin/configuracion/password');
  next();
}, adminConfigController.updatePassword);

// POST /api/admin/configuracion/logo - Subir o reemplazar logo
router.post('/logo', upload.single('logo'), (req, res, next) => {
  console.log('🖼️ Entrando a POST /api/admin/configuracion/logo');
  next();
}, adminConfigController.uploadLogo);

module.exports = router;

