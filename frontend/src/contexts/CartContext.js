import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Estado inicial
const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  isLoading: false,
};

// Tipos de acciones
const CART_ACTIONS = {
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_LOADING: 'SET_LOADING',
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_CART:
      return {
        ...state,
        items: action.payload.items || [],
        totalAmount: action.payload.total_amount || 0,
        totalItems: action.payload.total_items || 0,
        isLoading: false,
      };
    case CART_ACTIONS.ADD_ITEM:
      return {
        ...state,
        isLoading: false,
      };
    case CART_ACTIONS.UPDATE_ITEM:
      return {
        ...state,
        isLoading: false,
      };
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        isLoading: false,
      };
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        totalAmount: 0,
        totalItems: 0,
        isLoading: false,
      };
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Contexto
const CartContext = createContext();

// Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Cargar carrito cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Limpiar carrito si no está autenticado
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    }
  }, [isAuthenticated]);

  // Cargar carrito desde el servidor
  const loadCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await cartService.getCart();
      
      if (response.success) {
        dispatch({
          type: CART_ACTIONS.SET_CART,
          payload: response.data,
        });
      }
    } catch (error) {
      console.error('Error cargando carrito:', error);
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Agregar producto al carrito
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return { success: false };
    }

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
      const response = await cartService.addToCart(productId, quantity);
      
      if (response.success) {
        dispatch({ type: CART_ACTIONS.ADD_ITEM });
        await loadCart(); // Recargar carrito para obtener datos actualizados
        toast.success('Producto agregado al carrito');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al agregar al carrito';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Actualizar cantidad de producto en el carrito
  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para modificar el carrito');
      return { success: false };
    }

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
      const response = await cartService.updateCartItem(productId, quantity);
      
      if (response.success) {
        dispatch({ type: CART_ACTIONS.UPDATE_ITEM });
        await loadCart(); // Recargar carrito para obtener datos actualizados
        toast.success('Carrito actualizado');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar carrito';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Remover producto del carrito
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para modificar el carrito');
      return { success: false };
    }

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
      const response = await cartService.removeFromCart(productId);
      
      if (response.success) {
        dispatch({ type: CART_ACTIONS.REMOVE_ITEM });
        await loadCart(); // Recargar carrito para obtener datos actualizados
        toast.success('Producto removido del carrito');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al remover del carrito';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Limpiar carrito
  const clearCart = async () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para modificar el carrito');
      return { success: false };
    }

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
      const response = await cartService.clearCart();
      
      if (response.success) {
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
        toast.success('Carrito limpiado');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al limpiar carrito';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId) => {
    return state.items.some(item => item.product_id === productId);
  };

  // Obtener cantidad de un producto en el carrito
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadCart,
    isInCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export default CartContext;
