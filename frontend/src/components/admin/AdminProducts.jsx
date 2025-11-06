import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  X,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import AdminAuthService from '../../services/adminAuthService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    stock: '',
    category_id: '',
    brand: '',
    model: '',
    sku: '',
    is_active: true,
    is_featured: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/products`, {
        headers: AdminAuthService.getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data || []);
      } else {
        throw new Error(data.message || 'Error obteniendo productos');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar productos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        original_price: product.original_price || '',
        stock: product.stock || '',
        category_id: product.category_id || '',
        brand: product.brand || '',
        model: product.model || '',
        sku: product.sku || '',
        is_active: product.is_active !== undefined ? product.is_active : true,
        is_featured: product.is_featured || false
      });
      setImagePreview(product.image_url ? `${BACKEND_URL}${product.image_url}` : null);
      setImageFile(null);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        original_price: '',
        stock: '',
        category_id: '',
        brand: '',
        model: '',
        sku: '',
        is_active: true,
        is_featured: false
      });
      setImagePreview(null);
      setImageFile(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setImagePreview(null);
    setImageFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.match('image/(jpeg|jpg|png|webp)')) {
        toast.error('Solo se permiten archivos JPG, PNG o WEBP');
        return;
      }
      
      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen es demasiado grande. Máximo 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!formData.name || !formData.description || !formData.price || !formData.sku) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }
    
    // Validar imagen solo para creación
    if (!editingProduct && !imageFile) {
      toast.error('La imagen es obligatoria para crear un producto');
      return;
    }
    
    setSaving(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('original_price', formData.original_price || '');
      formDataToSend.append('stock', formData.stock || '0');
      formDataToSend.append('sku', formData.sku);
      formDataToSend.append('brand', formData.brand || '');
      formDataToSend.append('model', formData.model || '');
      formDataToSend.append('category_id', formData.category_id || '');
      formDataToSend.append('is_active', formData.is_active);
      formDataToSend.append('is_featured', formData.is_featured);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      const url = editingProduct 
        ? `${API_URL}/admin/products/${editingProduct.id}`
        : `${API_URL}/admin/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      // Para FormData, NO establecer Content-Type manualmente
      // El navegador lo establece automáticamente con el boundary correcto
      const headers = AdminAuthService.getAuthHeaders();
      // Eliminar Content-Type si existe para que el navegador lo establezca automáticamente
      delete headers['Content-Type'];
      
      const response = await fetch(url, {
        method,
        headers,
        body: formDataToSend
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(editingProduct ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
        closeModal();
        fetchProducts();
      } else {
        throw new Error(data.message || 'Error al guardar producto');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Error al guardar producto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers: AdminAuthService.getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Producto eliminado exitosamente');
        fetchProducts();
      } else {
        throw new Error(data.message || 'Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar producto');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Gestión de Productos
            </h1>
            <p className="text-gray-600">Administra los productos de tu tienda</p>
          </div>
          <button
            onClick={() => openModal()}
            className="btn-primary px-4 py-2 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="bg-white rounded-xl shadow-card p-6 mb-8">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar productos por nombre, SKU o marca..."
            className="input pl-12 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de productos */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando productos...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-card">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No se encontraron productos' : 'No hay productos registrados'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'Intenta con otros términos de búsqueda'
              : 'Crea tu primer producto con el botón "Nuevo Producto"'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => openModal()}
              className="btn-primary px-6 py-3 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Nuevo Producto
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Imagen */}
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden group">
                {product.image_url && !imageErrors[product.id] ? (
                  <img
                    src={`${BACKEND_URL}${product.image_url}`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      // Debug: mostrar la URL que falló
                      const imageUrl = `${BACKEND_URL}${product.image_url}`;
                      console.warn('⚠️ Error cargando imagen:', imageUrl);
                      console.warn('📦 Product image_url:', product.image_url);
                      console.warn('🌐 BACKEND_URL:', BACKEND_URL);
                      // Si falla la carga, marcar error para este producto
                      setImageErrors(prev => ({ ...prev, [product.id]: true }));
                    }}
                    onLoad={() => {
                      if (process.env.NODE_ENV === 'development') {
                        console.log('✅ Imagen cargada exitosamente:', `${BACKEND_URL}${product.image_url}`);
                      }
                    }}
                  />
                ) : (
                  /* Placeholder cuando no hay imagen_url o falla la carga */
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-2 shadow-sm">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-400 font-medium">
                      {product.image_url ? 'Error al cargar' : 'Sin imagen'}
                    </p>
                  </div>
                )}
                {/* Badge de estado */}
                <div className="absolute top-2 right-2 z-10">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${
                    product.is_active 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {product.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              
              {/* Contenido */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-primary-600">
                    ${parseFloat(product.price || 0).toLocaleString('es-CO')}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    product.stock > 5 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    Stock: {product.stock || 0}
                  </span>
                </div>
                
                {/* Acciones */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(product)}
                    className="flex-1 btn-secondary px-3 py-2 flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen {!editingProduct && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {imageFile ? imageFile.name : 'Haz clic para subir imagen'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG o WEBP (máx. 5MB)</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="input w-full"
                  required
                />
              </div>

              {/* Precio y Precio Original */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="input w-full"
                    min="0"
                    step="0.01"
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
                    className="input w-full"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Stock y SKU */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="input w-full"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="input w-full"
                    required
                  />
                </div>
              </div>

              {/* Marca y Modelo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="input w-full"
                  />
                </div>
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="input w-full"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado y Destacado */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Producto Activo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Destacado</span>
                </label>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 btn-secondary px-4 py-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-primary px-4 py-2 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Package className="w-5 h-5" />
                      {editingProduct ? 'Actualizar' : 'Crear'} Producto
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;