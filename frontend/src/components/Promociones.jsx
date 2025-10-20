import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';

function Promociones() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getFeaturedProducts();
        if (response.success) {
          setFeaturedProducts(response.data);
        }
      } catch (err) {
        setError('Error al cargar productos destacados');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section id="catalogo" className="w-full py-12 bg-negro text-amarillo flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-8 text-rojo">Productos Destacados</h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-rojo" />
          <span className="ml-2 text-amarillo">Cargando productos...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="catalogo" className="w-full py-12 bg-negro text-amarillo flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-8 text-rojo">Productos Destacados</h2>
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-rojo text-amarillo px-6 py-2 rounded-lg font-bold hover:bg-amarillo hover:text-rojo transition"
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="catalogo" className="w-full py-12 bg-negro text-amarillo flex flex-col items-center">
      <h2 className="text-4xl font-bold mb-8 text-rojo">Productos Destacados</h2>
      
      {featuredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-lg">No hay productos destacados disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Botón para ver más productos */}
      <div className="mt-8">
        <a 
          href="/productos" 
          className="bg-rojo text-amarillo px-8 py-3 rounded-lg font-bold hover:bg-amarillo hover:text-rojo transition-all duration-300"
        >
          Ver Todos los Productos
        </a>
      </div>
    </section>
  );
}

export default Promociones;
