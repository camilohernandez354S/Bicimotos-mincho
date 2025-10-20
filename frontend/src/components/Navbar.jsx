import React, { useState } from 'react';
import { Menu, X, Search, ChevronDown, ShoppingCart, User } from 'lucide-react';
import clsx from 'clsx';

const NAV_CATEGORIES = [
  {
    label: 'Bicicletas',
    columns: [
      { title: 'Asistidas / E-Bikes', items: ['E-MTB', 'Urbanas Eléctricas'] },
      { title: 'Marcas', items: ['GW', 'Scott', 'Orbea'] },
    ],
  },
  {
    label: 'Accesorios',
    columns: [
      { title: 'Componentes', items: ['Sillines', 'Pachas y Cadenas', 'Tensores', 'Lámparas'] },
      { title: 'Pedales', items: ['MTB', 'Ruta'] },
      { title: 'Suspensiones', items: ['Horquillas', 'Cartuchos', 'Aceites'] },
    ],
  },
  {
    label: 'Indumentaria',
    columns: [
      { title: 'Ropa', items: ['Chaquetas', 'Chalecos', 'Badanas'] },
      { title: 'Protección', items: ['Cascos', 'Guantes', 'Gafas'] },
      { title: 'Calzado', items: ['Zapatillas'] },
    ],
  },
  {
    label: 'Alimentación',
    columns: [
      { title: 'Energía', items: ['Geles', 'Barras'] },
    ],
  },
  {
    label: 'Catálogo',
    columns: [],
  },
];

function MegaMenu({ openIndex }) {
  if (openIndex === null || !NAV_CATEGORIES[openIndex] || NAV_CATEGORIES[openIndex].columns.length === 0) {
    return null;
  }
  const cat = NAV_CATEGORIES[openIndex];
  return (
    <div className="absolute left-0 right-0 top-full bg-negro border-b-4 border-rojo shadow-xl z-30">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {cat.columns.map((col, idx) => (
          <div key={idx}>
            <h4 className="text-amarillo font-bold mb-2">{col.title}</h4>
            <ul className="space-y-1">
              {col.items.map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-rojo transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="sticky top-0 z-40 bg-negro border-b-4 border-rojo">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <button className="md:hidden text-amarillo" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <img src="/img/logo.png" alt="Bicimotos Mincho" className="h-12" />
          <span className="hidden md:block text-2xl font-extrabold text-amarillo">BICIMOTOS MINCHO</span>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-2xl mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar productos, categorías..."
              className="w-full bg-gray-900 text-amarillo placeholder-gray-400 border-2 border-gray-700 focus:border-rojo rounded-lg py-2 pl-9 pr-3 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a href="/login" className="text-amarillo hover:text-rojo" title="Cuenta">
            <User className="w-6 h-6" />
          </a>
          <button className="relative text-amarillo hover:text-rojo" title="Carrito">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-rojo text-amarillo text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">0</span>
          </button>
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:block border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex gap-6">
          {NAV_CATEGORIES.map((c, idx) => (
            <div
              key={c.label}
              className="relative"
              onMouseEnter={() => setOpenIndex(idx)}
              onMouseLeave={() => setOpenIndex((prev) => (prev === idx ? null : prev))}
            >
              <button
                className={clsx(
                  'flex items-center gap-1 px-4 py-3 font-bold transition-colors',
                  openIndex === idx ? 'text-rojo' : 'text-amarillo hover:text-rojo'
                )}
              >
                {c.label}
                {c.columns.length > 0 && <ChevronDown className="w-4 h-4" />}
              </button>
              {openIndex === idx && <MegaMenu openIndex={idx} />}
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-800">
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full bg-gray-900 text-amarillo placeholder-gray-400 border-2 border-gray-700 focus:border-rojo rounded-lg py-2 pl-9 pr-3 outline-none"
              />
            </div>
            <ul className="space-y-2">
              {NAV_CATEGORIES.map((c) => (
                <li key={c.label}>
                  <a href="#" className="block px-2 py-2 text-amarillo font-bold hover:text-rojo">
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

export default Navbar;
