// Servicio para manejar las llamadas a la API pública
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class PublicApiService {
  // Obtener productos
  static async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const url = `${API_BASE_URL}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Error obteniendo productos');
      }
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      throw error;
    }
  }

  // Obtener producto por ID
  static async getProductById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Producto no encontrado');
      }
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      throw error;
    }
  }

  // Obtener productos destacados
  static async getFeaturedProducts(limit = 8) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/featured/list?limit=${limit}`);
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error obteniendo productos destacados');
      }
    } catch (error) {
      console.error('Error obteniendo productos destacados:', error);
      throw error;
    }
  }

  // Obtener productos relacionados
  static async getRelatedProducts(id, limit = 4) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/related?limit=${limit}`);
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error obteniendo productos relacionados');
      }
    } catch (error) {
      console.error('Error obteniendo productos relacionados:', error);
      throw error;
    }
  }

  // Obtener categorías
  static async getCategories(hierarchy = false) {
    try {
      const url = `${API_BASE_URL}/categories${hierarchy ? '?hierarchy=true' : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error obteniendo categorías');
      }
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      throw error;
    }
  }

  // Obtener categoría por ID
  static async getCategoryById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`);
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Categoría no encontrada');
      }
    } catch (error) {
      console.error('Error obteniendo categoría:', error);
      throw error;
    }
  }

  // Obtener categorías principales
  static async getMainCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/main/list`);
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error obteniendo categorías principales');
      }
    } catch (error) {
      console.error('Error obteniendo categorías principales:', error);
      throw error;
    }
  }

  // Obtener subcategorías
  static async getSubcategories(parentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${parentId}/subcategories`);
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error obteniendo subcategorías');
      }
    } catch (error) {
      console.error('Error obteniendo subcategorías:', error);
      throw error;
    }
  }

  // Enviar mensaje de contacto
  static async sendContactMessage(messageData) {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();

      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Error enviando mensaje');
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      throw error;
    }
  }

  // Obtener información de la empresa
  static async getCompanyInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/info`);
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error obteniendo información');
      }
    } catch (error) {
      console.error('Error obteniendo información:', error);
      throw error;
    }
  }

  // Obtener configuración del sitio
  static async getSiteConfig() {
    try {
      const response = await fetch(`${API_BASE_URL}/config`);
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error obteniendo configuración');
      }
    } catch (error) {
      console.error('Error obteniendo configuración:', error);
      throw error;
    }
  }

  // Health check
  static async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();

      return data.success;
    } catch (error) {
      console.error('Error en health check:', error);
      return false;
    }
  }

  // Buscar productos
  static async searchProducts(query, filters = {}) {
    try {
      const params = { search: query, ...filters };
      return await this.getProducts(params);
    } catch (error) {
      console.error('Error buscando productos:', error);
      throw error;
    }
  }
}

export default PublicApiService;
