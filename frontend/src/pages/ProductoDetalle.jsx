import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ArrowLeft, Truck, Shield, RotateCcw, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const ProductoDetalle = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Mock data para desarrollo
  const mockProduct = {
    id: 1,
    name: 'Frenos Shimano Deore XT',
    description: 'Sistema de frenos hidráulicos de alto rendimiento para mountain bike. Diseñado para ciclistas que buscan la máxima potencia de frenado y control en terrenos exigentes.',
    longDescription: `
      Los frenos Shimano Deore XT representan la excelencia en tecnología de frenado hidráulico. 
      Con su sistema de doble pistón y tecnología Ice Tech, estos frenos ofrecen un rendimiento 
      excepcional en cualquier condición climática.
      
      Características principales:
      • Sistema hidráulico de doble pistón
      • Tecnología Ice Tech para mejor disipación del calor
      • Palanca ajustable de alcance
      • Compatible con discos de 160mm a 203mm
      • Peso optimizado para máximo rendimiento
    `,
    price: 450000,
    originalPrice: 600000,
    images: [
      '/img/products/frenos-shimano-1.jpg',
      '/img/products/frenos-shimano-2.jpg',
      '/img/products/frenos-shimano-3.jpg'
    ],
    brand: 'Shimano',
    category: 'Frenos',
    rating: 4.8,
    reviews: 24,
    stock: 15,
    sku: 'SHI-DEO-XT-001',
    specifications: {
      peso: '180g',
      material: 'Aluminio forjado',
      color: 'Negro',
      garantia: '2 años',
      compatibilidad: 'Discos 160-203mm'
    },
    features: [
      'Sistema hidráulico de doble pistón',
      'Tecnología Ice Tech',
      'Palanca ajustable',
      'Compatible con múltiples tamaños de disco',
      'Peso optimizado'
    ]
  };

  const mockRelatedProducts = [
    {
      id: 2,
      name: 'Cambio Shimano SLX',
      price: 320000,
      originalPrice: 400000,
      image: '/img/products/cambio-shimano.jpg',
      rating: 4.6
    },
    {
      id: 3,
      name: 'Pedales Shimano SPD',
      price: 180000,
      originalPrice: 220000,
      image: '/img/products/pedales-shimano.jpg',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Cadena Shimano HG-X',
      price: 85000,
      originalPrice: 100000,
      image: '/img/products/cadena-shimano.jpg',
      rating: 4.5
    }
  ];

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProduct(mockProduct);
    setRelatedProducts(mockRelatedProducts);
    setLoading(false);
  };

  const addToCart = () => {
    console.log('Agregar al carrito:', { product, quantity });
  };

  const toggleFavorite = () => {
    console.log('Toggle favorito:', product.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <Link to="/productos" className="btn-primary">
            Volver a Productos
          </Link>
        </div>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="wrapper py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary-600">Inicio</Link>
          <span>/</span>
          <Link to="/productos" className="hover:text-primary-600">Productos</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Imágenes */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl shadow-card overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={clsx(
                    "aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors",
                    selectedImage === index ? "border-primary-500" : "border-gray-200"
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Información del Producto */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-primary-600 bg-primary-100 px-2 py-1 rounded">
                  {product.brand}
                </span>
                <span className="text-sm text-gray-500">{product.category}</span>
                <span className="text-sm text-gray-500">SKU: {product.sku}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-lg font-medium text-gray-900">{product.rating}</span>
                  <span className="text-gray-500">({product.reviews} reseñas)</span>
                </div>
                <span className={clsx(
                  "text-sm px-2 py-1 rounded",
                  product.stock > 10 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                )}>
                  {product.stock > 10 ? "En stock" : "Poco stock"}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {product.description}
              </p>
            </div>

            {/* Cantidad y Botones */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Cantidad:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock} disponibles
                </span>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={addToCart}
                  className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Agregar al Carrito
                </button>
                <button
                  onClick={toggleFavorite}
                  className="btn-secondary px-4 py-3"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Características */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Características principales</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Beneficios */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Truck className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-700">Envío gratis +$200.000</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-700">Garantía extendida</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <RotateCcw className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-700">Devolución 30 días</p>
              </div>
            </div>
          </div>
        </div>

        {/* Especificaciones Técnicas */}
        <div className="mt-12 bg-white rounded-xl shadow-card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Especificaciones Técnicas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/producto/${relatedProduct.id}`}
                  className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{relatedProduct.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{relatedProduct.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${relatedProduct.price.toLocaleString()}
                      </span>
                      {relatedProduct.originalPrice > relatedProduct.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ${relatedProduct.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductoDetalle;
