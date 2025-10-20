const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
adminUserSchema.index({ email: 1 });
adminUserSchema.index({ isActive: 1 });

// Virtual para verificar si la cuenta está bloqueada
adminUserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Middleware para encriptar contraseña antes de guardar
adminUserSchema.pre('save', async function(next) {
  // Solo encriptar si la contraseña ha sido modificada
  if (!this.isModified('password')) return next();
  
  try {
    // Encriptar contraseña con bcrypt
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
adminUserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Método para incrementar intentos de login
adminUserSchema.methods.incLoginAttempts = function() {
  // Si tenemos un lockUntil anterior y ya expiró, reiniciar
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Bloquear cuenta después de 5 intentos fallidos por 2 horas
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 horas
  }
  
  return this.updateOne(updates);
};

// Método para resetear intentos de login
adminUserSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

// Método estático para crear admin por defecto
adminUserSchema.statics.createDefaultAdmin = async function() {
  try {
    const existingAdmin = await this.findOne({ email: 'admin@bicimotosmincho.com' });
    
    if (!existingAdmin) {
      const defaultAdmin = new this({
        name: 'Administrador',
        email: 'admin@bicimotosmincho.com',
        password: 'BicimotosMincho2024!', // Contraseña segura por defecto
        role: 'super_admin'
      });
      
      await defaultAdmin.save();
      console.log('✅ Usuario administrador por defecto creado');
      console.log('📧 Email: admin@bicimotosmincho.com');
      console.log('🔑 Contraseña: BicimotosMincho2024!');
    }
  } catch (error) {
    console.error('Error creando admin por defecto:', error);
  }
};

module.exports = mongoose.model('AdminUser', adminUserSchema);
