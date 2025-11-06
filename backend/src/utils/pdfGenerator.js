const PDFDocument = require('pdfkit');

/**
 * Genera un buffer PDF con los datos de reportes
 * @param {Object} data - Datos para el reporte
 * @param {Array} data.products - Lista de productos
 * @param {Array} data.messages - Lista de mensajes
 * @param {Boolean} data.orders - Si existe la tabla orders
 * @returns {Promise<Buffer>} - Buffer del PDF generado
 */
exports.generatePDFBuffer = async (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margin: 40,
        size: 'A4',
        info: {
          Title: 'Reporte General - Bicimotos Mincho',
          Author: 'Bicimotos Mincho',
          Subject: 'Reporte de productos, mensajes y órdenes',
          Creator: 'Bicimotos Mincho Admin Panel'
        }
      });

      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Título principal
      doc.fontSize(20)
         .font('Helvetica-Bold')
         .text('📊 Reporte General', { align: 'center' });
      
      doc.fontSize(16)
         .font('Helvetica')
         .text('Bicimotos Mincho', { align: 'center' });
      
      doc.moveDown();
      doc.fontSize(10)
         .fillColor('gray')
         .text(`Generado el: ${new Date().toLocaleString('es-ES')}`, { align: 'center' });
      
      doc.moveDown(2);
      doc.fillColor('black');

      // Resumen General
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .text('Resumen General', { underline: true });
      
      doc.moveDown(0.5);
      doc.fontSize(12)
         .font('Helvetica')
         .text(`Total de Productos: ${data.products?.length || 0}`, { indent: 20 });
      doc.text(`Total de Mensajes: ${data.messages?.length || 0}`, { indent: 20 });
      doc.text(`Órdenes habilitadas: ${data.orders ? 'Sí' : 'No'}`, { indent: 20 });
      
      doc.moveDown(2);

      // Listado de Productos
      if (data.products && data.products.length > 0) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('Listado de Productos', { underline: true });
        
        doc.moveDown(0.5);
        doc.fontSize(11)
           .font('Helvetica');
        
        data.products.slice(0, 50).forEach((p, index) => {
          const name = p.name || 'Sin nombre';
          const price = p.price ? `$${parseFloat(p.price).toFixed(2)}` : 'N/A';
          const stock = p.stock !== undefined ? p.stock : 'N/A';
          const status = p.is_active ? 'Activo' : 'Inactivo';
          
          doc.text(`${index + 1}. ${name}`, { indent: 20 });
          doc.text(`   Precio: ${price} | Stock: ${stock} | Estado: ${status}`, { 
            indent: 30,
            continued: false
          });
          
          if (index < data.products.length - 1 && index < 49) {
            doc.moveDown(0.3);
          }
        });
        
        if (data.products.length > 50) {
          doc.moveDown(0.5);
          doc.fontSize(10)
             .fillColor('gray')
             .text(`... y ${data.products.length - 50} productos más`, { indent: 20 });
          doc.fillColor('black');
        }
        
        doc.moveDown(2);
      } else {
        doc.fontSize(12)
           .fillColor('gray')
           .text('No hay productos registrados', { indent: 20 });
        doc.fillColor('black');
        doc.moveDown(2);
      }

      // Listado de Mensajes
      if (data.messages && data.messages.length > 0) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('Listado de Mensajes', { underline: true });
        
        doc.moveDown(0.5);
        doc.fontSize(11)
           .font('Helvetica');
        
        data.messages.slice(0, 50).forEach((m, index) => {
          const name = m.name || 'Sin nombre';
          const email = m.email || 'Sin email';
          const subject = m.subject || 'Sin asunto';
          const status = m.status || 'N/A';
          const date = m.created_at ? new Date(m.created_at).toLocaleDateString('es-ES') : 'N/A';
          
          doc.text(`${index + 1}. ${name} (${email})`, { indent: 20 });
          doc.text(`   Asunto: ${subject} | Estado: ${status} | Fecha: ${date}`, { 
            indent: 30,
            continued: false
          });
          
          if (m.message && m.message.length > 0) {
            const messagePreview = m.message.length > 100 
              ? m.message.substring(0, 100) + '...' 
              : m.message;
            doc.text(`   Mensaje: ${messagePreview}`, { 
              indent: 30,
              continued: false
            });
          }
          
          if (index < data.messages.length - 1 && index < 49) {
            doc.moveDown(0.3);
          }
        });
        
        if (data.messages.length > 50) {
          doc.moveDown(0.5);
          doc.fontSize(10)
             .fillColor('gray')
             .text(`... y ${data.messages.length - 50} mensajes más`, { indent: 20 });
          doc.fillColor('black');
        }
      } else {
        doc.fontSize(12)
           .fillColor('gray')
           .text('No hay mensajes registrados', { indent: 20 });
        doc.fillColor('black');
      }

      // Pie de página
      doc.moveDown(3);
      doc.fontSize(8)
         .fillColor('gray')
         .text('Este reporte fue generado automáticamente por el sistema de administración de Bicimotos Mincho.', {
           align: 'center'
         });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

