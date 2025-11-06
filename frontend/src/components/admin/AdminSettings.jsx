import React, { useState, useEffect } from 'react';
import { Settings, Save, Eye, EyeOff, Upload, User, Mail, Lock, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminAuthService from '../../services/adminAuthService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminSettings = () => {
  const [config, setConfig] = useState({ 
    name: '', 
    email: '', 
    logo_path: '' 
  });
  const [passwords, setPasswords] = useState({ 
    currentPassword: '', 
    newPassword: '',
    confirmPassword: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/configuracion`, {
        method: 'GET',
        headers: AdminAuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener configuración');
      }

      const result = await response.json();
      if (result.success) {
        setConfig(result.data);
        if (result.data.logo_path) {
          setLogoPreview(`${API_BASE_URL.replace('/api', '')}${result.data.logo_path}`);
        }
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      toast.error('Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config.email) {
      toast.error('El correo electrónico es requerido');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/configuracion`, {
        method: 'PUT',
        headers: {
          ...AdminAuthService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: config.name || '',
          email: config.email,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Configuración actualizada correctamente');
        setConfig(result.data);
      } else {
        toast.error(result.message || 'Error al actualizar configuración');
      }
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      toast.error('Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error('Todos los campos son requeridos');
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/configuracion/password`, {
        method: 'PUT',
        headers: {
          ...AdminAuthService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Contraseña actualizada correctamente');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(result.message || 'Error al actualizar contraseña');
      }
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      toast.error('Error al actualizar contraseña');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp|gif)$/)) {
        toast.error('Solo se permiten imágenes (JPG, PNG, WEBP, GIF)');
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('El archivo no debe exceder 5MB');
        return;
      }

      setLogoFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) {
      toast.error('Selecciona un archivo primero');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);

      const response = await fetch(`${API_BASE_URL}/admin/configuracion/logo`, {
        method: 'POST',
        headers: AdminAuthService.getAuthHeaders(),
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Logo actualizado correctamente');
        setConfig({ ...config, logo_path: result.logo_path });
        setLogoPreview(`${API_BASE_URL.replace('/api', '')}${result.logo_path}`);
        setLogoFile(null);
      } else {
        toast.error(result.message || 'Error al subir logo');
      }
    } catch (error) {
      console.error('Error al subir logo:', error);
      toast.error('Error al subir logo');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuración del Administrador</h1>
          <p className="text-gray-600">Administra tu información personal y configuración</p>
        </div>
      </div>

      {/* Información Básica */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <User className="w-5 h-5" />
          Información Personal
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={config.name || ''}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tu nombre"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={config.email || ''}
              onChange={(e) => setConfig({ ...config, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tu@email.com"
              required
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {/* Cambiar Contraseña */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Cambiar Contraseña
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña Actual
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                placeholder="Ingresa tu contraseña actual"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nueva Contraseña
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirma tu nueva contraseña"
            />
          </div>
        </div>

        <button
          onClick={handlePasswordChange}
          disabled={saving}
          className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Lock className="w-5 h-5" />
          {saving ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
      </div>

      {/* Logo del Panel */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Logo del Panel
        </h2>
        
        <div className="space-y-4">
          {logoPreview && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Vista Previa:</p>
              <div className="border border-gray-300 rounded-lg p-4 inline-block">
                <img 
                  src={logoPreview} 
                  alt="Logo actual" 
                  className="h-24 object-contain"
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Archivo
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleLogoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formatos permitidos: JPG, PNG, WEBP, GIF. Tamaño máximo: 5MB
            </p>
          </div>
        </div>

        <button
          onClick={handleLogoUpload}
          disabled={!logoFile || saving}
          className="mt-6 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Upload className="w-5 h-5" />
          {saving ? 'Subiendo...' : 'Subir Logo'}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
