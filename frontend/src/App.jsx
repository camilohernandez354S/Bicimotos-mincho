import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import UserNavbar from './components/UserNavbar';
import SiteFooter from './components/SiteFooter';
import AdminLayout from './components/admin/AdminLayout';

// Páginas públicas
import Home from './pages/Home';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Contacto from './pages/Contacto';

// Páginas de admin
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './components/admin/AdminProducts';
import AdminMessages from './pages/AdminMessages';
import AdminOrders from './pages/AdminOrders';
import AdminReports from './components/admin/AdminReports';
import AdminSettings from './components/admin/AdminSettings';

// ----- GUARD PROTEGIDO -----
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  return token ? children : <Navigate to="/admin/login" replace />;
};

// ----- LAYOUT PÚBLICO -----
const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-white">
    <UserNavbar />
    <main>{children}</main>
    <SiteFooter />
  </div>
);

// ----- APLICACIÓN -----
function App() {
  return (
    <Router>
      <Routes>
        {/* === RUTAS PÚBLICAS === */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/productos" element={<PublicLayout><Productos /></PublicLayout>} />
        <Route path="/producto/:id" element={<PublicLayout><ProductoDetalle /></PublicLayout>} />
        <Route path="/contacto" element={<PublicLayout><Contacto /></PublicLayout>} />

        {/* === LOGIN ADMIN === */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* === RUTAS ADMIN (anidadas dentro de AdminLayout) === */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="mensajes" element={<AdminMessages />} />
          <Route path="ordenes" element={<AdminOrders />} />
          <Route path="reportes" element={<AdminReports />} />
          <Route path="configuracion" element={<AdminSettings />} />
        </Route>

        {/* === 404 === */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* === TOASTER === */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
          },
        }}
      />
    </Router>
  );
}

export default App;