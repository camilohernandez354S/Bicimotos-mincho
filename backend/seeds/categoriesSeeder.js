const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const db = require('../src/config/database');
const Category = require('../src/models/Category');

const categories = [
  'Grupos de cambios',
  'Llantas',
  'Rines',
  'Frenos',
  'Discos',
  'Manubrios',
  'Suspensiones',
  'Cascos',
  'Ropa',
  'Zapatillas',
  'Gafas',
  'Medias',
  'Guantes',
  'Repuestos en general de la bicicleta'
];

async function seedCategories() {
  try {
    await db.connectDB();

    for (const name of categories) {
      const slug = Category.generateSlug ? Category.generateSlug(name) : name.toLowerCase().replace(/\s+/g, '-');

      await db.query(
        `INSERT INTO categories (name, slug, description, is_active)
         VALUES ($1, $2, NULL, TRUE)
         ON CONFLICT (slug) DO NOTHING`,
        [name, slug]
      );
    }

    console.log('✅ Categorías insertadas correctamente');
    await db.disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al insertar categorías:', error.message);
    await db.disconnectDB();
    process.exit(1);
  }
}

seedCategories();
