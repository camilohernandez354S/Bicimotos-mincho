import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, ShoppingCart, Heart, Eye, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const Productos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Mock data para desarrollo
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

  const categories = [
    'Todos',
    'Frenos',
    'Cambios',
    'Pedales',
    'Transmisión',
    'Ruedas',
    'Suspensión'
  ];

  useEffect(() => {
    loadProducts();
  }, [currentPage, selectedCategory, sortBy, sortOrder]);

  const loadProducts = async () => {
    setLoading(true);
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let filteredProducts = [...mockProducts];
    
    // Filtrar por categoría
    if (selectedCategory && selectedCategory !== 'Todos') {
      filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
    }
    
    // Filtrar por búsqueda
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Ordenar
    filteredProducts.sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortBy === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else {
        return sortOrder === 'asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    
    setProducts(filteredProducts);
    setTotalPages(Math.ceil(filteredProducts.length / 12));
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadProducts();
  };

  const addToCart = (product) => {
    // Implementar lógica de carrito
    console.log('Agregar al carrito:', product);
  };

  const toggleFavorite = (productId) => {
    // Implementar lógica de favoritos
    console.log('Toggle favorito:', productId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="wrapper py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Productos</h1>
          <p className="text-xl text-gray-600">
            Componentes de bicicleta de la más alta calidad
          </p>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
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

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                className="input py-2"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
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
        </div>

        {/* Grid de Productos */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
            <p className="ml-3 text-gray-600">Cargando productos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-xl transition-shadow animate-fade-in">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
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
                    <span className={clsx(
                      "text-xs px-2 py-1 rounded",
                      product.stock > 10 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    )}>
                      {product.stock > 10 ? "En stock" : "Poco stock"}
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
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={clsx(
                    "px-4 py-2 rounded-lg transition-colors",
                    currentPage === page
                      ? "bg-primary-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Productos;
