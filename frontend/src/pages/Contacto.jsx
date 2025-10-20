import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      // Simular envío de mensaje
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Mensaje enviado exitosamente. Te contactaremos pronto.');
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Error al enviar el mensaje. Intenta de nuevo.');
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Teléfono',
      info: '+57 300 123 4567',
      description: 'Lunes a Viernes 9:00 AM - 6:00 PM'
    },
    {
      icon: Mail,
      title: 'Email',
      info: 'info@bicimotosmincho.com',
      description: 'Te respondemos en menos de 24 horas'
    },
    {
      icon: MapPin,
      title: 'Dirección',
      info: 'Calle 123 #45-67, Bogotá',
      description: 'Colombia - Zona Centro'
    },
    {
      icon: Clock,
      title: 'Horarios',
      info: 'Lun - Vie: 9:00 AM - 6:00 PM',
      description: 'Sáb: 9:00 AM - 4:00 PM'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="wrapper py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contáctanos</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ¿Tienes alguna pregunta? Estamos aquí para ayudarte con cualquier consulta sobre nuestros productos.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Información de Contacto */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h2>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-card">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-900 font-medium mb-1">{item.info}</p>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mapa */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ubicación</h3>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p>Mapa interactivo</p>
                  <p className="text-sm">Calle 123 #45-67, Bogotá</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Contacto */}
          <div className="bg-white rounded-xl shadow-card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un Mensaje</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="consulta-producto">Consulta sobre producto</option>
                  <option value="soporte-tecnico">Soporte técnico</option>
                  <option value="garantia">Garantía</option>
                  <option value="envio">Información de envío</option>
                  <option value="devolucion">Devolución</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="input w-full resize-none"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </form>

            {/* Información adicional */}
            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-green-800 mb-1">
                    Respuesta garantizada
                  </h4>
                  <p className="text-sm text-green-700">
                    Nos comprometemos a responder tu mensaje en menos de 24 horas durante días hábiles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Preguntas Frecuentes
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Cuánto tiempo tarda el envío?
              </h3>
              <p className="text-gray-600">
                El envío dentro de Bogotá tarda 24-48 horas. Para otras ciudades de Colombia, 
                el tiempo de entrega es de 3-5 días hábiles.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Ofrecen garantía en sus productos?
              </h3>
              <p className="text-gray-600">
                Sí, todos nuestros productos tienen garantía del fabricante. Además, 
                ofrecemos garantía extendida en componentes seleccionados.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Puedo devolver un producto?
              </h3>
              <p className="text-gray-600">
                Sí, tienes 30 días para devolver cualquier producto en perfecto estado. 
                El costo del envío de devolución corre por cuenta del cliente.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ¿Hacen instalación de componentes?
              </h3>
              <p className="text-gray-600">
                Ofrecemos servicio de instalación profesional para componentes complejos. 
                Consulta disponibilidad y costos al momento de la compra.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
