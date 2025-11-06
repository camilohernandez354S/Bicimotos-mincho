import React from 'react';
import { ShoppingCart, User, Calendar, Eye, Trash2 } from 'lucide-react';

const statusColors = {
  Pendiente: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'En proceso': 'bg-blue-100 text-blue-700 border-blue-200',
  Enviado: 'bg-purple-100 text-purple-700 border-purple-200',
  Completado: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const getStatusLabel = (status) => {
  const statusMap = {
    'Pendiente': 'Pendiente',
    'En proceso': 'En proceso',
    'Enviado': 'Enviado',
    'Completado': 'Completado',
    'pending': 'Pendiente',
    'confirmed': 'Confirmado',
    'processing': 'En proceso',
    'shipped': 'Enviado',
    'delivered': 'Completado',
    'cancelled': 'Cancelado',
  };
  return statusMap[status] || status;
};

const AdminOrderCard = ({ order, onView, onStatusChange, onDelete }) => {
  const statusColor = statusColors[order.status] || 'bg-gray-100 text-gray-700 border-gray-200';
  const statusLabel = getStatusLabel(order.status);

  return (
    <div className="flex justify-between items-center bg-white border rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div 
        onClick={onView} 
        className="cursor-pointer flex-1 min-w-0"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-800">
                Orden #{order.order_number || order.id}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
                {statusLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <User className="w-4 h-4" />
              <span className="font-medium">{order.customer_name}</span>
              <span className="text-gray-400">•</span>
              <span className="truncate">{order.customer_email}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(order.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <span className="font-semibold text-gray-700">
                ${parseFloat(order.total_amount || 0).toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onView}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Ver detalles"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(order.id)}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminOrderCard;

