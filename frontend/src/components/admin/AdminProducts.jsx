import React, { useState, useEffect } from 'react';
import adminProductsService from '../../services/adminProductsService';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  Save,
  X,
  Upload,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    stock: '',
    category: '',
    brand: '',
    model: '',
    sku: '',
    status: 'active'
  });

  // Datos de ejemplo como fallback
  const mockProducts = [
    {
      id: 1,
      name: 'Shimano XT M8100',
      description: 'Grupo de transmisión completo Shimano XT',
      price: 2500000,
      original_price: 2800000,
      stock: 15,
      category: 'Transmisiones',
      brand: 'Shimano',
      model: 'XT M8100',
      sku: 'SH-XT-8100',
      status: 'active',
      images: ['https://via.placeholder.com/300x200'],
      created_at: '2024-01-15',
      updated_at: '2024-01-20'
    },
    {
      id: 2,
      name: 'Frenos Deore BR-M6120',
      description: 'Frenos hidráulicos Shimano Deore',
      price: 450000,
      original_price: 500000,
      stock: 8,
      category: 'Frenos',
      brand: 'Shimano',
      model: 'BR-M6120',
      sku: 'SH-DEORE-6120',
      status: 'active',
      images: ['https://via.placeholder.com/300x200'],
      created_at: '2024-01-10',
      updated_at: '2024-01-18'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        adminProductsService.getProducts(),
        adminProductsService.getCategories()
      ]);
      
      // Asegurar que productsData es un array
      const productsArray = Array.isArray(productsData) ? productsData : 
                           Array.isArray(productsData?.data) ? productsData.data : 
                           Array.isArray(productsData?.products) ? productsData.products : [];
      
      // Asegurar que categoriesData es un array
      const categoriesArray = Array.isArray(categoriesData) ? categoriesData : 
                              Array.isArray(categoriesData?.data) ? categoriesData.data : 
                              Array.isArray(categoriesData?.categories) ? categoriesData.categories : [];
      
      setProducts(productsArray);
      setCategories(categoriesArray);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos. Usando datos de ejemplo.');
      // Fallback a datos de ejemplo si la API falla
      setProducts(mockProducts);
      setCategories(['Transmisiones', 'Frenos', 'Ruedas', 'Pedales', 'Suspensiones']);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      original_price: product.original_price || '',
      stock: product.stock || '',
      category: product.category || '',
      brand: product.brand || '',
      model: product.model || '',
      sku: product.sku || '',
      status: product.status || 'active'
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await adminProductsService.deleteProduct(productId);
        setProducts(Array.isArray(products) ? products.filter(p => p.id !== productId) : []);
        toast.success('Producto eliminado correctamente');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Error al eliminar el producto');
      }
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      stock: '',
      category: '',
      brand: '',
      model: '',
      sku: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: parseFloat(formData.original_price),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        // Actualizar producto existente
        const updatedProduct = await adminProductsService.updateProduct(editingProduct.id, productData);
        setProducts(Array.isArray(products) ? products.map(p => p.id === editingProduct.id ? updatedProduct : p) : []);
        toast.success('Producto actualizado correctamente');
      } else {
        // Crear nuevo producto
        const newProduct = await adminProductsService.createProduct(productData);
        setProducts(Array.isArray(products) ? [...products, newProduct] : [newProduct]);
        toast.success('Producto creado correctamente');
      }

      setShowModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error al guardar el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const ProductModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingProduct ? 'Editar Producto' : 'Crear Producto'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Ej: Shimano XT M8100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Ej: SH-XT-8100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Ej: Shimano"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Ej: XT M8100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="2500000"
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Original
                  </label>
                  <input
                    type="number"
                    name="original_price"
                    value={formData.original_price}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="2800000"
                    min="0"
                    step="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="15"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select 
                    name="category" 
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input h-24 resize-none"
                  placeholder="Descripción detallada del producto..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select 
                  name="status" 
                  value={formData.status}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-ghost px-6 py-2"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-2 flex items-center gap-2"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingProduct ? 'Actualizar' : 'Crear'} Producto
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Gestión de Productos
            </h1>
            <p className="text-gray-600">
              Administra el catálogo de productos Shimano
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={loadData}
              className="btn-ghost px-4 py-2 flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button
              onClick={handleCreate}
              className="btn-primary px-6 py-3 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nuevo Producto
            </button>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-6 rounded-xl shadow-card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, SKU o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-12"
              />
            </div>
          </div>
          <div className="md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Producto
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Precio
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></RefreshCw>
                      <span className="ml-3 text-gray-600">Cargando productos...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No se encontraron productos</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {searchTerm || selectedCategory !== 'all' 
                        ? 'Intenta ajustar los filtros de búsqueda' 
                        : 'Crea tu primer producto haciendo clic en "Nuevo Producto"'
                      }
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.images?.[0] || 'https://via.placeholder.com/300x200'}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.brand} {product.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 font-mono">{product.sku}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{formatPrice(product.price)}</p>
                        {product.original_price && product.original_price > product.price && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(product.original_price)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' :
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-gray-600 hover:text-primary-500 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-gray-600 hover:text-red-500 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <ProductModal />
    </div>
  );
};

export default AdminProducts;