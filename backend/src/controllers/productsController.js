const Product = require('../models/Product');
const Category = require('../models/Category');

// Obtener todos los productos (público)
const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      brand, 
      minPrice, 
      maxPrice, 
      search,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = { isActive: true };

    // Filtros
    if (category) query.category = category;
    if (brand) query.brand = new RegExp(brand, 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Búsqueda por texto
    if (search) {
      query.$text = { $search: search };
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Ordenamiento
    const sortObj = {};
    if (sort === 'price') {
      sortObj.price = order === 'asc' ? 1 : -1;
    } else if (sort === 'name') {
      sortObj.name = order === 'asc' ? 1 : -1;
    } else {
      sortObj[sort] = order === 'asc' ? 1 : -1;
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Product.countDocuments(query);

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

    const product = await Product.findById(id)
      .populate('category', 'name slug')
      .select('-__v');

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Incrementar vistas
    await product.incrementViews();

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

    const products = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('-__v');

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

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: id },
      category: product.category,
      isActive: true
    })
      .populate('category', 'name slug')
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      success: true,
      data: relatedProducts
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

    // Verificar que el SKU sea único
    const existingProduct = await Product.findOne({ sku: productData.sku });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'El SKU ya existe'
      });
    }

    const product = new Product(productData);
    await product.save();

    await product.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors
      });
    }

    console.error('Error creando producto:', error);
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

    // Si se está actualizando el SKU, verificar que sea único
    if (updateData.sku) {
      const existingProduct = await Product.findOne({ 
        sku: updateData.sku, 
        _id: { $ne: id } 
      });
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'El SKU ya existe'
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

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
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors
      });
    }

    console.error('Error actualizando producto:', error);
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

    const product = await Product.findByIdAndDelete(id);

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
      category,
      status,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};

    // Filtros
    if (search) {
      query.$text = { $search: search };
    }
    if (category) query.category = category;
    if (status) query.isActive = status === 'active';

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Ordenamiento
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Product.countDocuments(query);

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
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5 } });

    // Productos más vendidos
    const topSellingProducts = await Product.find()
      .sort({ sales: -1 })
      .limit(5)
      .select('name sales');

    // Productos más vistos
    const mostViewedProducts = await Product.find()
      .sort({ views: -1 })
      .limit(5)
      .select('name views');

    res.status(200).json({
      success: true,
      data: {
        total: totalProducts,
        active: activeProducts,
        featured: featuredProducts,
        lowStock: lowStockProducts,
        topSelling: topSellingProducts,
        mostViewed: mostViewedProducts
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
