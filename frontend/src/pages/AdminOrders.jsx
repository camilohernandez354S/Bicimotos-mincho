import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ShoppingCart, User, Mail, Phone, Calendar, X, Trash2, Package, DollarSign } from 'lucide-react';
import AdminOrderCard from '../components/admin/AdminOrderCard';
import AdminAuthService from '../services/adminAuthService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/ordenes`, {
        method: 'GET',
        headers: AdminAuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
      } else {
        toast.error('Error al cargar órdenes');
      }
    } catch (error) {
      console.error('Error obteniendo órdenes:', error);
      toast.error('Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/ordenes/${id}`, {
        method: 'GET',
        headers: AdminAuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setSelected(result.data);
      }
    } catch (error) {
      console.error('Error obteniendo detalle de orden:', error);
      toast.error('Error al obtener detalles de la orden');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/ordenes/${id}/status`, {
        method: 'PATCH',
        headers: {
          ...AdminAuthService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status } : o))
        );
        if (selected && selected.order && selected.order.id === id) {
          setSelected({
            ...selected,
            order: { ...selected.order, status }
          });
        }
        toast.success('Estado actualizado correctamente');
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
      toast.error('Error al actualizar estado');
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta orden? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/ordenes/${id}`, {
        method: 'DELETE',
        headers: AdminAuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
        if (selected && selected.order && selected.order.id === id) {
          setSelected(null);
        }
        toast.success('Orden eliminada correctamente');
      }
    } catch (error) {
      console.error('Error eliminando orden:', error);
      toast.error('Error al eliminar orden');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewOrder = (order) => {
    fetchOrderDetails(order.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingCount = orders.filter(o => 
    o.status === 'Pendiente' || o.status === 'pending'
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Órdenes</h1>
        <p className="text-gray-600">
          Administra las órdenes de clientes registradas en el sistema.
          {pendingCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
              {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium">No hay órdenes registradas</p>
            <p className="text-sm">Las órdenes de compra aparecerán aquí.</p>
          </div>
        ) : (
          orders.map((order) => (
            <AdminOrderCard
              key={order.id}
              order={order}
              onView={() => handleViewOrder(order)}
              onStatusChange={updateStatus}
              onDelete={deleteOrder}
            />
          ))
        )}
      </div>

      {/* Modal Detalle */}
      {selected && selected.order && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div 
            className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setSelected(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Orden #{selected.order.order_number || selected.order.id}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{selected.order.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{selected.order.customer_email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(selected.order.created_at).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  Estado: {selected.order.status}
                </span>
                {selected.order.payment_status && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    Pago: {selected.order.payment_status}
                  </span>
                )}
              </div>
            </div>

            {/* Items de la orden */}
            {selected.items && selected.items.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Productos
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {selected.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900">{item.name || 'Producto'}</p>
                        <p className="text-sm text-gray-600">
                          Cantidad: {item.quantity || 1}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ${parseFloat(item.item_price || item.price || 0).toLocaleString('es-ES', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  ${parseFloat(selected.order.total_amount || 0).toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
            </div>

            {/* Dirección de envío */}
            {selected.order.shipping_address && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Dirección de envío:</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                  {typeof selected.order.shipping_address === 'string' 
                    ? selected.order.shipping_address
                    : JSON.stringify(selected.order.shipping_address, null, 2)
                  }
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <select
                onChange={(e) => updateStatus(selected.order.id, e.target.value)}
                className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={selected.order.status}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En proceso">En proceso</option>
                <option value="Enviado">Enviado</option>
                <option value="Completado">Completado</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
              <button
                onClick={() => deleteOrder(selected.order.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

