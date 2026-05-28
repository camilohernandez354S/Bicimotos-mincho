import jwt from "jsonwebtoken";

// Middleware que valida que la request lleve un JWT válido en el header.
// Si está OK, agrega req.admin con los datos del admin y deja pasar.
// Si falla, corta con 401.
//
// Uso: router.post("/algo", requireAuth, handler)
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no provisto" });
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { id: payload.adminId, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
