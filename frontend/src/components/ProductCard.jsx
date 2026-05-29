import { Link } from "react-router-dom";

import { cldImage } from "../utils/cloudinary.js";

const PLACEHOLDER = "https://placehold.co/600x400/e5e7eb/9ca3af?text=Sin+foto";

function formatPrecio(precio) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(precio));
}

export default function ProductCard({ producto }) {
  // Cards en grilla: máx 400px de ancho en desktop, menos en tablet
  const imagen = cldImage(producto.imagenes?.[0], { w: 600, h: 400 }) || PLACEHOLDER;

  return (
    <Link
      to={`/producto/${producto.id}`}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition border border-gray-100"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imagen}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-orange-500 font-semibold">
          {producto.categoria?.nombre}
        </p>
        <h3 className="mt-1 font-semibold text-gray-900 line-clamp-2">
          {producto.nombre}
        </h3>
        {producto.marca && (
          <p className="text-sm text-gray-500 mt-1">{producto.marca}</p>
        )}
        <p className="mt-3 text-lg font-bold text-gray-900">
          {formatPrecio(producto.precio)}
        </p>
      </div>
    </Link>
  );
}
