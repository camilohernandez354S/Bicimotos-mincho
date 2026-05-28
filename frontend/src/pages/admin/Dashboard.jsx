import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../../services/api.js";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, activos: 0, destacados: 0 });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.admin.productos
      .listar()
      .then((productos) => {
        setStats({
          total: productos.length,
          activos: productos.filter((p) => p.activo).length,
          destacados: productos.filter((p) => p.destacado).length,
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card titulo="Productos totales" valor={stats.total} cargando={cargando} />
        <Card titulo="Activos" valor={stats.activos} cargando={cargando} />
        <Card titulo="Destacados" valor={stats.destacados} cargando={cargando} />
      </div>

      <Link
        to="/admin/productos"
        className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition"
      >
        Gestionar productos →
      </Link>
    </div>
  );
}

function Card({ titulo, valor, cargando }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500">{titulo}</p>
      <p className="mt-2 text-4xl font-bold text-gray-900">
        {cargando ? "..." : valor}
      </p>
    </div>
  );
}
