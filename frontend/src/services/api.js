// Capa de servicios — todas las llamadas al backend pasan por acá.
// Centralizar esto facilita cambiar la URL del API, agregar headers, manejar errores, etc.

const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = "bicimotos_admin_token";

// Helpers de token (lectura/escritura en localStorage)
export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request(path, options = {}) {
  const headers = { ...options.headers };

  // Si NO es FormData, mandamos JSON. Con FormData, el browser pone el Content-Type correcto.
  const isFormData = options.body instanceof FormData;
  if (!isFormData && options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // Si la ruta es /admin/*, adjuntamos el token automáticamente
  if (path.startsWith("/admin")) {
    const token = tokenStorage.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && path.startsWith("/admin")) {
    tokenStorage.clear();
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || `Error ${res.status}`);
  }

  // 204 No Content (típico de DELETE)
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  productos: {
    listar: () => request("/productos"),
    obtener: (id) => request(`/productos/${id}`),
  },
  categorias: {
    listar: () => request("/categorias"),
  },
  auth: {
    login: (email, password) =>
      request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  },
  admin: {
    productos: {
      listar: () => request("/admin/productos"),
      obtener: (id) => request(`/admin/productos/${id}`),
      crear: (data) => request("/admin/productos", { method: "POST", body: JSON.stringify(data) }),
      editar: (id, data) =>
        request(`/admin/productos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
      eliminar: (id) => request(`/admin/productos/${id}`, { method: "DELETE" }),
    },
    upload: (file) => {
      const fd = new FormData();
      fd.append("imagen", file);
      return request("/admin/upload", { method: "POST", body: fd });
    },
  },
};
