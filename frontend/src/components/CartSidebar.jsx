import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx';

const CartSidebar = ({ isOpen, onClose }) => {
  const { items, totalAmount, totalItems, updateQuantity, removeFromCart, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirigir al login
      return;
    }
    setIsCheckingOut(true);
    // Aquí iría la lógica de checkout
    setTimeout(() => {
      setIsCheckingOut(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-negro border-l-4 border-rojo z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-4 border-rojo">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-amarillo" />
            <h2 className="text-xl font-bold text-amarillo">
              Carrito ({totalItems})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-amarillo hover:text-rojo transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Tu carrito está vacío</p>
              <p className="text-gray-500 text-sm">Agrega algunos productos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product_id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    {/* Imagen del producto */}
                    <img
                      src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/80x80'}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    
                    {/* Información del producto */}
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-amarillo line-clamp-2">
                        {item.product?.name}
                      </h3>
                      <p className="text-xs text-gray-400 mb-2">
                        {item.product?.model}
                      </p>
                      <p className="text-sm font-bold text-rojo">
                        {formatPrice(item.product?.price)}
                      </p>
                    </div>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                        disabled={isLoading}
                        className="bg-gray-700 text-amarillo w-8 h-8 rounded flex items-center justify-center hover:bg-gray-600 disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="text-amarillo font-bold min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                        disabled={isLoading || item.quantity >= (item.product?.stock || 0)}
                        className="bg-gray-700 text-amarillo w-8 h-8 rounded flex items-center justify-center hover:bg-gray-600 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      disabled={isLoading}
                      className="text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="mt-2 text-right">
                    <span className="text-sm text-gray-400">
                      Subtotal: <span className="font-bold text-amarillo">
                        {formatPrice(item.product?.price * item.quantity)}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t-4 border-rojo p-4">
            {/* Resumen */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Subtotal:</span>
                <span className="text-amarillo">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Envío:</span>
                <span className="text-green-400">
                  {totalAmount > 500000 ? 'Gratis' : formatPrice(25000)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-600 pt-2">
                <span className="text-amarillo">Total:</span>
                <span className="text-rojo">
                  {formatPrice(totalAmount + (totalAmount > 500000 ? 0 : 25000))}
                </span>
              </div>
            </div>

            {/* Botón de checkout */}
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut || !isAuthenticated}
              className={clsx(
                'w-full py-3 rounded-lg font-bold transition-colors',
                isAuthenticated
                  ? 'bg-rojo text-amarillo hover:bg-amarillo hover:text-rojo'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              )}
            >
              {isCheckingOut ? 'Procesando...' : 'Proceder al Pago'}
            </button>

            {!isAuthenticated && (
              <p className="text-xs text-gray-400 text-center mt-2">
                Debes iniciar sesión para continuar
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
