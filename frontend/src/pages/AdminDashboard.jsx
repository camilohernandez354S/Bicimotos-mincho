import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    newMessages: 0,
    lowStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('📡 Obteniendo estadísticas desde /admin/dashboard');
        
        const response = await fetchWithAuth('/admin/dashboard', {
          method: 'GET',
        });

        console.log('📥 Respuesta recibida:', response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Error en la respuesta:', response.status, errorText);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('📊 Datos recibidos (raw):', JSON.stringify(result, null, 2));
        console.log('📊 Tipo de result:', typeof result);
        console.log('📊 result.success:', result.success);
        console.log('📊 result.data:', result.data);
        console.log('📊 result.data (tipo):', typeof result.data);
        console.log('📊 result.data (keys):', result.data ? Object.keys(result.data) : 'null/undefined');
        
        if (result.success && result.data) {
          // Verificar que result.data sea un objeto con las propiedades esperadas
          const data = result.data;
          console.log('📊 data.totalProducts:', data.totalProducts, 'tipo:', typeof data.totalProducts);
          console.log('📊 data.activeProducts:', data.activeProducts, 'tipo:', typeof data.activeProducts);
          console.log('📊 data.newMessages:', data.newMessages, 'tipo:', typeof data.newMessages);
          console.log('📊 data.lowStock:', data.lowStock, 'tipo:', typeof data.lowStock);
          
          const newStats = {
            totalProducts: Number(data.totalProducts) || 0,
            activeProducts: Number(data.activeProducts) || 0,
            newMessages: Number(data.newMessages) || 0,
            lowStock: Number(data.lowStock) || 0,
          };
          console.log('✅ Estableciendo estadísticas:', newStats);
          setStats(newStats);
        } else {
          console.error('❌ Error en la respuesta del servidor:', result);
          console.error('❌ Estructura esperada: { success: true, data: { ... } }');
          console.error('❌ Respuesta completa:', JSON.stringify(result, null, 2));
        }
      } catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        console.error('❌ Stack:', error.stack);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
        <p className="text-gray-600 mb-8">Panel de administración</p>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm text-gray-500 mb-2">Total Productos</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm text-gray-500 mb-2">Productos Activos</h3>
                <p className="text-3xl font-bold text-green-600">{stats.activeProducts}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm text-gray-500 mb-2">Mensajes Nuevos</h3>
                <p className="text-3xl font-bold text-orange-600">{stats.newMessages}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm text-gray-500 mb-2">Stock Bajo</h3>
                <p className="text-3xl font-bold text-red-600">{stats.lowStock}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Bienvenido al Panel de Administración</h2>
              <p className="text-gray-600">
                Este es el dashboard principal donde puedes gestionar todos los aspectos de tu tienda.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;