const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;
const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hola! Quería hacerles una consulta."
)}`;

export default function Contacto() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Contacto</h1>
      <p className="mt-4 text-gray-600 text-lg">
        La forma más rápida de contactarnos es por WhatsApp. Te respondemos en el día.
      </p>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition"
      >
        <span className="text-xl">💬</span>
        Escribinos por WhatsApp
      </a>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-2">Horarios</h2>
          <p className="text-gray-600 text-sm">Lunes a Sábado<br />9:00 a 19:00 hs</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-2">Dirección</h2>
          <p className="text-gray-600 text-sm">Próximamente — agregar dirección real</p>
        </div>
      </div>
    </section>
  );
}
