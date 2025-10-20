import React from 'react';
import { ShoppingCart, Heart, Star, Truck, Shield } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx';

const ProductCard = ({ product, className }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirigir al login o mostrar modal
      return;
    }

    const currentQuantity = getItemQuantity(product.id);
    await addToCart(product.id, currentQuantity + 1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = () => {
    if (product.original_price && product.original_price > product.price) {
      return Math.round(((product.original_price - product.price) / product.original_price) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();

  return (
    <div className={clsx('card-hover group', className)}>
      {/* Imagen del producto */}
      <div className="relative overflow-hidden">
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-primary-500 text-white px-2 py-1 rounded-lg text-sm font-bold z-10">
            -{discount}%
          </div>
        )}
        <img 
          src={product.images?.[0]?.url || 'https://via.placeholder.com/300x200'} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white text-gray-600 p-2 rounded-full shadow-medium hover:text-primary-500 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          {product.average_rating > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={clsx(
                      'w-4 h-4',
                      i < Math.floor(product.average_rating)
                        ? 'text-secondary-400 fill-current'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.total_reviews})
              </span>
            </div>
          )}
        </div>

        {/* Precios */}
        <div className="mb-4">
          {product.original_price && product.original_price > product.price ? (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary-500">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.original_price)}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-primary-500">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Stock y características */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">
                  Disponible ({product.stock} unidades)
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-red-600 font-medium">Agotado</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              <span>Envío gratis</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Garantía</span>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || !isAuthenticated}
            className={clsx(
              'flex-1 btn-primary py-3 text-sm font-medium',
              product.stock === 0 || !isAuthenticated
                ? 'opacity-50 cursor-not-allowed'
                : isInCart(product.id)
                ? 'bg-green-500 hover:bg-green-600'
                : ''
            )}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isInCart(product.id) ? 'En carrito' : 'Agregar'}
          </button>
          
          <button className="btn-outline px-3 py-3">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Marca: {product.brand}</span>
            <span>Modelo: {product.model}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;