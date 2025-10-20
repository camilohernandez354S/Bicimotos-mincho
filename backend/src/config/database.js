const mongoose = require('mongoose');

// Configuración de MongoDB
const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Mantener hasta 10 conexiones socket
  serverSelectionTimeoutMS: 5000, // Mantener intentando enviar operaciones por 5 segundos
  socketTimeoutMS: 45000, // Cerrar sockets después de 45 segundos de inactividad
  bufferMaxEntries: 0, // Deshabilitar mongoose buffering
  bufferCommands: false, // Deshabilitar mongoose buffering
};

// Función para conectar a MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bicimotos-mincho';
    
    await mongoose.connect(mongoURI, mongoConfig);
    
    console.log('✅ MongoDB conectado exitosamente');
    
    // Configurar eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB desconectado');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });

    return true;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    return false;
  }
};

// Función para desconectar de MongoDB
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('📦 Conexión a MongoDB cerrada');
    return true;
  } catch (error) {
    console.error('❌ Error cerrando conexión a MongoDB:', error);
    return false;
  }
};

// Función para verificar el estado de la conexión
const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return {
    state: states[mongoose.connection.readyState],
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name
  };
};

// Función para obtener estadísticas de la conexión
const getConnectionStats = () => {
  return {
    collections: mongoose.connection.collections,
    models: mongoose.connection.models,
    readyState: mongoose.connection.readyState
  };
};

module.exports = {
  connectDB,
  disconnectDB,
  getConnectionStatus,
  getConnectionStats
};