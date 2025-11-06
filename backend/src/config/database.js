const { Pool } = require('pg');

// Configuración de PostgreSQL
let pool = null;

// Función para crear el pool de conexiones
const createPool = () => {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'bicimotos_mincho',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      max: 20, // Máximo de conexiones en el pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Manejar errores del pool
    pool.on('error', (err) => {
      console.error('❌ Error inesperado en el pool de PostgreSQL:', err);
    });
  }
  return pool;
};

// Función para conectar a PostgreSQL
const connectDB = async () => {
  try {
    pool = createPool();
    
    // Probar la conexión
    const client = await pool.connect();
    console.log('✅ PostgreSQL conectado exitosamente');
    console.log(`📊 Base de datos: ${process.env.DB_NAME || 'bicimotos_mincho'}`);
    client.release();
    
    return true;
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    
    // Mensajes de ayuda según el tipo de error
    if (error.message.includes('password') || error.message.includes('autentificación')) {
      console.error('\n💡 SOLUCIÓN:');
      console.error('   1. Verifica que el archivo .env existe en la carpeta backend/');
      console.error('   2. Asegúrate de que DB_PASSWORD tenga la contraseña correcta de PostgreSQL');
      console.error('   3. Si no tienes .env, copia env.example a .env y configura las credenciales');
      console.error('   4. Ejecuta: copy env.example .env');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('no se puede conectar')) {
      console.error('\n💡 SOLUCIÓN:');
      console.error('   1. Verifica que PostgreSQL esté ejecutándose');
      console.error('   2. Verifica que el puerto 5432 esté disponible');
      console.error('   3. Verifica la configuración de DB_HOST en .env');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.error('\n💡 SOLUCIÓN:');
      console.error('   1. Crea la base de datos: CREATE DATABASE bicimotos_mincho;');
      console.error('   2. O cambia DB_NAME en .env a una base de datos existente');
    }
    
    return false;
  }
};

// Función para ejecutar queries
const query = async (text, params) => {
  try {
    if (!pool) {
      throw new Error('Pool de conexiones no inicializado');
    }
    
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Solo mostrar queries en desarrollo si son muy lentas o si hay un flag específico
    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_QUERIES === 'true') {
      if (duration > 100) { // Solo mostrar queries que toman más de 100ms
        console.log('📊 Query lenta:', { duration, rows: result.rowCount });
      }
    }
    
    return result;
  } catch (error) {
    // No loggear errores de "ya existe" o "no existe" para índices y comentarios
    if (error.message.includes('already exists') || 
        error.message.includes('does not exist') ||
        error.message.includes('duplicate')) {
      // Ignorar estos errores silenciosamente
      throw error;
    }
    console.error('❌ Error ejecutando query:', error.message);
    throw error;
  }
};

// Función para obtener un cliente del pool
const getClient = async () => {
  return await pool.connect();
};

// Función para desconectar de PostgreSQL
const disconnectDB = async () => {
  try {
    if (pool) {
      await pool.end();
      console.log('📦 Conexión a PostgreSQL cerrada');
      pool = null;
    }
    return true;
  } catch (error) {
    console.error('❌ Error cerrando conexión a PostgreSQL:', error);
    return false;
  }
};

// Función para verificar el estado de la conexión
const getConnectionStatus = async () => {
  try {
    if (!pool) {
      return { state: 'disconnected' };
    }
    
    const result = await pool.query('SELECT NOW()');
    return {
      state: 'connected',
      timestamp: result.rows[0].now
    };
  } catch (error) {
    return {
      state: 'error',
      error: error.message
    };
  }
};

// Inicializar el pool al cargar el módulo
if (process.env.NODE_ENV !== 'test') {
  createPool();
}

module.exports = {
  connectDB,
  disconnectDB,
  query,
  getClient,
  getConnectionStatus,
  pool: () => pool || createPool()
};