import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from 'react-hot-toast';

// Componentes de usuario
import UserNavbar from './components/UserNavbar';
import Hero from './components/Hero';
import Promociones from './components/Promociones';
import CategoriesGrid from './components/CategoriesGrid';
import BenefitsStrip from './components/BenefitsStrip';
import Servicios from './components/Servicios';
import Ventajas from './components/Ventajas';
import Contacto from './components/Contacto';
import SiteFooter from './components/SiteFooter';
import CartSidebar from './components/CartSidebar';

// Componentes de admin
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProducts from './components/admin/AdminProducts';

// Componente principal de usuario
const UserLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <UserNavbar />
      
      <main>
        <Hero />
        <Promociones />
        <CategoriesGrid />
        <BenefitsStrip />
        <Servicios />
        <Ventajas />
        <Contacto />
      </main>
      
      <SiteFooter />
      <CartSidebar />
    </div>
  );
};

// Componente principal de la aplicación
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Rutas de usuario */}
            <Route path="/" element={<UserLayout />} />
            <Route path="/catalogo" element={<UserLayout />} />
            <Route path="/productos" element={<UserLayout />} />
            <Route path="/contacto" element={<UserLayout />} />
            
            {/* Rutas de admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/productos" element={<AdminProducts />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            
            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Notificaciones globales */}
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
      </CartProvider>
    </AuthProvider>
  );
}

export default App;