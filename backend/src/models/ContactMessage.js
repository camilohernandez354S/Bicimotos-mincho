const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'El teléfono no puede exceder 20 caracteres']
  },
  subject: {
    type: String,
    required: [true, 'El asunto es requerido'],
    trim: true,
    maxlength: [200, 'El asunto no puede exceder 200 caracteres']
  },
  message: {
    type: String,
    required: [true, 'El mensaje es requerido'],
    trim: true,
    maxlength: [2000, 'El mensaje no puede exceder 2000 caracteres']
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  source: {
    type: String,
    enum: ['website', 'email', 'phone', 'social', 'other'],
    default: 'website'
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    default: null
  },
  reply: {
    message: String,
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser'
    },
    repliedAt: Date
  },
  tags: [String],
  notes: [{
    note: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdminUser'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
contactMessageSchema.index({ email: 1 });
contactMessageSchema.index({ status: 1 });
contactMessageSchema.index({ priority: 1 });
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ assignedTo: 1 });

// Virtual para calcular tiempo de respuesta
contactMessageSchema.virtual('responseTime').get(function() {
  if (this.reply && this.reply.repliedAt) {
    return this.reply.repliedAt - this.createdAt;
  }
  return null;
});

// Virtual para verificar si es urgente
contactMessageSchema.virtual('isUrgent').get(function() {
  const hoursSinceCreated = (Date.now() - this.createdAt) / (1000 * 60 * 60);
  return this.priority === 'urgent' || (this.status === 'new' && hoursSinceCreated > 24);
});

// Método para marcar como leído
contactMessageSchema.methods.markAsRead = function(adminId) {
  if (this.status === 'new') {
    this.status = 'read';
    this.assignedTo = adminId;
    return this.save();
  }
  return Promise.resolve(this);
};

// Método para responder mensaje
contactMessageSchema.methods.replyTo = function(replyMessage, adminId) {
  this.reply = {
    message: replyMessage,
    repliedBy: adminId,
    repliedAt: new Date()
  };
  this.status = 'replied';
  return this.save();
};

// Método para cerrar mensaje
contactMessageSchema.methods.close = function(adminId) {
  this.status = 'closed';
  this.assignedTo = adminId;
  return this.save();
};

// Método para agregar nota
contactMessageSchema.methods.addNote = function(note, adminId) {
  this.notes.push({
    note,
    createdBy: adminId,
    createdAt: new Date()
  });
  return this.save();
};

// Método estático para obtener estadísticas
contactMessageSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Método estático para obtener mensajes por prioridad
contactMessageSchema.statics.getByPriority = function(priority) {
  return this.find({ priority, status: { $ne: 'closed' } })
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });
};

// Método estático para buscar mensajes
contactMessageSchema.statics.searchMessages = function(query, filters = {}) {
  const searchQuery = {};
  
  if (query) {
    searchQuery.$or = [
      { name: new RegExp(query, 'i') },
      { email: new RegExp(query, 'i') },
      { subject: new RegExp(query, 'i') },
      { message: new RegExp(query, 'i') }
    ];
  }
  
  if (filters.status) {
    searchQuery.status = filters.status;
  }
  
  if (filters.priority) {
    searchQuery.priority = filters.priority;
  }
  
  if (filters.dateFrom || filters.dateTo) {
    searchQuery.createdAt = {};
    if (filters.dateFrom) searchQuery.createdAt.$gte = new Date(filters.dateFrom);
    if (filters.dateTo) searchQuery.createdAt.$lte = new Date(filters.dateTo);
  }
  
  return this.find(searchQuery)
    .populate('assignedTo', 'name email')
    .populate('reply.repliedBy', 'name email')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
