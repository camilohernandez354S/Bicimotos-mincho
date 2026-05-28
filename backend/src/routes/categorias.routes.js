import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

// GET /api/categorias — lista todas las categorías
router.get("/", async (req, res) => {
  const categorias = await prisma.categoria.findMany({
    orderBy: { nombre: "asc" },
  });
  res.json(categorias);
});

export default router;
