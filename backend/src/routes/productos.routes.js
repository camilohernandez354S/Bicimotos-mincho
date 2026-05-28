import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

// GET /api/productos — lista todos los productos activos
router.get("/", async (req, res) => {
  const productos = await prisma.producto.findMany({
    where: { activo: true },
    include: { categoria: true },
    orderBy: { creadoEn: "desc" },
  });
  res.json(productos);
});

// GET /api/productos/:id — detalle de un producto
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  // findFirst para poder filtrar por activo además del id —
  // un usuario que llega por URL directa a un producto desactivado debe ver 404,
  // no el producto oculto.
  const producto = await prisma.producto.findFirst({
    where: { id, activo: true },
    include: { categoria: true },
  });

  if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(producto);
});

export default router;
