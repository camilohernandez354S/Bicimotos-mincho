import React, { useState } from 'react';
import { Settings, Save, Eye, EyeOff, Upload, Trash2, Edit } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    storeName: 'Bicimotos Mincho',
    storeEmail: 'info@bicimotosmincho.com',
    storePhone: '+57 300 123 4567',
    storeAddress: 'Calle 123 #45-67, Bogotá, Colombia',
    currency: 'COP',
    timezone: 'America/Bogota',
    language: 'es',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    shipping: {
      freeShippingMin: 500000,
      standardShippingCost: 15000,
      expressShippingCost: 25000
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    // Aquí se implementaría la lógica para guardar en el backend
    console.log('Guardando configuración:', settings);
    // Mostrar toast de éxito
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notificaciones', icon: Settings },
    { id: 'shipping', label: 'Envíos', icon: Settings },
    { id: 'security', label: 'Seguridad', icon: Settings }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuración</h1>
          <p className="text-gray-600">Administra la configuración de tu tienda</p>
        </div>
        <button onClick={handleSave} className="btn-primary px-4 py-2">
          <Save className="w-5 h-5 mr-2" />
          Guardar Cambios
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar de pestañas */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-card p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenido de configuración */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-card p-6">
            {/* Pestaña General */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Información General</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Tienda
                    </label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => handleInputChange('storeName', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de Contacto
                    </label>
                    <input
                      type="email"
                      value={settings.storeEmail}
                      onChange={(e) => handleInputChange('storeEmail', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={settings.storePhone}
                      onChange={(e) => handleInputChange('storePhone', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Moneda
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="input w-full"
                    >
                      <option value="COP">Peso Colombiano (COP)</option>
                      <option value="USD">Dólar Americano (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección de la Tienda
                  </label>
                  <textarea
                    value={settings.storeAddress}
                    onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                    rows={3}
                    className="input w-full"
                  />
                </div>
              </div>
            )}

            {/* Pestaña Notificaciones */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Configuración de Notificaciones</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Notificaciones por Email</h3>
                      <p className="text-sm text-gray-600">Recibir notificaciones importantes por correo electrónico</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={(e) => handleInputChange('notifications.email', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Notificaciones SMS</h3>
                      <p className="text-sm text-gray-600">Recibir notificaciones por mensaje de texto</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.sms}
                        onChange={(e) => handleInputChange('notifications.sms', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Notificaciones Push</h3>
                      <p className="text-sm text-gray-600">Recibir notificaciones en tiempo real en el navegador</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.push}
                        onChange={(e) => handleInputChange('notifications.push', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Pestaña Envíos */}
            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Configuración de Envíos</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Envío Gratis Mínimo (COP)
                    </label>
                    <input
                      type="number"
                      value={settings.shipping.freeShippingMin}
                      onChange={(e) => handleInputChange('shipping.freeShippingMin', parseInt(e.target.value))}
                      className="input w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Costo Envío Estándar (COP)
                    </label>
                    <input
                      type="number"
                      value={settings.shipping.standardShippingCost}
                      onChange={(e) => handleInputChange('shipping.standardShippingCost', parseInt(e.target.value))}
                      className="input w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Costo Envío Express (COP)
                    </label>
                    <input
                      type="number"
                      value={settings.shipping.expressShippingCost}
                      onChange={(e) => handleInputChange('shipping.expressShippingCost', parseInt(e.target.value))}
                      className="input w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pestaña Seguridad */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Configuración de Seguridad</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cambiar Contraseña
                    </label>
                    <div className="space-y-3">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Contraseña actual"
                        className="input w-full"
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nueva contraseña"
                        className="input w-full"
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirmar nueva contraseña"
                        className="input w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showPassword ? 'Ocultar' : 'Mostrar'} contraseñas
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-medium text-yellow-800 mb-2">Sesiones Activas</h3>
                    <p className="text-sm text-yellow-700 mb-3">Tienes 1 sesión activa en este dispositivo</p>
                    <button className="btn-outline px-3 py-1 text-sm">
                      Cerrar Todas las Sesiones
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
