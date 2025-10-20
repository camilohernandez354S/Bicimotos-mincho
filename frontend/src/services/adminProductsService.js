import api from '../services/api';

// Servicio para gestión de productos en el admin
export const adminProductsService = {
  // Obtener todos los productos
  async getProducts() {
    try {
      const response = await api.get('/products');
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response.data?.data)) {
        return response.data.data;
      } else if (Array.isArray(response.data?.products)) {
        return response.data.products;
      } else {
        console.warn('Unexpected API response format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Devolver array vacío en caso de error
      return [];
    }
  },

  // Obtener un producto por ID
  async getProduct(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Crear un nuevo producto
  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Actualizar un producto
  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Eliminar un producto
  async deleteProduct(id) {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Subir imagen de producto
  async uploadProductImage(productId, imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post(`/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Obtener categorías
  async getCategories() {
    try {
      const response = await api.get('/categories');
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response.data?.data)) {
        return response.data.data;
      } else if (Array.isArray(response.data?.categories)) {
        return response.data.categories;
      } else {
        console.warn('Unexpected categories response format:', response.data);
        return ['Transmisiones', 'Frenos', 'Ruedas', 'Pedales', 'Suspensiones'];
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Devolver categorías por defecto en caso de error
      return ['Transmisiones', 'Frenos', 'Ruedas', 'Pedales', 'Suspensiones'];
    }
  },

  // Buscar productos
  async searchProducts(query, category = null) {
    try {
      const params = new URLSearchParams();
      if (query) params.append('search', query);
      if (category) params.append('category', category);
      
      const response = await api.get(`/products/search?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
};

export default adminProductsService;
