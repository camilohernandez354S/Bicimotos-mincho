const { sequelize } = require('../config/database');

// Importar todos los modelos
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Cart = require('./Cart');
const Order = require('./Order');

// Definir relaciones
const defineAssociations = () => {
  // Relaciones de User
  User.hasMany(Cart, {
    foreignKey: 'user_id',
    as: 'carts'
  });
  
  User.hasMany(Order, {
    foreignKey: 'user_id',
    as: 'orders'
  });

  // Relaciones de Category
  Category.hasMany(Product, {
    foreignKey: 'category_id',
    as: 'products'
  });

  // Relaciones de Product
  Product.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category'
  });

  // Relaciones de Cart
  Cart.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  // Relaciones de Order
  Order.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });
};

// Función para sincronizar todos los modelos
const syncAllModels = async (force = false) => {
  try {
    defineAssociations();
    await sequelize.sync({ force });
    console.log('✅ Todos los modelos sincronizados correctamente');
  } catch (error) {
    console.error('❌ Error sincronizando modelos:', error);
    throw error;
  }
};

// Función para crear datos iniciales
const createInitialData = async () => {
  try {
    // Crear categorías iniciales
    const categories = await Category.bulkCreate([
      {
        name: 'Transmisiones',
        description: 'Grupos de transmisión completos y componentes individuales',
        slug: 'transmisiones',
        is_active: true,
        sort_order: 1
      },
      {
        name: 'Frenos',
        description: 'Sistemas de frenado hidráulicos y mecánicos',
        slug: 'frenos',
        is_active: true,
        sort_order: 2
      },
      {
        name: 'Ruedas',
        description: 'Ruedas completas, llantas y cubiertas',
        slug: 'ruedas',
        is_active: true,
        sort_order: 3
      },
      {
        name: 'Suspensiones',
        description: 'Horquillas y amortiguadores',
        slug: 'suspensiones',
        is_active: true,
        sort_order: 4
      },
      {
        name: 'Accesorios',
        description: 'Accesorios y componentes varios',
        slug: 'accesorios',
        is_active: true,
        sort_order: 5
      }
    ], { ignoreDuplicates: true });

    // Crear productos de ejemplo
    const products = await Product.bulkCreate([
      {
        name: 'Transmisión Shimano XT M8100',
        description: 'Grupo de transmisión de alta gama para mountain bike con cambio de 12 velocidades',
        price: 1200000,
        original_price: 1500000,
        category_id: categories[0].id,
        brand: 'Shimano',
        model: 'XT M8100',
        sku: 'SH-XT-M8100-12S',
        images: [
          {
            url: 'https://via.placeholder.com/400x300',
            alt: 'Transmisión Shimano XT',
            isPrimary: true
          }
        ],
        stock: 5,
        specifications: {
          weight: '2.1 kg',
          material: 'Aluminio y acero',
          compatibility: 'Mountain Bike',
          warranty: '2 años'
        },
        features: ['12 velocidades', 'Cambio hidráulico', 'Resistente al agua'],
        is_active: true,
        is_featured: true,
        tags: ['mountain', '12v', 'hidráulico']
      },
      {
        name: 'Kit Frenos Hidráulicos Shimano Deore',
        description: 'Sistema de frenado hidráulico de alta calidad para mountain bike',
        price: 850000,
        original_price: 1000000,
        category_id: categories[1].id,
        brand: 'Shimano',
        model: 'Deore BR-M6120',
        sku: 'SH-DEORE-BR-M6120',
        images: [
          {
            url: 'https://via.placeholder.com/400x300',
            alt: 'Frenos Shimano Deore',
            isPrimary: true
          }
        ],
        stock: 8,
        specifications: {
          weight: '450g',
          material: 'Aluminio',
          compatibility: 'Mountain Bike',
          warranty: '2 años'
        },
        features: ['Frenado potente', 'Resistente al agua', 'Fácil mantenimiento'],
        is_active: true,
        is_featured: true,
        tags: ['hidráulico', 'mountain', 'potente']
      },
      {
        name: 'Ruedas Shimano Deore XT',
        description: 'Juego de ruedas de alta calidad para mountain bike',
        price: 1500000,
        original_price: 1800000,
        category_id: categories[2].id,
        brand: 'Shimano',
        model: 'Deore XT WH-MT800',
        sku: 'SH-DEORE-WH-MT800',
        images: [
          {
            url: 'https://via.placeholder.com/400x300',
            alt: 'Ruedas Shimano Deore XT',
            isPrimary: true
          }
        ],
        stock: 3,
        specifications: {
          weight: '1.8 kg',
          material: 'Aluminio',
          compatibility: 'Mountain Bike',
          warranty: '2 años'
        },
        features: ['Ligeras', 'Resistentes', 'Buena aerodinámica'],
        is_active: true,
        is_featured: true,
        tags: ['ligeras', 'resistentes', 'mountain']
      }
    ], { ignoreDuplicates: true });

    console.log('✅ Datos iniciales creados correctamente');
  } catch (error) {
    console.error('❌ Error creando datos iniciales:', error);
  }
};

module.exports = {
  User,
  Category,
  Product,
  Cart,
  Order,
  defineAssociations,
  syncAllModels,
  createInitialData
};
