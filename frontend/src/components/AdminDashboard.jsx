import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Settings,
  Menu,
  X,
  Search,
  Bell,
  User
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/admin', active: true },
    { icon: Package, label: 'Productos', href: '/admin/productos' },
    { icon: Users, label: 'Usuarios', href: '/admin/usuarios' },
    { icon: ShoppingCart, label: 'Órdenes', href: '/admin/ordenes' },
    { icon: TrendingUp, label: 'Reportes', href: '/admin/reportes' },
    { icon: Settings, label: 'Configuración', href: '/admin/configuracion' },
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
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-64
      `}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img src="/img/logo.png" alt="Bicimotos Mincho" className="h-8" />
            <span className="font-display font-bold text-gray-900">Admin Panel</span>
          </div>
          
          {/* Menú */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors
                  ${item.active 
                    ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-500' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

const AdminHeader = ({ onMenuToggle }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuToggle}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar en admin..."
              className="input pl-12 w-80"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative text-gray-600 hover:text-gray-900">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">Admin User</div>
              <div className="text-xs text-gray-500">Administrador</div>
            </div>
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const StatsCard = ({ title, value, change, icon: Icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-green-600 mt-1">{change}</p>
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    {
      title: 'Ventas Totales',
      value: '$12.5M',
      change: '+12.5% vs mes anterior',
      icon: TrendingUp,
      color: 'primary'
    },
    {
      title: 'Productos',
      value: '156',
      change: '+8 nuevos',
      icon: Package,
      color: 'secondary'
    },
    {
      title: 'Usuarios',
      value: '1,234',
      change: '+5.2% vs mes anterior',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Órdenes',
      value: '89',
      change: '+23% vs mes anterior',
      icon: ShoppingCart,
      color: 'blue'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <AdminHeader onMenuToggle={() => setSidebarOpen(true)} />
        
        <main className="p-6">
          {/* Header del dashboard */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Bienvenido al panel de administración de Bicimotos Mincho</p>
          </div>
          
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
          
          {/* Contenido principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de ventas */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventas por Mes</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Gráfico de ventas</p>
              </div>
            </div>
            
            {/* Productos más vendidos */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos Más Vendidos</h3>
              <div className="space-y-4">
                {[
                  { name: 'Shimano XT M8100', sales: 45, revenue: '$2.1M' },
                  { name: 'Frenos Deore BR-M6120', sales: 32, revenue: '$1.5M' },
                  { name: 'Ruedas Deore XT', sales: 28, revenue: '$1.8M' },
                ].map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} ventas</p>
                    </div>
                    <p className="font-semibold text-primary-600">{product.revenue}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
