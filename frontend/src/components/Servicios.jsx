function Servicios() {
  return (
    <section className="w-full py-12 bg-negro text-amarillo flex flex-col items-center">
      <h2 className="text-4xl font-bold mb-8 text-rojo">Servicios de Taller</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        <div className="bg-negro border-4 border-rojo rounded-xl p-6 flex flex-col items-center shadow-lg">
          <span className="text-5xl mb-4">🔧</span>
          <h3 className="text-2xl font-bold mb-2 text-amarillo">Mantenimiento General</h3>
          <p className="mb-2 text-center">Revisión completa, lubricación y ajuste de tu bicicleta.</p>
        </div>
        <div className="bg-negro border-4 border-rojo rounded-xl p-6 flex flex-col items-center shadow-lg">
          <span className="text-5xl mb-4">⚙️</span>
          <h3 className="text-2xl font-bold mb-2 text-amarillo">Ajuste de Transmisión</h3>
          <p className="mb-2 text-center">Optimiza el cambio de marchas y prolonga la vida útil de tu bici.</p>
        </div>
        <div className="bg-negro border-4 border-rojo rounded-xl p-6 flex flex-col items-center shadow-lg">
          <span className="text-5xl mb-4">🛠️</span>
          <h3 className="text-2xl font-bold mb-2 text-amarillo">Reparación de Frenos</h3>
          <p className="mb-2 text-center">Frenos seguros y potentes para cualquier terreno.</p>
        </div>
      </div>
      <a href="#" className="mt-8 bg-amarillo text-negro font-bold px-8 py-4 rounded-lg text-xl shadow-lg hover:bg-rojo hover:text-amarillo transition">Reservar Servicio</a>
    </section>
  );
}

export default Servicios;
