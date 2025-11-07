import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminAuthService from '../../services/adminAuthService';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay token al montar el componente
    const token = AdminAuthService.getToken();
    if (!token) {
      console.warn('⚠️ No hay token de autenticación. Redirigiendo al login...');
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <AdminHeader 
          onMenuToggle={() => setSidebarOpen(true)} 
        />
        
        {/* Contenido */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
