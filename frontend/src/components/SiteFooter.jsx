import React from 'react';
import { Mail, Phone, MapPin, Instagram, Youtube, Facebook } from 'lucide-react';

const SiteFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-negro text-amarillo border-t-4 border-rojo">
      {/* Sección principal del footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Información de contacto */}
          <div>
            <h3 className="font-bold text-rojo text-xl mb-4">BICIMOTOS MINCHO</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rojo" />
                <span className="text-sm">Calle 123 #45-67, Bogotá, Colombia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-rojo" />
                <span className="text-sm">+57 300 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-rojo" />
                <span className="text-sm">info@bicimotosmincho.com</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Más de 5 años entregando los mejores productos Shimano a nuestros clientes
            </p>
          </div>

          {/* Productos */}
          <div>
            <h4 className="font-bold text-amarillo text-lg mb-4">PRODUCTOS</h4>
            <ul className="space-y-2">
              <li><a href="/catalogo" className="text-gray-300 hover:text-rojo transition-colors text-sm">Catálogo</a></li>
              <li><a href="/categoria/transmisiones" className="text-gray-300 hover:text-rojo transition-colors text-sm">Transmisiones</a></li>
              <li><a href="/categoria/frenos" className="text-gray-300 hover:text-rojo transition-colors text-sm">Frenos</a></li>
              <li><a href="/categoria/ruedas" className="text-gray-300 hover:text-rojo transition-colors text-sm">Ruedas</a></li>
              <li><a href="/categoria/suspensiones" className="text-gray-300 hover:text-rojo transition-colors text-sm">Suspensiones</a></li>
              <li><a href="/categoria/accesorios" className="text-gray-300 hover:text-rojo transition-colors text-sm">Accesorios</a></li>
            </ul>
          </div>

          {/* Políticas */}
          <div>
            <h4 className="font-bold text-amarillo text-lg mb-4">POLÍTICAS</h4>
            <ul className="space-y-2">
              <li><a href="/politica-privacidad" className="text-gray-300 hover:text-rojo transition-colors text-sm">Política de Privacidad</a></li>
              <li><a href="/politica-envios" className="text-gray-300 hover:text-rojo transition-colors text-sm">Política de Envíos</a></li>
              <li><a href="/politica-devoluciones" className="text-gray-300 hover:text-rojo transition-colors text-sm">Política de Devoluciones</a></li>
              <li><a href="/terminos-condiciones" className="text-gray-300 hover:text-rojo transition-colors text-sm">Términos y Condiciones</a></li>
            </ul>
          </div>

          {/* Newsletter y redes sociales */}
          <div>
            <h4 className="font-bold text-amarillo text-lg mb-4">SÍGUENOS</h4>
            <div className="flex gap-3 mb-4">
              <a href="#" className="text-gray-300 hover:text-rojo transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-rojo transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-rojo transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
            
            <div className="mb-4">
              <h5 className="font-bold text-amarillo text-sm mb-2">Suscríbete para conocer más</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="flex-1 bg-gray-900 text-amarillo placeholder-gray-400 border-2 border-gray-700 focus:border-rojo rounded-l-lg py-2 px-3 outline-none text-sm"
                />
                <button className="bg-rojo text-amarillo px-4 py-2 rounded-r-lg hover:bg-red-600 transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Medios de pago */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-4">
            <h5 className="font-bold text-amarillo text-sm mb-2">Formas de pago</h5>
            <div className="flex justify-center gap-4 text-xs text-gray-400">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>American Express</span>
              <span>Mercado Pago</span>
              <span>Contraentrega</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Bicimotos Mincho. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
