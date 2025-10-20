import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Settings,
  MessageSquare,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { 
      id: 'dashboard', 
      icon: BarChart3, 
      label: 'Dashboard', 
      href: '/admin/dashboard',
      badge: null
    },
    { 
      id: 'productos', 
      icon: Package, 
      label: 'Productos', 
      href: '/admin/productos',
      badge: '156'
    },
    { 
      id: 'mensajes', 
      icon: MessageSquare, 
      label: 'Mensajes', 
      href: '/admin/mensajes',
      badge: '7'
    },
    { 
      id: 'ordenes', 
      icon: ShoppingCart, 
      label: 'Órdenes', 
      href: '/admin/ordenes',
      badge: '89'
    },
    { 
      id: 'reportes', 
      icon: TrendingUp, 
      label: 'Reportes', 
      href: '/admin/reportes',
      badge: null
    },
    { 
      id: 'configuracion', 
      icon: Settings, 
      label: 'Configuración', 
      href: '/admin/configuracion',
      badge: null
    },
  ];

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={clsx(
        'fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:z-auto w-64'
      )}>
        <div className="p-6">
          {/* Logo y marca */}
          <div className="flex items-center gap-3 mb-8">
            <img src="/img/logo.jpg" alt="Bicimotos Mincho" className="h-8" />
            <div>
              <span className="font-display font-bold text-gray-900 text-lg">Admin</span>
              <p className="text-xs text-gray-500">Panel de Control</p>
            </div>
          </div>
          
          {/* Menú */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={clsx(
                    'flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200 group',
                    isActive
                      ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                <div className="flex items-center gap-3">
                  <item.icon className={clsx(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                  )} />
                  <span>{item.label}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span className={clsx(
                      'px-2 py-1 text-xs font-bold rounded-full',
                      isActive 
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600'
                    )}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={clsx(
                    'w-4 h-4 transition-transform',
                    isActive ? 'rotate-90 text-primary-600' : 'text-gray-400'
                  )} />
                </div>
              </Link>
              );
            })}
          </nav>

          {/* Footer del sidebar */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
