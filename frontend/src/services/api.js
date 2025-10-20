import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de API
export const authService = {
  // Registro
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Obtener perfil del usuario actual
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Cambiar contraseña
  changePassword: async (passwordData) => {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  },
};

export const productService = {
  // Obtener todos los productos
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Obtener producto por ID
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Obtener productos destacados
  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured/list');
    return response.data;
  },

  // Obtener productos por categoría
  getProductsByCategory: async (categoryId, params = {}) => {
    const response = await api.get(`/products/category/${categoryId}`, { params });
    return response.data;
  },

  // Buscar productos
  searchProducts: async (query, filters = {}) => {
    const response = await api.get('/products', {
      params: { search: query, ...filters }
    });
    return response.data;
  },
};

export const categoryService = {
  // Obtener todas las categorías
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Obtener categoría por ID
  getCategory: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Obtener categoría por slug
  getCategoryBySlug: async (slug) => {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data;
  },
};

export const cartService = {
  // Obtener carrito
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Agregar producto al carrito
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/cart/add', { product_id: productId, quantity });
    return response.data;
  },

  // Actualizar cantidad en el carrito
  updateCartItem: async (productId, quantity) => {
    const response = await api.put('/cart/update', { product_id: productId, quantity });
    return response.data;
  },

  // Remover producto del carrito
  removeFromCart: async (productId) => {
    const response = await api.delete('/cart/remove', { data: { product_id: productId } });
    return response.data;
  },

  // Limpiar carrito
  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },
};

export const orderService = {
  // Obtener órdenes del usuario
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Obtener orden por ID
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Crear nueva orden
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Cancelar orden
  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },
};

export default api;
