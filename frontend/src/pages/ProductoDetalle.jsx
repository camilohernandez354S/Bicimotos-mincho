import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { api } from "../services/api.js";
import { usePageMeta } from "../hooks/usePageMeta.js";

const PLACEHOLDER = "https://placehold.co/800x600/e5e7eb/9ca3af?text=Sin+foto";
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

function formatPrecio(precio) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(precio));
}

function buildWhatsAppUrl(producto) {
  const mensaje = `Hola! Me interesa el producto "${producto.nombre}" que vi en su web. ¿Está disponible?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
}

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCargando(true);
    api.productos
      .obtener(id)
      .then(setProducto)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, [id]);

  // Título dinámico — se actualiza cuando el producto se carga.
  usePageMeta({
    title: producto?.nombre,
    description: producto?.descripcion || undefined,
  });

  if (cargando) {
    return <div className="max-w-6xl mx-auto px-4 py-12 text-gray-500">Cargando producto...</div>;
  }

  if (error || !producto) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <p className="text-red-600">{error || "Producto no encontrado"}</p>
        <Link to="/catalogo" className="text-orange-500 hover:underline mt-4 inline-block">
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  const imagenes = producto.imagenes?.length > 0 ? producto.imagenes : [PLACEHOLDER];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <Link to="/catalogo" className="text-orange-500 hover:underline text-sm">
        ← Volver al catálogo
      </Link>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Galería */}
        <div>
          <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={imagenes[imagenActiva]}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
          </div>
          {imagenes.length > 1 && (
            <div className="flex gap-2 mt-4">
              {imagenes.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImagenActiva(idx)}
                  className={`w-20 h-20 rounded-md overflow-hidden border-2 transition ${
                    idx === imagenActiva ? "border-orange-500" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm uppercase tracking-wide text-orange-500 font-semibold">
            {producto.categoria?.nombre}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{producto.nombre}</h1>
          {producto.marca && (
            <p className="mt-1 text-gray-600">
              {producto.marca} {producto.modelo && `• ${producto.modelo}`}
            </p>
          )}

          <p className="mt-6 text-4xl font-bold text-gray-900">
            {formatPrecio(producto.precio)}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {producto.stock > 0
              ? `${producto.stock} unidades disponibles`
              : "Consultar disponibilidad"}
          </p>

          {producto.descripcion && (
            <div className="mt-6">
              <h2 className="font-semibold text-gray-900 mb-2">Descripción</h2>
              <p className="text-gray-700 whitespace-pre-line">{producto.descripcion}</p>
            </div>
          )}

          <a
            href={buildWhatsAppUrl(producto)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg transition"
          >
            <span className="text-xl">💬</span>
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
