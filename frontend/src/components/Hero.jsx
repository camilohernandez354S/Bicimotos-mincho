import React from 'react';
import { ArrowRight, Star, Shield, Truck, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="wrapper section relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenido principal */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>Los mejores componentes Shimano</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6 leading-tight">
              Tu tienda de confianza para{' '}
              <span className="text-transparent bg-clip-text gradient-primary">
                componentes Shimano
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Descubre la mejor selección de componentes Shimano originales con garantía de calidad, 
              envíos gratis y el mejor servicio al cliente.
            </p>

            {/* Características destacadas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-soft">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Envío Gratis</h3>
                  <p className="text-xs text-gray-500">Desde $200.000</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-soft">
                <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-secondary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Garantía</h3>
                  <p className="text-xs text-gray-500">2 años oficial</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-soft">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Originales</h3>
                  <p className="text-xs text-gray-500">100% auténticos</p>
                </div>
              </div>
            </div>

            {/* Botones CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#productos" 
                className="btn-primary px-8 py-4 text-lg font-semibold group"
              >
                Ver Catálogo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="#contacto" 
                className="btn-outline px-8 py-4 text-lg font-semibold"
              >
                Contactar
              </a>
            </div>
          </div>

          {/* Imagen destacada */}
          <div className="relative animate-slide-up">
            <div className="relative">
              <img 
                src="https://via.placeholder.com/600x500" 
                alt="Componentes Shimano" 
                className="w-full h-auto rounded-2xl shadow-strong"
              />
              
              {/* Badge flotante */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-strong p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-500">500+</div>
                  <div className="text-xs text-gray-600">Productos</div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-strong p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-500">1000+</div>
                  <div className="text-xs text-gray-600">Clientes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;