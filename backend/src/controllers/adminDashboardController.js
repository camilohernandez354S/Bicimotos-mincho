const db = require('../config/database');

exports.getDashboardStats = async (req, res) => {
  console.log('🚀 getDashboardStats ejecutándose...');
  try {
    console.log('📊 Obteniendo estadísticas del dashboard...');
    
    // ✅ Verificar estructura de la tabla products
    let tableCheck;
    try {
      tableCheck = await db.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'products'
      `);
      const cols = tableCheck.rows.map(r => r.column_name);
      console.log('📋 Columnas de products:', cols);
      
      const colIsActive = cols.includes('is_active') ? 'is_active' : 
                          (cols.includes('isActive') ? 'isActive' : null);
      const hasStock = cols.includes('stock');
      
      // ✅ Total de productos
      const totalRes = await db.query('SELECT COUNT(*) AS total FROM products');
      const totalProducts = parseInt(totalRes.rows[0].total, 10);
      console.log('📦 Total productos:', totalProducts);

      // ✅ Productos activos
      let activeProducts = 0;
      if (colIsActive) {
        const activeRes = await db.query(
          `SELECT COUNT(*) AS active FROM products WHERE ${colIsActive} = true`
        );
        activeProducts = parseInt(activeRes.rows[0].active, 10);
        console.log('✅ Productos activos:', activeProducts);
      } else {
        console.warn('⚠️  Columna is_active no encontrada, usando totalProducts');
        activeProducts = totalProducts;
      }

      // ✅ Stock bajo (<= 5)
      let lowStock = 0;
      if (hasStock) {
        const stockRes = await db.query('SELECT COUNT(*) AS low_stock FROM products WHERE stock <= 5');
        lowStock = parseInt(stockRes.rows[0].low_stock, 10);
        console.log('⚠️  Stock bajo:', lowStock);
      } else {
        console.warn('⚠️  Columna stock no encontrada');
      }

      // ✅ Mensajes nuevos (desde contact_messages)
      let newMessages = 0;
      try {
        const messagesResult = await db.query(
          "SELECT COUNT(*) AS total FROM contact_messages WHERE status = 'new'"
        );
        newMessages = parseInt(messagesResult.rows[0].total, 10);
        console.log('📧 Mensajes nuevos:', newMessages);
      } catch (error) {
        // Si no existe la tabla de mensajes, no falla
        console.warn('⚠️  No se pudo obtener mensajes nuevos:', error.message);
      }

      const stats = {
        totalProducts,
        activeProducts,
        newMessages,
        lowStock
      };

      console.log('📊 Estadísticas finales:', stats);

      // Agregar headers para evitar caché
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (tableError) {
      console.error('❌ Error verificando estructura de tabla:', tableError);
      // Si falla la verificación, intentar consultas directas
      const totalRes = await db.query('SELECT COUNT(*) AS total FROM products');
      const totalProducts = parseInt(totalRes.rows[0].total, 10);
      
      const activeRes = await db.query('SELECT COUNT(*) AS active FROM products WHERE is_active = true');
      const activeProducts = parseInt(activeRes.rows[0].active, 10);
      
      const stockRes = await db.query('SELECT COUNT(*) AS low_stock FROM products WHERE stock <= 5');
      const lowStock = parseInt(stockRes.rows[0].low_stock, 10);
      
      let newMessages = 0;
      try {
        const messagesResult = await db.query(
          "SELECT COUNT(*) AS total FROM contact_messages WHERE status = 'new'"
        );
        newMessages = parseInt(messagesResult.rows[0].total, 10);
      } catch (error) {
        console.warn('⚠️  No se pudo obtener mensajes nuevos:', error.message);
      }

      // Agregar headers para evitar caché
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      res.status(200).json({
        success: true,
        data: {
          totalProducts,
          activeProducts,
          newMessages,
          lowStock
        }
      });
    }
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estadísticas del dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

