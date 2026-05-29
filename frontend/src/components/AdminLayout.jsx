import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const navLinkClass = ({ isActive }) =>
  `block px-4 py-2 rounded-md text-sm font-medium transition ${
    isActive ? "bg-orange-500 text-white" : "text-gray-300 hover:bg-gray-700"
  }`;

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  // Cerrar el menú automáticamente cuando cambia la ruta (mobile)
  useEffect(() => {
    setMenuAbierto(false);
  }, [location.pathname]);

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      {/* Top bar — visible solo en mobile */}
      <header className="md:hidden bg-gray-900 text-white flex items-center justify-between px-4 py-3 sticky top-0 z-30">
        <Link to="/admin" className="text-lg font-bold" onClick={cerrarMenu}>
          🚲 Admin <span className="text-orange-500">Mincho</span>
        </Link>
        <button
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
          className="p-2 -mr-2 text-gray-300 hover:text-white"
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
        >
          {menuAbierto ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Backdrop para mobile cuando el menú está abierto */}
      {menuAbierto && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={cerrarMenu}
          className="md:hidden fixed inset-0 top-12 bg-black/50 z-20"
        />
      )}

      {/* Sidebar — fijo en desktop, drawer deslizante en mobile */}
      <aside
        className={`
          bg-gray-900 text-white flex flex-col
          w-64 fixed md:static z-30
          inset-y-0 left-0 top-12 md:top-0
          transition-transform duration-200
          ${menuAbierto ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="hidden md:block p-6 border-b border-gray-700">
          <Link to="/admin" className="text-xl font-bold">
            🚲 Admin <span className="text-orange-500">Mincho</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/admin" end className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/productos" className={navLinkClass}>
            Productos
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-700 text-sm">
          <p className="text-gray-400">Sesión de</p>
          <p className="font-medium truncate">{admin?.nombre}</p>
          <p className="text-xs text-gray-500 truncate">{admin?.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 w-full text-left text-sm text-orange-400 hover:text-orange-300"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
