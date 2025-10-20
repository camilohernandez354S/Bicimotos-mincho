import React from 'react';
import { TrendingUp, BarChart3, DollarSign, Users, Package, MessageSquare } from 'lucide-react';

const AdminReports = () => {
  // Datos mock para reportes
  const salesData = [
    { month: 'Ene', sales: 12000000, orders: 45 },
    { month: 'Feb', sales: 15000000, orders: 52 },
    { month: 'Mar', sales: 18000000, orders: 68 },
    { month: 'Abr', sales: 16000000, orders: 61 },
    { month: 'May', sales: 20000000, orders: 78 },
    { month: 'Jun', sales: 22000000, orders: 85 }
  ];

  const topProducts = [
    { name: 'Frenos Shimano Deore XT', sales: 24, revenue: 10800000 },
    { name: 'Cambio Shimano SLX', sales: 18, revenue: 5760000 },
    { name: 'Pedales Shimano SPD', sales: 32, revenue: 5760000 },
    { name: 'Cadena Shimano HG-X', sales: 45, revenue: 3825000 }
  ];

  const customerStats = [
    { label: 'Clientes Nuevos', value: 156, change: '+12%', color: 'text-green-600' },
    { label: 'Clientes Recurrentes', value: 89, change: '+8%', color: 'text-blue-600' },
    { label: 'Clientes Inactivos', value: 23, change: '-3%', color: 'text-red-600' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reportes y Estadísticas</h1>
          <p className="text-gray-600">Análisis detallado del rendimiento de tu tienda</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-secondary px-4 py-2">
            <BarChart3 className="w-5 h-5 mr-2" />
            Exportar PDF
          </button>
          <button className="btn-primary px-4 py-2">
            <TrendingUp className="w-5 h-5 mr-2" />
            Generar Reporte
          </button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas Totales</p>
              <p className="text-2xl font-bold text-gray-900">$103M</p>
              <p className="text-sm text-green-600">+15% vs mes anterior</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Órdenes</p>
              <p className="text-2xl font-bold text-gray-900">389</p>
              <p className="text-sm text-blue-600">+8% vs mes anterior</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes</p>
              <p className="text-2xl font-bold text-gray-900">268</p>
              <p className="text-sm text-purple-600">+12% vs mes anterior</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mensajes</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-sm text-orange-600">+5% vs mes anterior</p>
            </div>
            <MessageSquare className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Gráfico de Ventas */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Ventas por Mes</h2>
          <div className="flex gap-2">
            <button className="btn-outline px-3 py-1 text-sm">6 meses</button>
            <button className="btn-primary px-3 py-1 text-sm">1 año</button>
          </div>
        </div>
        
        <div className="space-y-4">
          {salesData.map((data, index) => (
            <div key={data.month} className="flex items-center gap-4">
              <div className="w-12 text-sm font-medium text-gray-600">{data.month}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 bg-primary-500 rounded-full" style={{ width: `${(data.sales / 25000000) * 100}%` }}></div>
                  <span className="text-sm font-medium text-gray-900">${(data.sales / 1000000).toFixed(1)}M</span>
                </div>
                <div className="text-xs text-gray-500">{data.orders} órdenes</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Productos Más Vendidos */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Productos Más Vendidos</h2>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-600">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.sales} ventas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${(product.revenue / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-gray-500">Ingresos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas de Clientes */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Estadísticas de Clientes</h2>
          
          <div className="space-y-4">
            {customerStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{stat.label}</h3>
                  <p className="text-sm text-gray-600">Último mes</p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Resumen Ejecutivo</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Crecimiento</h3>
            <p className="text-sm text-gray-600">Las ventas han crecido un 15% este mes</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Inventario</h3>
            <p className="text-sm text-gray-600">5 productos con stock bajo</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Clientes</h3>
            <p className="text-sm text-gray-600">Alta retención de clientes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
