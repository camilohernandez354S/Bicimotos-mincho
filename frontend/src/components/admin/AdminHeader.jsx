import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, User, Menu, Settings } from 'lucide-react';

const AdminHeader = ({ onMenuToggle }) => {
  const location = useLocation();
  
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/admin/dashboard': return 'Dashboard';
      case '/admin/productos': return 'Productos';
      case '/admin/mensajes': return 'Mensajes';
      case '/admin/ordenes': return 'Órdenes';
      case '/admin/reportes': return 'Reportes';
      case '/admin/configuracion': return 'Configuración';
      default: return 'Dashboard';
    }
  };
  
  const currentPage = getPageTitle(location.pathname);
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuToggle}
            className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{currentPage}</h1>
            <p className="text-sm text-gray-500">Panel de administración</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Buscador */}
          <div className="hidden md:block relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar en admin..."
              className="input pl-12 w-80"
            />
          </div>
          
          {/* Notificaciones */}
          <button className="relative text-gray-600 hover:text-primary-500 transition-colors group">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
              3
            </span>
          </button>
          
          {/* Configuración */}
          <button className="text-gray-600 hover:text-primary-500 transition-colors">
            <Settings className="w-6 h-6" />
          </button>
          
          {/* Perfil de usuario */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
