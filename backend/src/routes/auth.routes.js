import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../db.js";

const router = Router();

// POST /api/auth/login — recibe { email, password }, devuelve { token, admin }
router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son requeridos" });
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const passwordOk = await bcrypt.compare(password, admin.password);
  if (!passwordOk) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const token = jwt.sign(
    { adminId: admin.id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    admin: { id: admin.id, email: admin.email, nombre: admin.nombre },
  });
});

export default router;
