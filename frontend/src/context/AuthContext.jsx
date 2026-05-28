import { createContext, useContext, useEffect, useState } from "react";

import { api, tokenStorage } from "../services/api.js";

const ADMIN_KEY = "bicimotos_admin_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // admin = null cuando no hay sesión. Lo hidrato de localStorage al arrancar
  // para que un refresh no te tire del panel.
  const [admin, setAdmin] = useState(() => {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  // Si en cualquier momento se borra el token (ej: el server respondió 401),
  // sincronizamos el estado de admin para mostrar el login.
  useEffect(() => {
    const checkToken = () => {
      if (!tokenStorage.get() && admin) setAdmin(null);
    };
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, [admin]);

  async function login(email, password) {
    const { token, admin } = await api.auth.login(email, password);
    tokenStorage.set(token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
    setAdmin(admin);
  }

  function logout() {
    tokenStorage.clear();
    localStorage.removeItem(ADMIN_KEY);
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
