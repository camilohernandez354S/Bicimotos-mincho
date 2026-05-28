export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm">
          © {year} Bicimotos Mincho. Todos los derechos reservados.
        </p>
        <p className="text-sm">
          Consultá por WhatsApp para concretar tu compra.
        </p>
      </div>
    </footer>
  );
}
