import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../services/api.js";
import ProductCard from "../components/ProductCard.jsx";
import { usePageMeta } from "../hooks/usePageMeta.js";

export default function Home() {
  usePageMeta({
    title: "Bicimotos Mincho — Bicicletas, accesorios y componentes",
    description:
      "Tu bicicletería de confianza. Bicicletas completas, marcos, accesorios y componentes. Consultá por WhatsApp.",
  });

  const [destacados, setDestacados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.productos
      .listar()
      .then((productos) => setDestacados(productos.filter((p) => p.destacado).slice(0, 4)))
      .catch((err) => console.error(err))
      .finally(() => setCargando(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold">
            Tu próxima bici te espera
          </h1>
          <p className="mt-4 text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
            Bicicletas, marcos, accesorios y componentes — todo lo que necesitás para rodar.
          </p>
          <Link
            to="/catalogo"
            className="inline-block mt-8 bg-white text-orange-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Ver catálogo
          </Link>
        </div>
      </section>

      {/* Destacados */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Productos destacados</h2>

        {cargando && <p className="text-gray-500">Cargando...</p>}

        {!cargando && destacados.length === 0 && (
          <p className="text-gray-500">No hay productos destacados todavía.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destacados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      </section>
    </>
  );
}
