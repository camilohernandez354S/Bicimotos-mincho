import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Admin</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Total Productos</h3>
            <p className="text-3xl font-bold text-blue-600">156</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Productos Activos</h3>
            <p className="text-3xl font-bold text-green-600">142</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Mensajes Nuevos</h3>
            <p className="text-3xl font-bold text-orange-600">7</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Stock Bajo</h3>
            <p className="text-3xl font-bold text-red-600">5</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bienvenido al Panel de Administración</h2>
          <p className="text-gray-600">
            Este es el dashboard principal donde puedes gestionar todos los aspectos de tu tienda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;