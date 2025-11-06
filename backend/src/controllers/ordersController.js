const db = require('../config/database');

// ✅ Obtener todas las órdenes
exports.getAllOrders = async (req, res) => {
  console.log('🔍 getAllOrders ejecutándose...');
  try {
    // Intentar obtener órdenes con estructura completa
    const result = await db.query(`
      SELECT 
        o.id, 
        o.order_number,
        o.user_id,
        COALESCE(u.first_name || ' ' || u.last_name, o.shipping_address->>'name', 'Cliente') as customer_name,
        COALESCE(u.email, o.shipping_address->>'email', o.billing_address->>'email', 'N/A') as customer_email,
        o.total_amount, 
        o.status, 
        o.payment_status,
        o.payment_method,
        o.created_at,
        o.updated_at
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
    `);
    
    console.log(`✅ getAllOrders: ${result.rows.length} órdenes encontradas`);
    res.status(200).json({ 
      success: true, 
      data: result.rows 
    });
  } catch (error) {
    console.error('❌ Error obteniendo órdenes:', error);
    console.error('❌ Stack:', error.stack);
    // Si la tabla no existe o hay un error, intentar estructura simple
    try {
      const simpleResult = await db.query(`
        SELECT 
          id, 
          COALESCE(customer_name, 'Cliente') as customer_name,
          COALESCE(customer_email, 'N/A') as customer_email,
          total_amount, 
          status, 
          created_at 
        FROM orders
        ORDER BY created_at DESC
      `);
      res.status(200).json({ 
        success: true, 
        data: simpleResult.rows 
      });
    } catch (simpleError) {
      console.error('❌ Error con estructura simple:', simpleError);
      console.error('❌ Stack:', simpleError.stack);
      // Si no existe la tabla, devolver array vacío en lugar de error
      console.log('⚠️  Tabla orders no existe, devolviendo array vacío');
      res.status(200).json({ 
        success: true, 
        data: [] 
      });
    }
  }
};

// ✅ Obtener detalle de una orden
exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener la orden
    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Orden no encontrada' 
      });
    }

    const order = orderRes.rows[0];

    // Intentar obtener items desde order_items
    let items = [];
    try {
      const itemsRes = await db.query(`
        SELECT 
          p.name, 
          p.price, 
          oi.quantity,
          oi.price as item_price
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = $1
      `, [id]);
      items = itemsRes.rows;
    } catch (itemsError) {
      // Si no existe order_items, intentar obtener desde items JSON
      if (order.items && typeof order.items === 'object') {
        items = Array.isArray(order.items) ? order.items : [];
      }
    }

    res.status(200).json({
      success: true,
      data: {
        order: order,
        items: items
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo detalle de orden:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener detalle de orden' 
    });
  }
};

// ✅ Actualizar estado
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validar estado
    const validStatuses = ['Pendiente', 'En proceso', 'Enviado', 'Completado', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido'
      });
    }

    const result = await db.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Estado de orden actualizado',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error actualizando estado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar estado' 
    });
  }
};

// ✅ Eliminar orden
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Eliminar items primero (si existe la tabla)
    try {
      await db.query('DELETE FROM order_items WHERE order_id = $1', [id]);
    } catch (itemsError) {
      // Si no existe order_items, continuar
      console.warn('⚠️  No se pudo eliminar order_items:', itemsError.message);
    }

    // Eliminar la orden
    const result = await db.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Orden eliminada correctamente' 
    });
  } catch (error) {
    console.error('❌ Error eliminando orden:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar orden' 
    });
  }
};

// ✅ Contador de órdenes pendientes
exports.getPendingCount = async (req, res) => {
  console.log('🔍 getPendingCount ejecutándose...');
  try {
    // Verificar si existe la tabla orders
    const tableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'orders'
      ) as exists
    `);

    if (!tableCheck.rows[0]?.exists) {
      console.log('⚠️  Tabla orders no existe, devolviendo contador 0');
      return res.status(200).json({ 
        success: true, 
        count: 0 
      });
    }

    // Intentar con diferentes formatos de estado
    let result;
    try {
      result = await db.query(
        "SELECT COUNT(*) AS pending FROM orders WHERE status = 'Pendiente' OR status = 'pending'"
      );
    } catch (error) {
      // Si falla, intentar solo con 'pending'
      result = await db.query(
        "SELECT COUNT(*) AS pending FROM orders WHERE status = 'pending'"
      );
    }
    
    const count = parseInt(result.rows[0]?.pending || 0, 10);
    console.log(`✅ getPendingCount: ${count} órdenes pendientes`);
    res.status(200).json({ 
      success: true, 
      count: count 
    });
  } catch (error) {
    console.error('❌ Error obteniendo contador de órdenes:', error);
    console.error('❌ Stack:', error.stack);
    
    // Si el error es que la tabla no existe, devolver 0 en lugar de error
    if (error.message && error.message.includes('no existe la relación')) {
      console.log('⚠️  Tabla orders no existe, devolviendo contador 0');
      return res.status(200).json({ 
        success: true, 
        count: 0 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Error al contar órdenes',
      count: 0,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

