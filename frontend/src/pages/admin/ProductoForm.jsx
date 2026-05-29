import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { api } from "../../services/api.js";
import { usePageMeta } from "../../hooks/usePageMeta.js";

const ESTADO_INICIAL = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: 0,
  marca: "",
  modelo: "",
  categoriaId: "",
  imagenes: [],
  destacado: false,
  activo: true,
};

export default function ProductoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const esEdicion = Boolean(id);

  usePageMeta({ title: esEdicion ? "Editar producto · Admin" : "Nuevo producto · Admin" });

  const [form, setForm] = useState(ESTADO_INICIAL);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);

  // Cargar categorías siempre, y el producto si estamos en modo edición
  useEffect(() => {
    api.categorias.listar().then(setCategorias).catch(console.error);

    if (esEdicion) {
      api.admin.productos
        .obtener(Number(id))
        .then((p) => {
          setForm({
            nombre: p.nombre,
            descripcion: p.descripcion ?? "",
            precio: p.precio,
            stock: p.stock,
            marca: p.marca ?? "",
            modelo: p.modelo ?? "",
            categoriaId: String(p.categoriaId),
            imagenes: p.imagenes ?? [],
            destacado: p.destacado,
            activo: p.activo,
          });
        })
        .catch((err) => setError(err.message))
        .finally(() => setCargando(false));
    }
  }, [id, esEdicion]);

  function actualizar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function subirImagen(file) {
    setSubiendo(true);
    try {
      const { url } = await api.admin.upload(file);
      setForm((prev) => ({ ...prev, imagenes: [...prev.imagenes, url] }));
    } catch (err) {
      alert(`Error al subir imagen: ${err.message}`);
    } finally {
      setSubiendo(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function quitarImagen(url) {
    setForm((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((u) => u !== url),
    }));
  }

  async function guardar(e) {
    e.preventDefault();
    setError(null);
    setGuardando(true);

    const payload = {
      ...form,
      precio: Number(form.precio),
      stock: Number(form.stock),
      categoriaId: Number(form.categoriaId),
      // Strings vacíos los mandamos como null para coherencia
      descripcion: form.descripcion || null,
      marca: form.marca || null,
      modelo: form.modelo || null,
    };

    try {
      if (esEdicion) {
        await api.admin.productos.editar(Number(id), payload);
      } else {
        await api.admin.productos.crear(payload);
      }
      navigate("/admin/productos");
    } catch (err) {
      setError(err.message);
      setGuardando(false);
    }
  }

  if (cargando) {
    return <p className="text-gray-500">Cargando producto...</p>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link to="/admin/productos" className="text-orange-500 hover:underline text-sm">
          ← Volver a productos
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          {esEdicion ? "Editar producto" : "Nuevo producto"}
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={guardar}
        className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6"
      >
        {/* Nombre */}
        <Field label="Nombre *">
          <input
            type="text"
            required
            value={form.nombre}
            onChange={(e) => actualizar("nombre", e.target.value)}
            className={inputClass}
          />
        </Field>

        {/* Descripción */}
        <Field label="Descripción">
          <textarea
            rows={4}
            value={form.descripcion}
            onChange={(e) => actualizar("descripcion", e.target.value)}
            className={inputClass}
          />
        </Field>

        {/* Grid de precio + stock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Precio (COP) *">
            <input
              type="number"
              min="0"
              step="1"
              required
              value={form.precio}
              onChange={(e) => actualizar("precio", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Stock">
            <input
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(e) => actualizar("stock", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        {/* Grid de marca + modelo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Marca">
            <input
              type="text"
              value={form.marca}
              onChange={(e) => actualizar("marca", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Modelo">
            <input
              type="text"
              value={form.modelo}
              onChange={(e) => actualizar("modelo", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        {/* Categoría */}
        <Field label="Categoría *">
          <select
            required
            value={form.categoriaId}
            onChange={(e) => actualizar("categoriaId", e.target.value)}
            className={inputClass}
          >
            <option value="">Seleccionar...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </Field>

        {/* Imágenes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imágenes
          </label>

          {form.imagenes.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {form.imagenes.map((url) => (
                <div key={url} className="relative w-24 h-24">
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover rounded border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => quitarImagen(url)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                    aria-label="Quitar imagen"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            disabled={subiendo}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) subirImagen(file);
            }}
            className="block text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
          {subiendo && <p className="text-sm text-gray-500 mt-1">Subiendo a Cloudinary...</p>}
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.destacado}
              onChange={(e) => actualizar("destacado", e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Destacado en home</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => actualizar("activo", e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Activo (visible al público)</span>
          </label>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={guardando || subiendo}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear producto"}
          </button>
          <Link
            to="/admin/productos"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg transition"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}
