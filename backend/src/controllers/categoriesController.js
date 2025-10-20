const Category = require('../models/Category');

// Obtener todas las categorías (público)
const getCategories = async (req, res) => {
  try {
    const { hierarchy = false } = req.query;

    let categories;
    if (hierarchy === 'true') {
      categories = await Category.getHierarchy();
    } else {
      categories = await Category.find({ isActive: true })
        .sort({ sortOrder: 1, name: 1 })
        .select('-__v');
    }

    res.status(200).json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener categoría por ID (público)
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id)
      .populate('subcategories')
      .select('-__v');

    if (!category || !category.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener categorías principales (público)
const getMainCategories = async (req, res) => {
  try {
    const categories = await Category.getMainCategories();

    res.status(200).json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error obteniendo categorías principales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener subcategorías (público)
const getSubcategories = async (req, res) => {
  try {
    const { parentId } = req.params;

    const subcategories = await Category.getSubcategories(parentId);

    res.status(200).json({
      success: true,
      data: subcategories
    });

  } catch (error) {
    console.error('Error obteniendo subcategorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ========== RUTAS PRIVADAS (ADMIN) ==========

// Crear categoría (admin)
const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;

    // Verificar que el nombre sea único
    const existingCategory = await Category.findOne({ 
      name: categoryData.name,
      isActive: true 
    });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }

    const category = new Category(categoryData);
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: category
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

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese slug'
      });
    }

    console.error('Error creando categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar categoría (admin)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Si se está actualizando el nombre, verificar que sea único
    if (updateData.name) {
      const existingCategory = await Category.findOne({ 
        name: updateData.name,
        _id: { $ne: id },
        isActive: true 
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una categoría con ese nombre'
        });
      }
    }

    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: category
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

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese slug'
      });
    }

    console.error('Error actualizando categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar categoría (admin)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si hay productos asociados
    const Product = require('../models/Product');
    const productsCount = await Product.countDocuments({ category: id });

    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la categoría porque tiene ${productsCount} productos asociados`
      });
    }

    // Verificar si hay subcategorías
    const subcategoriesCount = await Category.countDocuments({ parent: id });

    if (subcategoriesCount > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la categoría porque tiene ${subcategoriesCount} subcategorías`
      });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener todas las categorías (admin)
const getAllCategories = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search,
      status,
      sort = 'name',
      order = 'asc'
    } = req.query;

    const query = {};

    // Filtros
    if (search) {
      query.name = new RegExp(search, 'i');
    }
    if (status) query.isActive = status === 'active';

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Ordenamiento
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    const categories = await Category.find(query)
      .populate('parent', 'name')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Category.countDocuments(query);

    res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener estadísticas de categorías (admin)
const getCategoryStats = async (req, res) => {
  try {
    const totalCategories = await Category.countDocuments();
    const activeCategories = await Category.countDocuments({ isActive: true });
    const mainCategories = await Category.countDocuments({ parent: null });
    const subcategories = await Category.countDocuments({ parent: { $ne: null } });

    // Categorías con más productos
    const Product = require('../models/Product');
    const categoriesWithProducts = await Category.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $project: {
          name: 1,
          productCount: { $size: '$products' }
        }
      },
      {
        $sort: { productCount: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalCategories,
        active: activeCategories,
        main: mainCategories,
        subcategories: subcategories,
        topCategories: categoriesWithProducts
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
  getCategories,
  getCategoryById,
  getMainCategories,
  getSubcategories,
  
  // Rutas privadas (admin)
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryStats
};
