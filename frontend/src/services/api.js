// Capa de servicios — todas las llamadas al backend pasan por acá.
// Centralizar esto facilita cambiar la URL del API, agregar headers, manejar errores, etc.

const API_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || `Error ${res.status}`);
  }
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
};
