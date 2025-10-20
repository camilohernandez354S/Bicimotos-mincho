import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20">
        <div className="wrapper">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Componentes de 
                <span className="text-primary-500 block">Bicicletas</span>
                de Calidad
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Encuentra los mejores componentes Shimano y accesorios para tu bicicleta. 
                Calidad garantizada y envío rápido a toda Colombia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/productos" 
                  className="btn-primary px-8 py-4 text-lg inline-flex items-center gap-2"
                >
                  Ver Productos
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/contacto" 
                  className="btn-secondary px-8 py-4 text-lg"
                >
                  Contactar
                </Link>
              </div>
            </div>
            <div className="relative animate-slide-up">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 text-gray-900">
                  <h3 className="text-2xl font-bold mb-4">Ofertas Especiales</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span>Descuentos hasta 30%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-green-500" />
                      <span>Envío gratis +$200.000</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-blue-500" />
                      <span>Garantía extendida</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="wrapper">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Bicimotos Mincho?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos especialistas en componentes de bicicletas con más de 10 años de experiencia
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-card hover:shadow-xl transition-shadow animate-fade-in">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Calidad Premium</h3>
              <p className="text-gray-600">Solo productos originales de marcas reconocidas</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-card hover:shadow-xl transition-shadow animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Envío Rápido</h3>
              <p className="text-gray-600">Entrega en 24-48 horas en Bogotá</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-card hover:shadow-xl transition-shadow animate-fade-in">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Garantía</h3>
              <p className="text-gray-600">Garantía extendida en todos nuestros productos</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-card hover:shadow-xl transition-shadow animate-fade-in">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Soporte</h3>
              <p className="text-gray-600">Atención especializada y asesoría técnica</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="wrapper text-center">
          <h2 className="text-4xl font-bold mb-4">
            ¿Listo para mejorar tu bicicleta?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Explora nuestro catálogo completo de componentes Shimano y accesorios de alta calidad
          </p>
          <Link 
            to="/productos" 
            className="btn-white px-8 py-4 text-lg inline-flex items-center gap-2"
          >
            Ver Catálogo Completo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
