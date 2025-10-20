import React from 'react';
import { MessageSquare, Mail, Phone, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const AdminMessages = () => {
  // Datos mock para mensajes
  const messages = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@email.com',
      phone: '+57 300 123 4567',
      subject: 'Consulta sobre garantía',
      message: 'Hola, tengo una duda sobre la garantía de los frenos Shimano...',
      status: 'new',
      priority: 'medium',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria@email.com',
      phone: '+57 300 987 6543',
      subject: 'Información de envío',
      message: '¿Cuánto tiempo tarda el envío a Medellín?',
      status: 'read',
      priority: 'low',
      createdAt: '2024-01-14T15:45:00Z'
    },
    {
      id: 3,
      name: 'Carlos López',
      email: 'carlos@email.com',
      phone: '+57 300 555 1234',
      subject: 'Soporte técnico urgente',
      message: 'Necesito ayuda con la instalación de los cambios...',
      status: 'new',
      priority: 'urgent',
      createdAt: '2024-01-15T09:15:00Z'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Mensajes</h1>
          <p className="text-gray-600">Administra los mensajes de contacto de tus clientes</p>
        </div>
        <div className="flex gap-4">
          <button className="btn-secondary px-4 py-2">
            <MessageSquare className="w-5 h-5 mr-2" />
            Marcar Todos como Leídos
          </button>
          <button className="btn-primary px-4 py-2">
            <Mail className="w-5 h-5 mr-2" />
            Responder Masivo
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Mensajes</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nuevos</p>
              <p className="text-2xl font-bold text-red-600">7</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Respondidos</p>
              <p className="text-2xl font-bold text-green-600">65</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cerrados</p>
              <p className="text-2xl font-bold text-gray-600">17</p>
            </div>
            <Clock className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Lista de Mensajes */}
      <div className="bg-white rounded-xl shadow-card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mensajes Recientes</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {messages.map((message) => (
            <div key={message.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{message.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}>
                      {message.status === 'new' ? 'Nuevo' : 
                       message.status === 'read' ? 'Leído' : 
                       message.status === 'replied' ? 'Respondido' : 'Cerrado'}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(message.priority)}`}>
                      {message.priority === 'urgent' ? 'Urgente' :
                       message.priority === 'high' ? 'Alta' :
                       message.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {message.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {message.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(message.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2">{message.subject}</h4>
                  <p className="text-gray-600 text-sm">{message.message}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="btn-primary px-4 py-2 text-sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Responder
                </button>
                <button className="btn-secondary px-4 py-2 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marcar como Leído
                </button>
                <button className="btn-outline px-4 py-2 text-sm">
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
