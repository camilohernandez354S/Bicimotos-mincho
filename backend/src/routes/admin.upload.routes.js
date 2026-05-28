import { Router } from "express";
import multer from "multer";

import { requireAuth } from "../middleware/auth.js";
import { uploadBuffer } from "../cloudinary.js";

const router = Router();

// multer en memoria — el archivo nunca toca disco, va directo a Cloudinary.
// Limite de 5MB para evitar uploads abusivos.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const okMime = file.mimetype?.startsWith("image/");
    const okExt = /\.(jpe?g|png|gif|webp|avif|bmp)$/i.test(file.originalname || "");
    if (!okMime && !okExt) {
      return cb(new Error("Solo se aceptan imágenes"));
    }
    cb(null, true);
  },
});

router.use(requireAuth);

// POST /api/admin/upload — recibe { imagen: <archivo> } y devuelve { url, publicId }
router.post("/", upload.single("imagen"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se recibió ningún archivo (campo 'imagen')" });
  }

  try {
    const result = await uploadBuffer(req.file.buffer);
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    console.error("Error subiendo a Cloudinary:", err);
    res.status(500).json({ error: "Error al subir la imagen" });
  }
});

// Manejador de errores específico de multer (file size, file type, etc.)
router.use((err, req, res, next) => {
  if (err) return res.status(400).json({ error: err.message });
  next();
});

export default router;
