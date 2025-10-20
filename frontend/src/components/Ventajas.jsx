function Ventajas() {
  return (
    <section className="w-full py-12 bg-negro text-amarillo flex flex-col items-center">
      <h2 className="text-4xl font-bold mb-8 text-rojo">¿Por qué elegirnos?</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-6xl">
        <div className="flex flex-col items-center">
          <span className="text-5xl mb-2">🚴‍♂️</span>
          <p className="text-center font-bold">Productos Shimano 100% originales</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-5xl mb-2">🛒</span>
          <p className="text-center font-bold">Compra fácil y segura online</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-5xl mb-2">🔧</span>
          <p className="text-center font-bold">Taller especializado y confiable</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-5xl mb-2">🚚</span>
          <p className="text-center font-bold">Envíos rápidos y seguimiento</p>
        </div>
      </div>
    </section>
  );
}

export default Ventajas;
