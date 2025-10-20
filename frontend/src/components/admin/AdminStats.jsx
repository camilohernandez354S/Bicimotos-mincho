import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const AdminStats = () => {
  // Datos de ejemplo para los gráficos
  const salesData = [
    { name: 'Ene', ventas: 4000, usuarios: 1200 },
    { name: 'Feb', ventas: 4500, usuarios: 1350 },
    { name: 'Mar', ventas: 5000, usuarios: 1500 },
    { name: 'Abr', ventas: 4800, usuarios: 1450 },
    { name: 'May', ventas: 5200, usuarios: 1600 },
    { name: 'Jun', ventas: 5500, usuarios: 1700 },
  ];

  const topProducts = [
    { name: 'Shimano XT M8100', sales: 45, revenue: '$2.1M' },
    { name: 'Frenos Deore BR-M6120', sales: 32, revenue: '$1.5M' },
    { name: 'Ruedas Deore XT', sales: 28, revenue: '$1.8M' },
    { name: 'Pedales Shimano XTR', sales: 24, revenue: '$1.2M' },
  ];

  return (
    <div className="space-y-6">
      {/* Gráfico de ventas */}
      <div className="bg-white p-6 rounded-xl shadow-card animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Ventas por Mes</h3>
            <p className="text-sm text-gray-500">Últimos 6 meses</p>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+12.5%</span>
          </div>
        </div>
        
        {/* Placeholder para gráfico */}
        <div className="h-64 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-50" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
          <div className="text-center z-10">
            <Activity className="w-12 h-12 text-primary-500 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Gráfico de Ventas</p>
            <p className="text-sm text-gray-500">Integrar con Recharts</p>
          </div>
        </div>
      </div>

      {/* Productos más vendidos */}
      <div className="bg-white p-6 rounded-xl shadow-card animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Ver todos
          </button>
        </div>
        
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} ventas</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary-600">{product.revenue}</p>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs">+{Math.floor(Math.random() * 20) + 5}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-card animate-fade-up">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Conversión</h4>
              <p className="text-2xl font-bold text-gray-900">3.2%</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-sm text-green-600">+0.3%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-card animate-fade-up">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Ticket Promedio</h4>
              <p className="text-2xl font-bold text-gray-900">$245</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-sm text-green-600">+$12</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-card animate-fade-up">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Tiempo en Sitio</h4>
              <p className="text-2xl font-bold text-gray-900">4m 32s</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3 text-red-600" />
                <span className="text-sm text-red-600">-8s</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
