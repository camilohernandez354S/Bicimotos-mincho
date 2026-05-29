import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../../services/api.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

const PLACEHOLDER_IMG = "https://placehold.co/80x80/e5e7eb/9ca3af?text=?";

function formatPrecio(precio) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(precio));
}

export default function Productos() {
  usePageMeta({ title: "Productos · Admin" });

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  function recargar() {
    setCargando(true);
    setError(null);
    Promise.all([api.admin.productos.listar(), api.categorias.listar()])
      .then(([prods, cats]) => {
        setProductos(prods);
        setCategorias(cats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }

  useEffect(recargar, []);

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return productos.filter((p) => {
      const matchCat = filtroCategoria === "todas" || p.categoria?.slug === filtroCategoria;
      const matchQ =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.marca?.toLowerCase().includes(q) ||
        p.modelo?.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [productos, busqueda, filtroCategoria]);

  async function eliminar(producto) {
    if (!confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await api.admin.productos.eliminar(producto.id);
      recargar();
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`);
    }
  }

  function renderContenido() {
    if (cargando) {
      return <p className="p-8 text-center text-gray-500">Cargando productos...</p>;
    }
    if (productos.length === 0) {
      return (
        <p className="p-8 text-center text-gray-500">
          No hay productos todavía. Creá el primero con el botón de arriba.
        </p>
      );
    }
    if (filtrados.length === 0) {
      return (
        <p className="p-8 text-center text-gray-500">
          Ningún producto coincide con los filtros.
        </p>
      );
    }
    return (
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="text-left p-3 font-semibold">Foto</th>
            <th className="text-left p-3 font-semibold">Nombre</th>
            <th className="text-left p-3 font-semibold">Categoría</th>
            <th className="text-right p-3 font-semibold">Precio</th>
            <th className="text-right p-3 font-semibold">Stock</th>
            <th className="text-center p-3 font-semibold">Estado</th>
            <th className="text-right p-3 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filtrados.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="p-3">
                <img
                  src={p.imagenes?.[0] || PLACEHOLDER_IMG}
                  alt={p.nombre}
                  className="w-12 h-12 object-cover rounded"
                />
              </td>
              <td className="p-3">
                <p className="font-medium text-gray-900">{p.nombre}</p>
                {p.marca && <p className="text-xs text-gray-500">{p.marca}</p>}
              </td>
              <td className="p-3 text-gray-600">{p.categoria?.nombre}</td>
              <td className="p-3 text-right font-medium">{formatPrecio(p.precio)}</td>
              <td className="p-3 text-right">{p.stock}</td>
              <td className="p-3 text-center">
                <div className="flex flex-col items-center gap-1">
                  {p.activo ? (
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                      Activo
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                      Inactivo
                    </span>
                  )}
                  {p.destacado && (
                    <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded">
                      ★ Destacado
                    </span>
                  )}
                </div>
              </td>
              <td className="p-3 text-right whitespace-nowrap">
                <Link
                  to={`/admin/productos/${p.id}/editar`}
                  className="text-blue-600 hover:text-blue-800 mr-3"
                >
                  Editar
                </Link>
                <button
                  onClick={() => eliminar(p)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
        <Link
          to="/admin/productos/nuevo"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          + Nuevo producto
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, marca o modelo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="todas">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.slug}>{c.nombre}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {renderContenido()}
      </div>
    </div>
  );
}
