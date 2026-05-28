import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import ProductoDetalle from "./pages/ProductoDetalle.jsx";
import Contacto from "./pages/Contacto.jsx";
import NotFound from "./pages/NotFound.jsx";

import Login from "./pages/admin/Login.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import ProductosAdmin from "./pages/admin/Productos.jsx";
import ProductoForm from "./pages/admin/ProductoForm.jsx";

export default function App() {
  return (
    <Routes>
      {/* Sitio público */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="producto/:id" element={<ProductoDetalle />} />
        <Route path="contacto" element={<Contacto />} />
      </Route>

      {/* Login admin (sin layout, página independiente) */}
      <Route path="/admin/login" element={<Login />} />

      {/* Sección admin (protegida) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<ProductosAdmin />} />
        <Route path="productos/nuevo" element={<ProductoForm />} />
        <Route path="productos/:id/editar" element={<ProductoForm />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
