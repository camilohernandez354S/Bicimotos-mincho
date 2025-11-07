import React, { useState } from 'react';
import clsx from 'clsx';

const OFFICIAL_CATEGORIES = [
  'Grupos de cambios',
  'Llantas',
  'Rines',
  'Frenos',
  'Discos',
  'Manubrios',
  'Suspensiones',
  'Cascos',
  'Ropa',
  'Zapatillas',
  'Gafas',
  'Medias',
  'Guantes',
  'Repuestos en general de la bicicleta'
];

const SidebarCategorias = ({ selectedCategory, onSelectCategoria }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (category) => {
    onSelectCategoria && onSelectCategoria(category);
    setMobileOpen(false);
  };

  const renderList = () => (
    <>
      <div className="border-b border-gray-200 pb-3 mb-4">
        <p className="text-xs uppercase tracking-widest text-primary-600 font-semibold">Explora</p>
        <h2 className="text-lg font-bold text-gray-900">Categorías</h2>
      </div>

      <ul className="space-y-2">
        {OFFICIAL_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <li key={cat}>
              <button
                onClick={() => handleSelect(cat)}
                className={clsx(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border',
                  isActive
                    ? 'bg-primary-500 text-white border-primary-600 shadow-primary-200 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                )}
              >
                <span className="truncate">{cat}</span>
                <span
                  className={clsx(
                    'text-xs px-2 py-0.5 rounded-md font-semibold',
                    isActive ? 'bg-white text-primary-600' : 'bg-gray-200 text-gray-700'
                  )}
                >
                  Ver
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 bg-primary-50 border border-primary-100 text-primary-700 text-sm rounded-xl p-4 shadow-sm">
        <p className="font-semibold">¿Buscas algo específico?</p>
        <p className="text-xs text-primary-600 mt-1">
          Usa los filtros superiores o explora nuestras categorías destacadas.
        </p>
      </div>
    </>
  );

  return (
    <div className="relative w-full">
      {/* Versión móvil */}
      <div className="lg:hidden">
        <div className="fixed top-20 left-3 z-50">
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-2 bg-primary-500 text-white rounded-md shadow-md"
            aria-label="Mostrar categorías"
          >
            ☰ Categorías
          </button>
        </div>

        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div
          className={clsx(
            'fixed top-28 left-1/2 -translate-x-1/2 w-[min(90vw,22rem)] bg-white border border-gray-200 rounded-2xl shadow-xl z-50 transform transition-transform duration-300 ease-out',
            mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0 pointer-events-none'
          )}
        >
          <div className="p-4">
            {renderList()}
          </div>
        </div>
      </div>

      {/* Versión escritorio */}
      <div className="hidden lg:block">
        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sticky top-24">
          {renderList()}
        </div>
      </div>
    </div>
  );
};

SidebarCategorias.defaultProps = {
  selectedCategory: '',
  onSelectCategoria: undefined,
};

export default SidebarCategorias;
