import React from 'react';
import { MessageSquare, Mail, Clock, Trash2, Eye } from 'lucide-react';

const AdminMessageCard = ({ msg, onRead, onDelete, onView }) => {
  const isNew = msg.status === 'new';
  const isRead = msg.status === 'read';
  
  return (
    <div
      className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
        isNew ? 'bg-white border-l-4 border-l-blue-500 shadow-sm' : 'bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div 
          onClick={onView} 
          className="cursor-pointer flex-1 min-w-0"
        >
          <div className="flex items-start gap-3 mb-2">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              isNew ? 'bg-blue-100' : 'bg-gray-200'
            }`}>
              <MessageSquare className={`w-5 h-5 ${
                isNew ? 'text-blue-600' : 'text-gray-500'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-gray-800 mb-1 ${
                isNew ? 'text-base' : 'text-sm'
              }`}>
                {msg.subject}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Mail className="w-4 h-4" />
                <span className="font-medium">{msg.name}</span>
                <span className="text-gray-400">•</span>
                <span className="truncate">{msg.email}</span>
              </div>
              {msg.phone && (
                <p className="text-xs text-gray-500 mb-2">
                  📞 {msg.phone}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{new Date(msg.created_at).toLocaleString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
                {msg.status && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      msg.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      msg.status === 'read' ? 'bg-gray-100 text-gray-700' :
                      msg.status === 'replied' ? 'bg-green-100 text-green-700' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {msg.status === 'new' ? 'Nuevo' :
                       msg.status === 'read' ? 'Leído' :
                       msg.status === 'replied' ? 'Respondido' :
                       'Cerrado'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onView}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
          {isNew && (
            <button
              onClick={onRead}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors"
            >
              Marcar leído
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMessageCard;

