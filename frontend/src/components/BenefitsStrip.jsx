import React from 'react';
import { Truck, Shield, CreditCard, Clock } from 'lucide-react';

const BenefitsStrip = () => {
  const benefits = [
    {
      icon: <Truck className="w-8 h-8 text-rojo" />,
      title: 'Envíos a Todo Colombia',
      description: 'Recibe los productos en la puerta de tu casa mediante diferentes transportadoras'
    },
    {
      icon: <Shield className="w-8 h-8 text-rojo" />,
      title: 'Calidad Garantizada',
      description: 'Trabajamos con las mejores marcas del mercado, productos de primera calidad'
    },
    {
      icon: <CreditCard className="w-8 h-8 text-rojo" />,
      title: 'Compra Seguro',
      description: 'Nuestros pagos son respaldados por Mercado Pago. Recibimos todos los medios de pago'
    },
    {
      icon: <Clock className="w-8 h-8 text-rojo" />,
      title: 'Pagos Contraentrega',
      description: 'Paga tu producto al recibirlo. Contamos con diferentes convenios'
    }
  ];

  return (
    <section className="w-full py-12 bg-gray-900 text-amarillo">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="font-bold text-amarillo text-lg mb-2">{benefit.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsStrip;
