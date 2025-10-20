const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  session_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total_items: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'carts',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['session_id']
    },
    {
      fields: ['is_active']
    }
  ]
});

// Relaciones
Cart.belongsTo(require('./User'), {
  foreignKey: 'user_id',
  as: 'user'
});

// Métodos de instancia
Cart.prototype.addItem = function(productId, quantity = 1) {
  const items = this.items || [];
  const existingItemIndex = items.findIndex(item => item.product_id === productId);
  
  if (existingItemIndex >= 0) {
    items[existingItemIndex].quantity += quantity;
  } else {
    items.push({
      product_id: productId,
      quantity: quantity,
      added_at: new Date()
    });
  }
  
  this.items = items;
  this.calculateTotals();
  return this.save();
};

Cart.prototype.removeItem = function(productId) {
  const items = this.items || [];
  this.items = items.filter(item => item.product_id !== productId);
  this.calculateTotals();
  return this.save();
};

Cart.prototype.updateItemQuantity = function(productId, quantity) {
  const items = this.items || [];
  const itemIndex = items.findIndex(item => item.product_id === productId);
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      items.splice(itemIndex, 1);
    } else {
      items[itemIndex].quantity = quantity;
    }
  }
  
  this.items = items;
  this.calculateTotals();
  return this.save();
};

Cart.prototype.calculateTotals = async function() {
  const Product = require('./Product');
  const items = this.items || [];
  let totalAmount = 0;
  let totalItems = 0;
  
  for (const item of items) {
    const product = await Product.findByPk(item.product_id);
    if (product) {
      totalAmount += parseFloat(product.price) * item.quantity;
      totalItems += item.quantity;
    }
  }
  
  this.total_amount = totalAmount;
  this.total_items = totalItems;
};

Cart.prototype.clear = function() {
  this.items = [];
  this.total_amount = 0;
  this.total_items = 0;
  return this.save();
};

module.exports = Cart;
