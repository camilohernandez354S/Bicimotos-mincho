import AdminAuthService from './adminAuthService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Servicio para gestión de productos en el admin
export const adminProductsService = {
  // Obtener todos los productos
  async getProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: 'GET',
        headers: AdminAuthService.getAuthHeaders(),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data || [];
      } else {
        throw new Error(data.message || 'Error obteniendo productos');
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
      const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: 'GET',
        headers: AdminAuthService.getAuthHeaders(),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error obteniendo producto');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Crear un nuevo producto
  async createProduct(productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: 'POST',
        headers: AdminAuthService.getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error creando producto');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Actualizar un producto
  async updateProduct(id, productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: 'PUT',
        headers: AdminAuthService.getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error actualizando producto');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Eliminar un producto
  async deleteProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers: AdminAuthService.getAuthHeaders(),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Error eliminando producto');
      }
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
      
      const token = AdminAuthService.getToken();
      const headers = {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      };
      
      const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/images`, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error subiendo imagen');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Obtener categorías
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/categories`, {
        method: 'GET',
        headers: AdminAuthService.getAuthHeaders(),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data || [];
      } else {
        throw new Error(data.message || 'Error obteniendo categorías');
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
      
      const response = await fetch(`${API_BASE_URL}/admin/products?${params}`, {
        method: 'GET',
        headers: AdminAuthService.getAuthHeaders(),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data || [];
      } else {
        throw new Error(data.message || 'Error buscando productos');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Obtener estadísticas de productos
  async getProductStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products/stats`, {
        method: 'GET',
        headers: AdminAuthService.getAuthHeaders(),
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error obteniendo estadísticas');
      }
    } catch (error) {
      console.error('Error fetching product stats:', error);
      throw error;
    }
  }
};

export default adminProductsService;