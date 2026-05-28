import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-24 text-center">
      <p className="text-6xl">🚲💨</p>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">Página no encontrada</h1>
      <p className="mt-2 text-gray-600">La ruta que buscás no existe.</p>
      <Link
        to="/"
        className="mt-6 inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
