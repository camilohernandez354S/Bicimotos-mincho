import React from 'react';
import { ArrowRight, Truck, Shield, Star } from 'lucide-react';

const Banners = () => {
  return (
    <div className="w-full bg-negro">
      {/* Banner principal */}
      <div className="bg-gradient-to-r from-rojo to-red-600 text-amarillo py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¡Disfruta de Envíos Gratis a partir de $200.000!
          </h2>
          <p className="text-lg mb-6">
            Los mejores componentes Shimano con garantía de calidad
          </p>
          <a 
            href="#catalogo" 
            className="inline-flex items-center gap-2 bg-amarillo text-negro font-bold px-8 py-3 rounded-lg text-lg hover:bg-yellow-300 transition-colors"
          >
            Ver Catálogo
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Banner secundario */}
      <div className="bg-gray-900 text-amarillo py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-6 h-6 text-rojo" />
            <span className="text-xl font-bold">SUPER PRECIO EN LOS MEJORES COMPONENTES DEL MERCADO</span>
            <Star className="w-6 h-6 text-rojo" />
          </div>
          <p className="text-gray-300">Componentes Shimano originales con descuentos especiales</p>
        </div>
      </div>

      {/* Características destacadas */}
      <div className="py-8 bg-negro">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 bg-gray-900 p-4 rounded-lg">
              <Truck className="w-8 h-8 text-rojo" />
              <div>
                <h3 className="font-bold text-amarillo text-lg">Envíos Gratis</h3>
                <p className="text-gray-300 text-sm">Compras desde $200.000</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-900 p-4 rounded-lg">
              <Shield className="w-8 h-8 text-rojo" />
              <div>
                <h3 className="font-bold text-amarillo text-lg">Garantía Total</h3>
                <p className="text-gray-300 text-sm">2 años de garantía</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-900 p-4 rounded-lg">
              <Star className="w-8 h-8 text-rojo" />
              <div>
                <h3 className="font-bold text-amarillo text-lg">Productos Originales</h3>
                <p className="text-gray-300 text-sm">100% Shimano auténtico</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banners;
