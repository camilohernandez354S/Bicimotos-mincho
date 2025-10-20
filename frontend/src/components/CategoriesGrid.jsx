import React from 'react';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    id: 1,
    name: 'Transmisiones',
    slug: 'transmisiones',
    image: 'https://via.placeholder.com/300x200',
    description: 'Grupos completos Shimano'
  },
  {
    id: 2,
    name: 'Frenos',
    slug: 'frenos',
    image: 'https://via.placeholder.com/300x200',
    description: 'Sistemas hidráulicos'
  },
  {
    id: 3,
    name: 'Ruedas',
    slug: 'ruedas',
    image: 'https://via.placeholder.com/300x200',
    description: 'Llantas y cubiertas'
  },
  {
    id: 4,
    name: 'Suspensiones',
    slug: 'suspensiones',
    image: 'https://via.placeholder.com/300x200',
    description: 'Horquillas y amortiguadores'
  },
  {
    id: 5,
    name: 'Pedales',
    slug: 'pedales',
    image: 'https://via.placeholder.com/300x200',
    description: 'MTB y Ruta'
  },
  {
    id: 6,
    name: 'Accesorios',
    slug: 'accesorios',
    image: 'https://via.placeholder.com/300x200',
    description: 'Componentes varios'
  },
  {
    id: 7,
    name: 'Indumentaria',
    slug: 'indumentaria',
    image: 'https://via.placeholder.com/300x200',
    description: 'Ropa y protección'
  },
  {
    id: 8,
    name: 'Herramientas',
    slug: 'herramientas',
    image: 'https://via.placeholder.com/300x200',
    description: 'Mantenimiento'
  }
];

const CategoriesGrid = () => {
  return (
    <section className="w-full py-16 bg-negro text-amarillo">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-rojo">Explora Nuestras Categorías</h2>
          <p className="text-xl text-gray-300">Encuentra los mejores componentes Shimano organizados por categoría</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {CATEGORIES.map((category) => (
            <a
              key={category.id}
              href={`/categoria/${category.slug}`}
              className="group bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-amarillo text-lg mb-1">{category.name}</h3>
                <p className="text-gray-400 text-sm">{category.description}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center">
          <a
            href="/catalogo"
            className="inline-flex items-center gap-2 bg-rojo text-amarillo font-bold px-8 py-3 rounded-lg text-lg hover:bg-red-600 transition-colors"
          >
            Ver Todo el Catálogo
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;
