import React from 'react';
import AdminLayout from './AdminLayout';
import AdminCard from './AdminCard';
import AdminStats from './AdminStats';
import { 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingCart,
  DollarSign,
  Activity,
  Eye,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Ventas Totales',
      value: '$12.5M',
      trend: '+12.5% vs mes anterior',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'primary'
    },
    {
      title: 'Productos',
      value: '156',
      trend: '+8 nuevos',
      icon: <Package className="w-6 h-6" />,
      color: 'secondary'
    },
    {
      title: 'Usuarios',
      value: '1,234',
      trend: '+5.2% vs mes anterior',
      icon: <Users className="w-6 h-6" />,
      color: 'green'
    },
    {
      title: 'Órdenes',
      value: '89',
      trend: '+23% vs mes anterior',
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'blue'
    },
    {
      title: 'Ingresos',
      value: '$45.2K',
      trend: '+8.1% vs mes anterior',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'purple'
    },
    {
      title: 'Visitas',
      value: '8.9K',
      trend: '+15.3% vs mes anterior',
      icon: <Eye className="w-6 h-6" />,
      color: 'primary'
    }
  ];

  return (
    <AdminLayout currentPage="Dashboard">
      {/* Header del dashboard */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Bienvenido al Dashboard
        </h1>
        <p className="text-gray-600">
          Aquí tienes un resumen completo de tu tienda Bicimotos Mincho
        </p>
      </div>
      
      {/* Cards de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {stats.map((stat, index) => (
          <AdminCard 
            key={index}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            icon={stat.icon}
            color={stat.color}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>
      
      {/* Sección de gráficos y métricas */}
      <AdminStats />
      
      {/* Actividad reciente */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-card animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Ver todas
          </button>
        </div>
        
        <div className="space-y-4">
          {[
            { action: 'Nueva orden', user: 'Juan Pérez', product: 'Shimano XT M8100', time: 'Hace 2 min', type: 'order' },
            { action: 'Producto agregado', user: 'Admin', product: 'Frenos Deore BR-M6120', time: 'Hace 15 min', type: 'product' },
            { action: 'Usuario registrado', user: 'María García', product: '', time: 'Hace 1 hora', type: 'user' },
            { action: 'Orden completada', user: 'Carlos López', product: 'Ruedas Deore XT', time: 'Hace 2 horas', type: 'order' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'order' ? 'bg-green-100 text-green-600' :
                activity.type === 'product' ? 'bg-blue-100 text-blue-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {activity.type === 'order' ? <ShoppingCart className="w-5 h-5" /> :
                 activity.type === 'product' ? <Package className="w-5 h-5" /> :
                 <Users className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">
                  {activity.user} {activity.product && `- ${activity.product}`}
                </p>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
