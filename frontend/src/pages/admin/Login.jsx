import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Si ya está logueado, lo mando directo al panel
  if (isAuthenticated) return <Navigate to="/admin" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      await login(email, password);
      const destino = location.state?.from?.pathname || "/admin";
      navigate(destino, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg"
      >
        <div className="text-center mb-6">
          <span className="text-4xl">🚲</span>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Panel admin</h1>
          <p className="text-sm text-gray-500">Bicimotos Mincho</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-medium text-gray-700">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </label>

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-2 rounded-md transition"
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
