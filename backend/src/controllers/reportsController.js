const db = require('../config/database');
const { generatePDFBuffer } = require('../utils/pdfGenerator');

/**
 * Obtener resumen general de reportes
 */
exports.getSummaryReports = async (req, res) => {
  console.log('📊 Generando resumen de reportes...');
  try {
    // Obtener conteos en paralelo
    const [productsResult, messagesResult, ordersCheck] = await Promise.all([
      db.query('SELECT COUNT(*) as total FROM products'),
      db.query('SELECT COUNT(*) as total FROM contact_messages'),
      db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'orders'
        ) as exists
      `)
    ]);

    // Verificar si existe la tabla orders y contar
    let totalOrders = 0;
    if (ordersCheck.rows[0]?.exists) {
      try {
        const ordersResult = await db.query('SELECT COUNT(*) as total FROM orders');
        totalOrders = parseInt(ordersResult.rows[0]?.total || 0, 10);
      } catch (error) {
        console.warn('⚠️  No se pudo contar órdenes:', error.message);
        totalOrders = 0;
      }
    }

    const summary = {
      totalProducts: parseInt(productsResult.rows[0]?.total || 0, 10),
      totalMessages: parseInt(messagesResult.rows[0]?.total || 0, 10),
      totalOrders: totalOrders,
      hasOrdersTable: ordersCheck.rows[0]?.exists || false
    };

    console.log(`✅ getSummaryReports: ${JSON.stringify(summary)}`);
    res.status(200).json({ 
      success: true, 
      data: summary 
    });
  } catch (error) {
    console.error('❌ Error en getSummaryReports:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener resumen de reportes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Exportar reporte a PDF
 */
exports.exportPDFReport = async (req, res) => {
  console.log('🧾 Exportando PDF de reportes...');
  try {
    // Obtener datos en paralelo
    const [productsResult, messagesResult, ordersCheck] = await Promise.all([
      db.query('SELECT id, name, price, stock, is_active FROM products ORDER BY id ASC'),
      db.query('SELECT id, name, email, subject, message, status, created_at FROM contact_messages ORDER BY id ASC'),
      db.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'orders'
        ) as exists
      `)
    ]);

    const products = productsResult.rows || [];
    const messages = messagesResult.rows || [];
    const hasOrdersTable = ordersCheck.rows[0]?.exists || false;

    console.log(`📦 Productos: ${products.length}, Mensajes: ${messages.length}, Órdenes: ${hasOrdersTable ? 'Sí' : 'No'}`);

    // Generar PDF
    const pdfBuffer = await generatePDFBuffer({
      products: products,
      messages: messages,
      orders: hasOrdersTable
    });

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reportes_mincho_${Date.now()}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);

    console.log(`✅ PDF generado exitosamente (${pdfBuffer.length} bytes)`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('❌ Error al exportar PDF:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Error al generar el PDF',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

