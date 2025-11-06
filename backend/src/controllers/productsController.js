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
    const productData = req.body;

    // Mapear campos de camelCase a snake_case
    const mappedData = {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      original_price: productData.originalPrice || productData.original_price,
      stock: productData.stock || 0,
      sku: productData.sku,
      brand: productData.brand,
      model: productData.model,
      category_id: productData.categoryId || productData.category_id,
      image_url: productData.imageUrl || productData.image_url,
      images: productData.images,
      specifications: productData.specifications,
      features: productData.features,
      tags: productData.tags,
      is_active: productData.isActive !== undefined ? productData.isActive : true,
      is_featured: productData.isFeatured !== undefined ? productData.isFeatured : false
    };

    const product = await Product.create(mappedData);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product
    });

  } catch (error) {
    console.error('Error creando producto:', error);
    
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
    const updateData = req.body;

    // Mapear campos de camelCase a snake_case
    const mappedData = {};
    const fieldMap = {
      originalPrice: 'original_price',
      categoryId: 'category_id',
      imageUrl: 'image_url',
      isActive: 'is_active',
      isFeatured: 'is_featured'
    };

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        const dbField = fieldMap[key] || key;
        mappedData[dbField] = value;
      }
    }

    const product = await Product.update(id, mappedData);

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

    const product = await Product.delete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

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

// Obtener todos los productos (admin)
const getAllProducts = async (req, res) => {
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
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };

    if (status === 'active') {
      filters.is_active = true;
    } else if (status === 'inactive') {
      filters.is_active = false;
    }

    const products = search 
      ? await Product.searchProducts(search, filters)
      : await Product.getAll(filters);

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
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductStats
};