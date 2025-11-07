import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, ShoppingCart, Heart, Eye, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'react-hot-toast';
import SidebarCategorias from '../components/SidebarCategorias';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const Productos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const mockProducts = [
    {
      id: 1,
      name: 'Frenos Shimano Deore XT',
      description: 'Sistema de frenos hidráulicos de alto rendimiento',
      price: 450000,
      originalPrice: 600000,
      image: '/img/products/frenos-shimano.jpg',
      brand: 'Shimano',
      category: 'Frenos',
      rating: 4.8,
      reviews: 24,
      stock: 15,
      isFeatured: true
    },
    {
      id: 2,
      name: 'Cambio Shimano SLX',
      description: 'Desviador trasero de 12 velocidades',
      price: 320000,
      originalPrice: 400000,
      image: '/img/products/cambio-shimano.jpg',
      brand: 'Shimano',
      category: 'Cambios',
      rating: 4.6,
      reviews: 18,
      stock: 8,
      isFeatured: false
    },
    {
      id: 3,
      name: 'Pedales Shimano SPD',
      description: 'Pedales automáticos para mountain bike',
      price: 180000,
      originalPrice: 220000,
      image: '/img/products/pedales-shimano.jpg',
      brand: 'Shimano',
      category: 'Pedales',
      rating: 4.7,
      reviews: 32,
      stock: 12,
      isFeatured: true
    },
    {
      id: 4,
      name: 'Cadena Shimano HG-X',
      description: 'Cadena de 12 velocidades con tratamiento anticorrosión',
      price: 85000,
      originalPrice: 100000,
      image: '/img/products/cadena-shimano.jpg',
      brand: 'Shimano',
      category: 'Transmisión',
      rating: 4.5,
      reviews: 15,
      stock: 25,
      isFeatured: false
    }
  ];

  useEffect(() => {
    loadProducts();
  }, [currentPage, selectedCategory, sortBy, sortOrder]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (!categories.length) return;
    if (selectedCategory) {
      const match = categories.find((cat) => String(cat.id) === String(selectedCategory));
      setSelectedCategoryName(match ? match.name : '');
    } else {
      setSelectedCategoryName('');
    }
  }, [categories, selectedCategory]);

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/categorias`);

      if (!response.ok) {
        throw new Error('Error al cargar categorías');
      }

      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setCategories(result.data.map((category) => ({
          id: String(category.id),
          name: category.name,
        })));
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
      toast.error('No se pudieron cargar las categorías');
      setCategories([]);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (selectedCategory) {
        params.append('category_id', selectedCategory);
      }

      if (sortBy === 'price') {
        params.append('sort', 'price');
        params.append('order', sortOrder);
      } else if (sortBy === 'name') {
        params.append('sort', 'name');
        params.append('order', sortOrder);
      } else {
        params.append('sort', 'created_at');
        params.append('order', sortOrder);
      }

      const response = await fetch(`${API_BASE_URL}/public/productos?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }

      const result = await response.json();

      if (result.success && result.data) {
        const mappedProducts = result.data.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: parseFloat(product.price),
          originalPrice: product.original_price ? parseFloat(product.original_price) : null,
          image: product.image_url ? `${BACKEND_URL}${product.image_url}` : '/img/logo.jpg',
          brand: product.brand || 'Sin marca',
          category: product.category_name || 'Sin categoría',
          rating: product.rating_average || 0,
          reviews: product.rating_count || 0,
          stock: product.stock || 0,
          isFeatured: product.is_featured || false,
          sku: product.sku,
        }));

        setProducts(mappedProducts);
        setTotalPages(result.pagination?.pages || 1);
      } else {
        console.warn('No se encontraron productos, usando datos mock');
        setProducts(mockProducts);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
      toast.error('Error al cargar productos. Mostrando datos de ejemplo.');
      setProducts(mockProducts);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadProducts();
  };

  const addToCart = (product) => {
    console.log('Agregar al carrito:', product);
  };

  const toggleFavorite = (productId) => {
    console.log('Toggle favorito:', productId);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);

    const selectedCat = categories.find((cat) => String(cat.id) === String(value));
    setSelectedCategoryName(selectedCat ? selectedCat.name : '');
  };

  const handleSidebarCategoria = (categoriaNombre) => {
    const match = categories.find((cat) => cat.name === categoriaNombre);
    setSelectedCategory(match ? String(match.id) : '');
    setSelectedCategoryName(categoriaNombre);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex flex-1 flex-col lg:flex-row w-full max-w-[1400px] mx-auto mt-8 px-6 lg:px-10 gap-8">
        <div className="lg:w-64 lg:flex-shrink-0">
          <SidebarCategorias
            selectedCategory={selectedCategoryName}
            onSelectCategoria={handleSidebarCategoria}
          />
        </div>

        <main className="flex-1">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuestros Productos</h1>
            <p className="text-gray-500">
              Componentes de bicicleta de la más alta calidad
            </p>
          </header>

          <section className="bg-white rounded-xl shadow-card border border-gray-100 p-6 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="input pl-12 py-3 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary px-6 py-3">
                Buscar
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  className="input py-2"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select
                  className="input py-2"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                >
                  <option value="createdAt-desc">Más recientes</option>
                  <option value="createdAt-asc">Más antiguos</option>
                  <option value="price-asc">Precio menor</option>
                  <option value="price-desc">Precio mayor</option>
                  <option value="name-asc">Nombre A-Z</option>
                  <option value="name-desc">Nombre Z-A</option>
                </select>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
              <p className="ml-3 text-gray-600">Cargando productos...</p>
            </div>
          ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-xl transition-shadow animate-fade-in">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/img/logo.jpg';
                      }}
                    />
                    {product.isFeatured && (
                      <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Destacado
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-gray-600" />
                      </button>
                      <Link
                        to={`/producto/${product.id}`}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </Link>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-primary-600 bg-primary-100 px-2 py-1 rounded">
                        {product.brand}
                      </span>
                      <span className="text-xs text-gray-500">{product.category}</span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xl font-bold text-gray-900">
                          ${product.price.toLocaleString()}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span
                        className={clsx(
                          'text-xs px-2 py-1 rounded',
                          product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        )}
                      >
                        {product.stock > 10 ? 'En stock' : 'Poco stock'}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="btn-primary w-full py-2 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <div className="col-span-full text-center text-gray-500 mt-10">
                  No hay productos para esta categoría.
                </div>
              )}
            </section>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={clsx(
                      'px-4 py-2 rounded-lg transition-colors',
                      currentPage === page
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Productos;
