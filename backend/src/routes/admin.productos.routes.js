import { Router } from "express";

import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Todas las rutas de este router requieren JWT válido
router.use(requireAuth);

// GET /api/admin/productos — lista TODOS los productos (incluye inactivos)
router.get("/", async (req, res) => {
  const productos = await prisma.producto.findMany({
    include: { categoria: true },
    orderBy: { creadoEn: "desc" },
  });
  res.json(productos);
});

// POST /api/admin/productos — crear producto
router.post("/", async (req, res) => {
  const {
    nombre,
    descripcion,
    precio,
    stock,
    marca,
    modelo,
    imagenes,
    destacado,
    activo,
    categoriaId,
  } = req.body ?? {};

  if (!nombre || precio == null || categoriaId == null) {
    return res
      .status(400)
      .json({ error: "nombre, precio y categoriaId son requeridos" });
  }

  const producto = await prisma.producto.create({
    data: {
      nombre,
      descripcion: descripcion ?? null,
      precio,
      stock: stock ?? 0,
      marca: marca ?? null,
      modelo: modelo ?? null,
      imagenes: imagenes ?? [],
      destacado: destacado ?? false,
      activo: activo ?? true,
      categoriaId: Number(categoriaId),
    },
    include: { categoria: true },
  });

  res.status(201).json(producto);
});

// PUT /api/admin/productos/:id — actualizar producto
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  const data = req.body ?? {};
  // Solo aceptamos campos conocidos para evitar inyección de columnas raras
  const allowed = [
    "nombre",
    "descripcion",
    "precio",
    "stock",
    "marca",
    "modelo",
    "imagenes",
    "destacado",
    "activo",
    "categoriaId",
  ];
  const update = {};
  for (const key of allowed) {
    if (key in data) update[key] = data[key];
  }
  if (update.categoriaId != null) update.categoriaId = Number(update.categoriaId);

  try {
    const producto = await prisma.producto.update({
      where: { id },
      data: update,
      include: { categoria: true },
    });
    res.json(producto);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    throw err;
  }
});

// DELETE /api/admin/productos/:id — borrar producto
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  try {
    await prisma.producto.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    throw err;
  }
});

export default router;
