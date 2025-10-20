const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  payment_method: {
    type: DataTypes.ENUM('credit_card', 'debit_card', 'paypal', 'mercadopago', 'cash'),
    allowNull: true
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  shipping_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  shipping_address: {
    type: DataTypes.JSON,
    allowNull: false
  },
  billing_address: {
    type: DataTypes.JSON,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tracking_number: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  shipped_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  delivered_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['order_number']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['payment_status']
    },
    {
      fields: ['created_at']
    }
  ]
});

// Relaciones
Order.belongsTo(require('./User'), {
  foreignKey: 'user_id',
  as: 'user'
});

// Métodos de instancia
Order.prototype.generateOrderNumber = function() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BM-${timestamp.slice(-6)}-${random}`;
};

Order.prototype.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  if (newStatus === 'shipped') {
    this.shipped_at = new Date();
  } else if (newStatus === 'delivered') {
    this.delivered_at = new Date();
  }
  
  return this.save();
};

Order.prototype.calculateTotals = function() {
  const items = this.items || [];
  let subtotal = 0;
  
  items.forEach(item => {
    subtotal += parseFloat(item.price) * item.quantity;
  });
  
  this.subtotal = subtotal;
  this.total_amount = subtotal + parseFloat(this.tax_amount || 0) + parseFloat(this.shipping_amount || 0) - parseFloat(this.discount_amount || 0);
};

// Hook para generar número de orden
Order.beforeCreate = (order) => {
  if (!order.order_number) {
    order.order_number = order.generateOrderNumber();
  }
};

module.exports = Order;
