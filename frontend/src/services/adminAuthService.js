// Servicio para manejar la autenticación del admin
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AdminAuthService {
  // Login del administrador
  static async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Si la respuesta no es exitosa, lanzar error con el mensaje del servidor
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      if (data.success) {
        // Guardar token y datos del admin
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_data', JSON.stringify(data.admin));
        return data;
      } else {
        throw new Error(data.message || 'Error en el login');
      }
    } catch (error) {
      console.error('Error en login:', error);
      // Si es un error de red, proporcionar un mensaje más amigable
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.');
      }
      throw error;
    }
  }

  // Verificar token
  static async verifyToken() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No hay token');
      }

      const response = await fetch(`${API_BASE_URL}/admin/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data.success ? data.admin : null;
    } catch (error) {
      console.error('Error verificando token:', error);
      return null;
    }
  }

  // Logout
  static async logout() {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/admin/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Limpiar datos locales
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_data');
    }
  }

  // Obtener token
  static getToken() {
    return localStorage.getItem('admin_token');
  }

  // Obtener datos del admin
  static getAdminData() {
    const adminData = localStorage.getItem('admin_data');
    return adminData ? JSON.parse(adminData) : null;
  }

  // Verificar si está autenticado
  static isAuthenticated() {
    return !!this.getToken();
  }

  // Obtener headers con autorización
  static getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Cambiar contraseña
  static async changePassword(currentPassword, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/change-password`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error cambiando contraseña');
      }

      return data;
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      throw error;
    }
  }

  // Actualizar perfil
  static async updateProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      
      if (data.success) {
        // Actualizar datos locales
        localStorage.setItem('admin_data', JSON.stringify(data.admin));
        return data;
      } else {
        throw new Error(data.message || 'Error actualizando perfil');
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  }

  // Obtener perfil
  static async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/profile`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      
      if (data.success) {
        // Actualizar datos locales
        localStorage.setItem('admin_data', JSON.stringify(data.admin));
        return data.admin;
      } else {
        throw new Error(data.message || 'Error obteniendo perfil');
      }
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  }
}

export default AdminAuthService;
