function Contacto() {
  return (
    <section className="w-full py-12 bg-negro text-amarillo flex flex-col items-center">
      <h2 className="text-4xl font-bold mb-8 text-rojo">Contáctanos</h2>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl items-center justify-center">
        <div className="flex-1 text-center">
          <p className="mb-2">📍 Calle 123 #45-67, Ciudad</p>
          <p className="mb-2">📞 300 123 4567</p>
          <p className="mb-2">✉️ contacto@bicimotosmincho.com</p>
        </div>
        <div className="flex-1">
          <iframe
            title="Ubicación Bicimotos Mincho"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.8700000000003!2d-74.000000!3d4.600000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDM2JzAwLjAiTiA3NMKwMDAnMDAuMCJX!5e0!3m2!1ses!2sco!4v0000000000000" 
            width="100%" height="200" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </section>
  );
}

export default Contacto;
