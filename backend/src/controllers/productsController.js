const Product = require('../models/Product');
const Category = require('../models/Category');

// Obtener todos los productos (público)
const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category_id, 
      brand, 
      min_price, 
      max_price, 
      search,
      sort = 'created_at',
      order = 'desc',
      in_stock
    } = req.query;

    const filters = {
      category_id: category_id ? parseInt(category_id) : null,
      brand: brand || null,
      min_price: min_price ? parseFloat(min_price) : null,
      max_price: max_price ? parseFloat(max_price) : null,
      in_stock: in_stock === 'true',
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };

    // Buscar productos
    const products = search 
      ? await Product.searchProducts(search, filters)
      : await Product.getAll(filters);

    // Contar total
    const total = await Product.count(filters);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener producto por ID (público)
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.getById(id);

    if (!product || !product.is_active) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Incrementar vistas
    await Product.incrementViews(id);

    // Actualizar producto con las vistas incrementadas
    const updatedProduct = await Product.getById(id);

    res.status(200).json({
      success: true,
      data: updatedProduct
    });

  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener producto por ID (admin) - incluye inactivos
const getProductByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.getById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener productos destacados (público)
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.getFeatured(parseInt(limit));

    res.status(200).json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Error obteniendo productos destacados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener productos relacionados (público)
const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    const product = await Product.getById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const relatedProducts = await Product.getByCategory(
      product.category_id,
      parseInt(limit) + 1 // +1 para excluir el producto actual
    );

    // Filtrar el producto actual
    const filtered = relatedProducts.filter(p => p.id !== parseInt(id)).slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: filtered
    });

  } catch (error) {
    console.error('Error obteniendo productos relacionados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ========== RUTAS PRIVADAS (ADMIN) ==========

// Crear producto (admin)
const createProduct = async (req, res) => {
  try {
    // Validar que haya imagen
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'La imagen es obligatoria para crear un producto'
      });
    }

    // Los datos vienen directamente en req.body desde FormData procesado por multer
    const image_url = `/uploads/products/${req.file.filename}`;
    
    const data = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      original_price: req.body.original_price ? parseFloat(req.body.original_price) : null,
      stock: parseInt(req.body.stock || 0, 10),
      sku: req.body.sku,
      brand: req.body.brand || null,
      model: req.body.model || null,
      category_id: req.body.category_id ? parseInt(req.body.category_id, 10) : null,
      image_url: image_url,
      is_active: req.body.is_active === 'true' || req.body.is_active === true || req.body.is_active === undefined,
      is_featured: req.body.is_featured === 'true' || req.body.is_featured === true
    };

    // Validar campos requeridos
    if (!data.name || !data.description || !data.price || !data.sku) {
      // Eliminar imagen si falta validación
      if (req.file) {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '../../uploads/products', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(400).json({
        success: false,
        message: 'Nombre, descripción, precio y SKU son requeridos'
      });
    }

    const product = await Product.create(data);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product
    });

  } catch (error) {
    console.error('Error creando producto:', error);
    
    // Si hay imagen subida pero falló la creación, eliminar la imagen
    if (req.file) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '../../uploads/products', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    if (error.message.includes('SKU') || error.message.includes('requeridos')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar producto (admin)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener producto actual para eliminar imagen anterior si se sube nueva
    const currentProduct = await Product.getById(id);
    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Si hay nueva imagen subida, usar su ruta y eliminar la anterior
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (currentProduct.image_url) {
        const fs = require('fs');
        const path = require('path');
        const oldImagePath = path.join(__dirname, '../../', currentProduct.image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    // Los datos vienen directamente en req.body desde FormData procesado por multer
    const updateData = {};
    
    // Solo incluir campos que fueron enviados
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.price !== undefined) updateData.price = parseFloat(req.body.price);
    if (req.body.original_price !== undefined && req.body.original_price !== '') {
      updateData.original_price = parseFloat(req.body.original_price);
    }
    if (req.body.stock !== undefined) updateData.stock = parseInt(req.body.stock, 10);
    if (req.body.sku !== undefined) updateData.sku = req.body.sku;
    if (req.body.brand !== undefined) updateData.brand = req.body.brand || null;
    if (req.body.model !== undefined) updateData.model = req.body.model || null;
    if (req.body.category_id !== undefined && req.body.category_id !== '') {
      updateData.category_id = parseInt(req.body.category_id, 10);
    }
    if (req.body.is_active !== undefined) {
      updateData.is_active = req.body.is_active === 'true' || req.body.is_active === true;
    }
    if (req.body.is_featured !== undefined) {
      updateData.is_featured = req.body.is_featured === 'true' || req.body.is_featured === true;
    }
    
    // Actualizar imagen si se subió nueva
    if (req.file) {
      updateData.image_url = `/uploads/products/${req.file.filename}`;
    }

    const product = await Product.update(id, updateData);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product
    });

  } catch (error) {
    console.error('Error actualizando producto:', error);
    
    // Si se subió nueva imagen pero falló la actualización, eliminar la nueva imagen
    if (req.file) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '../../uploads/products', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    if (error.message.includes('SKU') || error.message.includes('no encontrado')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar producto (admin)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener producto antes de eliminar para borrar su imagen
    const product = await Product.getById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Eliminar imagen del producto si existe
    if (product.image_url) {
      const fs = require('fs');
      const path = require('path');
      const imagePath = path.join(__dirname, '../../', product.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Eliminar producto de la base de datos
    const deletedProduct = await Product.delete(id);

    res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener todos los productos (admin) - incluye inactivos
const getAllProducts = async (req, res) => {
  console.log('🔍 getAllProducts ejecutándose...');
  try {
    const { 
      page = 1, 
      limit = 20, 
      search,
      category_id,
      status
    } = req.query;

    const filters = {
      category_id: category_id ? parseInt(category_id) : null,
      is_active: status === 'inactive' ? false : status === 'active' ? true : undefined,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };

    if (status === 'active') {
      filters.is_active = true;
    } else if (status === 'inactive') {
      filters.is_active = false;
    }

    // Para admin, usar getAllAdmin que incluye productos inactivos
    const products = search 
      ? await Product.searchProductsAdmin(search, filters)
      : await Product.getAllAdmin(filters);

    const total = await Product.countAdmin(filters);

    console.log(`✅ getAllProducts: ${products.length} productos encontrados (total: ${total})`);
    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo productos:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener estadísticas de productos (admin)
const getProductStats = async (req, res) => {
  try {
    const db = require('../config/database');

    // Contar productos
    const totalResult = await db.query('SELECT COUNT(*) as total FROM products');
    const totalProducts = parseInt(totalResult.rows[0].total);

    const activeResult = await db.query('SELECT COUNT(*) as total FROM products WHERE is_active = true');
    const activeProducts = parseInt(activeResult.rows[0].total);

    const featuredResult = await db.query('SELECT COUNT(*) as total FROM products WHERE is_featured = true');
    const featuredProducts = parseInt(featuredResult.rows[0].total);

    const lowStockResult = await db.query('SELECT COUNT(*) as total FROM products WHERE stock <= 5 AND is_active = true');
    const lowStockProducts = parseInt(lowStockResult.rows[0].total);

    // Productos más vendidos
    const topSelling = await Product.getTopSelling(5);

    // Productos más vistos
    const mostViewed = await Product.getMostViewed(5);

    res.status(200).json({
      success: true,
      data: {
        total: totalProducts,
        active: activeProducts,
        featured: featuredProducts,
        lowStock: lowStockProducts,
        topSelling: topSelling.map(p => ({ name: p.name, sales: p.sales })),
        mostViewed: mostViewed.map(p => ({ name: p.name, views: p.views }))
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  // Rutas públicas
  getProducts,
  getProductById,
  getFeaturedProducts,
  getRelatedProducts,
  
  // Rutas privadas (admin)
  getProductByIdAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductStats
};