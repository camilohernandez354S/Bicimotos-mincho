const db = require('../config/database');
const bcrypt = require('bcryptjs');

class AdminUser {
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM admin_users WHERE email = $1 LIMIT 1';
      const result = await db.query(query, [email.toLowerCase()]);
      return result.rows[0];
    } catch (error) {
      console.error('Error buscando admin por email:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = 'SELECT * FROM admin_users WHERE id = $1 LIMIT 1';
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error buscando admin por ID:', error);
      throw error;
    }
  }

  static async createDefaultAdmin() {
    try {
      const defaultEmail = 'admin@bicimotosmincho.com';
      const defaultPassword = 'BicimotosMincho2024!';

      const check = await this.findByEmail(defaultEmail);
      
      if (!check) {
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        
        const query = 'INSERT INTO admin_users (email, password) VALUES ($1, $2) RETURNING id, email';
        const result = await db.query(query, [defaultEmail, hashedPassword]);
        
        console.log('✅ Admin por defecto creado: admin@bicimotosmincho.com / BicimotosMincho2024!');
        return result.rows[0];
      } else {
        console.log('ℹ️  Admin por defecto ya existe');
        // Si el admin ya existe pero tiene la contraseña antigua, actualizarla
        const testPassword = await this.validatePassword('BicimotosMincho2024!', check.password);
        if (!testPassword) {
          // La contraseña no coincide, actualizar a la nueva
          const hashedPassword = await bcrypt.hash(defaultPassword, 10);
          await db.query('UPDATE admin_users SET password = $1 WHERE id = $2', [hashedPassword, check.id]);
          console.log('✅ Contraseña del admin por defecto actualizada a: BicimotosMincho2024!');
        }
        return check;
      }
    } catch (error) {
      console.error('Error creando admin por defecto:', error);
      throw error;
    }
  }

  static async validatePassword(password, hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Error validando contraseña:', error);
      return false;
    }
  }

  static async create(email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO admin_users (email, password) VALUES ($1, $2) RETURNING id, email, created_at';
      const result = await db.query(query, [email.toLowerCase(), hashedPassword]);
      return result.rows[0];
    } catch (error) {
      console.error('Error creando admin:', error);
      throw error;
    }
  }

  static async updatePassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const query = 'UPDATE admin_users SET password = $1 WHERE id = $2 RETURNING id, email';
      const result = await db.query(query, [hashedPassword, id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error actualizando contraseña:', error);
      throw error;
    }
  }
}

module.exports = AdminUser;