import React from 'react';
import { ShoppingCart, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const AdminOrders = () => {
  // Datos mock para órdenes
  const orders = [
    {
      id: 'ORD-001',
      customer: 'Juan Pérez',
      email: 'juan@email.com',
      phone: '+57 300 123 4567',
      products: [
        { name: 'Frenos Shimano Deore XT', quantity: 1, price: 450000 },
        { name: 'Pedales Shimano SPD', quantity: 2, price: 180000 }
      ],
      total: 810000,
      status: 'pending',
      paymentStatus: 'paid',
      shippingAddress: 'Calle 123 #45-67, Bogotá',
      createdAt: '2024-01-15T10:30:00Z',
      estimatedDelivery: '2024-01-18'
    },
    {
      id: 'ORD-002',
      customer: 'María García',
      email: 'maria@email.com',
      phone: '+57 300 987 6543',
      products: [
        { name: 'Cambio Shimano SLX', quantity: 1, price: 320000 }
      ],
      total: 320000,
      status: 'processing',
      paymentStatus: 'paid',
      shippingAddress: 'Carrera 45 #78-90, Medellín',
      createdAt: '2024-01-14T15:45:00Z',
      estimatedDelivery: '2024-01-17'
    },
    {
      id: 'ORD-003',
      customer: 'Carlos López',
      email: 'carlos@email.com',
      phone: '+57 300 555 1234',
      products: [
        { name: 'Cadena Shimano HG-X', quantity: 3, price: 85000 }
      ],
      total: 255000,
      status: 'shipped',
      paymentStatus: 'paid',
      shippingAddress: 'Avenida 80 #12-34, Cali',
      createdAt: '2024-01-13T09:15:00Z',
      estimatedDelivery: '2024-01-16'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Órdenes</h1>
          <p className="text-gray-600">Administra las órdenes y pedidos de tus clientes</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-secondary px-4 py-2">
            <Package className="w-5 h-5 mr-2" />
            Exportar Órdenes
          </button>
          <button className="btn-primary px-4 py-2">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Nueva Orden
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Órdenes</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">12</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Enviadas</p>
              <p className="text-2xl font-bold text-green-600">45</p>
            </div>
            <Truck className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Entregadas</p>
              <p className="text-2xl font-bold text-gray-600">32</p>
            </div>
            <CheckCircle className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Lista de Órdenes */}
      <div className="bg-white rounded-xl shadow-card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Órdenes Recientes</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {orders.map((order) => (
            <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Orden #{order.id}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Pagado
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Cliente</h4>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                      <p className="text-sm text-gray-600">{order.email}</p>
                      <p className="text-sm text-gray-600">{order.phone}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Dirección de Envío</h4>
                      <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Productos</h4>
                    <div className="space-y-1">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{product.name} x{product.quantity}</span>
                          <span>${product.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between font-semibold text-gray-900 mt-2 pt-2 border-t">
                      <span>Total:</span>
                      <span>${order.total.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Creado: {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Entrega estimada: {order.estimatedDelivery}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="btn-primary px-4 py-2 text-sm">
                  <Package className="w-4 h-4 mr-2" />
                  Procesar
                </button>
                <button className="btn-secondary px-4 py-2 text-sm">
                  <Truck className="w-4 h-4 mr-2" />
                  Marcar como Enviado
                </button>
                <button className="btn-outline px-4 py-2 text-sm">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
