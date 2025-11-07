import AdminAuthService from '../services/adminAuthService';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Helper para hacer peticiones HTTP autenticadas al backend admin
 * Maneja automáticamente la expiración del token y redirige al login si es necesario
 * 
 * @param {string} url - URL relativa (ej: '/admin/products') o absoluta
 * @param {object} options - Opciones de fetch (method, body, headers, etc.)
 * @returns {Promise<Response>} - Respuesta de fetch
 */
export async function fetchWithAuth(url, options = {}) {
  // Si la URL no es absoluta, construirla con API_BASE_URL
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
  
  // Si no hay token, redirigir al login
  const token = AdminAuthService.getToken();
  if (!token) {
    console.warn('⚠️ No hay token de autenticación. Redirigiendo al login...');
    toast.error('Sesión expirada, por favor vuelve a iniciar sesión');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    window.location.href = '/admin/login';
    throw new Error('No hay token de autenticación');
  }

  // Obtener headers de autenticación (sin Content-Type si es FormData)
  const isFormData = options.body instanceof FormData;
  const authHeaders = AdminAuthService.getAuthHeaders(isFormData ? {} : {});
  
  // Si es FormData, no incluir Content-Type (el navegador lo establecerá automáticamente)
  if (isFormData) {
    delete authHeaders['Content-Type'];
  }
  
  // Combinar headers: primero los de auth, luego los personalizados (para permitir override)
  const headers = {
    ...authHeaders,
    ...(options.headers || {}),
  };

  // Realizar la petición
  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    // Si el token expiró o es inválido, manejar automáticamente
    if (response.status === 401) {
      console.warn('⚠️ Token expirado o inválido. Redirigiendo al login...');
      toast.error('Sesión expirada, por favor vuelve a iniciar sesión');
      
      // Limpiar datos de autenticación
      await AdminAuthService.logout();
      
      // Redirigir al login
      window.location.href = '/admin/login';
      
      throw new Error('Token expirado o inválido');
    }

    return response;
  } catch (error) {
    // Si es un error de red, no redirigir (puede ser un problema de conexión)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('❌ Error de red:', error);
      throw error;
    }
    
    // Si ya es un error de autenticación, re-lanzarlo
    if (error.message.includes('Token') || error.message.includes('token')) {
      throw error;
    }
    
    // Para otros errores, re-lanzar
    throw error;
  }
}

/**
 * Helper para hacer peticiones GET autenticadas
 */
export async function getWithAuth(url, options = {}) {
  return fetchWithAuth(url, {
    ...options,
    method: 'GET',
  });
}

/**
 * Helper para hacer peticiones POST autenticadas
 */
export async function postWithAuth(url, body, options = {}) {
  return fetchWithAuth(url, {
    ...options,
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

/**
 * Helper para hacer peticiones PUT autenticadas
 */
export async function putWithAuth(url, body, options = {}) {
  return fetchWithAuth(url, {
    ...options,
    method: 'PUT',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

/**
 * Helper para hacer peticiones PATCH autenticadas
 */
export async function patchWithAuth(url, body, options = {}) {
  return fetchWithAuth(url, {
    ...options,
    method: 'PATCH',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

/**
 * Helper para hacer peticiones DELETE autenticadas
 */
export async function deleteWithAuth(url, options = {}) {
  return fetchWithAuth(url, {
    ...options,
    method: 'DELETE',
  });
}

