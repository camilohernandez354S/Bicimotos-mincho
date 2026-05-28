import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

// Envuelve rutas que requieren admin logueado.
// Si no hay sesión, redirige a /admin/login y guarda de dónde venía
// para volver ahí después del login.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
