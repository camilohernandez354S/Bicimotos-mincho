import "dotenv/config";
import express from "express";
import cors from "cors";

import productosRoutes from "./routes/productos.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminProductosRoutes from "./routes/admin.productos.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Health check — útil para verificar que el server está vivo
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "bicimotos-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/admin/productos", adminProductosRoutes);

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API Bicimotos corriendo en http://localhost:${PORT}`);
});
