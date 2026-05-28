import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const navLinkClass = ({ isActive }) =>
  `block px-4 py-2 rounded-md text-sm font-medium transition ${
    isActive ? "bg-orange-500 text-white" : "text-gray-300 hover:bg-gray-700"
  }`;

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
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
            onClick={handleLogout}
            className="mt-3 w-full text-left text-sm text-orange-400 hover:text-orange-300"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
