import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';
import { tiendaAPI } from '../services/api';

const Tienda = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const categorias = ['Clases', 'Equipamiento', 'Nutrición', 'Accesorios'];

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await tiendaAPI.obtenerProductos();
      setProductos(response.data);
    } catch (error) {
      console.error('Error cargando productos:', error);
      // En caso de error, usar datos de respaldo
      setProductos([
        // Clases
        { id: 1, nombre: 'Clase Privada', precio: 50, imagen: 'https://media.tenor.com/sNB-srHLQPwAAAAM/monkey.gif', categoria: 'Clases', descripcion: 'Sesión 1 a 1' },
        { id: 2, nombre: 'Pack 5 Clases', precio: 200, imagen: 'https://i.pinimg.com/originals/a2/dd/42/a2dd42757edda5a2e6387bce2c1d3e17.jpg', categoria: 'Clases', descripcion: 'Descuento 20%' },
        { id: 3, nombre: 'Pack 10 Clases', precio: 350, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyNjcXLRqGPUn9qXipWyPCZoEeDjlkzwSPJljE-HBy7Si556HrY8LenDUVLOZD0JtP7q8&usqp=CAU', categoria: 'Clases', descripcion: 'Descuento 30%' },
        { id: 4, nombre: 'Membresía Mensual', precio: 100, imagen: 'https://assets.stickerswiki.app/s/mrincreibleperturbado_toto_cl_by_fstikbot/fc26c0b4.thumb.webp', categoria: 'Clases', descripcion: 'Acceso ilimitado' },
        
        // Equipamiento
        { id: 5, nombre: 'Colchoneta', precio: 30, imagen: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=200&h=150&fit=crop', categoria: 'Equipamiento', descripcion: 'Para ejercicios' },
        { id: 6, nombre: 'Mancuernas Set', precio: 80, imagen: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=200&h=150&fit=crop', categoria: 'Equipamiento', descripcion: '1-10kg' },
        { id: 7, nombre: 'Banda Elástica', precio: 15, imagen: 'https://cdn.prod.website-files.com/62d7d2c09b7ee7b59c86ea90/647772306ee3d4706c28674a_feliz-mujer-musculosa-haciendo-ejercicio-banda-resistencia-casa.webp', categoria: 'Equipamiento', descripcion: 'Set de 3' },
        { id: 8, nombre: 'Cuerda para Saltar PRIME', precio: 25, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_J8PwUjH5xTgpw5hgpoj0Ry_yJLf8lQ-KjQ&s', categoria: 'Equipamiento', descripcion: 'Profesional' },
        
        // Nutrición
        { id: 9, nombre: 'Proteína Whey', precio: 45, imagen: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&h=150&fit=crop', categoria: 'Nutrición', descripcion: '1kg' },
        { id: 10, nombre: 'BCAA', precio: 35, imagen: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&h=150&fit=crop', categoria: 'Nutrición', descripcion: '300g' },
        { id: 11, nombre: 'Creatina Monohidrato', precio: 40, imagen: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&h=150&fit=crop', categoria: 'Nutrición', descripcion: '500g' },
        { id: 12, nombre: 'Barras Proteicas', precio: 20, imagen: 'https://www.clarin.com/2018/11/13/0dvuOB2OA_0x750__1.jpg', categoria: 'Nutrición', descripcion: 'Pack de 6' },
        
        // Accesorios
        { id: 13, nombre: 'Botella Deportiva', precio: 18, imagen: 'https://cdn.clarosports.com/clarosports/2024/01/sin-titulo-2024-01-10t143530.096-143429.jpg', categoria: 'Accesorios', descripcion: '1L' },
        { id: 14, nombre: 'Toalla Gym', precio: 12, imagen: 'https://st.depositphotos.com/1765681/1339/i/950/depositphotos_13394367-stock-photo-wet-muscular-man-wrapped-in.jpg', categoria: 'Accesorios', descripcion: 'Microfibra' },
        { id: 15, nombre: 'Reloj Deportivo', precio: 60, imagen: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=150&fit=crop', categoria: 'Accesorios', descripcion: 'Con monitor' },
        { id: 16, nombre: 'Mochila Deportiva', precio: 55, imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=150&fit=crop', categoria: 'Accesorios', descripcion: 'Impermeable' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (producto) => {
    setCart([...cart, { ...producto, cantidad: 1 }]);
  };

  const handleRemoveFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

   const handleCheckout = () => {
    setCart([]);
    setCartOpen(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: '80px' }}>
        <Navbar />
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
          <p style={{ color: '#a0a0a0' }}>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: '80px' }}>
      <Navbar />
      
      {/* Botón carrito flotante */}
      <button
        onClick={() => setCartOpen(!cartOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          background: '#00ff87',
          color: '#0a0a0a',
          border: 'none',
          borderRadius: '50%',
          fontSize: '1.5rem',
          cursor: 'pointer',
          zIndex: 998,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(0, 255, 135, 0.3)'
        }}
      >
        🛒 {cart.length}
      </button>

      {/* Carrito lateral */}
      <CartSidebar
        isOpen={cartOpen}
        cart={cart}
        onRemove={handleRemoveFromCart}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {/* Contenido principal */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#00ff87',
          marginBottom: '3rem'
        }}>
          Tienda
        </h1>

        {/* Categorías */}
        {categorias.map((cat) => (
          <div key={cat} style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              color: '#60efff',
              marginBottom: '1.5rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid #2a2a2a'
            }}>
              {cat}
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1.5rem'
            }}>
              {productos
                .filter((p) => p.categoria === cat)
                .map((producto) => (
                  <ProductCard
                    key={producto.id}
                    producto={producto}
                    onAddToCart={handleAddToCart}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tienda;