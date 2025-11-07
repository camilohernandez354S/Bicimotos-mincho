import React, { useState } from 'react';
import { Menu, X, Search, ChevronDown, ShoppingCart, User, Heart } from 'lucide-react';
import clsx from 'clsx';

const NAV_CATEGORIES = [
  {
    label: 'Bicicletas',
    columns: [
      { title: 'E-Bikes', items: ['Urbanas Eléctricas', 'Mountain E-Bikes'] },
      { title: 'Marcas', items: ['GW', 'Scott', 'Orbea'] },
    ],
  },
  {
    label: 'Componentes',
    columns: [
      { title: 'Transmisiones', items: ['Shimano XT', 'Shimano Deore', 'SRAM'] },
      { title: 'Frenos', items: ['Hidráulicos', 'Mecánicos', 'Discos'] },
      { title: 'Ruedas', items: ['MTB', 'Ruta', 'Urbanas'] },
    ],
  },
  {
    label: 'Accesorios',
    columns: [
      { title: 'Suspensiones', items: ['Horquillas', 'Amortiguadores'] },
      { title: 'Pedales', items: ['MTB', 'Ruta', 'Urbanos'] },
      { title: 'Otros', items: ['Sillines', 'Manillares', 'Pedales'] },
    ],
  },
  {
    label: 'Indumentaria',
    columns: [
      { title: 'Ropa', items: ['Chaquetas', 'Chalecos', 'Badanas'] },
      { title: 'Protección', items: ['Cascos', 'Guantes', 'Gafas'] },
    ],
  },
];

function MegaMenu({ openIndex }) {
  if (
    openIndex === null ||
    !NAV_CATEGORIES[openIndex] ||
    NAV_CATEGORIES[openIndex].columns.length === 0
  ) {
    return null;
  }

  const cat = NAV_CATEGORIES[openIndex];

  return (
    <div className="absolute left-1/2 top-full -translate-x-1/2 bg-white shadow-lg border-t border-gray-200 z-30 animate-slide-up">
      <div className="w-[90vw] max-w-5xl px-8 py-8">
        <div
          className={clsx(
            'grid gap-x-12 gap-y-6 text-gray-700',
            cat.columns.length === 1 && 'grid-cols-1',
            cat.columns.length === 2 && 'grid-cols-2',
            cat.columns.length === 3 && 'grid-cols-3',
            cat.columns.length === 4 && 'grid-cols-4'
          )}
        >
          {cat.columns.map((col, idx) => (
            <div key={idx} className="min-w-[220px]">
              <h4 className="font-semibold text-gray-900 mb-3 text-base border-b border-gray-200 pb-1">
                {col.title}
              </h4>
              <ul className="space-y-1">
                {col.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="block text-sm text-gray-600 hover:text-primary-500 transition-colors whitespace-nowrap"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const UserNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-soft">
      {/* Top bar */}
      <div className="wrapper">
        <div className="flex items-center justify-between py-4">
          {/* Logo y marca */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-600 hover:text-primary-500 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <img src="/img/logo.jpg" alt="Bicimotos Mincho" className="h-10" />
            <span className="hidden md:block text-2xl font-display font-bold text-gray-900">
              BICIMOTOS MINCHO
            </span>
          </div>

          {/* Buscador */}
          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar productos Shimano..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-12 pr-4"
              />
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-primary-500 transition-colors" title="Favoritos">
              <Heart className="w-6 h-6" />
            </button>
            <a href="/login" className="text-gray-600 hover:text-primary-500 transition-colors" title="Mi cuenta">
              <User className="w-6 h-6" />
            </a>
            <button className="relative text-gray-600 hover:text-primary-500 transition-colors" title="Carrito">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                0
              </span>
            </button>
          </div>
        </div>

        {/* Navegación desktop */}
        {false && (
          <nav className="hidden md:block border-t border-gray-100">
            <div className="wrapper">
              <div className="flex gap-8 py-4">
                {NAV_CATEGORIES.map((c, idx) => (
                  <div
                    key={c.label}
                    className="relative"
                    onMouseEnter={() => setOpenIndex(idx)}
                    onMouseLeave={() => setOpenIndex(null)}
                  >
                    <button
                      className={clsx(
                        'flex items-center gap-1 px-3 py-2 font-medium transition-colors rounded-lg',
                        openIndex === idx
                          ? 'text-primary-500 bg-primary-50'
                          : 'text-gray-700 hover:text-primary-500 hover:bg-gray-50'
                      )}
                    >
                      {c.label}
                      {c.columns.length > 0 && <ChevronDown className="w-4 h-4" />}
                    </button>
                    {openIndex === idx && <MegaMenu openIndex={idx} />}
                  </div>
                ))}
              </div>
            </div>
          </nav>
        )}
      </div>

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="wrapper py-4">
            <div className="relative mb-4">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="input pl-12"
              />
            </div>
            <ul className="space-y-2">
              {NAV_CATEGORIES.map((c) => (
                <li key={c.label}>
                  <a
                    href="#"
                    className="block px-3 py-2 text-gray-700 font-medium hover:text-primary-500 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNavbar;
