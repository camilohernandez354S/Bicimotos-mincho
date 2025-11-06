import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { MessageSquare, Mail, Phone, Clock, X, Trash2, CheckCircle } from 'lucide-react';
import AdminMessageCard from '../components/admin/AdminMessageCard';
import AdminAuthService from '../services/adminAuthService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/mensajes`, {
        method: 'GET',
        headers: AdminAuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setMessages(result.data);
      } else {
        toast.error('Error al obtener mensajes');
      }
    } catch (error) {
      console.error('Error obteniendo mensajes:', error);
      toast.error('Error al obtener mensajes');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/mensajes/${id}/read`, {
        method: 'PATCH',
        headers: AdminAuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setMessages((prev) => prev.map((m) => 
          m.id === id ? { ...m, status: 'read' } : m
        ));
        if (selected && selected.id === id) {
          setSelected({ ...selected, status: 'read' });
        }
        toast.success('Mensaje marcado como leído');
      }
    } catch (error) {
      console.error('Error marcando mensaje como leído:', error);
      toast.error('Error al marcar mensaje como leído');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este mensaje?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/mensajes/${id}`, {
        method: 'DELETE',
        headers: AdminAuthService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selected && selected.id === id) {
          setSelected(null);
        }
        toast.success('Mensaje eliminado correctamente');
      }
    } catch (error) {
      console.error('Error eliminando mensaje:', error);
      toast.error('Error al eliminar mensaje');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const newMessagesCount = messages.filter(m => m.status === 'new').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mensajes Recibidos</h1>
        <p className="text-gray-600">
          Revisa los mensajes enviados desde el formulario de contacto.
          {newMessagesCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {newMessagesCount} nuevo{newMessagesCount !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium">No hay mensajes registrados</p>
            <p className="text-sm">Los mensajes enviados desde el formulario de contacto aparecerán aquí.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <AdminMessageCard
              key={msg.id}
              msg={msg}
              onRead={() => markAsRead(msg.id)}
              onDelete={() => deleteMessage(msg.id)}
              onView={() => setSelected(msg)}
            />
          ))
        )}
      </div>

      {/* Modal Detalle */}
      {selected && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 relative max-h-[90vh] overflow-y-auto"
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
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  selected.status === 'new' ? 'bg-blue-100' : 'bg-gray-200'
                }`}>
                  <MessageSquare className={`w-6 h-6 ${
                    selected.status === 'new' ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selected.subject}</h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="font-medium">{selected.name}</span>
                      <span className="text-gray-400">({selected.email})</span>
                    </div>
                    {selected.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{selected.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(selected.created_at).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selected.status && (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  selected.status === 'new' ? 'bg-blue-100 text-blue-700' :
                  selected.status === 'read' ? 'bg-gray-100 text-gray-700' :
                  selected.status === 'replied' ? 'bg-green-100 text-green-700' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {selected.status === 'new' ? 'Nuevo' :
                   selected.status === 'read' ? 'Leído' :
                   selected.status === 'replied' ? 'Respondido' :
                   'Cerrado'}
                </span>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Mensaje:</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              {selected.status === 'new' && (
                <button
                  onClick={() => {
                    markAsRead(selected.id);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Marcar como leído
                </button>
              )}
              <button
                onClick={() => {
                  deleteMessage(selected.id);
                }}
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

export default AdminMessages;

