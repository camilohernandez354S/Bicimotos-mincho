import { useEffect, useMemo, useState } from "react";

import { api } from "../services/api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([api.productos.listar(), api.categorias.listar()])
      .then(([prods, cats]) => {
        setProductos(prods);
        setCategorias(cats);
      })
      .catch((err) => console.error(err))
      .finally(() => setCargando(false));
  }, []);

  const filtrados = useMemo(() => {
    return productos.filter((p) => {
      const matchCategoria =
        categoriaActiva === "todas" || p.categoria?.slug === categoriaActiva;
      const matchBusqueda = p.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      return matchCategoria && matchBusqueda;
    });
  }, [productos, categoriaActiva, busqueda]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo</h1>
      <p className="text-gray-600 mb-8">
        Explorá todos nuestros productos. Hacé clic en uno para ver el detalle y consultar por WhatsApp.
      </p>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <select
          value={categoriaActiva}
          onChange={(e) => setCategoriaActiva(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="todas">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.slug}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {cargando && <p className="text-gray-500">Cargando productos...</p>}

      {!cargando && filtrados.length === 0 && (
        <p className="text-gray-500">No se encontraron productos con esos filtros.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtrados.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  );
}
