import React, { useEffect, useState } from 'react';
import { TrendingUp, BarChart3, DollarSign, Users, Package, MessageSquare, FileDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminAuthService from '../../services/adminAuthService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminReports = () => {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalMessages: 0,
    totalOrders: 0,
    hasOrdersTable: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reportes`, {
        method: 'GET',
        headers: AdminAuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener reportes');
      }

      const result = await response.json();
      if (result.success) {
        setSummary(result.data);
      }
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      toast.error('Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      toast.loading('Generando PDF...', { id: 'pdf-export' });
      
      const response = await fetch(`${API_BASE_URL}/admin/reportes/export/pdf`, {
        method: 'GET',
        headers: AdminAuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al generar PDF');
      }

      // Obtener el blob del PDF
      const blob = await response.blob();
      
      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reportes_mincho_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('PDF generado exitosamente', { id: 'pdf-export' });
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      toast.error('Error al generar PDF', { id: 'pdf-export' });
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reportes y Estadísticas</h1>
          <p className="text-gray-600">Análisis detallado del rendimiento de tu tienda</p>
        </div>
        <button
          onClick={handleExportPDF}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FileDown className="w-5 h-5" />
          Exportar PDF
        </button>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Productos</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalProducts}</p>
              <p className="text-sm text-green-600">Registrados en el sistema</p>
            </div>
            <Package className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Mensajes</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalMessages}</p>
              <p className="text-sm text-blue-600">Mensajes de contacto</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Órdenes</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalOrders}</p>
              <p className="text-sm text-purple-600">
                {summary.hasOrdersTable ? 'Órdenes registradas' : 'Tabla no disponible'}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estado del Sistema</p>
              <p className="text-2xl font-bold text-gray-900">
                {summary.hasOrdersTable ? '✓' : '⚠'}
              </p>
              <p className="text-sm text-orange-600">
                {summary.hasOrdersTable ? 'Sistema completo' : 'Órdenes pendientes'}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Resumen Ejecutivo</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Productos</h3>
            <p className="text-sm text-gray-600">
              {summary.totalProducts} productos registrados en el catálogo
            </p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Mensajes</h3>
            <p className="text-sm text-gray-600">
              {summary.totalMessages} mensajes de contacto recibidos
            </p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Órdenes</h3>
            <p className="text-sm text-gray-600">
              {summary.hasOrdersTable 
                ? `${summary.totalOrders} órdenes procesadas`
                : 'Sistema de órdenes no configurado'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Reporte</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Los datos mostrados son en tiempo real desde PostgreSQL</p>
          <p>• El PDF incluye todos los productos y mensajes del sistema</p>
          <p>• Los reportes se generan automáticamente al hacer clic en "Exportar PDF"</p>
          <p>• El archivo PDF se descarga con el nombre: <code className="bg-gray-100 px-2 py-1 rounded">reportes_mincho_[timestamp].pdf</code></p>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
