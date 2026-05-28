import { Link, NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition ${
    isActive
      ? "text-orange-500"
      : "text-gray-700 hover:text-orange-500"
  }`;

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🚲</span>
          <span className="text-xl font-bold text-gray-900">
            Bicimotos <span className="text-orange-500">Mincho</span>
          </span>
        </Link>

        <nav className="flex gap-2">
          <NavLink to="/" end className={linkClass}>Inicio</NavLink>
          <NavLink to="/catalogo" className={linkClass}>Catálogo</NavLink>
          <NavLink to="/contacto" className={linkClass}>Contacto</NavLink>
        </nav>
      </div>
    </header>
  );
}
