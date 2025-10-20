const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la categoría es requerido'],
    trim: true,
    unique: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  image: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });

// Virtual para contar productos
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Virtual para subcategorías
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Middleware para generar slug automáticamente
categorySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
      .trim('-'); // Remover guiones al inicio y final
  }
  next();
});

// Middleware para calcular nivel automáticamente
categorySchema.pre('save', async function(next) {
  if (this.isModified('parent')) {
    if (this.parent) {
      const parentCategory = await this.constructor.findById(this.parent);
      this.level = parentCategory ? parentCategory.level + 1 : 0;
    } else {
      this.level = 0;
    }
  }
  next();
});

// Método estático para obtener categorías con jerarquía
categorySchema.statics.getHierarchy = function() {
  return this.find({ isActive: true })
    .populate('subcategories')
    .sort({ sortOrder: 1, name: 1 });
};

// Método estático para obtener categorías principales
categorySchema.statics.getMainCategories = function() {
  return this.find({ 
    isActive: true, 
    parent: null 
  }).sort({ sortOrder: 1, name: 1 });
};

// Método estático para obtener subcategorías
categorySchema.statics.getSubcategories = function(parentId) {
  return this.find({ 
    isActive: true, 
    parent: parentId 
  }).sort({ sortOrder: 1, name: 1 });
};

// Método para obtener ruta completa de la categoría
categorySchema.methods.getFullPath = async function() {
  const path = [this.name];
  let current = this;
  
  while (current.parent) {
    current = await this.constructor.findById(current.parent);
    if (current) {
      path.unshift(current.name);
    } else {
      break;
    }
  }
  
  return path.join(' > ');
};

module.exports = mongoose.model('Category', categorySchema);